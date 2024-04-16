import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";

const Post = (props) => {
    return (
        <View style={styles.postContainer}>

            <View>
                <Text style={styles.userName}>{props.userName} - {props.timeStamp} :</Text>
                <Text>Group Capacity: {props.currentCap}/{props.capacity}</Text>
            </View>

            <Image 
            source={props.image}
            style={styles.postImage} 
            />
        
            <Text style={styles.postBody}>{props.body}</Text>
        </View>
    )
}

const styles = StyleSheet.create({

    userName: {
        fontSize: 20,
        fontWeight: "bold",
    },

    postContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        margin: 15,
        marginTop: 20,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.2,
        // shadowRadius: 1,
        // elevation: 3,
        // flex: 1,
        // margin: 20,
        // marginBottom: "auto",
    },

    postBody: {
        margin: 10,
        fontSize: 15,
    },
    
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 20,
    }
})

export default Post;