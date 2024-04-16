import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlusCircle, faQrcode, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import NavBar from '../Components/BottomNavBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from "react-native";
import {db, fetchCollection, addNewDocument, updateDocumentByEmail, useFetchAndUpdateBalance, subscribe} from '../firebase/server';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onSnapshot, collection, doc} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import observeAuthState from '../Components/observerAuthState';



const DivvyWallet = () => {
    const currentdate = require('moment-timezone');
    const datetime = currentdate().tz("Asia/Singapore").format('DD/MM/YYYY @ HH:mm:ss');

    const [walletAmt, setwalletAmt] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const auth = getAuth();
    const [userID, setUserID] = useState("");

    //const walletAmt = useFetchAndUpdateBalance();


    const navigate = useNavigate();

    useEffect(() => {
        // Set up snapshot listeners for 'DivvyWallet' and 'Transaction' collections
        const walletCollection = collection(db, 'DivvyWallet');
        const transactionCollection = collection(db, 'Transaction');
    
        const walletUnsubscribe = subscribe(walletCollection, setwalletAmt);
        const transactionUnsubscribe = subscribe(transactionCollection, setTransactions);
    
        // Clean up listeners when the component unmounts
        return () => {
          walletUnsubscribe;
          transactionUnsubscribe;
        };
      }, []);

    // Use onAuthStateChanged to listen for changes in the user's login state
    observeAuthState(auth, setUserID);

    const onTopUp = async () => {
        if (userID) {
            const amt = 100;
            try {
                const data = {
                    UserID: userID,
                    Amount: amt,
                    status: 'Top Up',
                    date: datetime
                }
                addNewDocument('Transaction', data);
                await updateDocumentByEmail('DivvyWallet', userID, amt, 'Amount', true);
            }
            catch(e){
                console.error(e.error);
            }
        } else {
            console.error('User email not available');
        }
    };

    const onPay = async () => {
        if (userID) {
            const amt = 100;
            try {
                const data = {
                    UserID: userID,
                    Amount: amt,
                    status: 'Paid',
                    date: datetime
                }
                addNewDocument('Transaction', data);
                await updateDocumentByEmail('DivvyWallet', userID, amt, 'Amount', false);
            }
            catch(e){
                console.error(e.error);
            }
        } else {
            console.error('User email not available');
        }
        navigate('/PaymentConfirmation', { balance: walletAmt });

    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.taskWrapper}>

                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>DivvyPay</Text>
                        <Image
                            source={require("../assets/divvylogo.png")}
                            style={styles.logo}
                        />
                    </View>
                    <Text style={{ fontSize: 16, color: 'white', marginTop: 50 }}>Balance</Text>
                    {walletAmt.filter((item) => item.UserID === userID).map((item, index) => (
                        <Text key={index} style={styles.balance}>${item.Amount}</Text>
                    ))}
                </View>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.button} onPress={() => navigate('/EnterAmount')}>
                        <FontAwesomeIcon icon={faPlusCircle} size={24} color='white' />
                        <Text style={{color:'white'}}>Top Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <FontAwesomeIcon icon={faQrcode} size={24} color='white' />
                        <Text style={{color:'white'}}>Scan To Pay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <FontAwesomeIcon icon={faExchangeAlt} size={24} color='white' />
                        <Text style={{color:'white'}}>Transfer</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    <View style={styles.transactions}>
                        <Text style={styles.sectionTitle}>Recent Transactions:</Text>
                        {transactions
                        .sort((a, b) => moment(b.date, 'DD/MM/YYYY @ HH:mm:ss') - moment(a.date, 'DD/MM/YYYY @ HH:mm:ss'))
                        .filter((item) => item.UserID === userID)
                        .slice(0, 2).map((item, index) => (
                            <TouchableOpacity key={index} style={styles.card}>
                                <Text style={styles.sectionTitle}>{item.status} ${item.Amount}</Text>
                                <Text style={{color:'white'}}>{item.date}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.rewards}>
                        <Text style={styles.sectionTitle}>Get more rewards:</Text>
                        <TouchableOpacity style={styles.card}>
                            <Text style={styles.sectionTitle}>Stand a chance to win up to 100 points</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </View>
            <NavBar screen="money" />

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        flex: 1,
        backgroundColor: '#011627',
    },
    header: {
        backgroundColor: '#022b3a', // Assuming a dark theme
        padding: 20,
        marginVertical: 20
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 50, // Adjust the width as needed
        height: 50, // Adjust the height as needed
        marginLeft: 30, // Optional: Add margin if needed
    },
    card: {
        backgroundColor: '#022b3a', // Assuming a dark theme
        padding: 10,
        marginVertical: 3
    },
    title: {
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
    },
    balance: {
        fontSize: 36,
        color: '#4ade80', // Greenish color for the balance
        fontWeight: 'bold',
        marginTop: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        alignItems: 'center',
    },
    transactions: {
        padding: 20,
    },
    rewards: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white'
    },
    taskWrapper: {
        flex: 1
    }
});

export default DivvyWallet;
