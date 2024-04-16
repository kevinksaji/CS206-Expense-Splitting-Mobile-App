import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Pressable, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const CameraInterface = ({ onCapture }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(cameraStatus === 'granted');
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (galleryStatus.status !== 'granted') {
        Alert.alert('Permissions required', 'Sorry, we need gallery permissions to make this work!');
      }
      setIsCameraActive(cameraStatus === 'granted');
    })();
  }, []);

  useEffect(() => {
    return () => {
      setIsCameraActive(false); // Deactivate the camera when the component unmounts
    };
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (onCapture) onCapture(photo.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onCapture(result.uri);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {isCameraActive && (
        <Camera style={styles.camera} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Snap</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={pickImage}>
              <Text style={styles.text}>Gallery</Text>
            </Pressable>
          </View>
        </Camera>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 20,
  },
  text: {
    fontSize: 22,
    color: 'white',
    fontStyle: "normal",
  },
});

export default CameraInterface;
