import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigate } from 'react-router-dom';
import Task from '../Components/Task';
import SearchBar from '../Components/SearchBar';
import NavBar from '../Components/BottomNavBar';
import { fetchCollection, addNewDocument } from '../firebase/server';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import observeAuthState from '../Components/observerAuthState';
import { useLocation } from 'react-router-dom';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Groups = () => {
    const navigate = useNavigate();

    const [groupData, setGroupData] = useState([]); // Initialize state to hold fetched data

    const auth = getAuth();

    const [userID, setUserID] = useState("");

    observeAuthState(auth, setUserID);

    useEffect(() => {
        // Fetch data from the "Group" collection
        const fetchData = async () => {
          const data = await fetchCollection('Group');
          setGroupData(data); // Set the fetched data to state
        };
      
        fetchData();
        
      }, []); // Empty dependency array means this effect runs once on mount

    const handleCreateGroupClick = () => {
        navigate('/Create_Grp');
    };

    const handleExpensesEntryClick = (groupName, groupDetails, groupID) => {
        navigate('/ExpensesPage', { state: { groupName: groupName} });

        // Store groupName and groupDetails in async storage
        AsyncStorage.setItem('groupName', groupName);
        console.log(groupName);
        AsyncStorage.setItem('groupDetails', JSON.stringify(groupDetails));
        console.log(groupDetails);
        AsyncStorage.setItem('groupID', groupID);
        console.log(groupID);
        
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.tasksWrapper}>
                <View style={styles.searchAndButtonWrapper}>
                    <SearchBar placeholder={"Search"} />
                    <TouchableOpacity style={styles.createGrpButton} onPress={handleCreateGroupClick}>
                        <Text style={{ color: 'white', fontSize: 20 }}>+</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.sectionTitle}>My Groups</Text>
                <ScrollView style={styles.items}>
                    {/* Check if userID is found inside the UserID array */}
                    {groupData.filter((item) => item.UserID.indexOf(userID) > -1).map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => handleExpensesEntryClick(item.Name, item, item.id)}>
                            <Task text={item.Name} text2={'' + item.Num_Friends + ' friends'} text3={item.Num_Expense + ' expense'} status={item.Status} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <NavBar screen="groups" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#011627',
        justifyContent: 'space-between',
    },
    searchAndButtonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    createGrpButton: {
        backgroundColor: "#0A2D4A",
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 49,
        height: 49,
        marginLeft: 20,
    },
    tasksWrapper: {
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
    },
    items: {
        marginTop: 30,
    },
});

export default Groups;
