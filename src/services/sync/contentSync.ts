import AsyncStorage from '@react-native-async-storage/async-storage';
import { Topic } from '../../types/content';

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
 * Fetch the manifest file from GitHub
 */
const fetchManifest = async (): Promise<Manifest> => {
  const response = await fetch(MANIFEST_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch manifest');
  }
  return response.json();
};

/**
 * Fetch a topic file from GitHub
 */
const fetchTopic = async (filename: string): Promise<Topic> => {
  const response = await fetch(`${TOPICS_BASE_URL}${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch topic: ${filename}`);
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
    // Fetch manifest
    const manifest = await fetchManifest();

    // Get already synced topics
    const syncedIds = await getSyncedTopicIds();

    // Find new topics
    const newTopicManifests = manifest.topics.filter(
      (t) => !syncedIds.includes(t.id)
    );

    // Download new topics
    const newTopics: Topic[] = [];
    for (const topicManifest of newTopicManifests) {
      try {
        const topic = await fetchTopic(topicManifest.filename);
        newTopics.push(topic);
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

    // Save last sync time
    await saveLastSyncTime();

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
