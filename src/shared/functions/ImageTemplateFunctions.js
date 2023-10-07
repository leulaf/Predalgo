import { db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import removeExcludedWords from '../../constants/ExcludedWords';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

const saveImageTemplate = async(memeName, templateUrl, uploader, height, width) => {
    return new Promise(async (resolve, reject) => {
        if(!(memeName || memeName.length == 0) || !(templateUrl || templateUrl.length == 0) || !(uploader || uploader.length == 0) || !(height) || !(width)){
            reject("Invalid parameters");
        }


        const userRef = doc(db, "users", auth.currentUser.uid);

        await updateDoc(userRef, {
            savedImageTemplates: arrayUnion({
                name: memeName,
                url: templateUrl,
                uploader: uploader,
                searchName: removeExcludedWords(memeName),
                height: height,
                width: width,
            }),
            
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            reject(e);
        });
    })
}

const unsaveImageTemplate = async(memeName, templateUrl, uploader, height, width) => {
    return new Promise(async (resolve, reject) => {
        if(!(memeName || memeName.length == 0) || !(templateUrl || templateUrl.length == 0) || !(uploader || uploader.length == 0) || !(height) || !(width)){
            reject("Invalid parameters");
        }


        const userRef = doc(db, "users", auth.currentUser.uid);

        await updateDoc(userRef, {
            savedImageTemplates: arrayRemove({
                name: memeName,
                url: templateUrl,
                uploader: uploader,
                searchName: removeExcludedWords(memeName),
                height: height,
                width: width,
            }),
            
        }).then(async() => {
            resolve(true);
        }).catch((e) => {
            reject(e);
        });
    })
}

export {saveImageTemplate, unsaveImageTemplate};