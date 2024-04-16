import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure you have expo or you can use another method to import Ionicons
import { useNavigate, useLocation } from "react-router-dom";
import { getDocument, updateDocument, getDocumentData, useFetchAndUpdateBalance, addNewDocument } from "../firebase/server";
import { getAuth } from "firebase/auth";
import { setDoc } from "firebase/firestore";

const ReviewTopUpScreen = () => {
  const navigate = useNavigate();
  const [uid, setUid] = useState("");
  const [document, setDocument] = useState("");

  const currentdate = require('moment-timezone');
  const datetime = currentdate().tz("Asia/Singapore").format('DD/MM/YYYY @ HH:mm:ss');

  // Get document
  useEffect(() => {
    const fetchDoc = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      const doc = await getDocument("DivvyWallet", user);
      setUid(user.uid);
      setDocument(doc);
    };

    fetchDoc();
  }, []);

  // Get amount from previous page and calculate total amount
  const { state } = useLocation();
  const { amount } = state;
  const balance = useFetchAndUpdateBalance();
  const total = parseFloat(balance) + parseFloat(amount);

  const data = {
    UserID: uid,
    Amount: amount,
    date: datetime,
    status: "Top Up"
  }

  // Update user balance and redirect to confirmation page
  const handleConfirm = async () => {
    await updateDocument("DivvyWallet", "Amount", total, document.id);
    addNewDocument("Transaction", data);
    navigate("/SuccessfulPayment", {state : {amount: amount}});
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigate("/EnterAmount")}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.walletContainer}>
        <Text style={styles.walletText}>Wallet • S${balance}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Method</Text>
        <Text style={styles.value}>Mastercard 1682</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Top-up amount</Text>
        <Text style={styles.value}>S${amount}</Text>
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>S${total}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "space-evenly",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletContainer: {
    marginBottom: 20,
    alignSelf: "flex-end",
  },
  walletText: {
    fontSize: 18,
    color: "#000",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 16,
    color: "#000",
  },
  value: {
    fontSize: 16,
    color: "#000",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ReviewTopUpScreen;
