import React, { useState } from "react";
import { StyleSheet, View, SafeAreaView, Text } from "react-native";
import BackButton from "../Components/BackButton";
import ManualScanToggle from "../Components/ManualScanToggle";
import SubmitButton from "../Components/SubmitButton";
import FormInput from "../Components/FormInput";
import BottomNavBar from "../Components/BottomNavBar";
import CameraInterface from "../Components/CameraInterface";
import { useNavigate } from "react-router-dom";
import { fetchCollection, addNewDocument } from "../firebase/server";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useLocation } from "react-router-dom";

const BillEntry = () => {
  const [activeSegment, setActiveSegment] = useState("manual");
  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState(""); // State to store title
  const [totalAmount, setTotalAmount] = useState(""); // State to store total amount
  const [category, setCategory] = useState(""); // State to store category
  const auth = getAuth();
  const [userEmail, setUserEmail] = useState(null);


  var location = useLocation();
  const groupName = location.state.groupName;
  const groupDetails = location.state.groupDetails;

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

  const navigate = useNavigate(); // Make sure to define navigate

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleBackClick = () => {
    navigate("/home");
  };

  const handleCapture = (uri) => {
    setImageUri(uri);
  };

  // Handler for when the submit button is pressed
  const handleEnterBill = () => {
    console.log("Enter bill button pressed");

    // Navigate to BillConfirmation and pass the name and amount as a route parameter
    navigate("/BillConfirmation", { state: { expenseName: name, expenseAmount: totalAmount,  groupName: groupName, groupDetails: groupDetails} });
  };

  const renderManualEntryForm = () => (
    <>
      <FormInput placeholder="Name" onChangeText={setName} value={name} />
      <FormInput
        placeholder="Total amount"
        inputMode="numeric"
        onChangeText={setTotalAmount}
        value={totalAmount}
      />

      <SubmitButton title="Enter bill" onPress={handleEnterBill} />
    </>
  );

  const renderScanReceipt = () => (
    <>
      <CameraInterface onCapture={handleCapture} />
      <SubmitButton title="Scan receipt" />
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={handleBackClick} />
        <Text style={styles.headerText}>Bill Entry</Text>
      </View>
      <View style={styles.toggleContainer}>
        <ManualScanToggle
          activeSegment={activeSegment}
          setActiveSegment={setActiveSegment}
        />
      </View>
      <View style={styles.form}>
        {activeSegment === "manual"
          ? renderManualEntryForm()
          : renderScanReceipt()}
      </View>
      <BottomNavBar activeScreen="groups" onHomePress={handleHomeClick} />
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
  toggleContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  form: {
    flex: 1,
    paddingHorizontal: 32,
    marginBottom: 32,
  },
});

export default BillEntry;
