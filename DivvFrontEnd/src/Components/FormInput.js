import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const FormInput = (props) => {
  return (
    <TextInput
      style={styles.input}
      {...props} // Inherit all props passed to it; e.g., placeholder, keyboardType
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 32,
    borderRadius: 5,
    fontSize: 16,
  },
});

export default FormInput;
