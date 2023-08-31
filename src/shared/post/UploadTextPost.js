import { Alert } from 'react-native';
import { db } from '../../config/firebase';
import { doc, collection, addDoc, updateDoc, increment } from "firebase/firestore";

import firebase from 'firebase/compat/app';
require('firebase/firestore');


import { getAuth } from "firebase/auth";

const auth = getAuth();


// Comment Text on a post
const UploadTextPost = async (title, text, tags) => {

    return new Promise(async (resolve, reject) => {
        if(text == ""){
            Alert.alert("Comment cannot be empty");
            return;
        }

        // add text post to database
        await addDoc(collection(db, "allPosts"), {
            title: title,
            text: text,
            tags: tags,
            likesCount: 0,
            commentsCount: 0,
            creationDate: firebase.firestore.FieldValue.serverTimestamp(),
            profile: auth.currentUser.uid,
            username: auth.currentUser.displayName,
            profilePic: auth.currentUser.photoURL,
        }).then(async (docRef) => {
            // update posts count for current user
            const currentUserRef = doc(db, 'users', auth.currentUser.uid);

            await updateDoc(currentUserRef, {
                posts: increment(1)
            });
            

            resolve(docRef.id);

            // Alert.alert("Post uploaded successfully!");
        }).catch(function (error) {
            // console.log(error);
            
        });

    });

};


export default UploadTextPost;