import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import user from "../assets/user.png";
import $ from "../assets/$.png";
import colors from "../config/colors";

const Task = (props) => {
	const isResolved = props.status === "Resolved";
  	return (
    	<View>
      		<View style={styles.item}>
        		<Text style={styles.itemText}>{props.text}</Text>
        		<View style={styles.ImgWordAllign}>
          			<Image source={user} style={styles.userImage}></Image>
          			<Text style={styles.itemText2}>{props.text2}</Text>
        		</View>
        
				<View style={styles.ImgWordAllign}>
          			<Image source={$} style={styles.userImage}></Image>
					<Text style={styles.itemText2}>{props.text3}</Text>
        		</View>
        		<Text style={[styles.itemText3, { color: isResolved ? "green" : "red" }]}>
					{props.status}
       			</Text>
      		</View>
    	</View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 10,
    flexDirection: "column",
    alignItems: "left",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 24,
    marginBottom: 5,
  },
  itemText2: {
    color: "white",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 5,
	flex: 1,
  },
  itemText3: {
    color: "red",
    fontSize: 15,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  ImgWordAllign:{
    flexDirection: 'row',
    alignItems: "left",
    justifyContent: "space-between",
  },
  userImage: {
    width: 24, // Adjust the width as needed
    height: 24, // Adjust the height as needed
    marginRight: 10,
  },
});

export default Task;
