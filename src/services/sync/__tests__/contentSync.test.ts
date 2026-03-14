import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  syncTopics,
  getSyncedTopicIds,
  getLastSyncTime,
  shouldSync,
} from '../contentSync';
import { Topic } from '../../../types/content';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

const mockManifest = {
  version: '1.0.0',
  lastUpdated: '2026-03-14T00:00:00Z',
  topics: [
    {
      id: 'test-topic-1',
      filename: 'test-topic-1.json',
      title: 'Test Topic 1',
      category: 'science',
      addedDate: '2026-03-14T00:00:00Z',
    },
    {
      id: 'test-topic-2',
      filename: 'test-topic-2.json',
      title: 'Test Topic 2',
      category: 'technology',
      addedDate: '2026-03-14T00:00:00Z',
    },
  ],
};

const mockTopic1: Topic = {
  id: 'test-topic-1',
  title: 'Test Topic 1',
  category: 'science',
  estimatedReadingTime: 10,
  createdAt: '2026-03-14T00:00:00Z',
  tags: ['test'],
  contentBlocks: [
    { type: 'intro', text: 'Introduction' },
    { type: 'key_point', text: 'Key point 1' },
    { type: 'summary', text: 'Summary' },
  ],
  quiz: [
    {
      question: 'Test question?',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      explanation: 'Explanation',
    },
  ],
};

const mockTopic2: Topic = {
  ...mockTopic1,
  id: 'test-topic-2',
  title: 'Test Topic 2',
};

describe('contentSync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    (AsyncStorage.getItem as jest.Mock).mockClear();
    (AsyncStorage.setItem as jest.Mock).mockClear();
  });

  describe('getSyncedTopicIds', () => {
    it('should return empty array when no synced topics exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getSyncedTopicIds();

      expect(result).toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@shelter_sessions:synced_topics');
    });

    it('should return parsed array of synced topic IDs', async () => {
      const mockIds = ['topic-1', 'topic-2', 'topic-3'];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockIds));

      const result = await getSyncedTopicIds();

      expect(result).toEqual(mockIds);
    });

    it('should return empty array on error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await getSyncedTopicIds();

      expect(result).toEqual([]);
    });
  });

  describe('getLastSyncTime', () => {
    it('should return null when no sync has occurred', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getLastSyncTime();

      expect(result).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@shelter_sessions:last_sync');
    });

    it('should return the last sync timestamp', async () => {
      const mockTimestamp = '2026-03-14T10:00:00Z';
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(mockTimestamp);

      const result = await getLastSyncTime();

      expect(result).toBe(mockTimestamp);
    });

    it('should return null on error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await getLastSyncTime();

      expect(result).toBeNull();
    });
  });

  describe('shouldSync', () => {
    it('should return true when no previous sync exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await shouldSync();

      expect(result).toBe(true);
    });

    it('should return true when last sync was more than 24 hours ago', async () => {
      const yesterday = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(yesterday);

      const result = await shouldSync();

      expect(result).toBe(true);
    });

    it('should return false when last sync was less than 24 hours ago', async () => {
      const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(oneHourAgo);

      const result = await shouldSync();

      expect(result).toBe(false);
    });

    it('should return false when last sync was exactly 23 hours ago', async () => {
      const twentyThreeHoursAgo = new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(twentyThreeHoursAgo);

      const result = await shouldSync();

      expect(result).toBe(false);
    });
  });

  describe('syncTopics', () => {
    it('should fetch and return new topics when none are synced', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockManifest,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTopic1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTopic2,
        });

      const result = await syncTopics();

      expect(result.newTopics).toHaveLength(2);
      expect(result.newTopics[0].id).toBe('test-topic-1');
      expect(result.newTopics[1].id).toBe('test-topic-2');
      expect(result.totalAvailable).toBe(2);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@shelter_sessions:synced_topics',
        JSON.stringify(['test-topic-1', 'test-topic-2'])
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@shelter_sessions:last_sync',
        expect.any(String)
      );
    });

    it('should only fetch topics that are not already synced', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(['test-topic-1'])
      );
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockManifest,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTopic2,
        });

      const result = await syncTopics();

      expect(result.newTopics).toHaveLength(1);
      expect(result.newTopics[0].id).toBe('test-topic-2');
      expect(result.totalAvailable).toBe(2);
      expect(global.fetch).toHaveBeenCalledTimes(2); // manifest + 1 topic
    });

    it('should return empty array when all topics are already synced', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(['test-topic-1', 'test-topic-2'])
      );
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockManifest,
      });

      const result = await syncTopics();

      expect(result.newTopics).toHaveLength(0);
      expect(result.totalAvailable).toBe(2);
      expect(global.fetch).toHaveBeenCalledTimes(1); // only manifest
    });

    it('should throw error when manifest fetch fails', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(syncTopics()).rejects.toThrow('Failed to fetch manifest');
    });

    it('should throw error when network request fails', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network request failed')
      );

      await expect(syncTopics()).rejects.toThrow('Network request failed');
    });

    it('should continue syncing other topics if one topic fails', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockManifest,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Server Error',
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTopic2,
        });

      const result = await syncTopics();

      // Should still get topic 2 even though topic 1 failed
      expect(result.newTopics).toHaveLength(1);
      expect(result.newTopics[0].id).toBe('test-topic-2');
    });

    it('should handle fetch timeout', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      // Mock AbortController
      const mockAbort = jest.fn();
      global.AbortController = jest.fn().mockImplementation(() => ({
        abort: mockAbort,
        signal: {},
      })) as any;

      // Simulate timeout
      (global.fetch as jest.Mock).mockImplementationOnce(() => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            const error = new Error('Aborted');
            error.name = 'AbortError';
            reject(error);
          }, 100);
        });
      });

      await expect(syncTopics()).rejects.toThrow();
    });

    it('should update synced IDs with newly downloaded topics', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(['existing-topic']))
        .mockResolvedValueOnce(null);

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockManifest,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTopic1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTopic2,
        });

      await syncTopics();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@shelter_sessions:synced_topics',
        JSON.stringify(['existing-topic', 'test-topic-1', 'test-topic-2'])
      );
    });

    it('should save last sync time after successful sync', async () => {
      const beforeSync = Date.now();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockManifest, topics: [] }),
      });

      await syncTopics();

      const afterSync = Date.now();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@shelter_sessions:last_sync',
        expect.any(String)
      );

      const savedTimestamp = (AsyncStorage.setItem as jest.Mock).mock.calls.find(
        (call) => call[0] === '@shelter_sessions:last_sync'
      )[1];
      const savedTime = new Date(savedTimestamp).getTime();

      expect(savedTime).toBeGreaterThanOrEqual(beforeSync);
      expect(savedTime).toBeLessThanOrEqual(afterSync);
    });
  });
});
