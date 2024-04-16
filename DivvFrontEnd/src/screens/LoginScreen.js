import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
    Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  NativeRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Use useNavigate hook to get navigation function

  const onLoginPress = () => {
    // Add login logic here - this is where we need to add authentication with firebase
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("/home"); // Navigate to HomeScreen
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const onSignUpPress = () => {
    navigate("/registration"); // Navigate to RegistrationScreen
  };

  return (
    
    <View style={styles.container}>
        <Image
          source={require("../assets/divvylogo.png")} 
          style={styles.logo}
        />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>DivvyUp.</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={onSignUpPress}>
          <Text style={styles.linkText}>Sign up</Text>
        </TouchableOpacity>
        <Text style={styles.linkText}>Forgot your password?</Text>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#011627",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  headerContainer: {
    marginBottom: 60,
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
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 40,
  },
  linkText: {
    color: "white",
    fontWeight: "bold",
  },
  socialButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 40,
  },
  socialButton: {
    height: 58,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 10,
  },

  loginButton: {
    height: 58,
    backgroundColor: "#4F5D75",
    width: "100%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default LoginScreen;
