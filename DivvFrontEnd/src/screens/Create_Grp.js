import {useState} from 'react';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from "react-native";
import CreateGrp_Cards from "../Components/CreateGrp_Cards";
import { useNavigate } from 'react-router-dom';
import colors from "../config/colors.js";
import NavButton from "../Components/NavButton.js";
import NavBar from '../Components/BottomNavBar';
import useSharedState from '../Components/useSharedState.js';


const Create_Grp = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");

  const handleBack = () => {
    // Navigate to the "Create_Grp" screen
    navigate('/Groups');
  };

  const handleAddMembersPress = () => {
    // Handle click for the "Add members" card
    navigate('/AddMembers', { state: {groupName}});
  };

  const handleShareLink = () => {
    // Handle click for the "Add members" card
    console.log("Share link card clicked");
  };

  return (
    <View style={styles.container}>
      <View style={styles.tasksWrapper}>
        <View style={styles.alignment}>
          <View>

        <NavButton onPressFunction={handleBack} style={{ marginRight:60}} arrowName={"arrow-back"}/>
		{/* <TouchableOpacity
  			onPress={handleBack}
  			style={{ backgroundColor: 'transparent'}}>
  			<Text style={{ color: 'white', fontSize:24, marginRight:150 }}>{'<'}</Text>
		</TouchableOpacity> */}

          </View>
          <Text style={styles.sectionTitle}>Create a group</Text>
          {/* <Text style={{ color: "white" }}>save</Text> */}
        </View>

        <View>
			<Text style={{ color: "white"}}>Group Name:</Text>
          <TextInput style={styles.textbox} placeholder="Enter group name" onChangeText={setGroupName} />
        </View>

        <View style={styles.addFriends}>
          <Text style={styles.sectionTitle}>Add your Friends!</Text>
        </View>
        <CreateGrp_Cards text={"Add members"} onPress={handleAddMembersPress} padding={15}/>
        <Text
          style={{ color: "white", textAlign: "center", paddingBottom: 10 }}
        >
          OR
        </Text>
        <CreateGrp_Cards
          text={"Share this link!"}
          text2={"HTTPS://..."}
          onPress={handleShareLink}
          padding={15}
        />
      </View>
      <NavBar screen="groups"/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#011627",
    justifyContent: 'space-between',
  },
  alignment: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 10,
  },
  addFriends: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  textbox: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingLeft: 5,
    marginBottom: 100,
	height: 40,
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Create_Grp;
