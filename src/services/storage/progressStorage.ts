import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPLETED_TOPICS_KEY = '@shelter_sessions:completed_topics';
const SESSION_STATS_KEY = '@shelter_sessions:session_stats';

export interface SessionStats {
  totalTopicsCompleted: number;
  totalQuizScore: number;
  totalQuizQuestions: number;
  lastSessionDate: string;
}

/**
 * Get array of completed topic IDs
 */
export const getCompletedTopicIds = async (): Promise<string[]> => {
  try {
    const value = await AsyncStorage.getItem(COMPLETED_TOPICS_KEY);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Error loading completed topics:', error);
    return [];
  }
};

/**
 * Mark a topic as completed
 */
export const markTopicAsCompleted = async (topicId: string): Promise<void> => {
  try {
    const completedIds = await getCompletedTopicIds();
    if (!completedIds.includes(topicId)) {
      completedIds.push(topicId);
      await AsyncStorage.setItem(COMPLETED_TOPICS_KEY, JSON.stringify(completedIds));
    }
  } catch (error) {
    console.error('Error marking topic as completed:', error);
  }
};

/**
 * Get session statistics
 */
export const getSessionStats = async (): Promise<SessionStats> => {
  try {
    const value = await AsyncStorage.getItem(SESSION_STATS_KEY);
    return value
      ? JSON.parse(value)
      : {
          totalTopicsCompleted: 0,
          totalQuizScore: 0,
          totalQuizQuestions: 0,
          lastSessionDate: new Date().toISOString(),
        };
  } catch (error) {
    console.error('Error loading session stats:', error);
    return {
      totalTopicsCompleted: 0,
      totalQuizScore: 0,
      totalQuizQuestions: 0,
      lastSessionDate: new Date().toISOString(),
    };
  }
};

/**
 * Update session statistics after completing a topic
 */
export const updateSessionStats = async (
  quizScore: number,
  quizTotal: number
): Promise<void> => {
  try {
    const stats = await getSessionStats();
    const updatedStats: SessionStats = {
      totalTopicsCompleted: stats.totalTopicsCompleted + 1,
      totalQuizScore: stats.totalQuizScore + quizScore,
      totalQuizQuestions: stats.totalQuizQuestions + quizTotal,
      lastSessionDate: new Date().toISOString(),
    };
    await AsyncStorage.setItem(SESSION_STATS_KEY, JSON.stringify(updatedStats));
  } catch (error) {
    console.error('Error updating session stats:', error);
  }
};

/**
 * Reset all progress (for testing or user request)
 */
export const resetAllProgress = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(COMPLETED_TOPICS_KEY);
    await AsyncStorage.removeItem(SESSION_STATS_KEY);
  } catch (error) {
    console.error('Error resetting progress:', error);
  }
};

/**
 * Check if a topic has been completed
 */
export const isTopicCompleted = async (topicId: string): Promise<boolean> => {
  const completedIds = await getCompletedTopicIds();
  return completedIds.includes(topicId);
};
