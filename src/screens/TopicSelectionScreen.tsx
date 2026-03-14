import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar as RNStatusBar,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Topic } from '../types/content';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import { getTopicLibrary } from '../constants/topicLibrary';
import { getCompletedTopicIds } from '../services/storage/progressStorage';

interface TopicSelectionScreenProps {
  onSelectTopic: (topic: Topic) => void;
  onBack: () => void;
  isDarkMode: boolean;
}

interface TopicWithStatus extends Topic {
  isCompleted: boolean;
}

export const TopicSelectionScreen: React.FC<TopicSelectionScreenProps> = ({
  onSelectTopic,
  onBack,
  isDarkMode,
}) => {
  const [topics, setTopics] = useState<TopicWithStatus[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    loadTopics();
  }, [filter, categoryFilter]);

  const loadTopics = async () => {
    try {
      const allTopics = await getTopicLibrary();
      const completedIds = await getCompletedTopicIds();

      let topicsWithStatus: TopicWithStatus[] = allTopics.map((topic) => ({
        ...topic,
        isCompleted: completedIds.includes(topic.id),
      }));

      // Apply filters
      if (filter === 'unread') {
        topicsWithStatus = topicsWithStatus.filter((t) => !t.isCompleted);
      } else if (filter === 'completed') {
        topicsWithStatus = topicsWithStatus.filter((t) => t.isCompleted);
      }

      if (categoryFilter) {
        topicsWithStatus = topicsWithStatus.filter((t) => t.category === categoryFilter);
      }

      // Sort: unread first, then by title
      topicsWithStatus.sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }
        return a.title.localeCompare(b.title);
      });

      setTopics(topicsWithStatus);
    } catch (error) {
      console.error('Error loading topics:', error);
    }
  };

  const categories = Array.from(new Set(topics.map((t) => t.category)));

  const bgColor = isDarkMode ? colors.dark.bg.primary : colors.neutral.bg;
  const textColor = isDarkMode ? colors.dark.text.primary : colors.neutral.text.primary;
  const secondaryTextColor = isDarkMode
    ? colors.dark.text.secondary
    : colors.neutral.text.secondary;

  const renderTopic = ({ item }: { item: TopicWithStatus }) => (
    <TouchableOpacity
      style={[
        styles.topicCard,
        isDarkMode ? styles.topicCardDark : styles.topicCardLight,
        item.isCompleted && styles.topicCardCompleted,
      ]}
      onPress={() => onSelectTopic(item)}
    >
      <View style={styles.topicHeader}>
        <Text style={[styles.topicTitle, { color: textColor }]} numberOfLines={2}>
          {item.title}
        </Text>
        {item.isCompleted && <Text style={styles.completedBadge}>✓</Text>}
      </View>
      <View style={styles.topicMeta}>
        <Text style={[styles.topicCategory, { color: secondaryTextColor }]}>
          {item.category.toUpperCase()}
        </Text>
        <Text style={[styles.topicTime, { color: secondaryTextColor }]}>
          {item.estimatedReadingTime} min
        </Text>
      </View>
      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <Text key={index} style={[styles.tag, { color: secondaryTextColor }]}>
              #{tag}
            </Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <View
        style={[
          styles.header,
          {
            paddingTop:
              Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) + spacing.md : 0,
          },
        ]}
      >
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Home</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Browse Topics</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Filter chips */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === 'all' && styles.filterChipActive,
            isDarkMode ? styles.filterChipDark : styles.filterChipLight,
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === 'all' && styles.filterChipTextActive,
              { color: filter === 'all' ? colors.neutral.white : textColor },
            ]}
          >
            All ({topics.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === 'unread' && styles.filterChipActive,
            isDarkMode ? styles.filterChipDark : styles.filterChipLight,
          ]}
          onPress={() => setFilter('unread')}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === 'unread' && styles.filterChipTextActive,
              { color: filter === 'unread' ? colors.neutral.white : textColor },
            ]}
          >
            Unread
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === 'completed' && styles.filterChipActive,
            isDarkMode ? styles.filterChipDark : styles.filterChipLight,
          ]}
          onPress={() => setFilter('completed')}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === 'completed' && styles.filterChipTextActive,
              { color: filter === 'completed' ? colors.neutral.white : textColor },
            ]}
          >
            Read
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category filter */}
      {categories.length > 1 && (
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[
              styles.categoryChip,
              !categoryFilter && styles.categoryChipActive,
              isDarkMode ? styles.categoryChipDark : styles.categoryChipLight,
            ]}
            onPress={() => setCategoryFilter(null)}
          >
            <Text
              style={[
                styles.categoryChipText,
                { color: !categoryFilter ? colors.primary.main : secondaryTextColor },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                categoryFilter === category && styles.categoryChipActive,
                isDarkMode ? styles.categoryChipDark : styles.categoryChipLight,
              ]}
              onPress={() =>
                setCategoryFilter(categoryFilter === category ? null : category)
              }
            >
              <Text
                style={[
                  styles.categoryChipText,
                  {
                    color:
                      categoryFilter === category ? colors.primary.main : secondaryTextColor,
                  },
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Topic list */}
      <FlatList
        data={topics}
        renderItem={renderTopic}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: secondaryTextColor }]}>
              {filter === 'completed'
                ? 'No completed topics yet'
                : filter === 'unread'
                  ? 'All topics have been read!'
                  : 'No topics available'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  backButtonText: {
    color: colors.primary.main,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  headerSpacer: {
    width: 60,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  filterChipLight: {
    borderColor: colors.neutral.border,
    backgroundColor: colors.neutral.bg,
  },
  filterChipDark: {
    borderColor: colors.dark.border,
    backgroundColor: colors.dark.bg.secondary,
  },
  filterChipActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  filterChipText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  filterChipTextActive: {
    color: colors.neutral.white,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  categoryChipLight: {
    borderColor: colors.neutral.border,
    backgroundColor: colors.neutral.white,
  },
  categoryChipDark: {
    borderColor: colors.dark.border,
    backgroundColor: colors.dark.bg.secondary,
  },
  categoryChipActive: {
    borderColor: colors.primary.main,
  },
  categoryChipText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    textTransform: 'capitalize',
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  topicCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  topicCardLight: {
    backgroundColor: colors.neutral.white,
    borderColor: colors.neutral.border,
  },
  topicCardDark: {
    backgroundColor: colors.dark.bg.secondary,
    borderColor: colors.dark.border,
  },
  topicCardCompleted: {
    opacity: 0.7,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  topicTitle: {
    flex: 1,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    lineHeight: 24,
  },
  completedBadge: {
    fontSize: 20,
    marginLeft: spacing.sm,
    color: colors.success.main,
  },
  topicMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  topicCategory: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
  topicTime: {
    fontSize: typography.sizes.xs,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: typography.sizes.xs,
  },
  emptyState: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
  },
});
