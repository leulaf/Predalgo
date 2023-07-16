import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView, Image, Dimensions, TouchableOpacity, Alert} from 'react-native';
import {ThemeContext} from '../../context-store/context';
import { db, storage } from '../config/firebase';
import { manipulateAsync } from 'expo-image-manipulator';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, collection, addDoc, updateDoc, increment } from "firebase/firestore";

import uuid from 'react-native-uuid';

import firebase from 'firebase/compat/app';
require('firebase/firestore');

// light mode icons
import ExitIconLight from '../../assets/exit_light.svg';
import UploadLight from '../../assets/upload_light.svg';
import LinkLight from '../../assets/link_light.svg';
import CreateMemeLight from '../../assets/meme_create_light.svg';
import PostButtonLight from '../../assets/post_button_light.svg';
import ExpandImage from '../../assets/expand_image.svg';
import ShrinkImage from '../../assets/shrink_image.svg';

// dark mode icons
import ExitIconDark from '../../assets/exit_dark.svg';
import UploadDark from '../../assets/upload_dark.svg';
import LinkDark from '../../assets/link_dark.svg';
import CreateMemeDark from '../../assets/meme_create_dark.svg';
import PostButtonDark from '../../assets/post_button_dark.svg';

const CreatePostScreen = ({navigation, route}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [title, setTitle] = React.useState('');
    const [text, setText] = React.useState('');
    const {imageUrl, memeName, imageUrls, newTemplate, newTemplateImage} = route.params;
    const [tempTags, setTempTags] = React.useState('');
    const [uploading, setUploading] = useState(false)
    const [correctTags, setCorrectTags] = React.useState([]);
    const [expandImage, setExpandImage] = React.useState(false);

    const addNewTemplate = async (newUrl) => {
        const userRef = doc(db, "users", firebase.auth().currentUser.uid);
        const userSnap = await getDoc(userRef);
        const username = userSnap.data().username;
        
        const addTemplateRef = await addDoc(collection(db, "imageTemplates"), {
            name: memeName,
            uploader: username,
            url: newUrl,
            useCount: 1,
            creationDate: firebase.firestore.FieldValue.serverTimestamp(),
        });

        return "success";
    }
    
    async function uploadImagePost() {
        setUploading(true)
        Alert.alert("Post being uploaded, please wait...");
        
        // Convert image to blob format(array of bytes)
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const filename = uuid.v4();
        const childPath = `posts/users/${firebase.auth().currentUser.uid}/${filename}`;
        
        const storageRef = ref(storage, childPath);
        const uploadTask = uploadBytesResumable(storageRef, blob)
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
                        
                        const newUploadTask = uploadBytesResumable(newStorageRef, newBlob)
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
        // add text post to database
        await addDoc(collection(db, "allPosts"), {
            title: title,
            imageUrl: url,
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


    const uploadTextPost = async () => {
        // add text post to database
        await addDoc(collection(db, "allPosts"), {
            title: title,
            text: text,
            tags: correctTags,
            likesCount: 0,
            commentsCount: 0,
            creationDate: firebase.firestore.FieldValue.serverTimestamp(),
            profile: firebase.auth().currentUser.uid
        }).then(async (docRef) => {
            // update posts count for current user
            const currentUserRef = doc(db, 'users', firebase.auth().currentUser.uid);

            updateDoc(currentUserRef, {
                posts: increment(1)
            });

            setUploading(false);
            Alert.alert("Post uploaded successfully!");
            navigation.goBack();
        }).catch(function (error) {
            console.log(error);
        });
    };

    const fixTags = (tempTags) => {
        let newTags = tempTags.split(' ');
        let tags = [];
        newTags.forEach((tag) => {
            if(tag[0] == '@' && tag.length > 1){
                tags.push(tag);
            }else if(tag[0] == '#' && tag.length > 1){
                tags.push(tag);
            }
        })

        setTempTags(tags.join(' '));
        setCorrectTags(tags);
    };




    let exitIcon, upload, link, createMeme, postButton;




    if(theme == 'light'){
        exitIcon = <ExitIconLight width={50} height={50}  style={{marginLeft: 90, position: 'absolute'}} />;
        upload = <UploadLight width={35} height={35} style={{ marginLeft: 15, marginTop:4}}/>;
        link = <LinkLight width={35} height={35} style={{ marginLeft: 15, marginTop:4}}/>;
        createMeme = <CreateMemeLight width={33} height={33} style={{ marginLeft: 10, marginRight: 5, marginTop:5}}/>;
        postButton = <PostButtonLight width={115} height={40} style={{ marginLeft: 22, marginTop:2}}/>;
    }else{
        exitIcon = <ExitIconDark width={50} height={50} style={{marginLeft: 90, position: 'absolute'}}/>;
        upload = <UploadDark width={35} height={35} style={{ marginLeft: 15, marginTop:4}}/>;
        link = <LinkDark width={35} height={35} style={{ marginLeft: 15, marginTop:4}}/>;
        createMeme = <CreateMemeDark width={33} height={33} style={{ marginLeft: 10, marginRight: 5, marginTop:5}}/>;
        postButton = <PostButtonDark width={115} height={40} style={{ marginLeft: 22, marginTop:2}}/>;
    }




    let content;




    if(imageUrl){
        content = (
            <>
                {expandImage ?
                    <TouchableOpacity
                            style={{flexDirection: 'column',}}
                            onPress={() => setExpandImage(!expandImage)}
                    >

                        <Image source={{ uri: imageUrl }} style={styles.imageExpanded} />

                        <View style={{flexDirection: 'row', position:'absolute', marginLeft: 285, marginTop:30}}>
                            <ShrinkImage width={26} height={26}/>
                            <Text style={{fontSize: 22, marginHorizontal: 10, fontWeight: 'bold',color: 'white'}}>
                                Shrink
                            </Text>
                        </View>
                    </TouchableOpacity>
                :
                    <TouchableOpacity
                        style={{flexDirection: 'column',}}
                        onPress={() => setExpandImage(!expandImage)}
                    >
                    
                        <Image source={{ uri: imageUrl }} style={styles.imageShrinked}  width={395} height={350}/>

                        <View style={{flexDirection: 'row', position:'absolute', marginLeft: 275, marginTop:30}}>
                            <ExpandImage width={24} height={24}/>
                            <Text style={{fontSize: 22, marginHorizontal: 10, fontWeight: 'bold',color: 'white'}}>
                                Expand
                            </Text>
                        </View>




                    </TouchableOpacity>
                    
                }
            </>
        )
    }else{
        content = <View style={theme == 'light' ? styles.lightTextContainer : styles.darkTextContainer}>

            <TextInput
                style={theme == 'light' ? styles.lightTextInput : styles.darkTextInput}
                multiline
                maxLength={10000}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect
                placeholder="Type your post here..."
                placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
                value={text}
                onChangeText={(newValue) => setText(newValue)}
            />

        </View>
    }




    return (
        <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
            <View style={theme == 'light' ? styles.lightPostContainer : styles.darkPostContainer}>
                <ScrollView automaticallyAdjustKeyboardInsets={true} style={{}}>
                    
                    <View style={{flexDirection: 'row'}}>

                        {/* Profile image and @Username  */}
                        <Image source={require('../../assets/profile_default.png')} style={{width: 40, height: 40, margin: 10}}/>
                        <Text style={theme == 'light' ? styles.lightUsername : styles.darkUsername}>
                            @Username
                        </Text>
                        
                        {/* Exit Icon */}
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                        >
                            {exitIcon}
                        </TouchableOpacity>
                        
                    </View>




                    {/* Title input text */}
                    <TextInput
                        style={theme == 'light' ? styles.lightTitleInput : styles.darkTitleInput}
                        autoCapitalize="none"
                        multiline
                        blurOnSubmit
                        maxLength={80}
                        autoCorrect
                        placeholder="Title *Optional*"
                        placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
                        value={title}
                        onChangeText={(newValue) => setTitle(newValue)}
                    />




                    {/* line break */}
                    <View style={{borderBottomColor: '#CCCCCC', borderBottomWidth: 1, marginHorizontal: 10,}}/>




                    {/* Content of the post, TextInput, Image */}
                    {content}




                    {/* Hashtags and mentions*/}
                    <TextInput
                        style={theme == 'light' ? styles.lightTitleInput : styles.darkTitleInput}
                        autoCapitalize="none"
                        autoCorrect
                        placeholder="@mentions #hashtags"
                        placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
                        value={tempTags}
                        onChangeText={(newValue) => setTempTags(newValue)}
                        onEndEditing={() => fixTags(tempTags)}
                    />


                </ScrollView>

                

                <View style={theme == 'light' ? styles.lightBottomContainer : styles.darkBottomContainer}>


                    <TouchableOpacity
                        style={{flexDirection: 'row',}}
                        // onPress={onPress}




                    >
                        {createMeme}
                        <Text marginBottom={15} width={61} style={theme == 'light' ? styles.lightBottomText : styles.darkBottomText}>
                            Memes
                        </Text>
                    </TouchableOpacity>




                    <TouchableOpacity
                            style={{flexDirection: 'row',}}
                            onPress={() => navigation.navigate("Upload")}
                        >
                        {upload}
                    </TouchableOpacity>                




                    <TouchableOpacity
                        style={{flexDirection: 'row',}}
                        // onPress={onPress}




                    >
                        {link}
                        <Text marginBottom={15} style={theme == 'light' ? styles.lightBottomText : styles.darkBottomText}>
                            Link
                        </Text>
                    </TouchableOpacity>



                    <TouchableOpacity
                        style={{flexDirection: 'row',}}
                        onPress={ async() =>
                                {
                                    if(imageUrl){
                                        await uploadImagePost()
                                    }else{
                                        await uploadTextPost()
                                    }
                                }
                            }
                    >
                        {postButton}
                    </TouchableOpacity>
                    
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    lightContainer: {
        flex: 1,
        backgroundColor: '#FBFBFB',
    },
    darkContainer: {
        flex: 1,
        backgroundColor: '#181818',
    },
    lightPostContainer: {
        marginTop: 70,
        height: '85%',
        width: '98%',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D4D4D4',
    },
    darkPostContainer: {
        marginTop: 70,
        height: '85%',
        width: '98%',
        flexDirection: 'column',
        backgroundColor: '#1C1C1C',
        alignSelf: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#333333',
    },
    lightBottomContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        marginBottom: 5,
    },
    darkBottomContainer: {
        flexDirection: 'row',
        backgroundColor: '#1C1C1C',
        marginBottom: 5,
    },
    lightUsername: {
        fontSize: 18,
        width: 200,
        fontWeight: '500',
        color: '#5F5F5F',
        alignSelf: 'center',
    },
    darkUsername: {
        fontSize: 18,
        width: 200,
        fontWeight: '500',
        color: '#EEEEEE',
        alignSelf: 'center',
    },
    lightTitleInput: {
        color: '#555555',
        height: 40,
        marginHorizontal: 13,
        fontSize: 24,
        fontWeight: '500',
    },
    darkTitleInput: {
        color: '#EEEEEE',
        height: 40,
        marginHorizontal: 13,
        fontSize: 24,
        fontWeight: '500'
    },
    lightTextContainer: {
        color: '#444444',
        height: 400,
        margin: 7,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DDDDDD',
    },
    darkTextContainer: {
        color: '#EEEEEE',
        height: 400,
        margin: 7,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#333333'
    },
    lightTextInput: {
        color: '#666666',
        height: 400,
        fontSize: 22,
        marginHorizontal: 10,
        fontWeight: '500',
    },
    darkTextInput: {
        color: '#EEEEEE',
        height: 400,
        fontSize: 22,
        marginHorizontal: 10,
        fontWeight: '500',
    },
    imageShrinked: {
        alignSelf: "center",
        borderRadius: 15,
        marginTop: 20,
        marginBottom: 50,
    },
    imageExpanded: {
        //   flex: 1,
        alignSelf: "center",
        resizeMode: "contain",
        borderRadius: 15,
        marginTop: 20,
        marginBottom: 50,
        width: "100%",
        height: 400,
    },
    lightBottomText: {
        color: '#666666',
        fontSize: 18,
        fontWeight: '500',
        alignSelf: 'center',
        marginLeft: 5,
        marginTop: 10,
    },
    darkBottomText: {
        color: '#DDDDDD',
        fontSize: 18,
        fontWeight: '500',
        alignSelf: 'center',
        marginLeft: 5,
        marginTop: 10,
    },
});




export default CreatePostScreen;
