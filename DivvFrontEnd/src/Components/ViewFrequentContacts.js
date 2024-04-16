import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const dummyContacts = [
  { id: '1', name: 'Keng Hiang', phone: '+657388544' },
  { id: '2', name: 'Yue Heng', phone: '+65837483258' },
  { id: '3', name: 'Isaac', phone: '+6545243666' },
  // Add more dummy contacts as needed
];

// Function to extract initials from a full name
const getInitials = (name) => {
  let initials = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  return initials;
};

const ViewFrequentContacts = ({ onContactPress }) => {
  const [showContacts, setShowContacts] = useState(false);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => onContactPress(item.name)}>
      <View style={styles.initialsCircle}>
        <Text style={styles.initialsText}>{getInitials(item.name)}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.phone}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={() => setShowContacts(!showContacts)}>
        <Text style={styles.buttonText}>Show Most Frequent Contacts </Text>
      </TouchableOpacity>
      {showContacts && (
        <FlatList
          data={dummyContacts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0A2D4A',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  initialsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  initialsText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  textContainer: {
    justifyContent: 'center',
  },
  addContactButton: {
    backgroundColor: '#0A2D4A',
    borderRadius: 10,
    padding: 10,
    width: "90%",
    alignItems: 'center',
  },
});

export default ViewFrequentContacts;
