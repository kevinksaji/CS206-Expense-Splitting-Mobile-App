import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const BackButton = ({onPress}) => {
  // Function to handle back press should be passed or use navigation from react-navigation
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Ionicons name="arrow-back" size={24} color="white" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 10,
    marginTop: 10,
  },
});

export default BackButton;
