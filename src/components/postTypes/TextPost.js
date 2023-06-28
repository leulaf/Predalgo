import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { firebase, storage, db } from '../../config/firebase';
import { doc, getDoc, deleteDoc, deleteObject, updateDoc, increment } from "firebase/firestore";
import {ThemeContext} from '../../../context-store/context';
import PostContainer from './PostContainer';
import PostBottom from './PostBottom';

const TextPost = ({ navigation, title, text, tags, profile, postId, likesCount, commentsCount, repostProfile }) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [profilePic, setProfilePic] = useState("");
    const [username, setUsername] = useState("");
    const [repostUsername, setRepostUsername] = useState(null);

    useEffect(() => {
        if(repostProfile != null){
            const userRef = doc(db, 'users', repostProfile);
            const userSnapshot = getDoc(userRef);

            userSnapshot.then((snapshot) => {
                if (snapshot.exists) {
                    setRepostUsername(snapshot.data().username);
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }

        const userRef = doc(db, 'users', profile);
        const userSnapshot = getDoc(userRef);

        userSnapshot.then((snapshot) => {
            if (snapshot.exists) {
                setProfilePic(snapshot.data().profilePic);
                setUsername(snapshot.data().username);
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }, []);

    if (username === "") {
        return null;
    }

    return (
        <PostContainer 
            title={title}
            profile={profile}
            postId={postId}
            profilePic={profilePic}
            username={username}
            repostUsername={repostUsername}
            content={
                <>
                    <View style={theme == "light" ? styles.lightTextContainer : styles.darkTextContainer}>
                            <Text numberOfLines={15} style={theme == "light" ? styles.lightText : styles.darkText}>{text}</Text>
                    </View>
                    <PostBottom 
                        tags={tags}
                        memeText={false}
                        postId={postId}
                        likesCount={likesCount}
                        commentsCount={commentsCount}
                        hideBottom
                    />
                </>
            }
        />
    );
    }

const styles = StyleSheet.create({
    lightTextContainer: {
        // minHeight: 353,
        // maxHeight: 353,
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 13,
        borderColor: "#f0f0f0",
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    darkTextContainer: {
        // minHeight: 353,
        // maxHeight: 353,
        width: "100%",
        backgroundColor: "#222222",
        borderRadius: 13,
        borderColor: "#333333",
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    lightText: {
        fontSize: 20,
        fontWeight: "400",
        color: '#222222',
        textAlign: "left",
        marginLeft: 10,
        marginRight: 65,
        marginVertical: 20,
    },
    darkText: {
        fontSize: 20,
        fontWeight: "400",
        color: '#F4F4F4',
        textAlign: "left",
        marginLeft: 10,
        marginRight: 65,
        marginVertical: 20,
    }
});

export default TextPost;
