import { db } from '../../../config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const auth = getAuth();

const onFlagComment = async(commentId) => {
    return new Promise(async (resolve, reject) => {

        const flaggedCommentsRef = doc(db, "flaggedComments", auth.currentUser.uid);

        await updateDoc(flaggedCommentsRef, {
            flaggedComments: arrayUnion(commentId),
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            // console.log(e);
            reject(e);
        });
    })
}

const onUnflagComment = async(commentId) => {
    return new Promise(async (resolve, reject) => {

        const flaggedCommentsRef = doc(db, "flaggedComments", auth.currentUser.uid);

        await updateDoc(flaggedCommentsRef, {
            flaggedComments: arrayRemove(commentId),
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            // console.log(e);
            reject(e);
        });
    })
}

export {onFlagComment, onUnflagComment};