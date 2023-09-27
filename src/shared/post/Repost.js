import { Alert } from 'react-native';
import { db } from '../../config/firebase';
import { doc, collection, addDoc, updateDoc, increment } from "firebase/firestore";

import firebase from 'firebase/compat/app';
require('firebase/firestore');


import { getAuth } from "firebase/auth";

const auth = getAuth();


// Comment Text on a post
const Repost = (repostedId, username, profilePic) => async () => {

    return new Promise(async (resolve, reject) => {
        // add text post to database
        await addDoc(collection(db, "allPosts"), {
            repostedPostId: repostedId,
            creationDate: firebase.firestore.FieldValue.serverTimestamp(),
            profile: auth.currentUser.uid,
            username: auth.currentUser.displayName,
            profilePic: auth.currentUser.photoURL,
            // username: username,
            // profilePic: profilePic,
            // reposterProfilePic: auth.currentUser.photoURL,
        }).then(async (docRef) => {
            // update posts count for current user
            const currentUserRef = doc(db, 'users', auth.currentUser.uid);

            await updateDoc(currentUserRef, {
                posts: increment(1)
            });

            // update reposts count for original poster
            const postRef = doc(db, 'allPosts', repostedId);

            await updateDoc(postRef, {
                reposts: increment(1)
            });

            resolve(docRef.id);

            Alert.alert("Reposted!");
        }).catch(function (error) {
            // console.log(error);
        });

    });

};


export default Repost;