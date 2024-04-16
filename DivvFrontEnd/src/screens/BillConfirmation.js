import React, { useState, useEffect } from "react";
import { increment } from "firebase/firestore";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  ScrollView,
} from "react-native";
import { useNavigate } from "react-router-dom";
import BackButton from "../Components/BackButton";
import ProfilePicture from "../Components/ProfilePicture";
import FormInput from "../Components/FormInput";
import { useLocation } from "react-router-dom";
import { fetchCollection, addNewDocument , updateDocument} from "../firebase/server";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SubmitButton from "../Components/SubmitButton";
import BottomNavBar from "../Components/BottomNavBar";
import { getAuth } from "firebase/auth";

const BillConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation().state;

  const auth = getAuth();
  const creatorUserID = auth.currentUser.uid;

  const [groupDetails, setGroupDetails] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [expenseAmounts, setExpenseAmounts] = useState({});
  const [groupName, setGroupName] = useState(""); // State to store group name
  const [groupID, setGroupID] = useState(""); // State to store group ID

  useEffect(() => {
    const init = async () => { // Initialize the component
      const groupName = await AsyncStorage.getItem("groupName");
      console.log("Group name:", groupName);
      setGroupName(groupName);
  
      // get the selected group details from async storage, and set it to state
      const groupDetailsJson = await AsyncStorage.getItem("groupDetails");
      const parsedGroupDetails = JSON.parse(groupDetailsJson);
      const groupDetailsArray = Array.isArray(parsedGroupDetails)
        ? parsedGroupDetails
        : [parsedGroupDetails];
      setGroupDetails(groupDetailsArray);
  
      // get the selected group id from async storage, and set it to state
      const groupID = await AsyncStorage.getItem("groupID");
      console.log("Group ID:", groupID);
      setGroupID(groupID);
  
      // fetch full user date from the 'Users' collection
      const usersData = await fetchCollection("Users");
      setUsersData(usersData);
  
      // get the total number of users in the group
      if (groupDetailsArray.length > 0) {
        const totalUsers = groupDetailsArray.reduce(
          (sum, group) => sum + group.UserID.length,
          0
        ); 

        // calculate the amount owed by each user
        const totalAmount = parseFloat(location.expenseAmount);
        const amountPerPerson = totalAmount / totalUsers;
        console.log("Amount per person:", amountPerPerson);
  
        
        const initialExpenseAmounts = {};
        groupDetailsArray.forEach((group) => {
          group.UserID.forEach((userId) => {
            initialExpenseAmounts[userId] = amountPerPerson;
          });
        });
        setExpenseAmounts(initialExpenseAmounts);
      }
    };
  
    init();
  }, []);

  const fetchUsersData = async () => {
    try {
      const usersData = await fetchCollection("Users");
      setUsersData(usersData);
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
  };
  
  const renderConfirmation = async () => {
    console.log("The split has been confirmed.");
    const creatorName = usersData.find((u) => u.UserID === creatorUserID).Username;
    console.log("Creator name:", creatorName);
    // Create expense instances for each user in the group
    for (const group of groupDetails) {
      for (const userId of group.UserID) {
        if (userId === creatorUserID){
            
            console.log("Creator name:", creatorName);
        }
        const userDetails = usersData.find((u) => u.UserID === userId && u.UserID !== creatorUserID); // make expenses for the rest of the users that are not the creator
        if (!userDetails) continue;

        
        const amountOwed = expenseAmounts[userId] || 0; // Get amount from state

        // Create expense instance
        const expenseInstance = {
          GroupID: groupID,
          UserID: userDetails.UserID,
          CreatorID: creatorUserID,
          CreatorName: creatorName,
          Username: userDetails.Username,
          ExpenseName: location.expenseName,
          AmountOwed: amountOwed.toFixed(2),
          GroupName: groupName,
          Resolved: false, // Initially set as unresolved
        };
        
        try {
          // Add expense instance for the creator to Firebase backend
          await addNewDocument("Expense", expenseInstance);
          console.log("Expense instance created for the creator.");
        } catch (error) {
          console.error("Error creating expense instance for the creator:", error);
        }
      }
    }
    // Assuming you have groupID and it's the correct document ID of the group
  if (groupID) {
    try {
      // Use the updateDocument function from server.js to increment Num_Expense
      await updateDocument("Group", "Num_Expense", increment(1), groupID);
      console.log("Group Num_Expense field incremented.");
    } catch (error) {
      console.error("Error updating Num_Expense in group document:", error);
    }
  }

  navigate("/Groups");
    navigate("/Groups");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigate("/BillEntry")} />
        <Text style={styles.headerText}>{location.expenseName}</Text>
      </View>
      <View style={styles.costContainer}>
        <Text style={styles.bodyText}>Total cost:</Text>
        <Text style={styles.costText}>{location.expenseAmount}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {groupDetails.map((group, index) => (
          <View key={index}>
            {group.UserID.map((userId, idx) => {
              const userDetails = usersData.find((u) => u.UserID === userId);
              if (!userDetails) return null;
              return (
                <View key={idx} style={styles.breakdownRow}>
                  <ProfilePicture />
                  <Text style={styles.breakdownText}>
                    {userDetails.Username}
                  </Text>
                  <FormInput
                    placeholder={`$0.00`}
                    value={expenseAmounts[userId]?.toFixed(2)}
                    inputMode="numeric"
                    style={styles.breakdownInput}
                    onChangeText={(text) => {
                      setExpenseAmounts((prevState) => ({
                        ...prevState,
                        [userId]: parseFloat(text) || 0,
                      }));
                    }}
                  />
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <SubmitButton title="Done" onPress={renderConfirmation} />
      </View>
      <BottomNavBar screen="groups" />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#011627",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerText: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    marginLeft: 16,
  },
  bodyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
  },
  costContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    alignSelf: "center",
    marginTop: 20,
  },
  costText: {
    color: "#00D7FF",
    marginLeft: 16,
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  breakdownRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 30,
  },
  breakdownText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 16,
  },
  percentageText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  breakdownInput: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 20,
    marginTop: 32,
    borderRadius: 5,
    fontSize: 16,
  },
  buttonContainer: {
    position: "relative",
    bottom: 0,
    padding: 16,
    marginBottom: 32,
  },
});

export default BillConfirmation;