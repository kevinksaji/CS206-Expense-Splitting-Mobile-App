import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, FlatList, Text, View, StyleSheet, TextInput, Button } from 'react-native';
import Contacts from 'react-native-contacts';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState('name'); // 'name' or 'recent'

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts Access Permission',
          message: 'This app would like to view your contacts.',
          buttonPositive: 'Please accept bare mortal'
        }
      ).then(() => {
        loadContacts();
      });
    } else {
      loadContacts();
    }
  }, []);

  useEffect(() => {
    filterContacts(searchQuery);
  }, [contacts, searchQuery, sortCriteria]);

  const loadContacts = () => {
    Contacts.getAll().then(contacts => {
      // Optionally, sort by recently added here if needed
      setContacts(contacts);
    }).catch(e => {
      console.log(e);
    });
  };

  const filterContacts = (query) => {
    let filtered = contacts.filter(contact => {
      const fullName = `${contact.givenName} ${contact.familyName}`.toLowerCase();
      return fullName.includes(query.toLowerCase()) ||
        contact.phoneNumbers.some(number => number.number.includes(query));
    });

    // Apply sorting based on sortCriteria
    if (sortCriteria === 'name') {
      filtered.sort((a, b) => `${a.givenName} ${a.familyName}`.localeCompare(`${b.givenName} ${b.familyName}`));
    } else if (sortCriteria === 'recent') {
      // Assuming contacts array is already sorted by recently added, otherwise apply your logic here
    }

    setFilteredContacts(filtered);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sortBar}>
        <Button title="Sort by Name" onPress={() => setSortCriteria('name')} />
        <Button title="Sort by Recent" onPress={() => setSortCriteria('recent')} />
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Contacts..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredContacts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text style={styles.contactText}>{`${item.givenName} ${item.familyName}`}</Text>
            <Text style={styles.numberText}>{item.phoneNumbers[0]?.number}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  sortBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10
  },
  searchBar: {
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  contactText: {
    fontSize: 18
  },
  numberText: {
    color: 'grey'
  }
});

export default ContactList;
