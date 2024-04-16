import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  increment,
  updateDoc,
  doc,
  onSnapshot,
  getDoc as getFirestoreDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2wQDz5j6G2ZYJu7MMDEDK57A1QgWFryg",
  authDomain: "divvyup-954c6.firebaseapp.com",
  projectId: "divvyup-954c6",
  storageBucket: "divvyup-954c6.appspot.com",
  messagingSenderId: "694501091525",
  appId: "1:694501091525:web:8c3cc3888e3b6c4cc8a8ac",
  measurementId: "G-KFRNSY1VY0",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Function to fetch and display data from 'Amount' collection
async function fetchCollection(Collection) {
  // Get a reference to the 'Amount' collection
  const collectionRef = collection(db, Collection);

  // Get the snapshot of the collection
  const snapshot = await getDocs(collectionRef);

  // Create an array to hold the data
  const Data = [];

  // Iterate over each document in the collection
  snapshot.forEach((doc) => {
    // Push the document data to the array 
    Data.push({id: doc.id, ...doc.data()}); 
  }); 

  // return the data if you need to use it elsewhere
  return Data;
}

async function addNewDocument(Collection, data) {
  try {
    const docRef = await addDoc(collection(db, Collection), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function updateDocumentByEmail(
  Collection,
  userID,
  dataToUpdate,
  field,
  inc
) {
  const collectionRef = collection(db, Collection);
  const queryConstraint = query(collectionRef, where("UserID", "==", userID));

  try {
    const querySnapshot = await getDocs(queryConstraint);

    if (querySnapshot.empty) {
      console.log("No matching document found with email:", userID);
      return;
    }

    querySnapshot.forEach(async (doc) => {
      try {
        let updatedVal;
        if (inc) {
          updatedVal = increment(dataToUpdate);
        } else {
          updatedVal = increment(dataToUpdate * -1);
        }
        const updatedData = {
          [field]: updatedVal,
        };
        await updateDoc(doc.ref, updatedData);
        console.log("Document updated with ID: ", doc.id);
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    });
  } catch (e) {
    console.error("Error querying documents: ", e);
  }
}

// GET a document, just pass in the collection name and the user object
// and it will return the document that is tagged to the user

// get document data
async function getDocumentData(collectionName, user) {
  const docRef = collection(db, collectionName);
  const q = query(docRef, where("UserID", "==", user.uid));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const data = querySnapshot.docs[0].data();
    return data;
  } else {
    console.log("No data found.");
  }
}

// get multiple document
async function getMultipleDocument(collectionName, user) {
  const docRef = collection(db, collectionName);
  const q = query(docRef, where("UserID", "==", user.uid));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs;
  return data;
}

async function getMultipleGroupDocument(collectionName, user) {
  const docRef = collection(db, collectionName);
  const q = query(docRef, where("UserID", "array-contains", user.uid));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs;
  return data;
}

// get document
async function getDocument(collectionName, user) {
  const docRef = collection(db, collectionName);
  const q = query(docRef, where("UserID", "==", user.uid));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs[0];
  return data;
}

// GET entire collection and return document data as array
function getCollection(collectionName, hasTimeStamp) {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        let docs = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data() }));
        if (hasTimeStamp) {
          const formattedDocs = docs.map((post) => ({
            ...post,
            Timestamp: post.Timestamp.toDate().toString(), // Convert Timestamp to String
          }));
          setData(formattedDocs);
        } else {
          setData(docs);
        }
      } catch (error) {
        console.log("Error fetching collection: ", error);
      }
    };

    fetchData();
  }, [collectionName, hasTimeStamp]);
  return {data};
}


// UPDATE a document
async function updateDocument(collectionName, field, data, docId) {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    [field]: data,
  });
}


// GET Balance
const useFetchAndUpdateBalance = () => {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchAndUpdateBalance = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const data = await getDocumentData("DivvyWallet", user);
        if (data) {
          setBalance(data.Amount);
        } else {
          console.log("No document found");
        }
      }
    };

    fetchAndUpdateBalance();
  }, []);

  return balance;
};

async function subscribe(Collection, setDataCallback){
  return onSnapshot(Collection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setDataCallback(data);
  });
}

async function getDoc(Collection, docID, field){
  try {
      // Create a reference to the specific document
      const groupDocRef = doc(db, Collection, docID);

      // Fetch the document
      const docSnap = await getFirestoreDoc(groupDocRef);

      // Check if the document exists
      if (docSnap.exists()) {
          // Access the specified field from the document data
          const fieldValue = docSnap.data()[field];
          return fieldValue;
      } else {
          throw new Error("Document does not exist!");
      }
  } catch (error) {
      console.error("Error fetching document:", error);
      return null;
  }
};

export {
  db,
  fetchCollection,
  addNewDocument,
  getDocumentData,
  updateDocumentByEmail,
  updateDocument,
  getDocument,
  getCollection,
  useFetchAndUpdateBalance,
  subscribe,
  getMultipleDocument,
  getMultipleGroupDocument,
  getDoc,
};
