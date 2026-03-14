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
        {/* Dark mode toggle */}
        <TouchableOpacity onPress={onToggleDarkMode} style={styles.darkModeButton}>
          <Text style={styles.darkModeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>

        {/* Debug button (dev only) */}
        {__DEV__ && (
          <TouchableOpacity
            onPress={() => setShowDebug(true)}
            style={styles.debugButton}
          >
            <Text style={styles.debugIcon}>🔍</Text>
          </TouchableOpacity>
        )}

        {/* App branding */}
        <View style={styles.brandingContainer}>
          <Text style={[styles.appIcon]}>📚</Text>
          <Text style={[styles.appTitle, { color: textColor }]}>Shelter Sessions</Text>
          <Text style={[styles.appSubtitle, { color: secondaryTextColor }]}>
            Learn something new in 15 minutes
          </Text>
        </View>

        {/* Stats display */}
        {stats && (
          <View style={styles.statsContainer}>
            <View
              style={[
                styles.statCard,
                isDarkMode ? styles.statCardDark : styles.statCardLight,
              ]}
            >
              <Text style={[styles.statNumber, { color: colors.primary.main }]}>
                {completedCount}
              </Text>
              <Text style={[styles.statLabel, { color: secondaryTextColor }]}>
                Topics Completed
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                isDarkMode ? styles.statCardDark : styles.statCardLight,
              ]}
            >
              <Text style={[styles.statNumber, { color: colors.secondary.main }]}>
                {availableCount}
              </Text>
              <Text style={[styles.statLabel, { color: secondaryTextColor }]}>
                Topics Available
              </Text>
            </View>

            {stats.totalQuizQuestions > 0 && (
              <View
                style={[
                  styles.statCard,
                  styles.statCardWide,
                  isDarkMode ? styles.statCardDark : styles.statCardLight,
                ]}
              >
                <Text style={[styles.statNumber, { color: colors.success.main }]}>
                  {Math.round((stats.totalQuizScore / stats.totalQuizQuestions) * 100)}%
                </Text>
                <Text style={[styles.statLabel, { color: secondaryTextColor }]}>
                  Quiz Accuracy
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Sync button */}
        {newTopicsCount > 0 && (
          <View style={styles.syncNotification}>
            <Text style={[styles.syncNotificationText, { color: secondaryTextColor }]}>
              🎉 {newTopicsCount} new topic{newTopicsCount > 1 ? 's' : ''} downloaded!
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.syncButton, isDarkMode ? styles.syncButtonDark : styles.syncButtonLight]}
          onPress={handleSync}
          disabled={isSyncing}
        >
          <Text style={[styles.syncButtonText, { color: colors.primary.main }]}>
            {isSyncing ? '⏳ Syncing...' : '🔄 Check for New Topics'}
          </Text>
        </TouchableOpacity>

        {/* Browse topics button */}
        <TouchableOpacity
          style={[styles.browseButton, isDarkMode ? styles.browseButtonDark : styles.browseButtonLight]}
          onPress={onBrowseTopics}
        >
          <Text style={[styles.browseButtonText, { color: colors.primary.main }]}>
            📚 Browse All Topics
          </Text>
        </TouchableOpacity>

        {/* Start session button */}
        <TouchableOpacity
          style={[
            styles.startButton,
            availableCount === 0 && styles.startButtonDisabled,
          ]}
          onPress={handleStartSession}
          disabled={availableCount === 0}
        >
          <Text style={styles.startButtonText}>
            {availableCount === 0 ? 'All Topics Completed!' : 'Start Random Session'}
          </Text>
          {availableCount > 0 && <Text style={styles.startButtonIcon}>→</Text>}
        </TouchableOpacity>

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
              Reset Progress (Dev Only)
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
    justifyContent: 'center',
  },
  darkModeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) + spacing.md : spacing.md,
    right: spacing.xl,
    padding: spacing.sm,
    zIndex: 10,
  },
  darkModeIcon: {
    fontSize: 28,
  },
  debugButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) + spacing.md + 40 : spacing.md + 40,
    right: spacing.xl,
    padding: spacing.sm,
    zIndex: 10,
  },
  debugIcon: {
    fontSize: 24,
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl * 2,
  },
  appIcon: {
    fontSize: 64,
    marginBottom: spacing.base,
  },
  appTitle: {
    fontSize: typography.sizes.heading,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
  },
  appSubtitle: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.base,
    marginBottom: spacing.xxl,
  },
  statCard: {
    width: '45%',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  statCardWide: {
    width: '92%',
  },
  statCardLight: {
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  statCardDark: {
    backgroundColor: colors.dark.bg.secondary,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  statNumber: {
    fontSize: typography.sizes.heading,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
  startButton: {
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
  startButtonDisabled: {
    backgroundColor: colors.neutral.border,
  },
  startButtonText: {
    color: colors.neutral.white,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    marginRight: spacing.sm,
  },
  startButtonIcon: {
    color: colors.neutral.white,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
  },
  syncNotification: {
    padding: spacing.base,
    borderRadius: borderRadius.md,
    backgroundColor: colors.success.bg,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  syncNotificationText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  syncButton: {
    padding: spacing.base,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
  },
  syncButtonLight: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.bg,
  },
  syncButtonDark: {
    borderColor: colors.primary.light,
    backgroundColor: colors.dark.bg.tertiary,
  },
  syncButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
  },
  browseButton: {
    padding: spacing.base,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  browseButtonLight: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.bg,
  },
  browseButtonDark: {
    borderColor: colors.primary.light,
    backgroundColor: colors.dark.bg.tertiary,
  },
  browseButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
  },
  resetButton: {
    marginTop: spacing.xl,
    padding: spacing.base,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: typography.sizes.sm,
  },
});
