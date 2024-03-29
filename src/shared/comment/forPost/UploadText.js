import { Alert } from 'react-native';
import { db, storage } from '../../../config/firebase';
import { doc, setDoc, getDoc, collection, addDoc, updateDoc, increment } from "firebase/firestore";

import firebase from 'firebase/compat/app';
require('firebase/firestore');


import { getAuth, updateProfile } from "firebase/auth";

const auth = getAuth();


// Comment Text on a post
const commentTextOnPost = async (text, replyToPostId, replyToProfile, replyToUsername ) => {

    return new Promise(async (resolve, reject) => {
        if(text == ""){
            Alert.alert("Comment cannot be empty");
            return;
        }

        // add text post to database
        await addDoc(collection(db, "comments", replyToPostId, "comments"), {
            replyToPostId: replyToPostId,
            replyToProfile: replyToProfile,
            replyToUsername: replyToUsername,
            isMainComment: true,
            text: text,
            likesCount: 0,
            commentsCount: 0,
            creationDate: firebase.firestore.FieldValue.serverTimestamp(),
            profile: auth.currentUser.uid,
            username: auth.currentUser.displayName,
            profilePic: auth.currentUser.photoURL,
        }).then(async (docRef) => {
            

            // increment comments count on post
            const postRef = doc(db, 'allPosts', replyToPostId);

            await updateDoc(postRef, {
                commentsCount: increment(1)
            }).then(() => {
                resolve(docRef.id);
            });

            
        }).catch(function (error) {
            // console.log(error);
        });

    });

};


export { commentTextOnPost };