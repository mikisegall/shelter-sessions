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
import { colors, typography, spacing, borderRadius, getCategoryColor } from '../constants/theme';
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
  const [allTopics, setAllTopics] = useState<TopicWithStatus[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    loadTopics();
  }, [filter, categoryFilter]);

  const loadTopics = async () => {
    try {
      const library = await getTopicLibrary();
      const completedIds = await getCompletedTopicIds();

      const topicsWithStatus: TopicWithStatus[] = library.map((topic) => ({
        ...topic,
        isCompleted: completedIds.includes(topic.id),
      }));

      // Store all topics for category list
      setAllTopics(topicsWithStatus);

      // Apply filters
      let filteredTopics = [...topicsWithStatus];

      if (filter === 'unread') {
        filteredTopics = filteredTopics.filter((t) => !t.isCompleted);
      } else if (filter === 'completed') {
        filteredTopics = filteredTopics.filter((t) => t.isCompleted);
      }

      if (categoryFilter) {
        filteredTopics = filteredTopics.filter((t) => t.category === categoryFilter);
      }

      // Sort: unread first, then by title
      filteredTopics.sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }
        return a.title.localeCompare(b.title);
      });

      setTopics(filteredTopics);
    } catch (error) {
      console.error('Error loading topics:', error);
    }
  };

  const categories = Array.from(new Set(allTopics.map((t) => t.category)));

  const bgColor = isDarkMode ? colors.dark.bg.primary : colors.neutral.bg;
  const textColor = isDarkMode ? colors.dark.text.primary : colors.neutral.text.primary;
  const secondaryTextColor = isDarkMode
    ? colors.dark.text.secondary
    : colors.neutral.text.secondary;

  const renderTopic = ({ item }: { item: TopicWithStatus }) => {
    const categoryColor = getCategoryColor(item.category);

    return (
      <TouchableOpacity
        style={[
          styles.topicCard,
          isDarkMode ? styles.topicCardDark : styles.topicCardLight,
          item.isCompleted && styles.topicCardCompleted,
          { borderLeftWidth: 4, borderLeftColor: categoryColor.main },
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
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor.bg }]}>
            <Text style={[styles.topicCategory, { color: categoryColor.main }]}>
              {item.category.toUpperCase()}
            </Text>
          </View>
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
  };

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
            isDarkMode ? styles.filterChipDark : styles.filterChipLight,
            filter === 'all' && styles.filterChipActive,
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: filter === 'all' ? colors.primary.main : secondaryTextColor },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            isDarkMode ? styles.filterChipDark : styles.filterChipLight,
            filter === 'unread' && styles.filterChipActive,
          ]}
          onPress={() => setFilter('unread')}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: filter === 'unread' ? colors.primary.main : secondaryTextColor },
            ]}
          >
            Unread
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            isDarkMode ? styles.filterChipDark : styles.filterChipLight,
            filter === 'completed' && styles.filterChipActive,
          ]}
          onPress={() => setFilter('completed')}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: filter === 'completed' ? colors.primary.main : secondaryTextColor },
            ]}
          >
            Read
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category filter */}
      {categories.length > 0 && (
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[
              styles.categoryChip,
              isDarkMode ? styles.categoryChipDark : styles.categoryChipLight,
              !categoryFilter && styles.categoryChipActive,
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
                isDarkMode ? styles.categoryChipDark : styles.categoryChipLight,
                categoryFilter === category && styles.categoryChipActive,
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
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  filterChipLight: {
    borderColor: colors.neutral.border,
    backgroundColor: colors.neutral.white,
  },
  filterChipDark: {
    borderColor: colors.dark.border,
    backgroundColor: colors.dark.bg.secondary,
  },
  filterChipActive: {
    borderColor: colors.primary.main,
  },
  filterChipText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    textTransform: 'capitalize',
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
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
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
