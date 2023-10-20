import { db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const auth = getAuth();

const onFlagGifTemplate = async(commentId) => {
    return new Promise(async (resolve, reject) => {

        const flaggedGifTemplatesRef = doc(db, "flaggedGifTemplates", auth.currentUser.uid);

        await updateDoc(flaggedGifTemplatesRef, {
            flaggedGifTemplates: arrayUnion(commentId),
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            // console.log(e);
            reject(e);
        });
    })
}

const onUnflagGifTemplate = async(commentId) => {
    return new Promise(async (resolve, reject) => {

        const flaggedGifTemplatesRef = doc(db, "flaggedGifTemplates", auth.currentUser.uid);

        await updateDoc(flaggedGifTemplatesRef, {
            flaggedGifTemplates: arrayRemove(commentId),
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            // console.log(e);
            reject(e);
        });
    })
}

export {onFlagGifTemplate, onUnflagGifTemplate};