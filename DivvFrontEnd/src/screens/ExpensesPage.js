import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import CreateGrp_Cards from "../Components/CreateGrp_Cards";
import { useNavigate, useLocation } from "react-router-dom";
import colors from "../config/colors.js";
import NavButton from "../Components/NavButton.js";
import NavBar from "../Components/BottomNavBar";
import ExpensesCard from "../Components/ExpensesCard";
import { useState, useEffect } from "react";
import { fetchCollection } from "../firebase/server";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ExpensesPage = () => {
  const [expenseData, setExpenseData] = useState([]); // Initialize state to hold fetched data
  const auth = getAuth();

  const [userID, setUserID] = useState("");
  const [groupID, setGroupID] = useState("");
  const [owe, setOwe] = useState("");
  const [owed, setOwed] = useState("");
  const [netAmount, setNetAmount] = useState("");

  const user = auth.currentUser.uid; // Get the user id
  const [userEmail, setUserEmail] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const groupName = location.state.groupName;

  // Use onAuthStateChanged to listen for changes in the user's login state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in.
      const email = user.email;
      setUserEmail(email);
      // Now you can use the userId as needed, for example, pass it to another function or store it in a state.
    } else {
      // User is signed out.
      console.log("User is not signed in.");
    }
  });

  useEffect(() => {
  const retrieveGroupIDAndFetchData = async () => {
    try {
      const storedGroupID = await AsyncStorage.getItem('groupID');
      if (storedGroupID !== null) {
        setGroupID(storedGroupID);
        const expenses = await fetchCollection("Expense");
        setExpenseData(expenses);
  
        const groupExpenses = expenses.filter(expense => expense.GroupID === storedGroupID);
        
        const net = groupExpenses.reduce((acc, expense) => acc + parseFloat(expense.AmountOwed), 0);
        setNetAmount(net.toFixed(2));
        
        const owedAmount = groupExpenses
          .filter(expense => expense.CreatorID === user && !expense.Resolved)
          .reduce((acc, expense) => acc + parseFloat(expense.AmountOwed), 0);
        setOwed(owedAmount.toFixed(2));
        
        const oweAmount = groupExpenses
          .filter(expense => expense.UserID === user && !expense.Resolved)
          .reduce((acc, expense) => acc + parseFloat(expense.AmountOwed), 0);
        setOwe(oweAmount.toFixed(2));
      } else {
        console.log('groupID not found in AsyncStorage.');
      }
    } catch (error) {
      console.error('AsyncStorage or fetchCollection error: ', error);
    }
  };

  retrieveGroupIDAndFetchData();
}, []);

  

  //const owed = 200;
  const notOwed = owed === 0;

  const owes = 100;
  const dontOwes = owes === 0;

  const handleBack = () => {
    // Navigate to the "Create_Grp" screen
    navigate("/Groups");
  };

  // send group name and group details that were sent here from the previous screen to the next screen
  const handleCreateExpense = (groupName) => {
    // Navigate to the "Create_Grp" screen
    navigate("/BillEntry", { state: { groupName: groupName } });
    // send group name and group details that were sent here from the previous screen to the next screen
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.tasksWrapper}>
        <View style={styles.alignment}>
          <NavButton
            onPressFunction={handleBack}
            style={{ marginRight: 40 }}
            arrowName={"arrow-back"}
          />
          <Text style={styles.sectionTitle}>{groupName}</Text>
        </View>


        <View style={styles.alignment}>
          <Text style={{ color: "white" }}>Total Owed:</Text>
          <Text style={{ color: owed > 0 ? "green" : "white", fontSize: 20 }}>
            ${owed}
          </Text>
        </View>

        <View style={styles.alignment}>
          <Text style={{ color: "white" }}>Total Owe:</Text>
          <Text style={{ color: owe > 0 ? "red" : "white", fontSize: 20 }}>
            ${owe}
          </Text>
        </View>

        <ScrollView style={styles.horizontalLine} />
        {/* Render the Expenses Cards here */}
        {/* check if the groupID in each expense matches the group id and the user id matches the user */}
        {expenseData
          // Filter for expenses related to the current group and user
          .filter(
            (expenseItem) =>
              expenseItem.GroupID === groupID &&
              (expenseItem.UserID === user || expenseItem.CreatorID === user) // expense cards are rendered for the ones you owe and the ones you are owed
          )
          .map((expenseItem, index) => {
            const isCreator = expenseItem.CreatorID === user;
            return (
              <ExpensesCard
                expenseID={expenseItem.id}
                creatorID={expenseItem.CreatorID}
                isCreator={isCreator}
                key={index}
                ExpenseName={expenseItem.ExpenseName}
                owe={expenseItem.AmountOwed}
                status={expenseItem.Resolved}
                text2={isCreator ? `You are owed:` : `You owe:`}
                Username={
                  isCreator ? expenseItem.Username : expenseItem.CreatorName
                }
              />
            );
          })}
      </ScrollView>

      <TouchableOpacity
        style={styles.createGrpButton}
        onPress={handleCreateExpense}
      >
        <Text style={{ color: "white", fontSize: 20 }}>+</Text>
      </TouchableOpacity>
      <NavBar screen="groups" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#011627",
    justifyContent: "space-between",
  },
  alignment: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "white",
    marginVertical: 10,
  },
  createGrpButton: {
    position: "absolute",
    bottom: 70,
    right: 10,
    backgroundColor: "#0A2D4A",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 49,
    height: 49,
  },
});

export default ExpensesPage;
