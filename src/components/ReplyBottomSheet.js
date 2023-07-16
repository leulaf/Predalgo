import React, {useEffect, useState, useContext, useMemo, useRef, useCallback} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput, Keyboard, InputAccessoryView } from 'react-native';
import uuid from 'react-native-uuid';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, collection, addDoc, updateDoc, increment } from "firebase/firestore";
import { firebase, db, storage } from '../config/firebase';

import {ThemeContext} from '../../context-store/context';
import { useNavigation } from '@react-navigation/native';

import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

// light mode icons
import UploadLight from '../../assets/upload_light.svg';
import CreateMemeLight from '../../assets/meme_create_light.svg';
import PostButtonLight from '../../assets/post_button_light.svg';
import LinkLight from '../../assets/link_light.svg';

// dark mode icons
import UploadDark from '../../assets/upload_dark.svg';
import CreateMemeDark from '../../assets/meme_create_dark.svg';
import PostButtonDark from '../../assets/post_button_dark.svg';
import LinkDark from '../../assets/link_dark.svg';

const commentTextOnPost = async (text, replyToProfile, postId, ) => {
    // add text post to database
    await addDoc(collection(db, "mainComments", postId, "comments"), {
        text: text,
        postId: postId,
        likesCount: 0,
        commentsCount: 0,
        creationDate: firebase.firestore.FieldValue.serverTimestamp(),
        profile: firebase.auth().currentUser.uid
    }).then(async (docRef) => {
        // navigate to comment screen with the new comment

    }).catch(function (error) {
        console.log(error);
    });
};

const ReplyBottomSheet = ({replyToPost, setReplyToPost, mainComment, secondaryComment}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const navigation = useNavigation();

    const inputAccessoryViewID = uuid.v4(); // maybe use uuid to generate this id

    const [textInputInFocus, setTextInputInFocus] = useState(false);
    const [textInputFullScreen, setTextInputFullScreen] = useState(false);

    let upload, createMeme, createMemeSmall, replyButton, link

    // icons
    if(theme == 'light'){
        link = <LinkLight width={25} height={25} marginLeft={10} marginRight={11} />;
        createMeme = <CreateMemeLight width={27} height={27} marginRight={7}/>;
        createMemeSmall = <CreateMemeLight width={23} height={23} marginRight={15} />;
        upload = <UploadLight width={28} height={28} marginRight={17}/>;
        replyButton = <PostButtonLight width={100} height={40} marginRight={8}/>;
    }else{
        link = <LinkDark width={25} height={25} marginLeft={10} marginRight={11} />;
        createMeme = <CreateMemeDark width={27} height={27} marginRight={7}/>;
        createMemeSmall = <CreateMemeDark width={23} height={23} marginRight={15} />;
        upload = <UploadDark width={28} height={28} marginRight={17} />;
        replyButton = <PostButtonDark width={100} height={40} marginRight={8}/>;
    }

    // ref
    const bottomSheetRef = useRef(null);
    const replyToPostRef = useRef(null);

    // variables
    const snapPoints = useMemo(() => ['15%', '80%', '99%'], []);

    // callbacks
    const handleSheetChanges = useCallback((index) => {
        // console.log('handleSheetChanges', index);
        if(index == 0){
            Keyboard.dismiss();
            setTextInputFullScreen(false);
        }else if(index == 1){
            // Open keyboard when bottom sheet is expanded
            replyToPostRef.current.focus();
            setTextInputFullScreen(false);
        }else if(index == 2){
            // Open keyboard when bottom sheet is expanded to fill screen
            replyToPostRef.current.focus();
            setTextInputFullScreen(true);
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

    const bottomButtons = () => (
        <View style={theme == 'light' ? styles.lightBottomContainer : styles.darkBottomContainer}>
        
        {/* Upload, Link, Create Meme Buttons */}
        <View style={{ flex: 1, flexDirection: 'row', marginTop: 6, justifyContent: 'flex-start' }}>
            

            
            
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
                    onPress={() => navigation.navigate("Upload")}
                >
                {upload}
            </TouchableOpacity>   
            
            



            {/* Create Meme Button */}
            <TouchableOpacity
                style={{flexDirection: 'row',    justifyContent: 'center' }}
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
            style={{alignItems: 'flex-end'}}
            onPress={ async() =>
                    {
                        if(imageUrl){
                            await uploadImageComment()
                        }else{
                            await uploadTextComment()
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
                    // automaticallyAdjustKeyboardInsets={true}
                    style={theme == 'light' ? styles.lightReplyToPostContainer : styles.darkReplyToPostContainer}
                >
                    <View 
                        style={[
                            theme == 'light' ? styles.lightReplyToPostBar : styles.darkReplyToPostBar,
                            { height: textInputInFocus ? 
                                textInputFullScreen ? 422 : 270 : 
                                40
                            }
                        ]}
                    >
                                
                        <TextInput
                            ref={(input) => { replyToPostRef.current = input; }}
                            inputAccessoryViewID={inputAccessoryViewID}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onFocus={() => handleFocus() }   //focus received
                            onBlur={() =>  handleBlur() }     //focus lost
                            maxLength={2000}
                            multiline={true}
                            style={[
                                theme == 'light' ? styles.lightInputStyle : styles.darkInputStyle, 
                                { height: textInputInFocus ? 
                                    textInputFullScreen ? 410 : 260 : 
                                    35
                                }
                            ]} 
                            placeholder="Reply to post"
                            value={replyToPost}
                            placeholderTextColor={theme == "light" ? "#666666" : "#AAAAAA"}
                            onChangeText={newTerm => setReplyToPost(newTerm)}
                            onSubmitEditing={() => {}}
                            // onEndEditing={(newTerm) => props.updateSeach(newTerm.nativeEvent.text)}
                        />

                        {
                            textInputInFocus ?
                                null
                            :
                                <TouchableOpacity
                                    onPress = {() => replyToPostRef.current.focus()}
                                > 
                                    {createMemeSmall}
                                </TouchableOpacity>
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

                </View>

            </BottomSheet>
    );
};

const styles = StyleSheet.create({
    lightBottomSheet: {
        marginBottom: 2,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
    },
    darkBottomSheet: {
        marginBottom: 2,
        flexDirection: 'column',
        backgroundColor: '#141414',
    },
    lightReplyToPostContainer: {
        // flex: 1,
        // flexDirection: 'column',
        backgroundColor: '#FFFFFF',
    },
    darkReplyToPostContainer: {
        // flex: 1,
        backgroundColor: '#141414',
    },
    lightReplyToPostBar: {
        height: 40,
        width: "95%",
        borderRadius: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: '#FBFBFB',
        borderWidth: 1,
        borderColor: '#EDEDED',
    },
    darkReplyToPostBar: {
        height: 40,
        width: "95%",
        borderRadius: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: '#202020',
        borderWidth: 1,
        borderColor: '#262626',
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
        // marginVertical: 10,
        marginBottom: 3,
    },
    darkBottomContainer: {
        flexDirection: 'row',
        // alignSelf: 'flex-end',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: '#141414',
        // backgroundColor: '#1C1C1C',
        // marginVertical: 10,
        marginBottom: 3,
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
        color: '#F4F4F4',
        fontSize: 19,
        fontWeight: '500',
        // alignSelf: 'center',
        marginBottom: 6,
        // marginRight: 8,
        // marginTop: 10,
    },
});

export default ReplyBottomSheet;
