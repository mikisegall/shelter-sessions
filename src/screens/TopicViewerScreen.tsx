import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Topic } from '../types/content';
import { ContentBlock } from '../components/topic/ContentBlock';
import { QuizQuestion } from '../components/topic/QuizQuestion';

interface TopicViewerScreenProps {
  topic: Topic;
}

export const TopicViewerScreen: React.FC<TopicViewerScreenProps> = ({ topic }) => {
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  const handleAnswer = (correct: boolean) => {
    setQuizScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const getCategoryColor = () => {
    switch (topic.category) {
      case 'science':
        return '#2196F3';
      case 'technology':
        return '#FF9800';
      case 'history':
        return '#9C27B0';
      case 'culture':
        return '#4CAF50';
      case 'philosophy':
        return '#E91E63';
      default:
        return '#757575';
    }
  };

  const getScoreMessage = () => {
    if (quizScore.total === 0) return null;

    const percentage = (quizScore.correct / quizScore.total) * 100;

    if (percentage === 100) return '🎉 Perfect score!';
    if (percentage >= 80) return '👏 Great job!';
    if (percentage >= 60) return '👍 Good work!';
    return '💪 Keep learning!';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
            <Text style={styles.categoryText}>{topic.category.toUpperCase()}</Text>
          </View>
          <Text style={styles.title}>{topic.title}</Text>
          <Text style={styles.readingTime}>📚 {topic.estimatedReadingTime} min read</Text>
        </View>

        {/* Content Blocks */}
        <View style={styles.contentSection}>
          {topic.contentBlocks.map((block, index) => (
            <ContentBlock key={index} block={block} />
          ))}
        </View>

        {/* Quiz Section */}
        <View style={styles.quizSection}>
          <View style={styles.quizHeader}>
            <Text style={styles.quizTitle}>🧠 Test Your Knowledge</Text>
            <Text style={styles.quizSubtitle}>
              Answer these questions to reinforce what you learned
            </Text>
          </View>

          {topic.quiz.map((question, index) => (
            <QuizQuestion
              key={index}
              question={question}
              questionNumber={index + 1}
              onAnswer={handleAnswer}
            />
          ))}

          {/* Quiz Results */}
          {quizScore.total > 0 && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>
                Score: {quizScore.correct} / {quizScore.total}
              </Text>
              {getScoreMessage() && <Text style={styles.scoreMessage}>{getScoreMessage()}</Text>}
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Enjoyed this topic? More sessions coming soon! 🚀
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    lineHeight: 36,
  },
  readingTime: {
    fontSize: 14,
    color: '#666',
  },
  contentSection: {
    padding: 20,
  },
  quizSection: {
    padding: 20,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  quizHeader: {
    marginBottom: 24,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  quizSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  scoreContainer: {
    marginTop: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  scoreMessage: {
    fontSize: 16,
    color: '#666',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
