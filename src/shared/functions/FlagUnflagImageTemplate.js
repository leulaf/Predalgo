import { db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const auth = getAuth();

const onFlagImageTemplate = async(memeName) => {
    return new Promise(async (resolve, reject) => {

        const flaggedImageTemplatesRef = doc(db, "flaggedImageTemplates", auth.currentUser.uid);

        await updateDoc(flaggedImageTemplatesRef, {
            flaggedImageTemplates: arrayUnion(memeName),
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            // console.log(e);
            reject(e);
        });
    })
}

const onUnflagImageTemplate = async(memeName) => {
    return new Promise(async (resolve, reject) => {

        const flaggedImageTemplatesRef = doc(db, "flaggedImageTemplates", auth.currentUser.uid);

        await updateDoc(flaggedImageTemplatesRef, {
            flaggedImageTemplates: arrayRemove(memeName),
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            // console.log(e);
            reject(e);
        });
    })
}

export {onFlagImageTemplate, onUnflagImageTemplate};