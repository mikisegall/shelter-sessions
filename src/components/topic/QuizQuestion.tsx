import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { QuizQuestion as QuizQuestionType } from '../../types/content';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  onAnswer: (correct: boolean) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  onAnswer,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(index);
    setShowExplanation(true);
    const isCorrect = index === question.correctAnswer;
    onAnswer(isCorrect);
  };

  const getOptionStyle = (index: number) => {
    if (selectedAnswer === null) {
      return styles.option;
    }

    if (index === question.correctAnswer) {
      return [styles.option, styles.correctOption];
    }

    if (index === selectedAnswer && index !== question.correctAnswer) {
      return [styles.option, styles.incorrectOption];
    }

    return [styles.option, styles.disabledOption];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionNumber}>Question {questionNumber}</Text>
      <Text style={styles.questionText}>{question.question}</Text>

      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(index)}
            onPress={() => handleAnswer(index)}
            disabled={selectedAnswer !== null}
          >
            <Text
              style={[
                styles.optionText,
                selectedAnswer !== null && index === question.correctAnswer && styles.correctText,
                selectedAnswer === index &&
                  index !== question.correctAnswer &&
                  styles.incorrectText,
              ]}
            >
              {String.fromCharCode(65 + index)}. {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {showExplanation && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationTitle}>
            {selectedAnswer === question.correctAnswer ? '✅ Correct!' : '❌ Not quite'}
          </Text>
          <Text style={styles.explanationText}>{question.explanation}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 10,
  },
  option: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  incorrectOption: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  correctText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  incorrectText: {
    color: '#C62828',
    fontWeight: '600',
  },
  explanationContainer: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
});
