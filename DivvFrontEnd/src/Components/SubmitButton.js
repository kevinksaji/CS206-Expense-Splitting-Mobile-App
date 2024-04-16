import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const SubmitButton = ({onPress, title}) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0A2D4A',
    padding: 32,
    marginTop: 32,
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubmitButton;
