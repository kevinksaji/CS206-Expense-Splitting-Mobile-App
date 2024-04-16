import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import NavBar from "../Components/BottomNavBar";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  fetchCollection,
  addNewDocument,
  getDocumentData,
  useFetchAndUpdateBalance,
  getMultipleDocument,
  getMultipleGroupDocument
} from "../firebase/server";
import { doc, getDoc } from "firebase/firestore";
import colors from "../config/colors";


const HomeScreen = () => {

  const PointsTab = () => {
    return (
      // Your Points Tab Content
      <View>
        <Text style={styles.tabContent}>Points content</Text>
      </View>
    );
  };
  
  
  
  const [transactionDocs, setTransactionDocs] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user != null) {
        const transactionDocuments = await getMultipleDocument("Transaction", user);
        setTransactionDocs(transactionDocuments);
      }
    };
  fetchTransactions();
}, []);
  
  
  const ActivityTab = () => {
    return (
      // Your Activity Tab Content
      <View style={styles.tabView}>
        {transactionDocs.map((doc, index) => (
          <View style={styles.tabContentContainer}>
            <Text key={index} style={styles.groupName}>Transaction: ${doc.data().Amount}</Text>
            <Text key={index} style={styles.groupStatus}>{doc.data().date}</Text>
          </View>
        ))}
      </View>
    );
  };

  const [groupDocs, setGroupDocs] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user != null) {
        const groupDocuments = await getMultipleGroupDocument("Group", user);
        setGroupDocs(groupDocuments);
      }
    };
  fetchGroups();
}, []);

  const GroupsTab = () => {
    return (
      // Your Groups Tab Content
      <View style={styles.tabView}>
        {groupDocs.map((doc, index) => (
          <View style={styles.tabContentContainer}>
            <Text key={index} style={styles.groupName}>{doc.data().Name}:</Text>
            <Text key={index} style={styles.groupStatus}>{doc.data().Status}</Text>
          </View>
        ))}
      </View>
    );
  };
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("GROUPS");
  const [userName, setUserName] = useState("");

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  useEffect(() => {
    const fetchUserName = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user != null) {
        const data = await getDocumentData("Users", user);
        setUserName(data.Username);
      }
    };
    fetchUserName();
  }, []);

  const balance = useFetchAndUpdateBalance();

  // Calculate expenses owed

  const [totalOwed, setTotalOwed] = useState(0);
  const [totalOwedToUser, setTotalOwedToUser] = useState(0);
  useEffect(() => {
    const fetchExpense = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user != null) {
        const documents = await getMultipleDocument("Expense", user);
        let totalExpense = 0;
        documents.forEach(doc => {
          if (!doc.data().Resolved) {
            // Sum up the amounts owed to the user
            const expense = parseFloat(doc.data().AmountOwed);
            totalExpense += expense
          }
          
        });
        setTotalOwed(totalExpense);
      }
    };
    const fetchOwedToUserExpenses = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user != null) {
        // Fetch all expenses associated with the user
        const allExpenseDocuments = await fetchCollection("Expense");
        let totalExpenseOwedToUser = 0; // Initialize the total amount owed to the user
  
        // Filter expenses where the current user is the creator
        allExpenseDocuments.forEach((expense) => {
          if (expense.CreatorID === user.uid && !expense.Resolved) {
            // Sum up the amounts owed to the user
            totalExpenseOwedToUser += parseFloat(expense.AmountOwed);
          }
        });
  
        // Update state with the total amount owed to the user
        setTotalOwedToUser(totalExpenseOwedToUser);
      }
    };
    fetchOwedToUserExpenses();
    fetchExpense();
  }, []);

  const renderTab = () => {
    if (activeTab === "POINTS") return <PointsTab />;
    if (activeTab === "GROUPS") return <GroupsTab />;
    if (activeTab === "ACTIVITY") return <ActivityTab />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.topContainer}>
          <View>
            <Text style={styles.greeting}>Good afternoon,</Text>
            <Text style={styles.username}>{userName}</Text>
          </View>
          <TouchableOpacity style={styles.container} onPress={handleLogout}>
            <Ionicons
              style={{ fontSize: 40, color: "white", marginLeft: "auto" }}
              name="log-out-outline"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceSection}>
          <Text style={styles.totalBalanceTitle}>Total Balance</Text>
          <Text style={styles.totalBalanceAmount}>+ ${balance}</Text>
          <View style={styles.balanceDetails}>
            <Text style={styles.moneyOwed}>You Owe ${parseFloat(totalOwed).toFixed(2)}</Text>
            <Text style={styles.paymentDue}>You are Owed ${parseFloat(totalOwedToUser).toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("POINTS")}
            style={[styles.tab, activeTab === "POINTS" ? styles.activeTab : {}]}
          >
            <Text style={styles.tabText}>POINTS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("GROUPS")}
            style={[styles.tab, activeTab === "GROUPS" ? styles.activeTab : {}]}
          >
            <Text style={styles.tabText}>GROUPS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("ACTIVITY")}
            style={[
              styles.tab,
              activeTab === "ACTIVITY" ? styles.activeTab : {},
            ]}
          >
            <Text style={styles.tabText}>ACTIVITY</Text>
          </TouchableOpacity>
        </View>

        {renderTab()}
        {/* <View style={styles.pointsList}>
          <Text style={styles.pointItemPositive}>22/1/24 +20</Text>
          <Text style={styles.pointItemPositive}>20/1/24 +32</Text>
          <Text style={styles.pointItemNegative}>8/1/24 -27</Text>
        </View> */}
      </ScrollView>
      <NavBar screen="home" />
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
  },
  contentContainer: {
    padding: 20,
  },
  greeting: {
    color: "#ffffff",
    fontSize: 18,
  },
  username: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  balanceSection: {
    backgroundColor: "#0A2D4A",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  totalBalanceTitle: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 10,
  },
  totalBalanceAmount: {
    color: "#4cd137",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  balanceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moneyOwed: {
    color: colors.divvy_red,
    fontSize: 16,
  },
  paymentDue: {
    color: "#e1e1e1",
    fontSize: 16,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tab: {
    color: "#ffffff",
    fontSize: 16,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#4cd137",
  },
  pointsList: {
    backgroundColor: "#0A2D4A",
    borderRadius: 10,
    padding: 20,
  },
  pointItemPositive: {
    color: "#4cd137",
    fontSize: 16,
    marginBottom: 10,
  },
  pointItemNegative: {
    color: "#e84118",
    fontSize: 16,
    marginBottom: 10,
  },
  remainingPoints: {
    padding: 20,
    alignItems: "center",
  },
  remainingPointsText: {
    color: "#ffffff",
    fontSize: 16,
  },
  topContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "#0A2D4A",
    borderRadius: 10,
  },
  tab: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#4cd137",
  },
  tabText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  tabView: {
    backgroundColor: "#0A2D4A",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  groupName: {
    color: "#FFF",
    fontSize: 15,
  },
  groupStatus: {
    color: colors.divvy_blue,
    fontSize: 15,
    marginLeft: "auto"
  },
  tabContentContainer: {
    flexDirection: "row"
  },
});

export default HomeScreen;
