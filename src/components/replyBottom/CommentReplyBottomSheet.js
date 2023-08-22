import React, {useEffect, useState, useContext, useMemo, useRef, useCallback} from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, TextInput, Keyboard, InputAccessoryView, Dimensions, Alert } from 'react-native';
import uuid from 'react-native-uuid';

import { BlurView } from 'expo-blur';

import { commentImageOnComment } from '../../shared/comment/forComment/UploadImage';
import { saveMemeToComment} from '../../shared/comment/forComment/UploadMeme';
import { commentTextOnComment } from '../../shared/comment/forComment/UploadText';

import {ThemeContext, AuthenticatedUserContext} from '../../../context-store/context';

import BottomSheet, {BottomSheetScrollView, BottomSheetTextInput} from '@gorhom/bottom-sheet';

import LinkInput from './shared/LinkInput';

// light mode icons
import UploadLight from '../../../assets/reply_upload_light.svg';
import SmallCreateMemeLight from '../../../assets/meme_create_light.svg';
import CreateMemeLight from '../../../assets/reply_meme_create_light.svg';
import PostButtonLight from '../../../assets/reply_light.svg';
import LinkLight from '../../../assets/reply_link_light.svg';
import SmallLinkLight from '../../../assets/link_light.svg';

// dark mode icons
import UploadDark from '../../../assets/upload_dark.svg';
import CreateMemeDark from '../../../assets/meme_create_dark.svg';
import PostButtonDark from '../../../assets/reply_dark.svg';
import LinkDark from '../../../assets/link_dark.svg';

import { getAuth } from "firebase/auth";
import { set } from 'react-native-reanimated';
import { ref } from 'firebase/storage';

const auth = getAuth();


const win = Dimensions.get('window');


