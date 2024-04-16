
import { useState, useEffect, React } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import NavBar from "../../Components/BottomNavBar";
import Post from "../../Components/StrangerSplit/Post";
import colors from "../../config/colors"
import DiscountImage from "../../assets/Discount.jpeg"
import pic1 from "../../assets/pic1.png"
import pic2 from "../../assets/pic2.png"
import pic3 from "../../assets/pic3.png"
import pic4 from "../../assets/pic4.png"
import SearchBar from '../../Components/SearchBar';
import { useNavigate } from 'react-router-dom';
import CreatePostModal from "../../Components/StrangerSplit/CreatePostModal";
import { addNewDocument, getCollection } from "../../firebase/server";


const StrangerHome = () => {
    const navigate = useNavigate();

    const images = [DiscountImage, pic1, pic2, pic3, pic4];

    const [modalVisible, setModalVisible] = useState(false);

    // Get Posts
    const posts = getCollection("Post", true).data;

    // Get Users
    const users = getCollection("Users", false).data;

    // Add post to post db
    const addPost = (newPost) => {
        addNewDocument('Post', newPost);
    };

    const onPressPost = (postId, name, body, groupID, currentCap, Capacity) => {
        navigate("/StrangerSplit/CreatePost", { state: { postId, name, body, groupID, currentCap, Capacity } });
    }


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.searchBar}>
                <SearchBar placeholder={"Search"} />
            </View>

            <ScrollView>
                {posts.map((post, index) => (

                    <TouchableOpacity onPress={() => onPressPost(post.id, post.Username, post.Body, post.GroupID, post.CurrentCap, post.Capacity)}>
                        <Post
                            key={index}
                            userName={post.Username}
                            timeStamp={post.Timestamp}
                            currentCap={post.CurrentCap}
                            capacity={post.Capacity}
                            image={images[index % images.length]}
                            body={post.Body}
                        />
                    </TouchableOpacity>
                ))}
                {/* <Post userName="Username Here" timeStamp="7:05pm" capacity="5" image={DiscountImage} body="Adidas Discount!. Check out these prices! Let's make use of this discount!" /> */}

            </ScrollView>

            <TouchableOpacity style={styles.plusButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>

            {modalVisible && <CreatePostModal onClose={() => setModalVisible(false)} onAddPost={addPost} users={users} />}

            <NavBar screen="wheel" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },

    searchBar: {
        marginTop: 40,
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    addPostButton: {
        backgroundColor: "#0A2D4A",
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        // marginLeft: 20,
    },

    userName: {
        fontSize: 20,
        fontWeight: "bold",
    },

    postContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        margin: 15,
        marginTop: 20,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.2,
        // shadowRadius: 1,
        // elevation: 3,
        // flex: 1,
        // margin: 20,
        // marginBottom: "auto",
    },

    postBody: {
        margin: 10,
        fontSize: 15,
    },

    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 20,
    },
    plusButton: {
        position: 'absolute',
        bottom: 60, // Adjust based on NavBar height
        right: 30,
        width: 56, // Button size
        height: 56, // Button size
        borderRadius: 28, // Half of width/height
        backgroundColor: colors.primary, // Use your app's primary color
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
})

export default StrangerHome;
