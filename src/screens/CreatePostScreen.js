import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView, Image, Dimensions, TouchableOpacity, Alert} from 'react-native';
import {ThemeContext} from '../../context-store/context';
import { db, storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, collection, addDoc, updateDoc, increment } from "firebase/firestore";

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

const win = Dimensions.get('window');

const CreatePostScreen = ({navigation, route}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [title, setTitle] = React.useState('');
    const [text, setText] = React.useState('');
    const {imageUrl, imageUrls} = route.params;
    const [tempTags, setTempTags] = React.useState('');
    const [uploading, setUploading] = useState(false)
    const [correctTags, setCorrectTags] = React.useState([]);
    const [expandImage, setExpandImage] = React.useState(false);
    
    async function uploadImagePost() {
        setUploading(true)
        Alert.alert("Post being uploaded, please wait...");
        
        // Convert image to blob format(array of bytes)
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const filename = imageUrl.substring(imageUrl.lastIndexOf('/')+1);
        const childPath = `posts/users/${firebase.auth().currentUser.uid}/${filename}`;
        
        const storageRef = ref(storage, childPath);
        const uploadTask =  uploadBytesResumable(storageRef, blob)
        .catch ((e) => {
            console.log(e);
        })


        uploadTask.then((snapshot) => {
            // console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            // console.log('File metadata:', snapshot.metadata);
            // Let's get a download URL for the file.
            getDownloadURL(snapshot.ref).then((url) => {
                // console.log(imageUrl);
                // console.log('File available at', url);
                saveImagePostData(url);
            });
        }).catch((error) => {
            console.error('Upload failed', error);
            // ...
        });
    };


    const saveImagePostData = async (url) => {
        // Add a new document in collection "posts"->"userId"->"userPosts" with a generated id for the post.
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


    const uploadTextPost = async () => {
        // Add a new document in collection "posts"->"userId"->"userPosts" with a generated id for the post.
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
        content = <TextInput
            style={theme == 'light' ? styles.lightTextInput : styles.darkTextInput}
            multiline
            maxLength={10000}
            blurOnSubmit
            autoCapitalize="none"
            autoCorrect
            placeholder=" Type your post here..."
            placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
            value={text}
            onChangeText={(newValue) => setText(newValue)}
        />
    }




    return (
        <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
            
            
            
            
            <ScrollView automaticallyAdjustKeyboardInsets={true} style={theme == 'light' ? styles.lightPostContainer : styles.darkPostContainer}>
                
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
                <View style={{borderBottomColor: '#CCCCCC', borderBottomWidth: 2, marginHorizontal: 10,}}/>




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




                <View style={{flexDirection: 'row', marginTop: 90}}>


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
                
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
  lightContainer: {
      height: '100%',
      backgroundColor: '#F4F4F4',
      flexDirection: 'column',
  },
  darkContainer: {
      height: '100%',
      backgroundColor: '#282828',
      flexDirection: 'column',
  },
  lightPostContainer: {
      marginTop: 70,
      marginBottom: 80,
      backgroundColor: '#fff',
      height: '80%',
      width: '97%',
      alignSelf: 'center',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#CCCCCC',
  },
  darkPostContainer: {
      marginTop: 70,
      marginBottom: 80,
      backgroundColor: '#1A1A1A',
      height: '80%',
      width: '97%',
      alignSelf: 'center',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#555555',
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
      color: '#444444',
      height: 40,
      margin: 10,
      fontSize: 20,
      fontWeight: '500',
  },
  darkTitleInput: {
      color: '#EEEEEE',
      height: 40,
      margin: 10,
      fontSize: 20,
      fontWeight: '500'
  },
  lightTextInput: {
      color: '#444444',
      height: 400,
      margin: 10,
      fontSize: 20,
      fontWeight: '500',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#CCCCCC',
  },
  darkTextInput: {
      color: '#EEEEEE',
      height: 400,
      margin: 10,
      fontSize: 20,
      fontWeight: '500',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#444444',
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
