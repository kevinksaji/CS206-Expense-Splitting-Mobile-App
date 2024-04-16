import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native'
import colors from '../config/colors'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLocation, useNavigate } from 'react-router-dom';

const SuccessfulTopUpScreen = () => {

    const { state } = useLocation();
    const { amount } = state;

    const navigate = useNavigate();
    return (
        <TouchableOpacity style={styles.container} onPress={() => { navigate('/money') }}>
            <Ionicons style={{ fontSize: 100, color: colors.divvy_green }} name='checkmark-done-outline' />
            <Text style={{ color: 'white', fontSize: 24 }}>Successful Top up of S${amount} to wallet!</Text>
        </TouchableOpacity>
    );
}

export default SuccessfulTopUpScreen;

const styles = StyleSheet.create({
    container: {
        height: 200,
        width: 350,
        borderRadius: 10,
        justifyContent: 'space-evenly',
        justifyContent: 'center',
        marginVertical: 300,
        marginHorizontal: 20
    }
});