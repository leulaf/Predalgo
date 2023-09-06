import { db, storage } from '../../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, collection, addDoc, updateDoc, increment } from "firebase/firestore";

import uuid from 'react-native-uuid';

import firebase from 'firebase/compat/app';
require('firebase/firestore');

import { getAuth, updateProfile } from "firebase/auth";

import {commentTextOnPost} from './UploadText';

const auth = getAuth();

// fuction is not needed since the template is already uploaded to the database
async function commentMemeOnPost(imageUrl, memeName, text, replyToPostId, replyToProfile, replyToUsername, imageHeight, imageWidth) {

    return new Promise(async (resolve, reject) => {
        // Convert image to blob format(array of bytes)
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const filename = uuid.v4();
        const childPath = `comments/users/${firebase.auth().currentUser.uid}/${filename}`;

        const metadata = {
            cacheControl: 'public,max-age=31536000',
        };
        
        const storageRef = ref(storage, childPath);
        const uploadTask = uploadBytesResumable(storageRef, blob, metadata)
        .catch ((e) => {
            // console.log(e);
        });
        

        await uploadTask.then(async(snapshot) => {
            // console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            // console.log('File metadata:', snapshot.metadata);
            
            // Let's get a download URL for the file.
            
            await getDownloadURL(snapshot.ref).then(async (url) => {
                
                
                await saveMemeToPost(url, memeName, text, replyToPostId, replyToProfile, replyToUsername, imageHeight, imageWidth)
                .then(async (id) => {


                    const result = { url: url, id: id };

                    // increment comments count on post
                    const postRef = doc(db, 'allPosts', replyToPostId);

                    await updateDoc(postRef, {
                        commentsCount: increment(1)
                    }).then(() => {
                        resolve(result);
                    });


                }).catch((error) => {
                    // console.log(error);
                })
                
                
            }).catch((error) => {
                // console.log(error);
            });

        }).catch((error) => {
            // console.error('Upload failed', error);
            // ...
        })
    })
};


// Comment image on a post
const saveMemeToPost = async (memeName, templateUrl, templateUploader, imageState, text, replyToPostId, replyToProfile, replyToUsername, imageHeight, imageWidth ) => {
    return new Promise(async (resolve, reject) => {

        // add text post to database
        const docRef = await addDoc(collection(db, "comments", replyToPostId, "comments"), {
            replyToPostId: replyToPostId,
            replyToProfile: replyToProfile,
            replyToUsername: replyToUsername,
            isMainComment: true,
            memeName: memeName,
            template: templateUrl,
            templateUploader: templateUploader,
            templateState: imageState,
            imageHeight: imageHeight,
            imageWidth: imageWidth,
            text: text != "" ? text : null,
            likesCount: 0,
            commentsCount: 0,
            creationDate: firebase.firestore.FieldValue.serverTimestamp(),
            profile: auth.currentUser.uid,
            username: auth.currentUser.displayName,
            profilePic: auth.currentUser.photoURL,
        }).then(async (docRef) => {
            // navigate to comment screen with the new comment
            // id = docRef.id;
            resolve(docRef.id);
        }).catch(function (error) {
            // console.log(error);
        });

        // return id;
    })
};


export { commentMemeOnPost, saveMemeToPost };