const CommentReplyBottomSheet = ({navigation, replyToPostId, replyToCommentId, replyToProfile, replyToUsername, onReplying}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const {imageReply, setImageReply} = useContext(AuthenticatedUserContext);
    const [replyTextToPost, setReplyTextToPost] = useState("");
    const [replyImageToPost, setReplyImageToPost] = useState("");
    const [replyMemeToPost, setReplyMemeToPost] = useState("");

    const inputAccessoryViewID = uuid.v4(); // maybe use uuid to generate this id

    const [linkView, setLinkView] = useState(false);

    const [currentSelection, setCurrentSelection] = useState({start: 0, end: 0});

    const [textInputInFocus, setTextInputInFocus] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);


    let upload, uploadSmall, createMeme, createMemeSmall, link, linkSmall, replyButton

    // icons
    if(theme == 'light'){
        link = <LinkLight width={30.5} height={30.5} marginLeft={8} marginRight={7} />;
        linkSmall = <SmallLinkLight width={26.5} height={26.5} marginRight={5} marginTop={5}/>;
        createMeme = <CreateMemeLight width={27} height={27} marginRight={7}/>;
        createMemeSmall = <SmallCreateMemeLight width={23.5} height={23.5} marginRight={15} />;
        upload = <UploadLight width={28} height={28} marginRight={17}/>;
        replyButton = <PostButtonLight width={95} height={35} marginRight={8}/>;
    }else{
        link = <LinkDark width={30.5} height={30.5} marginLeft={8} marginRight={8.5} />;
        linkSmall = <LinkDark width={26.5} height={26.5} marginRight={5} marginTop={5}/>;
        createMeme = <CreateMemeDark width={27} height={27} marginRight={7}/>;
        createMemeSmall = <CreateMemeDark width={23.5} height={23.5} marginRight={15} />;
        upload = <UploadDark width={28} height={28} marginRight={17} />;
        replyButton = <PostButtonDark width={95} height={35} marginRight={8}/>;
    }

    // ref
    const bottomSheetRef = useRef(null);
    const replyTextToPostRef = useRef(null);

    // variables
    const snapPoints = useMemo(() => ['10%', '70%', '95%'], []);

    useEffect(() => {
        if(imageReply && imageReply.forCommentOnComment){
            setReplyImageToPost(imageReply);

            // replyTextToPostRef.current.focus();
            // setTextInputInFocus(true);
            // setCurrentIndex(2);
            bottomSheetRef.current.snapToIndex(2);
            // handleSheetAnimate(0, 2);
            // handleSheetChanges(2);
        }
    }, [imageReply])

    const onSelectionChange = ({ nativeEvent: { selection, text } }) => {
        // console.log(
        //   "change selection to",
        //   selection,
        //   "for value",
        //   replyTextToPost.substring(selection.start, selection.end)
        // );
        setCurrentSelection(selection);
    };

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

        !linkView && Keyboard.dismiss();
        !linkView && bottomSheetRef.current.snapToIndex(0);
    }

    const handleBlurLinkView = () => {
        bottomSheetRef.current.snapToIndex(0);
        // setLinkView(false);
        Keyboard.dismiss();
        
    }

    const onReplyWithText = async () => {

        await commentTextOnComment(
            replyTextToPost,
            replyToCommentId,
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
            navigation.push("Comment", {
                commentId: id,
                replyToCommentId: replyToCommentId,
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

        await commentImageOnComment(
            replyImageToPost.uri,
            replyTextToPost,
            replyToCommentId,
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
            setImageReply(null);
            setReplyImageToPost(null);
            setReplyTextToPost("");
                
            // navigate to comment screen with the new comment
            navigation.push("Comment", {
                commentId: result.id,
                replyToCommentId: replyToCommentId,
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

    const onReplyWithMeme = async () => {

        await saveMemeToComment(
            replyImageToPost.memeName,
            replyImageToPost.template,
            replyImageToPost.imageState,
            replyTextToPost,
            replyToCommentId,
            replyToPostId,
            replyToProfile,
            replyToUsername,
            replyImageToPost.height,
            replyImageToPost.width,
        ).catch(function (error) {
            // console.log(error);
        }).then(async (id) => {
            const text = replyTextToPost;

            // clear reply text and image
            setImageReply(null);
            setReplyImageToPost(null);
            setReplyTextToPost("");
                                            
            // navigate to comment screen with the new comment
            navigation.push("Comment", {
                commentId: id,
                replyToCommentId: replyToCommentId,
                replyToPostId: replyToPostId,
                replyToProfile: replyToProfile,
                replyToUsername: replyToUsername,
                memeName: replyImageToPost.memeName,
                template: replyImageToPost.template,
                templateState: replyImageToPost.imageState,
                imageUrl: replyImageToPost.uri,
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
        linkView ?
            <LinkInput
                handleFocus={handleFocus}
                handleBlur={handleBlurLinkView}
                theme={theme}
                linkView={linkView}
                setLinkView={setLinkView}
                currentSelection={currentSelection}
                setCurrentSelection={setCurrentSelection}
                replyTextToPost={replyTextToPost}
                setReplyTextToPost={setReplyTextToPost}
            />

        :
        <View style={theme == 'light' ? styles.lightBottomContainer : styles.darkBottomContainer}>
        
        {/* Upload, Link, Create Meme Buttons */}
        <View style={{ flex: 1, flexDirection: 'row', marginBottom: 1}}>
            

            
            
            {/* Link Button */}
            <TouchableOpacity
                    // style={{flexDirection: 'row',}}
                    onPress={() => setLinkView(true)}
                >
                {link}
            </TouchableOpacity>




            {/* Upload Button */}
            <TouchableOpacity
                    // style={{flexDirection: 'row',}}
                    onPress={() => 
                        {
                            setImageReply(null)
                            navigation.navigate("Upload", {
                                forCommentOnComment: true,
                                forCommentOnPost: false,
                            })
                        }
                    }
                >
                {upload}
            </TouchableOpacity>   
            
            



            {/* Create Meme Button */}
            <TouchableOpacity
                style={{flexDirection: 'row',  flex: 1 }}
                onPress={() => 
                    {
                        setImageReply(null)
                        navigation.navigate("AddPost", {
                            forCommentOnComment: true,
                            forCommentOnPost: false,
                        })
                    }
                }
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

                        if(replyImageToPost && replyImageToPost.template){
                            
                            await onReplyWithMeme();

                        }else if(replyImageToPost){
                            
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
                index={onReplying ? 1 : 0}
                snapPoints={snapPoints}
                onAnimate={handleSheetAnimate}
                // onChange={() => handleSheetChanges}
                keyboardBehavior="interactive"
                backgroundComponent={() =>
                    <BlurView 
                        tint = {theme == 'light' ?  "light" : "dark"}
                        intensity={theme == 'light' ?  100 : 100}
                        style={[StyleSheet.absoluteFill, {}]}
                    />
                }
                style={{
                    backgroundColor: theme == 'light' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(32, 32, 32, 0.3)',  // <==== HERE
                    overflow: 'hidden',
                    borderRadius: 20,
                    // shadowColor: theme == 'light' ? '#005FFF' : '#DDDDDD',
                    // shadowOffset: {
                    //   width: 0,
                    //   height: theme == 'light' ? 6 : 6,
                    // },
                    // shadowOpacity: theme == 'light' ? 0.6 : 0.33,
                    // shadowRadius: 12,
                    // elevation: 5,
                }}
                // style={{backgroundColor: theme == 'light' ? styles.lightContainer : styles.darkContainer}}
                backgroundStyle={theme == 'light' ? styles.lightBottomSheet : styles.darkBottomSheet}
                handleIndicatorStyle={{backgroundColor: theme == 'light' ? '#C3C3C3' : '#363636'}}
            >
                <View
                    onPress={() => handleFocus()}
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
                                {   
                                    height: !textInputInFocus ? 35 :

                                    (replyImageToPost ? 225 

                                        : 

                                        currentIndex == 1 ? 225 : 415
                                    ),
                                    marginTop: 1,
                                }
                            ]} 
                            value={replyTextToPost}
                            placeholder="Reply to comment"
                            placeholderTextColor={theme == "light" ? "#555555" : "#BBBBBB"}
                            backgroundComponent={() =>
                                <BlurView
                                    tint = {theme == 'light' ?  "light" : "dark"}
                                    intensity={theme == 'light' ?  100 : 100}
                                    style={[StyleSheet.absoluteFill, {borderRadius: 240}]}
                                />
                            }
                            onChangeText={newTerm => setReplyTextToPost(newTerm)}
                            onSelectionChange={onSelectionChange}
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
                            !textInputInFocus && !linkView &&

                            <TouchableOpacity
                                style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center',}}
                                onPress = {() => handleFocus()}
                            > 
                                {linkSmall}
                                {createMemeSmall}
                            </TouchableOpacity>
                        }

                    </View>
                    
                    {
                        (replyImageToPost && currentIndex != 0) &&
                        <TouchableOpacity
                            onPress={() => 

                                {
                                    navigation.navigate(replyImageToPost.memeName ? 'EditMeme' : "EditImage", {
                                        imageUrl: replyImageToPost.undeditedUri,
                                        height: replyImageToPost.height,
                                        width: replyImageToPost.width,
                                        imageState: replyImageToPost.imageState,
                                        forCommentOnComment: true,
                                        forCommentOnPost: false,
                                        forComment: true,
                                        cameraPic: false,
                                        dontCompress: true,
                                        replyMemeName: replyImageToPost.memeName ? replyImageToPost.memeName : null,
                                        templateExists: replyImageToPost.templateExists ? replyImageToPost.templateExists : null,
                                    })
                                }

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
                    textInputInFocus &&
                    
                    <InputAccessoryView 
                        nativeID={inputAccessoryViewID}
                        backgroundComponent={() =>
                            <BlurView
                                tint = {theme == 'light' ?  "light" : "dark"}
                                intensity={theme == 'light' ?  100 : 100}
                                style={[StyleSheet.absoluteFill, {borderRadius: 24}]}
                            />
                        }
                    >
                        {bottomButtons()}
                    </InputAccessoryView>
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
        height: 44,
        width: "95%",
        borderRadius: 30,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.35)',
        borderWidth: 1,
        borderColor: '#E2E2E2',
    },
    darkReplyTextPostBar: {
        height: 44,
        width: "95%",
        borderRadius: 30,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(32, 32, 32, 0.35)',
        borderWidth: 1,
        borderColor: '#242424',
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
        height: 44,
        fontSize: 18,
        fontWeight: "400",
        marginHorizontal: 10,
        padding: 5,
        // marginVertical: 20,
        // alignSelf: 'center',
        color: '#222222',
    },
    darkInputStyle: {
        flex: 1,
        height: 44,
        fontSize: 18,
        fontWeight: "400",
        marginHorizontal: 10,
        padding: 5,
        // marginVertical: 13,
        // alignSelf: 'center',
        color: '#F4F4F4',
    },
    lightBottomContainer: {
        flexDirection: 'row',
        // backgroundColor: '#FFFFFF',
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
        // backgroundColor: '#141414',
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

export default CommentReplyBottomSheet;
