import React, {useEffect, useState, useContext, useMemo, useRef, useCallback} from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, TextInput, Keyboard, InputAccessoryView, Dimensions } from 'react-native';
import uuid from 'react-native-uuid';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, collection, addDoc, updateDoc, increment } from "firebase/firestore";
import { firebase, db, storage } from '../config/firebase';

import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';

import BottomSheet, {BottomSheetScrollView, BottomSheetTextInput} from '@gorhom/bottom-sheet';

// light mode icons
import UploadLight from '../../assets/upload_light.svg';
import CreateMemeLight from '../../assets/meme_create_light.svg';
import PostButtonLight from '../../assets/reply_light.svg';
import LinkLight from '../../assets/link_light.svg';

// dark mode icons
import UploadDark from '../../assets/upload_dark.svg';
import CreateMemeDark from '../../assets/meme_create_dark.svg';
import PostButtonDark from '../../assets/reply_dark.svg';
import LinkDark from '../../assets/link_dark.svg';

import { getAuth, updateProfile } from "firebase/auth";

const auth = getAuth();

const win = Dimensions.get('window');

// Comment text on a post
const commentTextOnPost = async (text, replyToProfile, postId, replyToUsername ) => {

    let id
    // add text post to database
    await addDoc(collection(db, "mainComments", postId, "comments"), {
        replyToPostId: postId,
        replyToProfile: replyToProfile,
        replyToUsername: replyToUsername,
        text: text,
        likesCount: 0,
        commentsCount: 0,
        creationDate: firebase.firestore.FieldValue.serverTimestamp(),
        profile: auth.currentUser.uid,
        username: auth.currentUser.displayName,
        profilePic: auth.currentUser.photoURL,
    }).then(async (docRef) => {
        // navigate to comment screen with the new comment
        id = docRef.id;
    }).catch(function (error) {
        // console.log(error);
    });

    return {
        commentId: id,
        replyToPostId: postId,
        replyToProfile: replyToProfile,
        replyToUsername: replyToUsername,
        text: text,
        likesCount: 0,
        commentsCount: 0,
        profile: auth.currentUser.uid,
        username: auth.currentUser.displayName,
        profilePic: auth.currentUser.photoURL,
    }
};

// Comment image on a post
const commentImageOnPost = async (url, replyToProfile, postId, replyToUsername ) => {
    // add text post to database
    await addDoc(collection(db, "mainComments", postId, "comments"), {
        replyToPostId: postId,
        replyToProfile: replyToProfile,
        replyToUsername: replyToUsername,
        imageUrl: url,
        likesCount: 0,
        commentsCount: 0,
        creationDate: firebase.firestore.FieldValue.serverTimestamp(),
        profile: auth.currentUser.uid,
        username: auth.currentUser.displayName,
        profilePic: auth.currentUser.photoURL,
    }).then(async (docRef) => {
        // navigate to comment screen with the new comment

    }).catch(function (error) {
        // console.log(error);
    });
};

// Comment text on a comment
const commentTextOnComment = async (text, replyToProfile, commentId, replyToUsername ) => {
    // add text post to database
    const {id} = await addDoc(collection(db, "mainComments", postId, "comments"), {
        replyToCommentId: commentId,
        replyToProfile: replyToProfile,
        replyToUsername: replyToUsername,
        text: text,
        likesCount: 0,
        commentsCount: 0,
        creationDate: firebase.firestore.FieldValue.serverTimestamp(),
        profile: auth.currentUser.uid,
        username: auth.currentUser.displayName,
        profilePic: auth.currentUser.photoURL,
    }).then(async (docRef) => {
        // navigate to comment screen with the new comment
    }).catch(function (error) {
        // console.log(error);
    });

    return {
        commentId: id,
        replyToCommentId: commentId,
    }
};

