import React from 'react';
import { SwipeableTopicScreen } from './src/screens/SwipeableTopicScreen';
import { SAMPLE_TOPIC } from './src/constants/sampleTopic';

export default function App() {
  return <SwipeableTopicScreen topic={SAMPLE_TOPIC} />;
}
