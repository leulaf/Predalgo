import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';
import { firebase, storage, db } from '../../config/firebase';
import { doc, getDoc, deleteDoc, deleteObject, updateDoc, increment } from "firebase/firestore";
import {ThemeContext} from '../../../context-store/context';
import PostContainer from './PostContainer';

import PostText from '../../shared/Text/PostText';

import { useNavigation } from '@react-navigation/native';


const TextPost = ({ navigation, title, username = "", profilePic = "", text, tags, profile, postId, likesCount, commentsCount, repostProfile, repostComment }) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [profilePicState, setProfilePicState] = useState(profilePic);
    const [usernameState, setUsernameState] = useState(username);
    const [repostUsername, setRepostUsername] = useState(null);

    useEffect(() => {
        if(repostProfile != null){
            const userRef = doc(db, 'users', repostProfile);
            const userSnapshot = getDoc(userRef);

            userSnapshot.then((snapshot) => {
                if (snapshot.exists) {
                    setRepostUsername(snapshot.data().username);
                } else {
                    // console.log("No such document!");
                }
            }).catch((error) => {
                // console.log("Error getting document:", error);
            });
        }

        if(usernameState == ""){
            const userRef = doc(db, 'users', profile);
            const userSnapshot = getDoc(userRef);

            userSnapshot.then((snapshot) => {
                if (snapshot.exists) {
                    setProfilePicState(snapshot.data().profilePic);
                    setUsernameState(snapshot.data().username);
                } else {
                    // console.log("No such document!");
                }
            }).catch((error) => {
                // console.log("Error getting document:", error);
            });
        }
    }, []);

    if (usernameState === "") {
        return null;
    }

    return (
        <PostContainer 
            title={title}
            text={text}
            likesCount={likesCount}
            commentsCount={commentsCount}
            tags={tags}
            memeText={false}
            profile={profile}
            postId={postId}
            profilePic={profilePicState}
            username={usernameState}
            repostUsername={repostUsername}

            navigation={navigation}

            content={
                <PostText numberOfLines={15} text={text}/>
            }
        />
    );
    }

const styles = StyleSheet.create({

    lightText: {
        fontSize: 20,
        fontWeight: '400',
        color: '#222222',
        textAlign: "left",
        marginLeft: 10,
        marginRight: 65,
        marginVertical: 10,
    },
    darkText: {
        fontSize: 20,
        fontWeight: '400',
        color: '#F4F4F4',
        textAlign: "left",
        marginLeft: 10,
        marginRight: 65,
        marginVertical: 10,
    }
});

export default TextPost;
