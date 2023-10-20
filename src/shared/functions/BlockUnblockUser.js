import { db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const auth = getAuth();

const onBlockUser = async(profile) => {
    return new Promise(async (resolve, reject) => {

        const blockedUsersRef = doc(db, "blockUsers", auth.currentUser.uid);

        await updateDoc(blockedUsersRef, {
            blockedUsers: arrayUnion(profile),
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            // console.log(e);
            reject(e);
        });
    })
}

const onUnflagComment = async(profile) => {
    return new Promise(async (resolve, reject) => {

        const blockedUsersRef = doc(db, "blockUsers", auth.currentUser.uid);

        await updateDoc(blockedUsersRef, {
            blockedUsers: arrayRemove(profile),
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            // console.log(e);
            reject(e);
        });
    })
}

export {onBlockUser, onUnflagComment};