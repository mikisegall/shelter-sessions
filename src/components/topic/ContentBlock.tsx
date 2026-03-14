import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ContentBlock as ContentBlockType } from '../../types/content';

interface ContentBlockProps {
  block: ContentBlockType;
}

export const ContentBlock: React.FC<ContentBlockProps> = ({ block }) => {
  const getBlockStyle = () => {
    switch (block.type) {
      case 'intro':
        return styles.intro;
      case 'key_point':
        return styles.keyPoint;
      case 'highlight':
        return styles.highlight;
      case 'detail':
        return styles.detail;
      case 'example':
        return styles.example;
      case 'summary':
        return styles.summary;
      default:
        return styles.detail;
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

  return (
    <View style={[styles.container, getBlockStyle()]}>
      <Text style={styles.icon}>{getIcon()}</Text>
      <Text style={styles.text}>{block.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  icon: {
    fontSize: 20,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  intro: {
    backgroundColor: '#E3F2FD',
    borderLeftColor: '#2196F3',
  },
  keyPoint: {
    backgroundColor: '#FFF3E0',
    borderLeftColor: '#FF9800',
  },
  highlight: {
    backgroundColor: '#F3E5F5',
    borderLeftColor: '#9C27B0',
  },
  detail: {
    backgroundColor: '#F5F5F5',
    borderLeftColor: '#757575',
  },
  example: {
    backgroundColor: '#E8F5E9',
    borderLeftColor: '#4CAF50',
  },
  summary: {
    backgroundColor: '#FCE4EC',
    borderLeftColor: '#E91E63',
  },
});
