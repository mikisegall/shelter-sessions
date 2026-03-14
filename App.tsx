import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { SwipeableTopicScreen } from './src/screens/SwipeableTopicScreen';
import { TopicSelectionScreen } from './src/screens/TopicSelectionScreen';
import { Topic } from './src/types/content';
import {
  markTopicAsCompleted,
  updateSessionStats,
} from './src/services/storage/progressStorage';

type Screen = 'home' | 'browse' | 'session';

export default function App() {
  const systemColorScheme = useColorScheme();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  const handleStartSession = (topic: Topic) => {
    setCurrentTopic(topic);
    setCurrentScreen('session');
  };

  const handleBrowseTopics = () => {
    setCurrentScreen('browse');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setCurrentTopic(null);
  };

  const handleSessionComplete = async (quizScore: number, quizTotal: number) => {
    if (currentTopic) {
      // Save progress
      await markTopicAsCompleted(currentTopic.id);
      await updateSessionStats(quizScore, quizTotal);
    }

    // Return to home
    handleBackToHome();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (currentScreen === 'session' && currentTopic) {
    return (
      <SwipeableTopicScreen
        topic={currentTopic}
        onComplete={handleSessionComplete}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onBackToHome={handleBackToHome}
      />
    );
  }

  if (currentScreen === 'browse') {
    return (
      <TopicSelectionScreen
        onSelectTopic={handleStartSession}
        onBack={handleBackToHome}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <HomeScreen
      onStartSession={handleStartSession}
      onBrowseTopics={handleBrowseTopics}
      isDarkMode={isDarkMode}
      onToggleDarkMode={toggleDarkMode}
    />
  );
}
