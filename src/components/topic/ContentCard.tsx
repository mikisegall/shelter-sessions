import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { ContentBlock as ContentBlockType } from '../../types/content';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

interface ContentCardProps {
  block: ContentBlockType;
  isDark: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing.xl * 2;

export const ContentCard: React.FC<ContentCardProps> = ({ block, isDark }) => {
  const getBlockLabel = () => {
    switch (block.type) {
      case 'intro':
        return 'Introduction';
      case 'key_point':
        return 'Key Point';
      case 'highlight':
        return 'Highlight';
      case 'detail':
        return 'Details';
      case 'example':
        return 'Example';
      case 'summary':
        return 'Summary';
      default:
        return '';
    }
  };

  const getIcon = () => {
    switch (block.type) {
      case 'intro':
        return '📖';
      case 'key_point':
        return '🔑';
      case 'highlight':
        return '✨';
      case 'detail':
        return '📝';
      case 'example':
        return '💡';
      case 'summary':
        return '🎯';
      default:
        return '•';
    }
  };

  const cardStyle = isDark ? styles.cardDark : styles.cardLight;
  const textStyle = isDark ? styles.textDark : styles.textLight;
  const labelStyle = isDark ? styles.labelDark : styles.labelLight;

  return (
    <View style={[styles.card, cardStyle]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>{getIcon()}</Text>
          <Text style={[styles.label, labelStyle]}>{getBlockLabel()}</Text>
        </View>
        <Text style={[styles.text, textStyle]}>{block.text}</Text>
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
    justifyContent: 'center',
    minHeight: 400,
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
    fontSize: 28,
    marginRight: spacing.md,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  labelLight: {
    color: colors.primary.main,
  },
  labelDark: {
    color: colors.primary.light,
  },
  text: {
    fontSize: typography.sizes.lg,
    lineHeight: typography.sizes.lg * typography.lineHeights.relaxed,
    fontWeight: typography.weights.normal,
  },
  textLight: {
    color: colors.neutral.text.primary,
  },
  textDark: {
    color: colors.dark.text.primary,
  },
});
