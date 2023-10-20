import { db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const auth = getAuth();

const onSavePost = async(postId) => {
    return new Promise(async (resolve, reject) => {

        const savedPostsRef = doc(db, "savedPosts", auth.currentUser.uid);

        await updateDoc(savedPostsRef, {
            savedPosts: arrayUnion(postId),
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            // console.log(e);
            reject(e);
        });
    })
}

const onUnSavePost = async(postId) => {
    return new Promise(async (resolve, reject) => {

        const savedPostsRef = doc(db, "savedPosts", auth.currentUser.uid);

        await updateDoc(savedPostsRef, {
            savedPosts: arrayRemove(postId),
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            // console.log(e);
            reject(e);
        });
    })
}

export {onSavePost, onUnSavePost};