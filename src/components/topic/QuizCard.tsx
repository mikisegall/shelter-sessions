import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { QuizQuestion as QuizQuestionType } from '../../types/content';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

interface QuizCardProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (correct: boolean) => void;
  isDark: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing.xl * 2;

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  isDark,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    setShowExplanation(true);
    const isCorrect = index === question.correctAnswer;
    onAnswer(isCorrect);
  };

  const getOptionStyle = (index: number) => {
    const baseStyle = isDark ? styles.optionDark : styles.optionLight;

    if (selectedAnswer === null) {
      return [styles.option, baseStyle];
    }

    if (index === question.correctAnswer) {
      return [styles.option, styles.correctOption];
    }

    if (index === selectedAnswer && index !== question.correctAnswer) {
      return [styles.option, styles.incorrectOption];
    }

    return [styles.option, baseStyle, styles.disabledOption];
  };

  const getOptionTextStyle = (index: number) => {
    const baseStyle = isDark ? styles.optionTextDark : styles.optionTextLight;

    if (selectedAnswer !== null && index === question.correctAnswer) {
      return [baseStyle, styles.correctText];
    }

    if (selectedAnswer === index && index !== question.correctAnswer) {
      return [baseStyle, styles.incorrectText];
    }

    return baseStyle;
  };

  const cardStyle = isDark ? styles.cardDark : styles.cardLight;
  const textStyle = isDark ? styles.textDark : styles.textLight;
  const explanationStyle = isDark ? styles.explanationDark : styles.explanationLight;

  return (
    <View style={[styles.card, cardStyle]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>🧠</Text>
          <Text style={[styles.questionNumber, textStyle]}>
            Question {questionNumber} of {totalQuestions}
          </Text>
        </View>

        <Text style={[styles.questionText, textStyle]}>{question.question}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={getOptionStyle(index)}
              onPress={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              activeOpacity={0.7}
            >
              <Text style={getOptionTextStyle(index)}>
                {String.fromCharCode(65 + index)}. {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {showExplanation && (
          <View style={[styles.explanationContainer, explanationStyle]}>
            <Text style={[styles.explanationTitle, textStyle]}>
              {selectedAnswer === question.correctAnswer ? '✅ Correct!' : '❌ Not quite'}
            </Text>
            <Text style={[styles.explanationText, textStyle]}>{question.explanation}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    maxHeight: 600,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.xl,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  questionNumber: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xl,
    lineHeight: typography.sizes.xl * typography.lineHeights.normal,
  },
  textLight: {
    color: colors.neutral.text.primary,
  },
  textDark: {
    color: colors.dark.text.primary,
  },
  optionsContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  option: {
    padding: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 2,
  },
  optionLight: {
    borderColor: colors.neutral.border,
    backgroundColor: colors.neutral.white,
  },
  optionDark: {
    borderColor: colors.dark.border,
    backgroundColor: colors.dark.bg.tertiary,
  },
  correctOption: {
    borderColor: colors.success.main,
    backgroundColor: colors.success.bg,
  },
  incorrectOption: {
    borderColor: colors.error.main,
    backgroundColor: colors.error.bg,
  },
  disabledOption: {
    opacity: 0.4,
  },
  optionTextLight: {
    fontSize: typography.sizes.base,
    color: colors.neutral.text.primary,
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
  },
  optionTextDark: {
    fontSize: typography.sizes.base,
    color: colors.dark.text.primary,
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
  },
  correctText: {
    color: colors.success.dark,
    fontWeight: typography.weights.semibold,
  },
  incorrectText: {
    color: colors.error.dark,
    fontWeight: typography.weights.semibold,
  },
  explanationContainer: {
    padding: spacing.base,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  explanationLight: {
    backgroundColor: colors.primary.bg,
  },
  explanationDark: {
    backgroundColor: colors.dark.bg.tertiary,
  },
  explanationTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
  },
  explanationText: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.sizes.sm * typography.lineHeights.relaxed,
  },
});
