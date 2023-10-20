import { db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const auth = getAuth();

/* 

***

What if username changes?

***

*/

const onFollow = async(profile, username, profilePic) => {
    return new Promise(async (resolve, reject) => {

        const followRef = doc(db, "following", auth.currentUser.uid);

        await updateDoc(followRef, {
            following: arrayUnion({
                profile: profile,
                username: username,
                profilePic: profilePic,
            }),
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            // console.log(e);
            reject(e);
        });
    })
}

const onUnfollow = async(profile, username, profilePic) => {
    return new Promise(async (resolve, reject) => {

        const followRef = doc(db, "following", auth.currentUser.uid);

        await updateDoc(followRef, {
            following: arrayRemove({
                profile: profile,
                username: username,
                profilePic: profilePic,
            }),
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            // console.log(e);
            reject(e);
        });
    })
}

export {onFollow, onUnfollow};