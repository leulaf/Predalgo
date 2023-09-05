import { firebase, storage, db } from '../../config/firebase';
import { query, where, collection, getDocs, addDoc, doc, getDoc, setDoc, deleteDoc, deleteObject, updateDoc, increment } from "firebase/firestore";

import { getAuth } from 'firebase/auth';

const auth = getAuth();

// update like count and add post to liked collection
const onLikePost = async (postId) => {
    return new Promise(async (resolve, reject) => {
        const likedRef = doc(db, "likedPosts", auth.currentUser.uid, "posts", postId);

        // add post to likes collection
        await setDoc(likedRef, {})

        // update like count for post
        const postRef = doc(db, 'allPosts', postId);
    
        await updateDoc(postRef, {
            likesCount: increment(1)
        }).then(() => {
            // console.log("liked")
            resolve(true);
        }).catch((error) => {
            // console.log(error);
            reject(false);
        });

    });
};

// update like count and add post to liked collection
const onDisikePost = async (postId) => {
    return new Promise(async (resolve, reject) => {
        // delete post from likes collection
        await deleteDoc(doc(db, "likedPosts", auth.currentUser.uid, "posts", postId))

        // update like count for post
        const postRef = doc(db, 'allPosts', postId);

        await updateDoc(postRef, {
            likesCount: increment(-1)
        }).then(() => {
            // console.log("disliked")
            resolve(true);
        }).catch((error) => {
            // console.log(error);
            reject(false);
        });
    });
}

export { onLikePost, onDisikePost }