// Comment text on a comment
const commentImageOnComment = async (url, replyToProfile, commentId, replyToUsername ) => {
    // add text post to database
    await addDoc(collection(db, "mainComments", postId, "comments"), {
        replyToCommentId: commentId,
        replyToProfile: replyToProfile,
        replyToUsername: replyToUsername,
        imageUrl: url,
        likesCount: 0,
        commentsCount: 0,
        creationDate: firebase.firestore.FieldValue.serverTimestamp(),
        profile: auth.currentUser.uid,
        username: auth.currentUser.displayName,
        profilePic: auth.currentUser.photoURL,
    }).then(async (docRef) => {
        // navigate to comment screen with the new comment

    }).catch(function (error) {
        // console.log(error);
    });
};

const PostReplyBottomSheet = ({navigation, postId, replyToProfile, replyToUsername}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const {imageForPost, setImageForPost} = useContext(AuthenticatedUserContext);
    const [replyTextToPost, setReplyTextToPost] = useState("");
    const [replyImageToPost, setReplyImageToPost] = useState("");
    const [replyMemeToPost, setReplyMemeToPost] = useState("");

    const inputAccessoryViewID = uuid.v4(); // maybe use uuid to generate this id

    const [textInputInFocus, setTextInputInFocus] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);

    let upload, createMeme, createMemeSmall, replyButton, link

    // icons
    if(theme == 'light'){
        link = <LinkLight width={30.5} height={30.5} marginLeft={8} marginRight={7} />;
        createMeme = <CreateMemeLight width={27} height={27} marginRight={7}/>;
        createMemeSmall = <CreateMemeLight width={23} height={23} marginRight={15} />;
        upload = <UploadLight width={28} height={28} marginRight={17}/>;
        replyButton = <PostButtonLight width={95} height={35} marginRight={8}/>;
    }else{
        link = <LinkDark width={30.5} height={30.5} marginLeft={8} marginRight={8.5} />;
        createMeme = <CreateMemeDark width={27} height={27} marginRight={7}/>;
        createMemeSmall = <CreateMemeDark width={23} height={23} marginRight={15} />;
        upload = <UploadDark width={28} height={28} marginRight={17} />;
        replyButton = <PostButtonDark width={95} height={35} marginRight={8}/>;
    }

    // ref
    const bottomSheetRef = useRef(null);
    const replyTextToPostRef = useRef(null);

    // variables
    const snapPoints = useMemo(() => ['15%', '99%'], []);

    useEffect(() => {
        if(imageForPost){
            setReplyImageToPost(imageForPost);
            setImageForPost(null);
            bottomSheetRef.current.snapToIndex(1);
        }
    }, [imageForPost, setImageForPost])

    // callbacks
    const handleSheetChanges = useCallback((index) => {
        // console.log('handleSheetChanges', index);
        if(index == 0){
            Keyboard.dismiss();
            setCurrentIndex(0);
        }else if(index == 1){
            // Open keyboard when bottom sheet is expanded
            replyTextToPostRef.current.focus();
            setCurrentIndex(1);
        }
    }, []);

    // Expand the bottom sheet when the text input is focused
    const handleFocus = () => {
        bottomSheetRef.current.snapToIndex(1);
        setTextInputInFocus(true);
    }
    
    // Collapse the bottom sheet when the text input is blurred (Not in focus)
    const handleBlur = () => {
        bottomSheetRef.current.snapToIndex(0);
        setTextInputInFocus(false);
    }

    // Comment text on a post
    const commentTextOnPost = async (text, replyToProfile, postId, replyToUsername ) => {

        let id
        // add text post to database
        await addDoc(collection(db, "mainComments", postId, "comments"), {
            replyToPostId: postId,
            replyToProfile: replyToProfile,
            replyToUsername: replyToUsername,
            text: text,
            likesCount: 0,
            commentsCount: 0,
            creationDate: firebase.firestore.FieldValue.serverTimestamp(),
            profile: auth.currentUser.uid,
            username: auth.currentUser.displayName,
            profilePic: auth.currentUser.photoURL,
        }).then(async (docRef) => {
            // navigate to comment screen with the new comment
            id = docRef.id;
        }).catch(function (error) {
            // console.log(error);
        });
        setReplyTextToPost("");
        navigation.navigate("Comment", {
            commentId: id,
            replyToPostId: postId,
            replyToProfile: replyToProfile,
            replyToUsername: replyToUsername,
            text: text,
            likesCount: 0,
            commentsCount: 0,
            profile: auth.currentUser.uid,
            username: auth.currentUser.displayName,
            profilePic: auth.currentUser.photoURL,
        })
    };


    const bottomButtons = () => (
        <View style={theme == 'light' ? styles.lightBottomContainer : styles.darkBottomContainer}>
        
        {/* Upload, Link, Create Meme Buttons */}
        <View style={{ flex: 1, flexDirection: 'row', marginBottom: 1}}>
            

            
            
            {/* Link Button */}
            <TouchableOpacity
                    // style={{flexDirection: 'row',}}
                    onPress={() => navigation.navigate("Upload")}
                >
                {link}
            </TouchableOpacity>




            {/* Upload Button */}
            <TouchableOpacity
                    // style={{flexDirection: 'row',}}
                    onPress={() => 
                        navigation.navigate("Upload", {
                            forComment: true,
                        })
                    }
                >
                {upload}
            </TouchableOpacity>   
            
            



            {/* Create Meme Button */}
            <TouchableOpacity
                style={{flexDirection: 'row',  flex: 1 }}
                // onPress={onPress}
            >
                {createMeme}
                
                <Text marginBottom={0} style={theme == 'light' ? styles.lightBottomText : styles.darkBottomText}>
                    Memes
                </Text>

            </TouchableOpacity>

            



        </View>


        {/* Reply Button */}
        <TouchableOpacity
            style={{marginBottom: 6}}
            onPress={ () =>
                    {
                        Keyboard.dismiss();
                        bottomSheetRef.current.snapToIndex(0);

                        if(replyTextToPost){
                            commentTextOnPost(
                                replyTextToPost,
                                replyToProfile,
                                postId,
                                replyToUsername,
                            ).catch(function (error) {
                                // console.log(error);
                            });
                        }else{
                            uploadImageComment()
                        }
                    }
                }
        >
            {replyButton}
        </TouchableOpacity>
        


        </View>
    );

    return (
            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                // style={{backgroundColor: theme == 'light' ? styles.lightContainer : styles.darkContainer}}
                backgroundStyle={theme == 'light' ? styles.lightBottomSheet : styles.darkBottomSheet}
                handleIndicatorStyle={{backgroundColor: theme == 'light' ? '#DDDDDD' : '#2D2D2D'}}
            >
                <View 
                    automaticallyAdjustKeyboardInsets={true}
                    contentContainerStyle={theme == 'light' ? styles.lightReplyTextToPostContainer : styles.darkReplyTextToPostContainer}
                >
                    <View 
                        style={[
                            theme == 'light' ? 
                                (currentIndex == 1 || textInputInFocus ? 
                                    replyImageToPost ? styles.lightFocusReplyTextImagePostBar : styles.lightFocusReplyTextPostBar
                                    : 
                                    styles.lightReplyTextPostBar)
                                :


                                (currentIndex == 1 || textInputInFocus ? 
                                    
                                    
                                    replyImageToPost ? styles.darkFocusReplyTextImagePostBar : styles.darkFocusReplyTextPostBar
                                    : 
                                    styles.darkReplyTextPostBar),
                        ]}
                    >
                                
                        <BottomSheetTextInput
                            ref={(input) => { replyTextToPostRef.current = input; }}
                            inputAccessoryViewID={inputAccessoryViewID}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onFocus={() => handleFocus() }   //focus received
                            onBlur={() =>  handleBlur() }     //focus lost
                            maxLength={2000}
                            multiline={true}
                            style={[
                                theme == 'light' ? styles.lightInputStyle : styles.darkInputStyle, 
                                { height: !textInputInFocus ? 35 :

                                    (replyImageToPost ? 225 : 415)
                                    
                                }
                            ]} 
                            placeholder="Reply to post"
                            value={replyTextToPost}
                            placeholderTextColor={theme == "light" ? "#666666" : "#AAAAAA"}
                            onChangeText={newTerm => setReplyTextToPost(newTerm)}
                            // onEndEditing={(newTerm) => 
                            //     commentTextOnPost(
                            //         newTerm,
                            //         replyToProfile,
                            //         postId,
                            //         replyToUsername,
                            //     ).then((comment) => {
                            //         
                            //         bottomSheetRef.current.snapToIndex(0);
                            //     })
                            // }
                        />

                        {
                            textInputInFocus ?
                                null
                            :
                                <TouchableOpacity
                                    onPress = {() => replyTextToPostRef.current.focus()}
                                > 
                                    {createMemeSmall}
                                </TouchableOpacity>
                        }
                            

                    </View>
                    
                    {
                        (replyImageToPost && currentIndex != 0) &&
                        <Image 
                            source={{uri : replyImageToPost.uri}}
                            // resizeMode='contain'
                            style={{
                                height: (replyImageToPost.height * (win.width / replyImageToPost.width)) * 0.5,
                                width: win.width * 0.5,
                                alignSelf: 'center',
                                borderRadius: 10,
                                marginTop: 10,
                            }}
                        />
                    }
                    

                </View>

                {/* Show bottom buttons only when text input is clicked */}
                {
                    textInputInFocus ?
                        <InputAccessoryView nativeID={inputAccessoryViewID}>
                            {bottomButtons()}
                        </InputAccessoryView>
                    :
                        null
                }

            </BottomSheet>
    );
};

