import { db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const auth = getAuth();

const onFlagPost = async(postId) => {
    return new Promise(async (resolve, reject) => {

        const flaggedPostsRef = doc(db, "flaggedPosts", auth.currentUser.uid);

        await updateDoc(flaggedPostsRef, {
            flaggedPosts: arrayUnion(postId),
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            // console.log(e);
            reject(e);
        });
    })
}

const onUnflagPost = async(postId) => {
    return new Promise(async (resolve, reject) => {

        const flaggedPostsRef = doc(db, "flaggedPosts", auth.currentUser.uid);

        await updateDoc(flaggedPostsRef, {
            flaggedPosts: arrayRemove(postId),
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            // console.log(e);
            reject(e);
        });
    })
}

export {onFlagPost, onUnflagPost};