import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import NavBar from "../Components/BottomNavBar";
import { useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDocument, updateDocument } from "../firebase/server";

const PaymentConfirmationScreen = ({ navigation }) => {
  const { state } = useLocation();
  const { balance, owe, name, expenseID} = state;
  const formattedBalance = balance.toFixed(2); // Fixing the balance to 2 decimal places


  // Update balance
  useEffect(() => {
    const updateBalance = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const doc = await getDocument("DivvyWallet", user);
        await updateDocument("DivvyWallet", "Amount", formattedBalance, doc.id);
        await updateDocument("Expense", "Resolved", true, expenseID);

      }
    };

    updateBalance();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={styles.card}>
            <FontAwesome name="check-circle" size={60} color="green" />
            <Text style={styles.confirmationMessage}>
              You have paid ${owe} to {name}!
            </Text>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>${formattedBalance}</Text>
          </View>
        </View>
      </View>
      <NavBar screen="money" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#011627",
  },

  container: {
    flex: 1,
    backgroundColor: "#011627",
    alignItems: "center",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#1D3949",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0, // This makes sure the NavBar is at the bottom
  },
  confirmationMessage: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  balanceLabel: {
    fontSize: 16,
    color: "#A7A7A7",
    marginTop: 16,
  },
  balanceAmount: {
    fontSize: 32,
    color: "green",
    fontWeight: "bold",
    marginTop: 8,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 40,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default PaymentConfirmationScreen;
