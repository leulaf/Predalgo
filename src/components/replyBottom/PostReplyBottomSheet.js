import React, {useEffect, useState, useContext, useMemo, useRef, useCallback} from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, TextInput, Keyboard, InputAccessoryView, Dimensions, Alert } from 'react-native';
import uuid from 'react-native-uuid';

import { commentImageOnPost } from '../../shared/comment/UploadImageComment';
import { commentTextOnPost } from '../../shared/comment/UploadTextComment';

import {ThemeContext, AuthenticatedUserContext} from '../../../context-store/context';

import BottomSheet, {BottomSheetScrollView, BottomSheetTextInput} from '@gorhom/bottom-sheet';


// light mode icons
import UploadLight from '../../../assets/upload_light.svg';
import CreateMemeLight from '../../../assets/meme_create_light.svg';
import PostButtonLight from '../../../assets/reply_light.svg';
import LinkLight from '../../../assets/link_light.svg';

// dark mode icons
import UploadDark from '../../../assets/upload_dark.svg';
import CreateMemeDark from '../../../assets/meme_create_dark.svg';
import PostButtonDark from '../../../assets/reply_dark.svg';
import LinkDark from '../../../assets/link_dark.svg';

import { getAuth } from "firebase/auth";


const auth = getAuth();

const win = Dimensions.get('window');


