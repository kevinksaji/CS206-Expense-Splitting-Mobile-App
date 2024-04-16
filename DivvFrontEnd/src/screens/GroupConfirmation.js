import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Notification from '../Components/Notification';
import { useNavigate, useLocation } from 'react-router-dom';
import colors from '../config/colors'
import { fetchCollection, addNewDocument } from '../firebase/server';
import useSharedState from '../Components/useSharedState';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import observeAuthState from '../Components/observerAuthState';


const GroupConfirmation = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();

    //UID = curent users ID
    const [UID, setUID] = useState("");

    // Use onAuthStateChanged to listen for changes in the user's login state
    observeAuthState(auth, setUID);

    const name = location.state.groupName;
    const noFriend = location.state.noFriend;
    let selectedFriendsIds = location.state.selectedFriends;

    //once YH change groupIDs to friends array
    const groupIDs = selectedFriendsIds;

    const data = {
        UserID: groupIDs,
        Name: name,
        Num_Friends: noFriend + 1,
        Num_Expense: 0,
        Status: "Unresolved"
    }

    const handlePress = () => {
        navigate('/Groups');
        addNewDocument('Group', data);
    };

    return (
        <View style={styles.container}>
            <Notification onPressFunction={handlePress} />
        </View>
    );
}

export default GroupConfirmation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
    },
});