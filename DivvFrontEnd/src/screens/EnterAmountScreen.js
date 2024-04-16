import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigate } from "react-router-dom";
import ReviewTopUpScreen from "./ReviewTopUpScreen";
import { getAuth } from "firebase/auth";
import { useFetchAndUpdateBalance } from "../firebase/server";

const EnterAmountScreen = () => {
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/ReviewAmount", { state: { amount } });
  };


  const balance = useFetchAndUpdateBalance();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.cancelButton}>
        <Icon
          name="times"
          size={30}
          color="#000"
          onPress={() => navigate("/money")}
        />
      </TouchableOpacity>
      <Text style={styles.title}>Enter Amount</Text>
      <View style={styles.cardContainer}>
        <Text style={styles.cardText}>Mastercard ****</Text>
        <Text style={styles.feeText}>No fee</Text>
      </View>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="S$0.00"
        value={amount}
        onChangeText={setAmount}
      />
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Wallet balance: S${balance}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    backgroundColor: "white",
    justifyContent: "space-evenly", // Add this to distribute space
  },
  cancelButton: {
    position: "absolute",
    top: 55, // Adjust this value as needed for status bar height
    left: 20,
    zIndex: 10, // Ensure it sits above other components
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardContainer: {
    backgroundColor: "#F5F5F5",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "500",
  },
  feeText: {
    fontSize: 16,
    color: "green",
  },
  input: {
    fontSize: 36,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 20,
    padding: 10,
    textAlign: "center",
  },
  balanceContainer: {
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EnterAmountScreen;