const PostReplyBottomSheet = ({navigation, replyToPostId, replyToProfile, replyToUsername}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const {imageForPost, setImageForPost} = useContext(AuthenticatedUserContext);
    const [replyTextToPost, setReplyTextToPost] = useState("");
    const [replyImageToPost, setReplyImageToPost] = useState("");
    const [replyMemeToPost, setReplyMemeToPost] = useState("");

    const inputAccessoryViewID = uuid.v4(); // maybe use uuid to generate this id

    const [textInputInFocus, setTextInputInFocus] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [count, setCount] = useState(0);

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
    const snapPoints = useMemo(() => ['15%', '70%', '99%'], []);

    useEffect(() => {
        if(imageForPost){
            setReplyImageToPost(imageForPost);
            setImageForPost(null);
            // console.log("imageForPost");


            // replyTextToPostRef.current.focus();
            // setTextInputInFocus(true);
            // setCurrentIndex(2);
            bottomSheetRef.current.snapToIndex(2);
            // handleSheetAnimate(0, 2);
            // handleSheetChanges(2);
        }
    }, [imageForPost, setImageForPost])

    // callbacks
    const handleSheetChanges = useCallback((index) => {
        // console.log('handleSheetChanges', index);
        // if(index == 0){
        //     Keyboard.dismiss();
        //     setCurrentIndex(0);
        //     setTextInputInFocus(false);
        // }else if(index == 1){
        //     // Open keyboard when bottom sheet is expanded
        //     replyTextToPostRef.current.focus();
        //     setCurrentIndex(1);
        //     setTextInputInFocus(true);
        // }else if(index == 2){
        //     replyTextToPostRef.current.focus();
        //     setCurrentIndex(2);
        //     setTextInputInFocus(true);
        // }
    }, []);

    // Makes sure the keyboard is open when the bottom sheet is expanded
    const handleSheetAnimate = useCallback((from, to) => {
        // console.log('handleSheetAnimate', from, to);
        
        if(to == 0){
            Keyboard.dismiss();
            setCurrentIndex(0);
            setTextInputInFocus(false);
        }else if(to == 1){
            // Open keyboard when bottom sheet is expanded

            replyTextToPostRef.current.focus();

            setCurrentIndex(1);
            setTextInputInFocus(true);
        }else{
            // replyTextToPostRef.current.focus();
            setTextInputInFocus(true);
            setCurrentIndex(2);

            replyTextToPostRef.current.focus();
            

        }
        
    }, [snapPoints]);

    // Expand the bottom sheet when the text input is focused
    const handleFocus = () => {

        if(replyImageToPost){
            bottomSheetRef.current.snapToIndex(2);

        }else{
            bottomSheetRef.current.snapToIndex(1);

        }
        setTextInputInFocus(true);
    }
    
    // Collapse the bottom sheet when the text input is blurred (Not in focus)
    const handleBlur = () => {

        // console.log("handleBlur + " + count);

        // if(count == 1){
        //     replyTextToPostRef.current.focus();
        //     setCount(0);
        //     return
        // }


        // Keyboard.dismiss();
        bottomSheetRef.current.snapToIndex(0);
    }

    const onReplyWithText = async () => {

        await commentTextOnPost(
            replyTextToPost,
            replyToPostId,
            replyToProfile,
            replyToUsername,
        ).catch(function (error) {
            // console.log(error);
        }).then(async (id) => {
            
            const text = replyTextToPost;

            // clear reply text
            setReplyTextToPost("");

            // navigate to comment screen with the new comment
            navigation.navigate("Comment", {
                commentId: id,
                replyToPostId: replyToPostId,
                replyToProfile: replyToProfile,
                replyToUsername: replyToUsername,
                text: text,
                likesCount: 0,
                commentsCount: 0,
                profile: auth.currentUser.uid,
                username: auth.currentUser.displayName,
                profilePic: auth.currentUser.photoURL,
            });

        });

    }

    const onReplyWithImage = async () => {

        await commentImageOnPost(
            replyImageToPost.uri,
            replyTextToPost,
            replyToPostId,
            replyToProfile,
            replyToUsername,
            replyImageToPost.height,
            replyImageToPost.width,
        ).catch(function (error) {
            // console.log(error);
        }).then(async (result) => {
            
            const text = replyTextToPost;

            // clear reply text and image
            setReplyImageToPost(null);
            setReplyTextToPost("");
                                            
            // navigate to comment screen with the new comment
            navigation.navigate("Comment", {
                commentId: result.id,
                replyToPostId: replyToPostId,
                replyToProfile: replyToProfile,
                replyToUsername: replyToUsername,
                imageUrl: result.url,
                imageHeight: replyImageToPost.height,
                imageWidth: replyImageToPost.width,
                text: text,
                likesCount: 0,
                commentsCount: 0,
                profile: auth.currentUser.uid,
                username: auth.currentUser.displayName,
                profilePic: auth.currentUser.photoURL,
            });

        });

    }


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
            onPress={ async () =>
                    {
                        Keyboard.dismiss();
                        bottomSheetRef.current.snapToIndex(0);

                        if(replyImageToPost){
                            
                            await onReplyWithImage();

                        }else{

                            await onReplyWithText();

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
                onAnimate={handleSheetAnimate}
                onChange={() => handleSheetChanges}
                keyboardBehavior="interactive"
                style={{
                    backgroundColor: theme == 'light' ? 'white' : '#141414',  // <==== HERE
                    borderRadius: 24,
                    shadowColor: theme == 'light' ? '#005FFF' : '#DDDDDD',
                    shadowOffset: {
                      width: 0,
                      height: theme == 'light' ? 4 : 6,
                    },
                    shadowOpacity: theme == 'light' ? 0.4 : 0.2,
                    shadowRadius: 12,
                    elevation: 5,
                }}
                // style={{backgroundColor: theme == 'light' ? styles.lightContainer : styles.darkContainer}}
                backgroundStyle={theme == 'light' ? styles.lightBottomSheet : styles.darkBottomSheet}
                handleIndicatorStyle={{backgroundColor: theme == 'light' ? '#DDDDDD' : '#2D2D2D'}}
            >
                <View 
                    automaticallyAdjustKeyboardInsets={true}
                    // contentContainerStyle={theme == 'light' ? styles.lightReplyTextToPostContainer : styles.darkReplyTextToPostContainer}
                >
                    <View 
                        style={[
                            theme == 'light' ? 
                                (textInputInFocus ? 
                                        replyImageToPost ? 
                                            styles.lightFocusReplyTextImagePostBar
                                        :
                                            currentIndex == 1 ? {...styles.lightFocusReplyTextPostBar, height: 235} : styles.lightFocusReplyTextPostBar
                                    : 
                                        styles.lightReplyTextPostBar
                                )


                                :


                                (textInputInFocus ? 
                                    
                                    
                                        replyImageToPost ? 
                                                styles.darkFocusReplyTextImagePostBar
                                            :
                                                currentIndex == 1 ? {...styles.darkFocusReplyTextPostBar, height: 235} : styles.darkFocusReplyTextPostBar
                                    :
                                        styles.darkReplyTextPostBar
                                ),
                        ]}
                    >
                        {/* <BottomSheetTextInput */}
                        <TextInput
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

                                    (replyImageToPost ? 225 

                                        : 

                                        currentIndex == 1 ? 225 : 415
                                    )
                                    
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
                            //         replyToPostId,
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
                                    onPress = {() => handleFocus()}
                                > 
                                    {createMemeSmall}
                                </TouchableOpacity>
                        }
                            

                    </View>
                    
                    {
                        (replyImageToPost && currentIndex != 0) &&
                        <TouchableOpacity
                            onPress={() => 

                                {
                                    navigation.navigate("EditImage", ('EditImage', {
                                    imageUrl: replyImageToPost.undeditedUri,
                                    height: replyImageToPost.height,
                                    width: replyImageToPost.width,
                                    imageState: replyImageToPost.imageState,
                                    forComment: true,
                                    cameraPic: false,
                                    dontCompress: true,
                                }))}

                            }
                        >
                            <Image 
                                source={{uri : replyImageToPost.uri}}
                                // resizeMode='contain'
                                style={{
                                    height:
                                    replyImageToPost.height < replyImageToPost.width ?
                                        (replyImageToPost.height * (win.width / replyImageToPost.width)) * 0.5
                                    :
                                        (replyImageToPost.height * (win.width / replyImageToPost.width)) * 0.25,

                                    width:
                                    replyImageToPost.height < replyImageToPost.width ?
                                        win.width * 0.5
                                    :
                                        win.width * 0.25,

                                    alignSelf: 'center',
                                    borderRadius: 10,
                                    marginTop: 10,
                                }}
                            />
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
        width: "97%",
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
        width: "97%",
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
        width: "97%",
        borderRadius: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    darkFocusReplyTextPostBar: {
        height: 425,
        width: "97%",
        borderRadius: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    lightFocusReplyTextImagePostBar: {
        height: 235,
        width: "97%",
        borderRadius: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    darkFocusReplyTextImagePostBar: {
        height: 235,
        width: "97%",
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