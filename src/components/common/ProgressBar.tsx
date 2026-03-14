import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../constants/theme';

interface ProgressBarProps {
  current: number;
  total: number;
  isDarkMode?: boolean;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  isDarkMode = false,
  showLabel = true,
}) => {
  const progress = Math.min(current / total, 1);
  const percentage = Math.round(progress * 100);

  const bgColor = isDarkMode ? colors.dark.bg.tertiary : colors.neutral.border;
  const textColor = isDarkMode ? colors.dark.text.secondary : colors.neutral.text.secondary;

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={[styles.label, { color: textColor }]}>
          {current} of {total} • {percentage}%
        </Text>
      )}
      <View style={[styles.track, { backgroundColor: bgColor }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: colors.primary.main,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});
