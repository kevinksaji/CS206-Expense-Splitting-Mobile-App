import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import user from "../assets/user.png";
import $ from "../assets/$.png";
import colors from "../config/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigate } from "react-router-native";
import { useFetchAndUpdateBalance } from "../firebase/server";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getDocument, updateDocument } from "../firebase/server";

const ExpensesCard = (props) => {
  const isResolved = props.status;
  const navigate = useNavigate();

  let balance = useFetchAndUpdateBalance();

  const handleDivvyUpPress = async () => {
    const auth = getAuth();
    const payer = auth.currentUser;
    const payerBalance = parseFloat(balance);
    const amountOwed = parseFloat(props.owe);
  
    if (payerBalance < amountOwed) {
      alert("Your balance is insufficient.");
      return;
    }
  
    // Deduct the amount owed from the payer's balance
    const newPayerBalance = payerBalance - amountOwed;
  
    try {
      // Update payer's balance
      const payerDoc = await getDocument("DivvyWallet", payer);
      await updateDocument("DivvyWallet", "Amount", newPayerBalance, payerDoc.id);
  
      // Fetch the expense creator's wallet document using their UserID
      const creatorWalletDoc = await getDocument("DivvyWallet", { uid: props.creatorID });
  
      // Update creator's balance by adding the amount owed
      const creatorBalance = parseFloat(creatorWalletDoc.data().Amount);
      const newCreatorBalance = creatorBalance + amountOwed;
      await updateDocument("DivvyWallet", "Amount", newCreatorBalance, creatorWalletDoc.id);
  
      // Navigate to PaymentConfirmationScreen
      navigate('/PaymentConfirmationScreen', { state: { balance: newPayerBalance, owe: amountOwed, name: props.Username, expenseID: props.expenseID} });
    } catch (error) {
      console.error("Error updating balances: ", error);
    }
  };
  

  return (
    <View>
      <View style={styles.item}>
        <View style={styles.ImgWordAllign}>
          <Ionicons name="fast-food-outline" size={30} color="#FFF" />
          <Text style={styles.whitebody}>{props.text2}</Text>
        </View>

        <View style={styles.ImgWordAllign}>
          <Text style={styles.itemText}>{props.ExpenseName}</Text>
        </View>

        <View style={styles.ImgWordAllign}>
          <Text style={styles.whitebody}>{props.Username}</Text>
          <Text style={isResolved ? styles.resolved : styles.unresolved}>
            {isResolved ? "Resolved" : "Unresolved"}
          </Text>
          {props.owe !== 0 && !props.isCreator && !props.status && (
            <TouchableOpacity
              style={styles.DivvyUp}
              onPress={handleDivvyUpPress}
            >
              <Text style={styles.whitebody}>DivvyUp</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.itemText}>${props.owe}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 10,
    alignItems: "left",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 24,
    marginBottom: 5,
  },
  whitebody: {
    color: "white",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 5,
  },
  resolved: {
    color: "green",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 5,
  },
  unresolved: {
    color: "red",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 5,
  },
  itemText3: {
    color: "red",
    fontSize: 15,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  ImgWordAllign: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  DivvyUp: {
    backgroundColor: colors.divvy_green,
    padding: 10,
    borderRadius: 10,
  },
});

export default ExpensesCard;
