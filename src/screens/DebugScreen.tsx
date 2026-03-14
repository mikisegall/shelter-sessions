import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import { getTopicLibrary, TOPIC_LIBRARY } from '../constants/topicLibrary';
import {
  getSyncedTopicIds,
  getLastSyncTime,
} from '../services/sync/contentSync';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DebugScreenProps {
  onClose: () => void;
  isDarkMode: boolean;
}

export const DebugScreen: React.FC<DebugScreenProps> = ({
  onClose,
  isDarkMode,
}) => {
  const [debugInfo, setDebugInfo] = useState<string>('Loading...');

  useEffect(() => {
    loadDebugInfo();
  }, []);

  const loadDebugInfo = async () => {
    try {
      const bundledTopics = TOPIC_LIBRARY;
      const allTopics = await getTopicLibrary();
      const syncedIds = await getSyncedTopicIds();
      const lastSync = await getLastSyncTime();

      const downloadedTopicsRaw = await AsyncStorage.getItem(
        '@shelter_sessions:downloaded_topics'
      );
      const downloadedTopics = downloadedTopicsRaw
        ? JSON.parse(downloadedTopicsRaw)
        : [];

      const info = `
=== DEBUG INFO ===

BUNDLED TOPICS (${bundledTopics.length}):
${bundledTopics.map((t) => `  • ${t.id} - ${t.title}`).join('\n')}

DOWNLOADED TOPICS (${downloadedTopics.length}):
${downloadedTopics.length > 0 ? downloadedTopics.map((t: any) => `  • ${t.id} - ${t.title}`).join('\n') : '  (none)'}

SYNCED IDs (${syncedIds.length}):
${syncedIds.map((id) => `  • ${id}`).join('\n') || '  (none)'}

ALL TOPICS MERGED (${allTopics.length}):
${allTopics.map((t) => `  • ${t.id} - ${t.title}`).join('\n')}

LAST SYNC:
${lastSync || 'Never'}

=== STORAGE KEYS ===
@shelter_sessions:synced_topics
@shelter_sessions:downloaded_topics
@shelter_sessions:last_sync
      `.trim();

      setDebugInfo(info);
    } catch (error) {
      setDebugInfo(`ERROR: ${error}`);
    }
  };

  const clearSyncData = async () => {
    await AsyncStorage.removeItem('@shelter_sessions:synced_topics');
    await AsyncStorage.removeItem('@shelter_sessions:downloaded_topics');
    await AsyncStorage.removeItem('@shelter_sessions:last_sync');
    loadDebugInfo();
  };

  const bgColor = isDarkMode ? colors.dark.bg.primary : colors.neutral.bg;
  const textColor = isDarkMode ? colors.dark.text.primary : colors.neutral.text.primary;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Debug Info</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕ Close</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.debugText, { color: textColor }]}>{debugInfo}</Text>
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.refreshButton]}
          onPress={loadDebugInfo}
        >
          <Text style={styles.buttonText}>🔄 Refresh</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearSyncData}
        >
          <Text style={styles.buttonText}>🗑️ Clear Sync Data</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  closeButton: {
    padding: spacing.sm,
  },
  closeButtonText: {
    color: colors.primary.main,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  debugText: {
    fontFamily: 'monospace',
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  refreshButton: {
    backgroundColor: colors.primary.main,
  },
  clearButton: {
    backgroundColor: colors.error.main,
  },
  buttonText: {
    color: colors.neutral.white,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
});
