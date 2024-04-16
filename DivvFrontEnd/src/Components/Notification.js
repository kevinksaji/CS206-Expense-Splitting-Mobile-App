import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native'
import colors from '../config/colors'
import Ionicons from 'react-native-vector-icons/Ionicons';

const Notification = ({onPressFunction}) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPressFunction}>
            <Ionicons style={{ fontSize: 100, color: colors.divvy_green }} name='checkmark-done-outline' />
            <Text style={{ color: 'white', fontSize:24 }}>Group Created Successfully!</Text>
        </TouchableOpacity>
    );
}

export default Notification;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.secondary,
        height: 200,
        width: 350,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
});