/**
 * Content Sync Service
 *
 * Handles downloading new topics from GitHub Pages and managing sync state.
 *
 * ## Architecture
 * - Manifest-based sync: fetches manifest.json to get list of available topics
 * - Downloads only new topics (not already synced or bundled)
 * - Stores downloaded topics in AsyncStorage
 * - Tracks synced topic IDs to prevent re-downloading
 * - Graceful offline handling (fails silently if no network)
 *
 * ## Storage Keys
 * - `@shelter_sessions:downloaded_topics` - Array of downloaded Topic objects
 * - `@shelter_sessions:synced_topics` - Array of synced topic IDs
 * - `@shelter_sessions:last_sync` - ISO timestamp of last successful sync
 *
 * ## Sync Flow
 * 1. Fetch manifest.json from GitHub Pages
 * 2. Get list of already synced topic IDs
 * 3. On first sync, mark bundled topics as synced (prevents re-downloading)
 * 4. Download topics not in synced list
 * 5. Update synced IDs and last sync timestamp
 * 6. Return newly downloaded topics
 *
 * @module services/sync/contentSync
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Topic } from '../../types/content';

// GitHub Pages URLs for manifest and topic files
const MANIFEST_URL =
  'https://raw.githubusercontent.com/mikisegall/shelter-sessions/main/public/topics/manifest.json';
const TOPICS_BASE_URL =
  'https://raw.githubusercontent.com/mikisegall/shelter-sessions/main/public/topics/';

const LAST_SYNC_KEY = '@shelter_sessions:last_sync';
const SYNCED_TOPICS_KEY = '@shelter_sessions:synced_topics';

interface ManifestTopic {
  id: string;
  filename: string;
  title: string;
  category: string;
  addedDate: string;
}

interface Manifest {
  version: string;
  lastUpdated: string;
  topics: ManifestTopic[];
}

interface SyncResult {
  newTopics: Topic[];
  totalAvailable: number;
  lastSync: string;
}

/**
 * Fetch with timeout support
 */
const fetchWithTimeout = async (
  url: string,
  timeoutMs: number = 10000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

/**
 * Fetch the manifest file from GitHub
 */
const fetchManifest = async (): Promise<Manifest> => {
  const response = await fetchWithTimeout(MANIFEST_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch manifest: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

/**
 * Fetch a topic file from GitHub
 */
const fetchTopic = async (filename: string): Promise<Topic> => {
  const response = await fetchWithTimeout(`${TOPICS_BASE_URL}${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch topic ${filename}: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

/**
 * Get list of already synced topic IDs
 */
export const getSyncedTopicIds = async (): Promise<string[]> => {
  try {
    const value = await AsyncStorage.getItem(SYNCED_TOPICS_KEY);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Error loading synced topics:', error);
    return [];
  }
};

/**
 * Save synced topic IDs
 */
const saveSyncedTopicIds = async (ids: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(SYNCED_TOPICS_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error('Error saving synced topics:', error);
  }
};

/**
 * Get last sync timestamp
 */
export const getLastSyncTime = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LAST_SYNC_KEY);
  } catch (error) {
    console.error('Error loading last sync time:', error);
    return null;
  }
};

/**
 * Save last sync timestamp
 */
const saveLastSyncTime = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Error saving last sync time:', error);
  }
};

/**
 * Sync new topics from the remote manifest
 * Returns newly downloaded topics
 */
export const syncTopics = async (): Promise<SyncResult> => {
  try {
    // Import bundled topics to get their IDs
    const { TOPIC_LIBRARY } = await import('../../constants/topicLibrary');
    const bundledTopicIds = TOPIC_LIBRARY.map((t) => t.id);

    // Fetch manifest
    const manifest = await fetchManifest();

    // Get already synced topics
    let syncedIds = await getSyncedTopicIds();

    // On first sync, mark bundled topics as already synced
    // This prevents re-downloading topics we already have bundled
    if (syncedIds.length === 0) {
      syncedIds = bundledTopicIds;
      await saveSyncedTopicIds(bundledTopicIds);
      console.log(`Initialized sync with ${bundledTopicIds.length} bundled topics`);
    }

    // Find new topics (not bundled and not already synced)
    const newTopicManifests = manifest.topics.filter(
      (t) => !syncedIds.includes(t.id)
    );

    // Download new topics
    console.log(`Found ${newTopicManifests.length} new topics to download`);
    const newTopics: Topic[] = [];
    for (const topicManifest of newTopicManifests) {
      try {
        console.log(`Downloading topic: ${topicManifest.id} (${topicManifest.filename})`);
        const topic = await fetchTopic(topicManifest.filename);
        newTopics.push(topic);
        console.log(`✓ Downloaded: ${topic.title}`);
      } catch (error) {
        console.error(`Failed to download topic ${topicManifest.id}:`, error);
      }
    }

    // Update synced list
    const allSyncedIds = [
      ...syncedIds,
      ...newTopics.map((t) => t.id),
    ];
    await saveSyncedTopicIds(allSyncedIds);
    console.log(`Synced IDs updated: ${allSyncedIds.length} total`);

    // Save last sync time
    await saveLastSyncTime();

    console.log(`Sync complete: ${newTopics.length} new topics, ${manifest.topics.length} total available`);

    return {
      newTopics,
      totalAvailable: manifest.topics.length,
      lastSync: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error syncing topics:', error);
    throw error;
  }
};

/**
 * Check if sync is needed (hasn't synced in 24 hours)
 */
export const shouldSync = async (): Promise<boolean> => {
  const lastSync = await getLastSyncTime();
  if (!lastSync) return true;

  const lastSyncDate = new Date(lastSync);
  const now = new Date();
  const hoursSinceLastSync =
    (now.getTime() - lastSyncDate.getTime()) / (1000 * 60 * 60);

  return hoursSinceLastSync >= 24;
};
