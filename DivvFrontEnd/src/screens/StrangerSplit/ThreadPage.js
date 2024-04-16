import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Text } from 'react-native';
import { useNavigate } from 'react-router-dom';
import ThreadHeader from '../../Components/StrangerSplit/ThreadHeader';
import NavButton from '../../Components/NavButton';
import Comments from '../../Components/StrangerSplit/Comments';
import NavBar from '../../Components/BottomNavBar';
import {addNewDocument, getCollection, updateDocument, subscribe, db, getDoc } from '../../firebase/server';
import observeAuthState from '../../Components/observerAuthState';
import { useLocation } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import {collection, updateDoc} from 'firebase/firestore';
import getUserNameFromUID from '../../Components/getUserNameFromUID';


const ThreadPage = () => {
    const navigate = useNavigate();
    const auth = getAuth();

    const [UID, setUID] = useState('');
    const [UserName, setUserName] = useState('');
    const [comment, setComment] = useState([]);
    const [currentUsers, setCurrentUsers] = useState([]);
    const [isThreadHeaderVisible, setIsThreadHeaderVisible] = useState(false);

    const location = useLocation();
    const name = location.state.name;
    const body = location.state.body;
    const did = location.state.postId;
    const groupID = location.state.groupID;
    let currentCap = location.state.currentCap;
    const capacity = location.state.Capacity;
    let status = currentUsers.indexOf(UID) > -1 || currentCap >= capacity;

    const users = getCollection("Users", false).data;

    useEffect(() => {
        const fetchData = async () => {
            observeAuthState(auth, setUID);
            setUserName(getUserNameFromUID(UID, users));
    
            const currentUsers = await getDoc("Group", groupID, 'UserID');
            setCurrentUsers(currentUsers);
    
            const com = collection(db, "Comment");
            const commentUnsubscribe = subscribe(com, setComment);

            setIsThreadHeaderVisible(true);
            
            return () => {
                commentUnsubscribe();
            };
        };
    
        fetchData();
    }, [auth, UID, users, groupID]);

    //Get from user DB to get userName, get from comment DB to get comments
    //Title, body, username need to get from previous state.

    const onBack = () => {
        navigate("/StrangerSplit");
    }

    const handleCommentSubmit = (commentValue) => {
        console.log(UserName);
        const data = {
            docID: did,
            name: UserName,
            body: commentValue,
        }
        addNewDocument("Comment", data);
    };

    const handleJoinGroup = () =>{
        currentCap++;
        currentUsers.push(UID);
        updateDocument("Group", "Num_Friends", currentCap, groupID);
        updateDocument("Group", "UserID", currentUsers, groupID);
        updateDocument("Post", "CurrentCap", currentCap, did);
        onBack();
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.tasksWrapper}>
                <NavButton arrowName={"arrow-back"} onPressFunction={onBack}/>
                {isThreadHeaderVisible && (
                    <ThreadHeader 
                        UserName={name} 
                        Title={body} 
                        onCommentSubmit={handleCommentSubmit} 
                        handleJoin={handleJoinGroup} 
                        isInside={status}
                    />
                )}
                <ScrollView style={styles.items}>
                {comment.filter(com => com.docID === did).map((com, index) => (
                    <Comments key={index} UserName={com.name} Comment={com.body}/>
                ))}
                </ScrollView>
            </View>
            <NavBar screen="wheel" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#011627',
        justifyContent: 'space-between',
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

export default ThreadPage;
