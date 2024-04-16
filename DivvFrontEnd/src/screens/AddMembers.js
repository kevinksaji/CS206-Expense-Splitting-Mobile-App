import React, { useEffect, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from "../Components/SearchBar";
import AddFriendCard from "../Components/AddFriendCard";
import user from "../assets/user.png";
import NavButton from "../Components/NavButton";
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavBar from '../Components/BottomNavBar';
import ViewFrequentContacts from '../Components/ViewFrequentContacts';
import ContactsList from '../Components/ContactsList';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase/server';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import observeAuthState from '../Components/observerAuthState';

const AddMembers = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const groupName = location.state.groupName;

  const auth = getAuth();

  const [userID, setUserID] = useState("");
  observeAuthState(auth, setUserID);

  const handleBack = () => {
    // Navigate to the "Create_Grp" screen
    navigate('/Create_Grp');
  };

  const handleForward = () => {
    const arr = selectedUsers.map(user => user.id)
    arr.push(userID);
    navigate('/GroupConfirmation', { state: { groupName, noFriend: selectedUsers.length, selectedFriends: arr } });
  };

  const [checked, setChecked] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handlePress = (userId, userName) => {
    setSelectedUsers((prevSelectedUsers) => {
      const index = prevSelectedUsers.findIndex(user => user.id === userId);
      if (index > -1) {
        // If the user is already selected, remove them from the array
        return prevSelectedUsers.filter((user) => user.id !== userId);
      } else {
        // If the user is not selected, add them to the array
        return [...prevSelectedUsers, { id: userId, name: userName }];
      }
    });
  };

  // Get friends 
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const querySnapshot = await getDocs(collection(db, "Users"));
      const friendsData = querySnapshot.docs.map(doc => ({ id: doc.data().UserID, name: doc.data().Username }));
      setFriends(friendsData);
    };
    fetchFriends();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.tasksWrapper}>
        <View style={styles.alignment}>
          <NavButton onPressFunction={handleBack} arrowName={"arrow-back"} />
          <Text style={styles.sectionTitle}>Invite Members</Text>
          <NavButton onPressFunction={handleForward} arrowName={"arrow-forward"} />
        </View>

        <View style={styles.topContainer}>
          {/* View the contact list  */}
          <ViewFrequentContacts onContactPress={handlePress} />
        </View>

        {/* Display selected user information */}
        <View style={{ allignItems: 'center', flexDirection: 'row', marginBottom: 10 }}>
          {selectedUsers.map((userDict) => (
            <View key={userDict.id} style={{ alignItems: 'center', marginRight: 10 }}>
              <Ionicons name="person-circle-outline" size={30} color="white" />
              <Text style={{ color: 'white' }}>{userDict.name}</Text>
            </View>
          ))}
        </View>

        <ScrollView>
          <View>
            <Text style={{ color: 'white' }}>Friends on DivvyUp</Text>
            {friends.map(friend => (
              <AddFriendCard
                key={friend.id}
                text={friend.name}
                img={user}
                checked={selectedUsers.some(user => user.id === friend.id)}
                handlePress={() => handlePress(friend.id, friend.name)}
              />
            ))}

          </View>
        </ScrollView>

      </View>
      <NavBar screen="groups" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#011627",
    justifyContent: 'space-between',
  },
  topContainer: {
    //flex: 1,
    marginBottom: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addContactButton: {
    backgroundColor: '#0A2D4A',
    borderRadius: 10,
    padding: 10,
    width: "90%",
    alignItems: 'center',
  },
  alignment: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  textbox: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingLeft: 5,
    marginBottom: 100,
  },
  tasksWrapper: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default AddMembers;
