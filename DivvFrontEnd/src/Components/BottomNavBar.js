import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigate } from 'react-router-dom';

const BottomNavBar = ({screen}) => {
  const [activeScreen, setActiveScreen] = useState(screen); // Default active screen
  const navigate = useNavigate();

  // Function to handle icon press
  const handleIconPress = (screen, route) => {
    setActiveScreen(screen);
    // Add navigation logic here if needed
    navigate(route);
  };

  // Helper function to determine icon style
  const iconStyle = (screen) => ({
    ...styles.iconWrap,
    backgroundColor: activeScreen === screen ? '#0A2D4A' : 'transparent', // Change the color based on the active screen
  });

  return (
    <View style={styles.navbarContainer}>
      <Pressable style={iconStyle('home')} onPress={() => handleIconPress('home','/home')}>
        <Icon name="home-outline" size={30} color="#FFF" />
      </Pressable>
      <Pressable style={iconStyle('groups')} onPress={() => handleIconPress('groups','/groups')}>
        <Icon name="people" size={30} color="#FFF" />
      </Pressable>
      <Pressable style={iconStyle('money')} onPress={() => handleIconPress('money', '/money')}>
        <Icon name="logo-usd" size={30} color="#FFF" />
      </Pressable>
      <Pressable style={iconStyle('wheel')} onPress={() => handleIconPress('wheel', '/StrangerSplit')}>
        <Icon name="ellipse-outline" size={30} color="#FFF" />
      </Pressable>
      <Pressable style={iconStyle('profile')} onPress={() => handleIconPress('profile')}>
        <Icon name="person-outline" size={30} color="#FFF" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#011627',
    height: 60,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 10,
  },
  
});

export default BottomNavBar;
