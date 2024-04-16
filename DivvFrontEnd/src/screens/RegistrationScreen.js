import { StatusBar } from "expo-status-bar";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useState } from "react";
import { Link } from "react-router-native";
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {fetchCollection, addNewDocument} from '../firebase/server';

const RegistrationScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const onRegisterPress = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      alert("Passwords must be at least 6 characters.");
      return;
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        const data = {
          Username: username,
          UserID: user.uid
        }
        const dataDivvyWallet = {
          UserID: user.uid,
          Amount: 0
        }

        addNewDocument('Users', data);
        addNewDocument('DivvyWallet', dataDivvyWallet);
        alert("Signed up.");
        navigate("/home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/divvylogo.png')} 
            style={styles.logo}
          />
          </View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>DivvyUp.</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={onRegisterPress}>
          <Text style={styles.buttonTitle}>Sign up</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link to="/login" style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Log in</Text>
          </Link>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#011627", // Set dark background color
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center', // This will center the logo horizontally
    marginTop: 60, // Add top margin to create space at the top of the screen
  },
  logo: {
    width: 100, 
    height: 100, 
  },
  headerContainer: {
    marginBottom: 60,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },
  input: {
    height: 58,
    backgroundColor: "white",
    marginBottom: 20,
    width: "100%",
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#4F5D75", 
    width: "100%",
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerView: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    color: "white",
    fontSize: 16,
    marginRight: 10, // Add space between text and link
  },
  footerLink: {
  },
  footerLinkText: {
    color: "#FDBA74", 
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default RegistrationScreen;
