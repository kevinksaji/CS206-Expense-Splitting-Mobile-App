import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { RadioButton } from 'react-native-paper';
import colors from "../config/colors";

const AddFriendCard = ({text, text2, img, checked, handlePress, state}) => {

    return (
        <View style={styles.item}>
            <View style={styles.alignment}>
                <Image source={img}></Image>
                <Text style={styles.itemText}>{text}</Text>
            </View>
            <RadioButton value="first" color = {colors.divvy_blue} uncheckedColor='white' status={checked ? 'checked' : 'unchecked'} onPress={handlePress}/>
            <Text style={styles.itemText2}>{text2}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    item:{
        backgroundColor: '#0A2D4A',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 10,
        padding: 15,
    },
    itemText:{
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        lineHeight: 24
    },
    itemText2:{
        color: 'white',
        fontSize: 10,
        lineHeight: 24
    },
    alignment: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginRight: 'auto',
    },
});

export default AddFriendCard;