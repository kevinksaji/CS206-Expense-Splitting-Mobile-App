import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const CreateGrp_Cards = ({text, text2, onPress, padding}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.item} padding={padding}>
                <Text style={styles.itemText}>{text}</Text>
                <Text style={styles.itemText2}>{text2}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    item:{
        backgroundColor: '#0A2D4A',
        borderRadius: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
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
    }
});

export default CreateGrp_Cards;