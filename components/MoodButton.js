import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const MoodButton = ({ emoji, mood, onPress }) => {
  return (
    <Pressable 
      style={styles.moodButton} 
      onPress={() => onPress(mood)}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.moodText}>{mood}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  moodButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 8,
    width: '45%',
    elevation: 2,
  },
  emoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  moodText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MoodButton;