import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { NativeRouter, Routes, Route } from "react-router-native";
import {
  Groups,
  Create_Grp,
  AddMembers,
  LoginScreen,
  RegistrationScreen,
  HomeScreen,
  BillEntryManual,
  GroupConfirmation,
  ExpensesPage,
} from "./src/screens";
import { initializeApp } from "firebase/app";
import CreateGrp from './src/screens/Create_Grp'
import BillEntry from "./src/screens/BillEntry";
import BillConfirmation from "./src/screens/BillConfirmation";
import DivvyWallet from "./src/screens/DivvyWallet";
import PaymentConfirmationScreen from "./src/screens/PaymentConfirmationScreen";
import EnterAmountScreen from "./src/screens/EnterAmountScreen";
import ReviewTopUpScreen from "./src/screens/ReviewTopUpScreen";
import SuccessfulTopUpScreen from "./src/screens/SuccessfulTopUpScreen";
import ThreadPage from "./src/screens/StrangerSplit/ThreadPage";
import StrangerHome from "./src/screens/StrangerSplit/StrangerHome";
import { LogBox } from 'react-native';

// Ignore all logs and warnings
LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const firebaseConfig = {
    apiKey: "AIzaSyC2wQDz5j6G2ZYJu7MMDEDK57A1QgWFryg",
    authDomain: "divvyup-954c6.firebaseapp.com",
    projectId: "divvyup-954c6",
    storageBucket: "divvyup-954c6.appspot.com",
    messagingSenderId: "694501091525",
    appId: "1:694501091525:web:8c3cc3888e3b6c4cc8a8ac",
    measurementId: "G-KFRNSY1VY0",
  };
  const app = initializeApp(firebaseConfig);

  return (
    <NativeRouter>
      <View style={styles.container}>
        <Routes>
          <Route path="/login" element={<LoginScreen setUser={setUser} />} />
          <Route path="/registration" element={<RegistrationScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/Groups" element={<Groups />} />
          <Route path="/Create_Grp" element={<Create_Grp />} />
          <Route path="/AddMembers" element={<AddMembers />} />
          <Route path="/GroupConfirmation" element={<GroupConfirmation />} />
          <Route path="/BillEntry" element={<BillEntry />} />
          <Route path="/money" element={<DivvyWallet />} />
          <Route path="/EnterAmount" element={<EnterAmountScreen />} />
          <Route path="/ReviewAmount" element={<ReviewTopUpScreen />} />
          <Route path="/SuccessfulPayment" element={<SuccessfulTopUpScreen />} />
          <Route path="/ExpensesPage" element={<ExpensesPage />} />
          <Route path="/PaymentConfirmationScreen" element={<PaymentConfirmationScreen />} />
          <Route path="/BillConfirmation" element={<BillConfirmation />} />
          <Route path="/StrangerSplit" element={<StrangerHome />} />
          <Route path="/StrangerSplit/CreatePost" element={<ThreadPage />} />
          

          {user ? (
            <Route path="/home" element={<Groups user={user} />} />
          ) : (
            <Route path="/" element={<LoginScreen setUser={setUser} />} />
          )}
        </Routes>
      </View>
      {/* <View style={styles.container}>
        <Routes>
            <Route path="/" element={<Groups />} />
            <Route path="/Create_Grp" element={<Create_Grp />} />
            <Route path="/AddMembers" element={<AddMembers />} />
            <Route path="/GroupConfirmation" element={<GroupConfirmation />} />
        </Routes>
      </View> */}
    </NativeRouter>

    //     <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen name="Groups_Page" component={Groups_Page} options={{ headerShown: false }}/>
    //     <Stack.Screen name="Create_Grp" component={Create_Grp} options={{ headerShown: false }}/>
    //   </Stack.Navigator>
    // </NavigationContainer>

    // <View style={styles.container}>
    //   <LoginScreen />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#011627",
  },
});
