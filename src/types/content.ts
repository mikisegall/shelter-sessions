/**
 * Content Type Definitions
 * Defines the structure for learning topics and their components
 */

export type TopicCategory =
  | 'science'
  | 'technology'
  | 'history'
  | 'culture'
  | 'philosophy'
  | 'business'
  | 'psychology'
  | 'nature';

export type ContentBlockType =
  | 'intro'       // Introduction to the topic
  | 'key_point'   // Main concept or fact
  | 'highlight'   // Interesting highlight or surprising fact
  | 'detail'      // Detailed explanation
  | 'example'     // Real-world example
  | 'summary';    // Conclusion or summary

export interface ContentBlock {
  type: ContentBlockType;
  text: string;
  imageUrl?: string;  // Optional image for visual learning
}

export interface QuizQuestion {
  question: string;
  options: string[];            // Array of possible answers
  correctAnswer: number;        // Index of correct answer (0-based)
  explanation: string;          // Why this is the correct answer
}

export interface Topic {
  id: string;                   // Unique identifier (UUID)
  title: string;                // Topic title
  category: TopicCategory;      // Category classification
  estimatedReadingTime: number; // In minutes (target: 10-15)
  contentBlocks: ContentBlock[]; // Array of content sections
  quiz: QuizQuestion[];         // Self-assessment questions (3-5 questions)
  createdAt: string;            // ISO 8601 timestamp
  tags?: string[];              // Optional tags for future filtering
}

export interface UserProgress {
  topicId: string;
  completed: boolean;
  completedAt?: string;         // ISO 8601 timestamp
  quizScore?: number;           // Percentage (0-100)
  rating?: number;              // User rating (1-5)
  feedback?: string;            // User feedback on topic
}

export interface ContentMetadata {
  totalTopics: number;
  completedTopics: number;
  lastSyncedAt?: string;        // ISO 8601 timestamp
  availableCategories: TopicCategory[];
}
