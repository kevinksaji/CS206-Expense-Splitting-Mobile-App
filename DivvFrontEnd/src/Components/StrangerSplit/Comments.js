import React from "react";
import { View, Text, StyleSheet} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from "../../config/colors";

const Comments = (props) => {
  	return (
    	<View>
      		<View style={styles.item}>
        		<Text style={styles.UserName}>{props.UserName}</Text>
          		<Text style={styles.Comment}>{props.Comment}</Text>
      		</View>
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
  UserName: {
    color: "white",
    fontSize: 12,
    marginBottom: 5,
  },
  Comment: {
    color: "white",
    fontSize: 16,
    lineHeight: 50,
  },
});

export default Comments;
