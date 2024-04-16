import React, { useState } from 'react';
import { View, Image, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ProfilePicture = ({ image, setImage }) => {
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to set your profile picture!');
            return;
        }

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

    return (
        <View style={styles.container}>
            <Pressable onPress={pickImage} style={styles.imageContainer}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <Image source={require('../assets/default-profile-pic.jpeg')} style={styles.image} />
                )}
            </Pressable>
        </View>
    );
};

const styles = {
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: 50,
        overflow: 'hidden',
    },
    image: {
        width: 50,
        height: 50,
    },
};

export default ProfilePicture;