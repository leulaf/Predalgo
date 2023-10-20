import { db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const auth = getAuth();

const onSaveComment = async(commentId) => {
    return new Promise(async (resolve, reject) => {

        const savedCommentsRef = doc(db, "savedComments", auth.currentUser.uid);

        await updateDoc(savedCommentsRef, {
            savedComments: arrayUnion(commentId),
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            // console.log(e);
            reject(e);
        });
    })
}

const onUnsaveComment = async(commentId) => {
    return new Promise(async (resolve, reject) => {

        const savedCommentsRef = doc(db, "savedComments", auth.currentUser.uid);

        await updateDoc(savedCommentsRef, {
            savedComments: arrayRemove(commentId),
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            // console.log(e);
            reject(e);
        });
    })
}

export {onSaveComment, onUnsaveComment};