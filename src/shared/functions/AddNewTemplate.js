import { db, storage } from '../../config/firebase';
import { collection, doc, setDoc, getDoc, query, where, limit, getDocs, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import firebase from 'firebase/compat/app';

import { Alert } from 'react-native';

import removeExcludedWords from '../../constants/ExcludedWords';

import uuid from 'react-native-uuid';


const uploadNewTemplate = async (newTemplateImage, memeName, height, width) => {
    if(memeName.length == 0){
        Alert.alert("Please enter a name for the meme template.");
        return;
    }
    return new Promise(async (resolve, reject) => {
        // check if the meme name is unique
        const q = query(
            collection(db, "imageTemplates"),
            where("name", "==", memeName),
            limit(1)
        );
        
        const snapshot = await getDocs(q);

        if (snapshot.docs.length !== 0) {
            Alert.alert("Meme with that name already exists. Please choose a different name.");
            return; // Exit the function immediately
        }

        let templateUrl

        // Alert.alert("Meme with that name already exists. Please choose a different name.");
        // upload the new template to firebase storage
        const newResponse = await fetch(newTemplateImage);
        const newBlob = await newResponse.blob();

        const newFilename = uuid.v4();
        const newChildPath = `imageTemplates/${newFilename}`;

        const metadata = {
            cacheControl: 'public,max-age=31536000',
        };

        const newStorageRef = ref(storage, newChildPath);
        
        const newUploadTask = uploadBytesResumable(newStorageRef, newBlob, metadata)
        .catch ((e) => {
            console.log(e);
        });

        await newUploadTask.then(async(snapshot) => {
            // console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            // console.log('File metadata:', snapshot.metadata);
            
            // Let's get a download URL for the file.
            getDownloadURL(snapshot.ref).then(async (newUrl) => {
                // console.log(imageUrl);
                // console.log('File available at', url);
                await addNewTemplate(newUrl, memeName, height, width);
                resolve(newUrl);
            }).catch((error) => {
                console.error('Upload failed', error);
                // ...
            });


        }).catch((error) => {
            console.error('Upload failed', error);
            // ...
        });


    });

    
}

const addNewTemplate = async (newUrl, memeName, height, width) => {
    const userRef = doc(db, "users", firebase.auth().currentUser.uid);
    const userSnap = await getDoc(userRef);
    const username = userSnap.data().username;
    // const {height, width} = await getHeightAndWidth(newUrl);

    await setDoc(doc(db, "imageTemplates", memeName), {
        name: memeName,
        searchName: removeExcludedWords(memeName),
        uploader: username,
        url: newUrl,
        height: height,
        width: width,
        useCount: 0,
        creationDate: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(async() => {
        
    });
}

export {uploadNewTemplate, addNewTemplate};