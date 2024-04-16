import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const NavButton = ({onPressFunction, style, arrowName }) => {
  // Function to handle back press should be passed or use navigation from react-navigation
  return (
    <TouchableOpacity style={style} onPress={onPressFunction}>
      <Ionicons name={arrowName} size={24} color="white" />
    </TouchableOpacity>
  );
};

export default NavButton;
