import React from 'react';
import { db, storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, collection, addDoc, updateDoc, increment } from "firebase/firestore";

import uuid from 'react-native-uuid';

import firebase from 'firebase/compat/app';
require('firebase/firestore');

    
async function uploadImagePost(imageUrl, memeName, newTemplate, newTemplateImage, title, height, width, correctTags, setUploading) {

    // Convert image to blob format(array of bytes)
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const filename = uuid.v4();
    const childPath = `posts/users/${firebase.auth().currentUser.uid}/${filename}`;
    const metadata = {
        cacheControl: 'public,max-age=31536000',
    };
    const storageRef = ref(storage, childPath);
    const uploadTask = uploadBytesResumable(storageRef, blob, metadata)
    .catch ((e) => {
        console.log(e);
    });
    
    await uploadTask.then(async(snapshot) => {
        // console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        // console.log('File metadata:', snapshot.metadata);
        
        // Let's get a download URL for the file.
        
        getDownloadURL(snapshot.ref).then(async (url) => {
            // console.log(imageUrl);
            // console.log('File available at', url);
            
            if(memeName == null || memeName == undefined || memeName == ''){
                saveImagePostData(url);
            }else{
                if(newTemplate){
                    // upload new template image to storage imageTemplates folder
                    
                        // Convert image to blob format(array of bytes)
                    const newResponse = await fetch(newTemplateImage);
                    const newBlob = await newResponse.blob();

                    const newFilename = uuid.v4();
                    const newChildPath = `imageTemplates/${newFilename}`;
                    
                    const newStorageRef = ref(storage, newChildPath);

                    const metadata = {
                        cacheControl: 'public,max-age=31536000',
                    };
                    
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
                            await addNewTemplate(newUrl).then(async () => {
                                await saveMemePostData(url);
                            })
                        }).catch((error) => {
                            console.error('Upload failed', error);
                            // ...
                        });


                    }).catch((error) => {
                        console.error('Upload failed', error);
                        // ...
                    });
                }else{
                    saveMemePostData(url);
                }
            }
        });
    }).catch((error) => {
        console.error('Upload failed', error);
        // ...
    });
};
    
const saveImagePostData = async (url) => {

    // add text post to database
    await addDoc(collection(db, "allPosts"), {
        title: title,
        imageUrl: url,
        height: height,
        width: width,
        tags: correctTags,
        likesCount: 0,
        commentsCount: 0,
        creationDate: firebase.firestore.FieldValue.serverTimestamp(),
        profile: firebase.auth().currentUser.uid
    }).then(async (docRef) => {
        // update posts count for current user
        const currentUserRef = doc(db, 'users', firebase.auth().currentUser.uid);

        await updateDoc(currentUserRef, {
            posts: increment(1)
        });
        
        setUploading(false);
        Alert.alert("Post uploaded successfully!");
        navigation.goBack();
    }).catch(function (error) {
            console.log(error);
    });
};

const saveMemePostData = async (url) => {
    const {height, width} = await getHeightAndWidth(url);
    // add text post to database
    await addDoc(collection(db, "allPosts"), {
        title: title,
        imageUrl: url,
        height: height,
        width: width,
        memeName: memeName,
        tags: correctTags,
        likesCount: 0,
        commentsCount: 0,
        creationDate: firebase.firestore.FieldValue.serverTimestamp(),
        profile: firebase.auth().currentUser.uid
    }).then(async (docRef) => {
        // update posts count for current user
        const currentUserRef = doc(db, 'users', firebase.auth().currentUser.uid);

        await updateDoc(currentUserRef, {
            posts: increment(1)
        });
        
        setUploading(false);
        Alert.alert("Post uploaded successfully!");
        navigation.goBack();
    }).catch(function (error) {
            console.log(error);
    });
};
