import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

const SuggestionCard = ({ mood, suggestion, onReset }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerEmoji}>💡</Text>
        <Text style={styles.header}>Notre suggestion pour vous :</Text>
      </View>
      
      <Text style={styles.moodResult}>
        Humeur détectée : <Text style={styles.moodHighlight}>{mood}</Text>
      </Text>
      
      <ScrollView style={styles.suggestionContainer}>
        <Text style={styles.suggestion}>{suggestion}</Text>
      </ScrollView>
      
      <Pressable 
        style={styles.resetButton} 
        onPress={onReset}
      >
        <Text style={styles.resetButtonText}>Nouvelle analyse</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    maxHeight: '80%',
    flexDirection: 'column',
  },
  headerContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  headerEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  moodResult: {
    fontSize: 15,
    color: '#666',
    marginBottom: 12,
  },
  moodHighlight: {
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  suggestionContainer: {
    maxHeight: 300,
    marginBottom: 12,
  },
  suggestion: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 12,
    backgroundColor: '#f5f9ff',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2',
  },
  resetButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default SuggestionCard;