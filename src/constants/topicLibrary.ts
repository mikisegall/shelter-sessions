import { Topic } from '../types/content';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import bundled topic JSON files
import crispr from '../../content/topics/crispr-gene-editing.json';
import labGrownMeat from '../../content/topics/lab-grown-meat.json';
import quantumComputing from '../../content/topics/quantum-computing-debate.json';
import microplastics from '../../content/topics/microplastics-health.json';
import aiAlignment from '../../content/topics/ai-alignment-problem.json';

const DOWNLOADED_TOPICS_KEY = '@shelter_sessions:downloaded_topics';

/**
 * Bundled topics that come with the app
 */
const BUNDLED_TOPICS: Topic[] = [
  crispr as Topic,
  labGrownMeat as Topic,
  quantumComputing as Topic,
  microplastics as Topic,
  aiAlignment as Topic,
];

/**
 * Get downloaded topics from storage
 */
const getDownloadedTopics = async (): Promise<Topic[]> => {
  try {
    const value = await AsyncStorage.getItem(DOWNLOADED_TOPICS_KEY);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Error loading downloaded topics:', error);
    return [];
  }
};

/**
 * Save downloaded topics to storage
 */
export const saveDownloadedTopics = async (topics: Topic[]): Promise<void> => {
  try {
    const existing = await getDownloadedTopics();
    const merged = [...existing, ...topics];
    // Remove duplicates by ID
    const unique = merged.filter(
      (topic, index, self) => index === self.findIndex((t) => t.id === topic.id)
    );
    await AsyncStorage.setItem(DOWNLOADED_TOPICS_KEY, JSON.stringify(unique));
  } catch (error) {
    console.error('Error saving downloaded topics:', error);
  }
};

/**
 * Get complete library of topics (bundled + downloaded)
 */
export const getTopicLibrary = async (): Promise<Topic[]> => {
  const downloaded = await getDownloadedTopics();
  const all = [...BUNDLED_TOPICS, ...downloaded];
  // Remove duplicates by ID
  return all.filter(
    (topic, index, self) => index === self.findIndex((t) => t.id === topic.id)
  );
};

/**
 * Complete library of available topics
 * For synchronous access, use bundled topics only
 * For full library, use getTopicLibrary() async
 */
export const TOPIC_LIBRARY: Topic[] = BUNDLED_TOPICS;

/**
 * Get a random unread topic from the library
 * @param completedTopicIds Array of topic IDs that have been completed
 * @returns A random unread topic, or null if all topics have been read
 */
export const getRandomUnreadTopic = (completedTopicIds: string[]): Topic | null => {
  const unreadTopics = TOPIC_LIBRARY.filter(
    (topic) => !completedTopicIds.includes(topic.id)
  );

  if (unreadTopics.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * unreadTopics.length);
  return unreadTopics[randomIndex];
};

/**
 * Get topic by ID
 * @param id Topic ID
 * @returns Topic object or undefined if not found
 */
export const getTopicById = (id: string): Topic | undefined => {
  return TOPIC_LIBRARY.find((topic) => topic.id === id);
};

/**
 * Get topics by category
 * @param category Topic category
 * @returns Array of topics in the specified category
 */
export const getTopicsByCategory = (category: string): Topic[] => {
  return TOPIC_LIBRARY.filter((topic) => topic.category === category);
};

/**
 * Get all available categories
 * @returns Array of unique category strings
 */
export const getAllCategories = (): string[] => {
  const categories = TOPIC_LIBRARY.map((topic) => topic.category);
  return Array.from(new Set(categories));
};
