import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Topic } from '../types/content';
import { ContentCard } from '../components/topic/ContentCard';
import { QuizCard } from '../components/topic/QuizCard';
import { colors, typography, spacing, borderRadius } from '../constants/theme';

interface SwipeableTopicScreenProps {
  topic: Topic;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type CardItem =
  | { type: 'intro'; index: number }
  | { type: 'content'; index: number }
  | { type: 'quiz'; index: number }
  | { type: 'summary'; index: number };

export const SwipeableTopicScreen: React.FC<SwipeableTopicScreenProps> = ({ topic }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const flatListRef = useRef<FlatList>(null);

  // Build card items array
  const cards: CardItem[] = [
    { type: 'intro', index: 0 },
    ...topic.contentBlocks.map((_, i) => ({ type: 'content' as const, index: i })),
    ...topic.quiz.map((_, i) => ({ type: 'quiz' as const, index: i })),
    { type: 'summary', index: 0 },
  ];

  const handleAnswer = (correct: boolean) => {
    setQuizScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderCard = ({ item }: { item: CardItem }) => {
    if (item.type === 'intro') {
      return (
        <View style={styles.cardContainer}>
          <View style={[styles.introCard, isDarkMode ? styles.cardDark : styles.cardLight]}>
            <View style={[styles.categoryBadge, { backgroundColor: colors.primary.main }]}>
              <Text style={styles.categoryText}>{topic.category.toUpperCase()}</Text>
            </View>
            <Text style={[styles.title, isDarkMode ? styles.textDark : styles.textLight]}>
              {topic.title}
            </Text>
            <View style={styles.metaRow}>
              <Text style={[styles.metaText, isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}>
                📚 {topic.estimatedReadingTime} min
              </Text>
              <Text style={[styles.metaText, isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}>
                {topic.contentBlocks.length} sections
              </Text>
              <Text style={[styles.metaText, isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}>
                {topic.quiz.length} questions
              </Text>
            </View>
            <Text style={[styles.swipeHint, isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}>
              👉 Swipe to start
            </Text>
          </View>
        </View>
      );
    }

    if (item.type === 'content') {
      return (
        <View style={styles.cardContainer}>
          <ContentCard block={topic.contentBlocks[item.index]} isDark={isDarkMode} />
        </View>
      );
    }

    if (item.type === 'quiz') {
      return (
        <View style={styles.cardContainer}>
          <QuizCard
            question={topic.quiz[item.index]}
            questionNumber={item.index + 1}
            totalQuestions={topic.quiz.length}
            onAnswer={handleAnswer}
            isDark={isDarkMode}
          />
        </View>
      );
    }

    if (item.type === 'summary') {
      const percentage =
        quizScore.total > 0 ? Math.round((quizScore.correct / quizScore.total) * 100) : 0;

      return (
        <View style={styles.cardContainer}>
          <View style={[styles.summaryCard, isDarkMode ? styles.cardDark : styles.cardLight]}>
            <Text style={styles.summaryIcon}>🎉</Text>
            <Text style={[styles.summaryTitle, isDarkMode ? styles.textDark : styles.textLight]}>
              Session Complete!
            </Text>

            {quizScore.total > 0 && (
              <View style={styles.scoreBox}>
                <Text
                  style={[styles.scoreLabel, isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}
                >
                  Your Score
                </Text>
                <Text style={[styles.scoreValue, isDarkMode ? styles.textDark : styles.textLight]}>
                  {quizScore.correct} / {quizScore.total}
                </Text>
                <Text style={[styles.scorePercentage, { color: colors.primary.main }]}>
                  {percentage}%
                </Text>
                <Text
                  style={[styles.scoreMessage, isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}
                >
                  {percentage === 100
                    ? '🎉 Perfect!'
                    : percentage >= 80
                    ? '👏 Great job!'
                    : percentage >= 60
                    ? '👍 Good work!'
                    : '💪 Keep learning!'}
                </Text>
              </View>
            )}

            <Text
              style={[styles.summaryText, isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}
            >
              More topics coming soon!
            </Text>
          </View>
        </View>
      );
    }

    return null;
  };

  const bgColor = isDarkMode ? colors.dark.bg.primary : colors.neutral.bg;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header with progress and dark mode toggle */}
      <View
        style={[
          styles.header,
          isDarkMode ? styles.headerDark : styles.headerLight,
          {
            paddingTop:
              Platform.OS === 'android'
                ? (RNStatusBar.currentHeight || 0) + spacing.md
                : spacing.md,
          },
        ]}
      >
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentIndex + 1) / cards.length) * 100}%`,
                  backgroundColor: colors.primary.main,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, isDarkMode ? styles.textSecondaryDark : styles.textSecondaryLight]}>
            {currentIndex + 1} / {cards.length}
          </Text>
        </View>

        <TouchableOpacity onPress={toggleDarkMode} style={styles.darkModeButton}>
          <Text style={styles.darkModeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable content */}
      <FlatList
        ref={flatListRef}
        data={cards}
        renderItem={renderCard}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(index);
        }}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="center"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
  },
  headerLight: {
    backgroundColor: colors.neutral.white,
    borderBottomColor: colors.neutral.border,
  },
  headerDark: {
    backgroundColor: colors.dark.bg.secondary,
    borderBottomColor: colors.dark.border,
  },
  progressContainer: {
    flex: 1,
    marginRight: spacing.base,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.neutral.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  darkModeButton: {
    padding: spacing.sm,
  },
  darkModeIcon: {
    fontSize: 20,
  },
  cardContainer: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  introCard: {
    width: SCREEN_WIDTH - spacing.xl * 2,
    padding: spacing.xxl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  categoryBadge: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
  },
  categoryText: {
    color: colors.neutral.white,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: typography.sizes.heading,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: typography.sizes.heading * typography.lineHeights.tight,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.xl,
  },
  metaText: {
    fontSize: typography.sizes.sm,
  },
  swipeHint: {
    fontSize: typography.sizes.base,
    marginTop: spacing.lg,
  },
  summaryCard: {
    width: SCREEN_WIDTH - spacing.xl * 2,
    padding: spacing.xxl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    minHeight: 400,
    justifyContent: 'center',
  },
  summaryIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    fontSize: typography.sizes.heading,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xl,
  },
  scoreBox: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    padding: spacing.xl,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary.bg,
    width: '100%',
  },
  scoreLabel: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: typography.sizes.heading,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  scorePercentage: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
  },
  scoreMessage: {
    fontSize: typography.sizes.base,
  },
  summaryText: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
  },
  cardLight: {
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardDark: {
    backgroundColor: colors.dark.bg.secondary,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  textLight: {
    color: colors.neutral.text.primary,
  },
  textDark: {
    color: colors.dark.text.primary,
  },
  textSecondaryLight: {
    color: colors.neutral.text.secondary,
  },
  textSecondaryDark: {
    color: colors.dark.text.secondary,
  },
});
