// SearchBar.js
import React from "react";
import { StyleSheet, TextInput, View, Keyboard, Button } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import colors from "../config/colors";

const SearchBar = ({ clicked, searchPhrase, setSearchPhrase, setClicked, placeholder }) => {
   return (
      <View style={styles.container}>
         <View style={clicked ? styles.searchBar__clicked : styles.searchBar__unclicked}>
            <Feather name="search" size={20} color="white" style={{ marginLeft: 1 }} />

            <TextInput
               style={styles.input}
               placeholder={placeholder}
               placeholderTextColor={"white"}
               value={searchPhrase}
               onChangeText={setSearchPhrase}
            />
         </View>
      </View>
   );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
   container: {
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
      width: "90%",
      margin: 10,
   },
   searchBar__unclicked: {
      padding: 10,
      flexDirection: "row",
      backgroundColor: "#0A2D4A",
      borderRadius: 15,
      alignItems: "center",
   },
   searchBar__clicked: {
      padding: 10,
      flexDirection: "row",
      width: "80%",
      backgroundColor: "#0A2D4A",
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "space-evenly",
   },
   input: {
      fontSize: 20,
      marginLeft: 10,
      width: "90%",
   },
});
