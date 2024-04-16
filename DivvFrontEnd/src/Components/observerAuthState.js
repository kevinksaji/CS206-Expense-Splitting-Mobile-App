import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Step 1: Define the separate function for observing auth state changes
function observeAuthState(auth, setUID) {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, update UID state
            const uid = user.uid;
            setUID(uid);
            // Additional logic for signed-in user can be placed here
            // e.g., adding UID to selectedFriendsIds if that's intended here
            // selectedFriendsIds.push(uid); // Make sure this is what you want and it's defined correctly
        } else {
            // User is signed out
            console.log('User is not signed in.');
        }
    });

    return unsubscribe;
}

export default observeAuthState;