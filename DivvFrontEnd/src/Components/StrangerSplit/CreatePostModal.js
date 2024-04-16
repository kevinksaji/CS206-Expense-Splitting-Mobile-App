import React, { useState, useMemo } from 'react';
import { Modal, View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // If you are using Expo
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import observerAuthState from '../observerAuthState';
import getUserNameFromUID from '../getUserNameFromUID';
import { serverTimestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import CreateGroupModal from './CreateGroupModal';


const CreatePostModal = ({ onClose, onAddPost, users }) => {
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [userID, setUserID] = useState('');

    // Get username and userID
    const auth = getAuth();

    observerAuthState(auth, setUserID);

    const UserName = useMemo(() => getUserNameFromUID(userID, users), [userID, users]);

    const timeStamp = serverTimestamp();

    const navigate = useNavigate();

    const pickImage = async () => {
        // Use ImagePicker from Expo or any other library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const submitPost = async () => {
        try {
            // Call CreateGroupModal and await its result
            const docID = await CreateGroupModal(userID, description);
            
            const newPost = {
                Username: UserName,
                UserID: userID,
                Timestamp: timeStamp,
                CurrentCap: 1,
                Capacity: 5, // Set the default or get from user input
                Body: description, // Description from the input
                GroupID: docID,
            };
    
            onAddPost(newPost); // Add the new post using the passed function
            onClose(); // Close the modal after submission
            navigate('/home');
        } catch (error) {
            console.error("Error creating post:", error);
            // Handle the error appropriately
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalView}>
                <Button title="Upload an image" onPress={pickImage} />
                {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}
                <TextInput
                    placeholder="Post details"
                    value={description}
                    onChangeText={setDescription}
                    style={styles.input}
                    multiline
                />
                <Button title="Submit" onPress={submitPost} />
                <TouchableOpacity onPress={onClose} style={styles.button}>
                    <Text>Cancel</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '80%',
    },
    button: {
        marginTop: 10,
    },
});

export default CreatePostModal;