const styles = StyleSheet.create({
    lightBottomSheet: {
        marginBottom: 10,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
    },
    darkBottomSheet: {
        marginBottom: 10,
        flexDirection: 'column',
        backgroundColor: '#141414',
    },
    lightReplyTextToPostContainer: {
        // flex: 1,
        // flexDirection: 'column',
        backgroundColor: '#FFFFFF',
    },
    darkReplyTextToPostContainer: {
        // flex: 1,
        backgroundColor: '#141414',
    },
    lightReplyTextPostBar: {
        height: 40,
        width: "95%",
        borderRadius: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#EDEDED',
    },
    darkReplyTextPostBar: {
        height: 40,
        width: "95%",
        borderRadius: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: '#202020',
        borderWidth: 1,
        borderColor: '#262626',
    },
    lightFocusReplyTextPostBar: {
        height: 425,
        width: "98%",
        borderRadius: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    darkFocusReplyTextPostBar: {
        height: 425,
        width: "98%",
        borderRadius: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    lightFocusReplyTextImagePostBar: {
        height: 235,
        width: "98%",
        borderRadius: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    darkFocusReplyTextImagePostBar: {
        height: 235,
        width: "98%",
        borderRadius: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    lightInputStyle: {
        flex: 1,
        // height: 40,
        fontSize: 18,
        fontWeight: "400",
        marginHorizontal: 12,
        // marginVertical: 20,
        // alignSelf: 'center',
        color: '#222222',
    },
    darkInputStyle: {
        flex: 1,
        // height: 40,
        fontSize: 18,
        fontWeight: "400",
        marginHorizontal: 12,
        // marginVertical: 13,
        // alignSelf: 'center',
        color: '#F4F4F4',
    },
    lightBottomContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        // alignSelf: 'flex-end',
        alignItems: 'center',
        alignContent: 'center',
        height: 40,
        // marginVertical: 10,
        // marginBottom: 3,
        // marginTop: 6
        // marginBottom: 4
    },
    darkBottomContainer: {
        flexDirection: 'row',
        // alignSelf: 'flex-end',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: '#141414',
        height: 40,
        // backgroundColor: '#1C1C1C',
        // marginVertical: 10,
        // marginBottom: 3,
        // marginTop: 6
        // marginBottom: 4
    },
    lightBottomText: {
        color: '#666666',
        fontSize: 19,
        fontWeight: '500',
        marginBottom: 6,
        // alignSelf: 'center',
        // marginRight: 8,
        // marginTop: 10,
    },
    darkBottomText: {
        color: '#EEEEEE',
        fontSize: 19,
        fontWeight: '500',
        // alignSelf: 'center',
        marginBottom: 6,
        // marginRight: 8,
        // marginTop: 10,
    },
});

export default PostReplyBottomSheet;
