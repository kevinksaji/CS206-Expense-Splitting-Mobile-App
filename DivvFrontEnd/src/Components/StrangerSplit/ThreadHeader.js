import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from "../../config/colors";

const ThreadHeader = (props) => {
    const [editMode, setEditMode] = useState(false);
    const [comment, setComment] = useState('');

    const handleChatBubbleClick = () => {
        setEditMode(editMode => !editMode);
    };

    const handleSubmit = () => {
        if (comment.trim() !== '') {
        props.onCommentSubmit(comment);
        setComment('');
        }
        setEditMode(false);
    };

    return (
        <View>
        <View style={styles.item}>
            <Text style={styles.UserName}>{props.UserName}</Text>
            <Text style={styles.Title}>{props.Title}</Text>
            <Text style={styles.Body}>{props.Body}</Text>

            <View style={styles.buttons}>
              <TouchableOpacity onPress={handleChatBubbleClick}>
                  <Ionicons name="chatbubble-outline" size={25} color="#FFF" />
              </TouchableOpacity>

              {!props.isInside && <TouchableOpacity onPress={props.handleJoin}>
                  <Ionicons name="add" size={25} color="#FFF" />
              </TouchableOpacity>}
            </View>
        </View>

        {editMode && (
            <TextInput
            placeholder="Type your comment..."
            onChangeText={text => setComment(text)}
            value={comment}
            onSubmitEditing={handleSubmit}
            placeholderTextColor={"white"}
            style={{ borderWidth: 1, borderColor: 'white', padding: 10, marginTop: 10, color: 'white'}}
            />
        )}
        </View>
    );
    };

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    flexDirection: "column",
    alignItems: "left",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  buttons:{
    flexDirection: "row",
    justifyContent: "space-between"
  },
  UserName: {
    color: "white",
    fontSize: 12,
    marginBottom: 5,
  },
  Title: {
    color: "white",
    fontSize: 24,
    lineHeight: 50,
    fontWeight: "bold",
  },
  Body: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
  },
});

export default ThreadHeader;
