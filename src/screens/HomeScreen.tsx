import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar as RNStatusBar,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Topic } from '../types/content';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import {
  getSessionStats,
  getCompletedTopicIds,
  SessionStats,
} from '../services/storage/progressStorage';
import {
  TOPIC_LIBRARY,
  getTopicLibrary,
  saveDownloadedTopics,
} from '../constants/topicLibrary';
import { syncTopics, shouldSync } from '../services/sync/contentSync';
import { DebugScreen } from './DebugScreen';

interface HomeScreenProps {
  onStartSession: (topic: Topic) => void;
  onBrowseTopics: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartSession,
  onBrowseTopics,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [availableCount, setAvailableCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [newTopicsCount, setNewTopicsCount] = useState(0);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    loadStats();
    checkForNewTopics();
  }, []);

  const checkForNewTopics = async () => {
    try {
      const needsSync = await shouldSync();
      if (needsSync) {
        // Auto-sync silently in background
        handleSync();
      }
    } catch (error) {
      // Silently fail if offline
    }
  };

  const loadStats = async () => {
    try {
      const sessionStats = await getSessionStats();
      const completedIds = await getCompletedTopicIds();
      const allTopics = await getTopicLibrary();
      setStats(sessionStats);
      setCompletedCount(completedIds.length);
      setAvailableCount(allTopics.length - completedIds.length);
    } catch (error) {
      console.error('Error loading stats:', error);
      // Fallback to default values
      setStats({
        totalTopicsCompleted: 0,
        totalQuizScore: 0,
        totalQuizQuestions: 0,
        lastSessionDate: new Date().toISOString(),
      });
      setCompletedCount(0);
      setAvailableCount(TOPIC_LIBRARY.length);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    console.log('=== SYNC STARTED ===');
    try {
      const result = await syncTopics();
      console.log(`Sync result: ${result.newTopics.length} new topics`);

      if (result.newTopics.length > 0) {
        console.log('Saving downloaded topics to storage...');
        await saveDownloadedTopics(result.newTopics);
        setNewTopicsCount(result.newTopics.length);
        console.log('Reloading stats...');
        await loadStats(); // Refresh counts
        console.log('Stats reloaded');
      } else {
        console.log('No new topics to download');
      }
    } catch (error) {
      console.error('Sync failed:', error);
      // Silently fail - user is offline
    } finally {
      setIsSyncing(false);
      console.log('=== SYNC COMPLETE ===');
    }
  };

  const handleStartSession = async () => {
    try {
      const completedIds = await getCompletedTopicIds();
      const allTopics = await getTopicLibrary();
      const unreadTopics = allTopics.filter((topic) => !completedIds.includes(topic.id));

      if (unreadTopics.length > 0) {
        const randomTopic = unreadTopics[Math.floor(Math.random() * unreadTopics.length)];
        onStartSession(randomTopic);
      }
    } catch (error) {
      console.error('Error starting session:', error);
      // Fallback: just pick a random topic from bundled
      const randomTopic = TOPIC_LIBRARY[Math.floor(Math.random() * TOPIC_LIBRARY.length)];
      if (randomTopic) {
        onStartSession(randomTopic);
      }
    }
  };


  const bgColor = isDarkMode ? colors.dark.bg.primary : colors.neutral.bg;
  const textColor = isDarkMode ? colors.dark.text.primary : colors.neutral.text.primary;
  const secondaryTextColor = isDarkMode
    ? colors.dark.text.secondary
    : colors.neutral.text.secondary;

  if (showDebug) {
    return <DebugScreen onClose={() => setShowDebug(false)} isDarkMode={isDarkMode} />;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <View
        style={[
          styles.container,
          {
            paddingTop:
              Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) + spacing.md : 0,
          },
        ]}
      >
        {/* Header with dark mode and debug */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.appTitle, { color: textColor }]}>Shelter Sessions</Text>
          </View>
          <View style={styles.headerRight}>
            {__DEV__ && (
              <TouchableOpacity onPress={() => setShowDebug(true)} style={styles.iconButton}>
                <Text style={styles.iconButtonText}>🔍</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onToggleDarkMode} style={styles.iconButton}>
              <Text style={styles.iconButtonText}>{isDarkMode ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Text style={[styles.heroIcon]}>📚</Text>
          <Text style={[styles.heroTitle, { color: textColor }]}>
            Learn in 15 minutes
          </Text>

          {/* Compact stats row */}
          {stats && (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary.main }]}>
                  {completedCount}
                </Text>
                <Text style={[styles.statText, { color: secondaryTextColor }]}>read</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.secondary.main }]}>
                  {availableCount}
                </Text>
                <Text style={[styles.statText, { color: secondaryTextColor }]}>available</Text>
              </View>
              {stats.totalQuizQuestions > 0 && (
                <>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.success.main }]}>
                      {Math.round((stats.totalQuizScore / stats.totalQuizQuestions) * 100)}%
                    </Text>
                    <Text style={[styles.statText, { color: secondaryTextColor }]}>accuracy</Text>
                  </View>
                </>
              )}
            </View>
          )}
        </View>

        {/* Action buttons - simplified */}
        <View style={styles.actionsContainer}>
          {/* Primary action */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              availableCount === 0 && styles.primaryButtonDisabled,
            ]}
            onPress={handleStartSession}
            disabled={availableCount === 0}
          >
            <Text style={styles.primaryButtonText}>
              {availableCount === 0 ? 'All Topics Complete!' : 'Start Session'}
            </Text>
            {availableCount > 0 && <Text style={styles.primaryButtonIcon}>→</Text>}
          </TouchableOpacity>

          {/* Secondary actions */}
          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                isDarkMode ? styles.secondaryButtonDark : styles.secondaryButtonLight,
              ]}
              onPress={onBrowseTopics}
            >
              <Text style={[styles.secondaryButtonText, { color: textColor }]}>
                Browse Topics
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                isDarkMode ? styles.secondaryButtonDark : styles.secondaryButtonLight,
              ]}
              onPress={handleSync}
              disabled={isSyncing}
            >
              <Text style={[styles.secondaryButtonText, { color: textColor }]}>
                {isSyncing ? 'Syncing...' : 'Sync'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sync notification */}
          {newTopicsCount > 0 && (
            <View style={styles.notification}>
              <Text style={[styles.notificationText, { color: colors.success.main }]}>
                🎉 {newTopicsCount} new topic{newTopicsCount > 1 ? 's' : ''} available
              </Text>
            </View>
          )}
        </View>

        {/* Reset progress (for testing) */}
        {__DEV__ && completedCount > 0 && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={async () => {
              const { resetAllProgress } = await import(
                '../services/storage/progressStorage'
              );
              await resetAllProgress();
              loadStats();
            }}
          >
            <Text style={[styles.resetButtonText, { color: secondaryTextColor }]}>
              Reset Progress
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.base,
    marginBottom: spacing.xl,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    padding: spacing.xs,
  },
  iconButtonText: {
    fontSize: 24,
  },
  appTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  heroContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  heroIcon: {
    fontSize: 72,
    marginBottom: spacing.lg,
  },
  heroTitle: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.base,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  statText: {
    fontSize: typography.sizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.neutral.border,
  },
  actionsContainer: {
    gap: spacing.base,
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.neutral.border,
  },
  primaryButtonText: {
    color: colors.neutral.white,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    marginRight: spacing.sm,
  },
  primaryButtonIcon: {
    color: colors.neutral.white,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  secondaryButton: {
    flex: 1,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  secondaryButtonLight: {
    backgroundColor: colors.neutral.white,
    borderColor: colors.neutral.border,
  },
  secondaryButtonDark: {
    backgroundColor: colors.dark.bg.secondary,
    borderColor: colors.dark.border,
  },
  secondaryButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  notification: {
    padding: spacing.base,
    borderRadius: borderRadius.md,
    backgroundColor: colors.success.bg,
    alignItems: 'center',
  },
  notificationText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  resetButton: {
    marginTop: spacing.xl,
    padding: spacing.base,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: typography.sizes.xs,
    opacity: 0.5,
  },
});
