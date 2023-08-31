import { db, storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, collection, addDoc, updateDoc, increment } from "firebase/firestore";

import uuid from 'react-native-uuid';

import firebase from 'firebase/compat/app';
require('firebase/firestore');

import { getAuth } from "firebase/auth";

const auth = getAuth();

// fuction is not needed since the template is already uploaded to the database
async function UploadMemePost(title, text, url, memeName, templateUrl, imageState, height, width, tags) {
    return new Promise(async (resolve, reject) => {
        // Convert image to blob format(array of bytes)
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const filename = uuid.v4();
        const childPath = `posts/users/${auth.currentUser.uid}/${filename}`;
        const metadata = {
            cacheControl: 'public,max-age=31536000',
        };
        const storageRef = ref(storage, childPath);
        const uploadTask = uploadBytesResumable(storageRef, blob, metadata)
        .catch ((e) => {
            // console.log(e);
            resolve(false);
        });
        
        await uploadTask.then(async(snapshot) => {
            // console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            // console.log('File metadata:', snapshot.metadata);
            
            // get a download URL for the file.
            getDownloadURL(snapshot.ref).then(async (url) => {
                // console.log(imageUrl);
                // console.log('File available at', url);
                
                await SaveMemePostData(title, text, url, memeName, templateUrl, imageState, height, width, tags)
                .then(async (id) => {
                    if (id != false) {
                        // update posts count for current user
                        const currentUserRef = doc(db, 'users', auth.currentUser.uid);

                        await updateDoc(currentUserRef, {
                            posts: increment(1)
                        });

                        resolve(id);
                    }else{
                        resolve(false);
                    }
                })
                .catch((e) => {
                    resolve(false);
                });
                
            });
        }).catch((error) => {
            // console.error('Upload failed', error);
            // ...
        });
    });
};


const SaveMemePostData = async (title, text, url, memeName, templateUrl, imageState, height, width, tags) => {
    return new Promise(async (resolve, reject) => {
        // add text post to database
        await addDoc(collection(db, "allPosts"), {
            title: title,
            text: text,
            imageUrl: url,
            memeName: memeName,
            template: templateUrl,
            templateState: imageState,
            imageHeight: height,
            imageWidth: width,
            tags: tags,
            likesCount: 0,
            commentsCount: 0,
            creationDate: firebase.firestore.FieldValue.serverTimestamp(),
            username: auth.currentUser.displayName,
            profilePic: auth.currentUser.photoURL,
            profile: auth.currentUser.uid
        }).then(async (docRef) => {
            // update posts count for current user
            const currentUserRef = doc(db, 'users', auth.currentUser.uid);

            await updateDoc(currentUserRef, {
                posts: increment(1)
            });

            resolve(docRef.id);
            // Alert.alert("Post uploaded successfully!");
        }).catch(function (error) {
            resolve(false);
            // console.log(error);
        });
    });
};


export { UploadMemePost, SaveMemePostData }
