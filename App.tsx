import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { SwipeableTopicScreen } from './src/screens/SwipeableTopicScreen';
import { Topic } from './src/types/content';
import {
  markTopicAsCompleted,
  updateSessionStats,
} from './src/services/storage/progressStorage';

export default function App() {
  const systemColorScheme = useColorScheme();
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  const handleStartSession = (topic: Topic) => {
    setCurrentTopic(topic);
  };

  const handleSessionComplete = async (quizScore: number, quizTotal: number) => {
    if (currentTopic) {
      // Save progress
      await markTopicAsCompleted(currentTopic.id);
      await updateSessionStats(quizScore, quizTotal);
    }

    // Return to home
    setCurrentTopic(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (currentTopic) {
    return (
      <SwipeableTopicScreen
        topic={currentTopic}
        onComplete={handleSessionComplete}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onBackToHome={() => setCurrentTopic(null)}
      />
    );
  }

  return (
    <HomeScreen
      onStartSession={handleStartSession}
      isDarkMode={isDarkMode}
      onToggleDarkMode={toggleDarkMode}
    />
  );
}
