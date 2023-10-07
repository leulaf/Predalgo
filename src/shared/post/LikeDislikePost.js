import { firebase, storage, db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, increment } from "firebase/firestore";

import { getAuth } from 'firebase/auth';

const auth = getAuth();

// update like count and add post to liked collection
const onLikePost = async (postId, emoji) => {
    return new Promise(async (resolve, reject) => {
        const userRef = doc(db, "users", auth.currentUser.uid);


        // add post to likes collection
        await updateDoc(userRef, {
            likedPosts: arrayUnion({
                postId: postId,
                emoji: emoji,
            }),
            // moodArray: [
            //     "laughing",
            //     "loving",
            //     "shocked",
            //     "lightBulb",
            //     "confetti",
            //     "wink",
            //     "skeptical",
            //     "eyeRoll",
            //     "crying",
            //     "sad",
            //     "angry"
            // ]
        }).then(() => {
            // console.log("liked")
            resolve(true);
        }).catch((error) => {
            // console.log(error);
            reject(false);
        });

        // update like count for post
        const postRef = doc(db, 'allPosts', postId);
    
        await updateDoc(postRef, {
            likesCount: increment(1),
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
const onDisikePost = async (postId, emoji) => {
    return new Promise(async (resolve, reject) => {
        // delete post from likes collection
        const userRef = doc(db, "users", auth.currentUser.uid);


        // add post to likes collection
        await updateDoc(userRef, {
            likedPosts: arrayRemove({
                postId: postId,
                emoji: emoji,
            }),
            // moodArray: [
            //     "laughing",
            //     "loving",
            //     "shocked",
            //     "lightBulb",
            //     "confetti",
            //     "wink",
            //     "skeptical",
            //     "eyeRoll",
            //     "crying",
            //     "sad",
            //     "angry"
            // ]
        }).then(() => {
            // console.log("liked")
            resolve(true);
        }).catch((error) => {
            // console.log(error);
            reject(false);
        });

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