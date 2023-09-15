import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView, Dimensions, InputAccessoryView, Keyboard, TouchableOpacity, Alert} from 'react-native';

import { StackActions } from '@react-navigation/native';

import {BlurView} from 'expo-blur';

import LottieView from 'lottie-react-native';

import Constants from 'expo-constants';

import uuid from 'react-native-uuid';

import { Image } from 'expo-image';

import LinkInput from '../shared/functions/LinkInput';

import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';

import UploadImagePost from '../shared/post/UploadImagePost';
import UploadTextPost from '../shared/post/UploadTextPost';
import {SaveMemePostData} from '../shared/post/UploadMemePost';

import { getAuth } from "firebase/auth";

const auth = getAuth();

require('firebase/firestore');


// light mode icons
import BackLight from '../../assets/down_light.svg';
import ExitIconLight from '../../assets/xLight.svg';
import UploadLight from '../../assets/upload_light.svg';
import LinkLight from '../../assets/link_light.svg';
import CreateMemeLight from '../../assets/meme_create_light.svg';
import PostButtonLight from '../../assets/post_button_light.svg';
import DeleteImageLight from '../../assets/x.svg';
// import ExpandImage from '../../assets/expand_image.svg';
// import ShrinkImage from '../../assets/shrink_image.svg';

// dark mode icons
import BackDark from '../../assets/down_dark.svg';
import ExitIconDark from '../../assets/xDark.svg';
import UploadDark from '../../assets/upload_dark.svg';
import LinkDark from '../../assets/link_dark.svg';
import CreateMemeDark from '../../assets/meme_create_dark.svg';
import PostButtonDark from '../../assets/post_button_dark.svg';


const win = Dimensions.get('window');

const uploadingAnimation = require('../../assets/animations/Uploading.json');
const refreshingHeight = win.width/2;


const CreatePostScreen = ({navigation, route}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const {imagePost, setImagePost} = React.useContext(AuthenticatedUserContext);
    const [currentSelection, setCurrentSelection] = React.useState({start: 0, end: 0});
    const [title, setTitle] = React.useState('');
    const [text, setText] = React.useState('');
    const {imageUrl, memeName, imageUrls, newTemplate, newTemplateImage} = route.params;
    const [linkView, setLinkView] = React.useState(false);
    const [tempTags, setTempTags] = React.useState('');
    const [uploading, setUploading] = React.useState(true);
    const titleInputAccessoryViewID = uuid.v4();
    const textInputAccessoryViewID = uuid.v4();
    const tagInputAccessoryViewID = uuid.v4();
    // const [expandImage, setExpandImage] = React.useState(false);

    
    let exitIcon, upload, link, createMeme, postButton, down, largeUpload, largeLink, largeCreateMeme;

    // icons
    if(theme == 'light'){
        exitIcon = <ExitIconLight width={22} height={22} style={{marginLeft: 16}} />;
        link = <LinkLight width={31} height={31} marginLeft={8} marginRight={7} />;
        largeLink = <LinkLight width={32} height={32} marginRight={2} />;
        createMeme = <CreateMemeLight width={28} height={28} marginRight={7}/>;
        largeCreateMeme = <CreateMemeLight width={32} height={32} marginRight={8}/>;
        upload = <UploadLight width={29} height={29} marginRight={17}/>;
        largeUpload = <UploadLight width={30} height={30} marginRight={7} />;
        postButton = <PostButtonLight width={95} height={40} style={{ marginRight: 8 }}/>;
        down = <BackLight width={20} height={20}/>
    }else{
        exitIcon = <ExitIconDark width={22} height={22} style={{marginLeft: 16}}/>;
        link = <LinkDark width={31} height={31} marginLeft={8} marginRight={8.5} />;
        largeLink = <LinkDark width={32} height={32} marginRight={2} />;
        createMeme = <CreateMemeDark width={28} height={28} marginRight={7}/>;
        largeCreateMeme = <CreateMemeDark width={32} height={32} marginRight={8}/>;
        upload = <UploadDark width={29} height={29} marginRight={17} />;
        largeUpload = <UploadDark width={30} height={30} marginRight={7} />;
        postButton = <PostButtonDark width={95} height={40} style={{ marginRight: 8 }}/>;
        down = <BackDark width={24} height={24}/>
    }


    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          () => {
            setKeyboardVisible(true); // or some other action
          }
        );
        const keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          () => {
            setKeyboardVisible(false); // or some other action
          }
        );
    
        return () => {
          keyboardDidHideListener.remove();
          keyboardDidShowListener.remove();
        };
      }, []);


    const fixTags = (tempTags) => {
        // console.log(tempTags)
        let newTags = tempTags.split(' ');
        // console.log(newTags)
        let tags = [];
        newTags.forEach((tag) => {
            if(tag[0] == '@' && tag.length > 1){
                tags.push(tag);
            }else if(tag[0] == '#' && tag.length > 1){
                tags.push(tag);
            }
        })

        return tags
        // setCorrectTags(tags);
    };


    const onSelectionChange = React.useCallback(({ nativeEvent: { selection, text } }) => {
        // console.log(
        //   "change selection to",
        //   selection,
        //   "for value",
        //   replyTextToPost.substring(selection.start, selection.end)
        // );
        setCurrentSelection(selection);
    }, []);



    const bottomButtons = React.useCallback(() => (
        linkView ?
            <LinkInput
                // handleFocus={handleFocus}
                theme={theme}
                linkView={linkView}
                setLinkView={setLinkView}
                currentSelection={currentSelection}
                setCurrentSelection={setCurrentSelection}
                replyTextToPost={text}
                setReplyTextToPost={setText}
            />

        :

        <View style={theme == 'light' ? styles.lightInputTopContainer : styles.darkInputTopContainer}>

            {/* Hashtags and mentions*/}
            <TextInput
                nativeID={tagInputAccessoryViewID}
                style={theme == 'light' ? styles.lightTagInput : styles.darkTagInput}
                autoCapitalize="none"
                autoCorrect
                placeholder="@mentions #hashtags"
                placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
                value={tempTags}
                onChangeText={(newValue) => setTempTags(newValue)}
                // onEndEditing={() => fixTags(tempTags)}
            />

            {/* line break */}
            <View style={{borderBottomColor: theme == 'light' ? '#DDDDDD' : '#AAAAAA', borderBottomWidth: 1, marginHorizontal: 5, marginBottom: 14}}/>
        
            {/* Upload, Link, Create Meme Buttons */}
            <View style={{ flex: 1, flexDirection: 'row', marginBottom: 8}}>
                

                
                
                {/* Link Button */}
                <TouchableOpacity
                        // style={{flexDirection: 'row',}}
                        onPress={() => setLinkView(true)}
                    >
                    {link}
                </TouchableOpacity>




                {/* Upload Image Button */}
                <TouchableOpacity
                        // style={{flexDirection: 'row',}}
                        onPress={() => 
                            {
                                setImagePost(null)
                                navigation.navigate("Upload", {
                                    forCommentOnComment: false,
                                    forCommentOnPost: false,
                                    forPost: true,
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
                            setImagePost(null)
                            navigation.navigate("AddPost", {
                                forCommentOnComment: false,
                                forCommentOnPost: false,
                                forPost: true,
                            })
                        }
                    }
                >
                    {createMeme}
                    
                    <Text marginBottom={0} style={theme == 'light' ? styles.lightBottomText : styles.darkBottomText}>
                        Memes
                    </Text>

                </TouchableOpacity>
                

                {/* Keyboard down button */}
                <TouchableOpacity
                    style={{flexDirection: 'row', paddingTop: 2, paddingRight: 15}}
                    onPress={() => Keyboard.dismiss()}
                >
                    {down}
                </TouchableOpacity>


            </View>
            


        </View>
    ), [linkView, title, tempTags, theme]);

    
    const titleBottomButtons = React.useCallback(() => (

        <View style={theme == 'light' ? styles.lightInputTopContainer : styles.darkInputTopContainer}>

            {/* Hashtags and mentions*/}
            <TextInput
                nativeID={tagInputAccessoryViewID}
                style={theme == 'light' ? styles.lightTagInput : styles.darkTagInput}
                autoCapitalize="none"
                autoCorrect
                placeholder="@mentions #hashtags"
                placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
                value={tempTags}
                onChangeText={(newValue) => setTempTags(newValue)}
                // onEndEditing={() => fixTags(tempTags)}
            />

            {/* line break */}
            <View style={{borderBottomColor: theme == 'light' ? '#DDDDDD' : '#AAAAAA', borderBottomWidth: 1, marginHorizontal: 5, marginBottom: 10}}/>
        
            
        </View>
    ), [linkView, imagePost, text, tempTags, currentSelection, theme]);

    const handleFocus = () => {
        setKeyboardVisible(true);
    };

    const handleBlur = () => {
        setKeyboardVisible(false);
    };


    


    const initialBottomButtons = (
        <>
            {/* Hashtags and mentions*/}
            <TextInput
                inputAccessoryViewID={tagInputAccessoryViewID}
                style={theme == 'light' ? styles.lightBottomTagInput : styles.darkBottomTagInput}
                autoCapitalize="none"
                autoCorrect
                handleFocus={handleFocus}
                handleBlur={handleBlur}
                placeholder="@mentions #hashtags"
                placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
                value={tempTags}
                onChangeText={(newValue) => setTempTags(newValue)}
                // onEndEditing={() => fixTags(tempTags)}
            />



            {/* line break */}
            <View style={{borderBottomColor: theme == 'light' ? '#DDDDDD' : '#AAAAAA', borderBottomWidth: 1, alignSelf: 'center', width: "94%", marginBottom: 8, position: 'absolute', bottom: 125}}/>

            

            <View style={{flexDirection: 'row', width: "100%", position: 'absolute', bottom: 75, alignSelf: 'center', justifyContent: 'space-around',
                // , width: "100%", alignItems: 'center',  justifyContent: 'center', alignContent: 'center'
            }}>
                

                {/* Upload Image Button */}
                <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => 
                        {
                            setImagePost(null)
                            navigation.navigate("Upload", {
                                forCommentOnComment: false,
                                forCommentOnPost: false,
                                forPost: true,
                            })
                        }
                    }
                >
                    {largeUpload}
                    <Text style={theme == 'light' ? styles.lightBottomText : styles.darkBottomText}>
                        Image
                    </Text>
                </TouchableOpacity> 



                {/* Create Meme Button */}
                <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => 
                        {
                            setImagePost(null)
                            navigation.navigate("AddPost", {
                                forCommentOnComment: false,
                                forCommentOnPost: false,
                                forPost: true,
                            })
                        }
                    }
                >
                    {largeCreateMeme}
                    <Text style={theme == 'light' ? styles.lightBottomText : styles.darkBottomText}>
                        Memes
                    </Text>
                </TouchableOpacity>

                

                {/* Link Button */}
                <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => setLinkView(true)}
                >
                    {largeLink}
                    <Text style={[theme == 'light' ? styles.lightBottomText : styles.darkBottomText, {marginRight: 6}]}>
                        Link
                    </Text>
                </TouchableOpacity>

            </View>

        </>
        
    )

    
    const onPostText = React.useCallback(async (correctTags) => {
        
        await UploadTextPost(
            title,
            text,
            correctTags
        ).catch(function (error) {
            // console.log(error);
            setUploading(false);
        }).then(async (id) => {
            const newText = text;

            // clear text
            setText("");
            setText("");
            setTitle("");
            setTempTags("");
            setUploading(false);

            // navigate to Post screen with the new Post
            navigation.dispatch(
                StackActions.replace("Post", {
                    postId: id,
                    title: title,
                    text: newText,
                    tags: correctTags,
                    likesCount: 0,
                    commentsCount: 0,
                    profile: auth.currentUser.uid,
                    username: auth.currentUser.displayName,
                    profilePic: auth.currentUser.photoURL,
                })
            );

        });
    }, [text])


    const onPostImage = React.useCallback(async (correctTags) => {

        await UploadImagePost(
            title,
            text,
            imagePost.uri,
            imagePost.height,
            imagePost.width,
            correctTags
        ).catch(function (error) {
            // console.log(error);
            setUploading(false);
        }).then(async (id) => {
            
            const newText = text;

            // clear text and image
            setImagePost(null);
            setText("");
            setTitle("");
            setTempTags("");
            setUploading(false);
                                            
            // navigate to Post screen with the new Post
            navigation.dispatch(
                StackActions.replace("Post", {
                    postId: id,
                    title: title,
                    text: newText,
                    imageUrl: imagePost.uri,
                    imageHeight: imagePost.height,
                    imageWidth: imagePost.width,
                    tags: correctTags,
                    likesCount: 0,
                    commentsCount: 0,
                    profile: auth.currentUser.uid,
                    username: auth.currentUser.displayName,
                    profilePic: auth.currentUser.photoURL,
                })
            );

        });

    }, [imagePost, text])


    const onPostMeme = React.useCallback(async (correctTags) => {
        console.log(correctTags)
        await SaveMemePostData(
            title,
            text,
            imagePost.memeName,
            imagePost.template,
            imagePost.templateUploader,
            imagePost.imageState,
            imagePost.height,
            imagePost.width,
            correctTags
        ).catch(function (error) {
            // console.log(error);
            setUploading(false);
        }).then(async (id) => {
            
            const newText = text;

            // clear reply text and image
            setImagePost(null);
            setText("");
            setTitle("");
            setTempTags("");
            setUploading(false);

            // navigate to Post screen with the new Post
            navigation.dispatch(
                StackActions.replace("Post", {
                    postId: id,
                    title: title,
                    memeName: imagePost.memeName,
                    template: imagePost.template,
                    templateUploader: imagePost.templateUploader,
                    templateState: imagePost.imageState,
                    imageUrl: imagePost.uri,
                    imageHeight: imagePost.height,
                    imageWidth: imagePost.width,
                    text: newText,
                    tags: correctTags,
                    likesCount: 0,
                    commentsCount: 0,
                    profile: auth.currentUser.uid,
                    username: auth.currentUser.displayName,
                    profilePic: auth.currentUser.photoURL,
                })
            );

        });

    }, [imagePost, text])

    const getJsonLottie = (url) => {
        fetch(url, {method: "GET"})
        .then((response) => response.json())
        .then((responseData) => {
            // console.log(responseData);
            setUploading(responseData);
        })
        .catch((error) => {
            // console.log(error);
        })
    }


    const uploadingScreen = (
        <View style={{
            // position: 'absolute',
            // top: 0, left: 0,
            justifyContent: 'center', alignItems: 'center',
            height: win.height, width: win.width,
            backgroundColor: theme == 'light' ? '#FFF' : '#1C1C1C',
            
        }}>
            {getJsonLottie("https://firebasestorage.googleapis.com/v0/b/predalgo-backend.appspot.com/o/posts%2Fusers%2F0GqNSWhzt1cs5YcVupZKHIVlzMG2%2Fintro-creativity-women.json?alt=media&token=1c818cb4-b6e9-44c5-bcac-d35ac3a0ee2b")}
            <LottieView
                    // ref={refreshViewRef}
                    autoPlay
                    style={[styles.lottieView]}
                    // source={theme == 'light' ? uploadingAnimation : uploadingAnimation}
                    source={uploading}
                    // progress={progress}
                    colorFilters={[
                        { keypath: "Shape Layer 1 Comp 1", 
                            color: theme == 'light' ? "#2476FF" : "#FFF" },
                    ]}
                />
        </View>
    );


    return (
        <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
                    {uploading && uploadingScreen}
                <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        marginTop: Constants.statusBarHeight
                    }}>
                        {/* Exit Icon */}
                        <TouchableOpacity
                            style={{flex: 1, borderWidth: 0, botderColor: "black"}}
                            onPress={() => navigation.goBack()}
                        >
                            {exitIcon}
                        </TouchableOpacity>


                        {/* Post Button */}
                        <TouchableOpacity
                             style={{flexDirection: 'row',borderWidth: 0, botderColor: "black"}}
                            onPress={ async () =>
                                    {
                                        setUploading(true);
                                        Keyboard.dismiss();
                                        // console.log(tempTags)
                                        // fixTags(tempTags);

                                        if(imagePost && imagePost.template){
                                            
                                            await onPostMeme(fixTags(tempTags));

                                        }else if(imagePost){
                                            
                                            await onPostImage(fixTags(tempTags));

                                        }else{

                                            await onPostText(fixTags(tempTags));

                                        }
                                    }
                                }
                        >
                            {postButton}
                        </TouchableOpacity>
                </View>

                {/* Title input text */}
                <TextInput
                    inputAccessoryViewID={titleInputAccessoryViewID}
                    style={theme == 'light' ? styles.lightTitleInput : styles.darkTitleInput}
                    autoCapitalize="none"
                    multiline
                    blurOnSubmit
                    maxLength={80}
                    autoCorrect
                    handleFocus={handleFocus}
                    handleBlur={handleBlur}
                    placeholder={!imagePost ? "Title (optional)" : "Title"}
                    placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
                    value={title}
                    onChangeText={(newValue) => setTitle(newValue)}
                />


                {/* line break */}
                <View style={{borderBottomColor: theme == 'light' ? '#DDDDDD' : '#AAAAAA', borderBottomWidth: 1, alignSelf: 'center', width: "94%", marginTop: 8}}/>




                {/* Content of the post, TextInput, Image */}
                {
                // (showText || !(imagePost)) &&
                    <View style={theme == 'light' ? styles.lightTextContainer : styles.darkTextContainer}>

                        <TextInput
                            inputAccessoryViewID={textInputAccessoryViewID}
                            style={[theme == 'light' ? styles.lightTextInput : styles.darkTextInput, 
                                {
                                    height: isKeyboardVisible ?
                                        Dimensions.get('window').height * 0.3
                                    :
                                        imagePost ? 'auto' : Dimensions.get('window').height * 0.5,
                                    maxHeight: imagePost ? Dimensions.get('window').height * 0.5 : Dimensions.get('window').height * 0.5,
                                }
                            ]}
                            multiline
                            maxLength={10000}
                            handleFocus={handleFocus}
                            handleBlur={handleBlur}
                            // blurOnSubmit={false}
                            autoCapitalize="none"
                            autoCorrect
                            onSelectionChange={onSelectionChange}
                            placeholder= {!imagePost ? "Type your post here..." : "Type here...(optional)"}
                            placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
                            value={text}
                            onChangeText={(newValue) => setText(newValue)}
                            
                        />

                    </View>
                }




                {
                    (imagePost && !isKeyboardVisible) &&

                    <ScrollView style={{alignSelf: 'center', flexDirection: 'column', marginTop: 10, marginBottom: 10}}>
                        
                        


                        {/* Selected Image */}
                        <TouchableOpacity
                            onPress={() => 

                                {   
                                    navigation.navigate(imagePost.memeName ? 'EditMeme' : "EditImage", {
                                        imageUrl: imagePost.undeditedUri,
                                        templateUploader: imagePost.templateUploader,
                                        height: imagePost.height,
                                        width: imagePost.width,
                                        imageState: imagePost.imageState,
                                        forCommentOnComment: false,
                                        forCommentOnPost: false,
                                        forComment: false,
                                        forPost: true,
                                        cameraPic: false,
                                        dontCompress: true,
                                        replyMemeName: imagePost.memeName ? imagePost.memeName : null,
                                        templateExists: imagePost.templateExists ? imagePost.templateExists : null,
                                    })
                                }

                            }
                        >
                            <Image 
                                source={{uri : imagePost.uri}}
                                // resizeMode='contain'
                                style={{
                                    height:
                                    imagePost.height < imagePost.width ?
                                        (imagePost.height * (win.width / imagePost.width)) * 1
                                    :
                                        (imagePost.height * (win.width / imagePost.width)) * 1,

                                    width:
                                    imagePost.height < imagePost.width ?
                                        win.width * 1
                                    :
                                        win.width * 1,

                                    alignSelf: 'center',
                                    borderRadius: 10,
                                    // marginTop: 10,
                                }}
                            />
                        </TouchableOpacity>

                        {/* Delete Image */}
                        <TouchableOpacity style={{ 
                            // marginRight: 10, marginTop: 10,
                            position: 'absolute', padding: 15,
                            flexDirection: 'row', 
                            // backgroundColor: 'black', 
                            alignSelf: 'flex-end' }} 
                            onPress={() => setImagePost(null)}
                        >
                            <DeleteImageLight height={30} width={30} />
                            {/* <Text marginBottom={0} style={theme == 'light' ? styles.lightBottomText : styles.darkBottomText}>
                                Delete
                            </Text> */}
                        </TouchableOpacity>
                    </ScrollView>
                }



                {/* Background color behind tags and bottom buttons, 
                *needed so that an image being the background does not change the background of the tags & buttonse */}
                {
                // {/* <View style={{backgroundColor: 'white', alignSelf: 'center', width: "100%", height: 190, marginBottom: 8, position: 'absolute', bottom: 0}}/> */}

                imagePost && <View style={{backgroundColor: theme == 'light' ? '#FFFFFF' : '#1C1C1C', alignSelf: 'center', width: "100%", height: 190, marginBottom: 8, position: 'absolute', bottom: 0}}/>
                // <View style={{ alignSelf: 'center', width: "100%", height: 190, marginBottom: 8, position: 'absolute', bottom: 0}}>
                //     <BlurView
                //         tint = {theme == 'light' ?  "light" : "dark"}
                //         intensity={theme == 'light' ?  100 : 100}
                //         style={[StyleSheet.absoluteFill, ]}
                //     />
                // </View>
                }

                {/* bottom buttons */}
                {!uploading && initialBottomButtons}



                



                {/* Top of keyboard with different options */}
                
                {/* For Text Input */}
                <InputAccessoryView 
                    nativeID={textInputAccessoryViewID}
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
                

                {/* For Tags Input */}
                <InputAccessoryView 
                    nativeID={tagInputAccessoryViewID}
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

                {/* For Title Input */}
                <InputAccessoryView 
                    nativeID={titleInputAccessoryViewID}
                    backgroundComponent={() =>
                        <BlurView
                            tint = {theme == 'light' ?  "light" : "dark"}
                            intensity={theme == 'light' ?  100 : 100}
                            style={[StyleSheet.absoluteFill, {borderRadius: 24}]}
                        />
                    }
                >
                    {titleBottomButtons()}
                </InputAccessoryView>


        </View>
    );
}

const styles = StyleSheet.create({
    lightContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    darkContainer: {
        flex: 1,
        // backgroundColor: '#181818',
        backgroundColor: '#1C1C1C',
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
    lottieView: {
        height: refreshingHeight*2,
        // position: 'absolute',
        // top: 10,
        // left: 0,
        // right: 9,
    },
    lightInputTopContainer: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        // backgroundColor: '#FFFFFF',
        // alignSelf: 'flex-end',
        // alignItems: 'center',
        // alignContent: 'center',
        // height: 100,
        // marginVertical: 10,
        // marginBottom: 3,
        // marginTop: 6
        // marginBottom: 4
    },
    darkInputTopContainer: {
        flexDirection: 'column',
        backgroundColor: '#1C1C1C',
        // alignSelf: 'flex-end',
        // alignItems: 'center',
        // alignContent: 'center',
        // backgroundColor: '#141414',
        // height: 40,
        // backgroundColor: '#1C1C1C',
        // marginVertical: 10,
        // marginBottom: 3,
        // marginTop: 6
        // marginBottom: 4
    },
    lightUsername: {
        fontSize: 18,
        width: 200,
        fontWeight: "500",
        color: '#5F5F5F',
        alignSelf: 'center',
    },
    darkUsername: {
        fontSize: 18,
        width: 200,
        fontWeight: "500",
        color: '#EEEEEE',
        alignSelf: 'center',
    },
    lightTitleInput: {
        color: '#555555',
        height: 40,
        marginTop: 15,
        marginHorizontal: 15,
        fontSize: 24,
        fontWeight: "500",
    },
    darkTitleInput: {
        color: '#EEEEEE',
        height: 40,
        marginTop: 15,
        marginHorizontal: 15,
        fontSize: 24,
        fontWeight: "500"
    },
    lightTagInput: {
        width: "100%",
        color: '#555555',
        height: "auto",
        marginBottom: 10,
        marginTop: 10,
        marginHorizontal: 10,
        fontSize: 22,
        fontWeight: "500",
    },
    darkTagInput: {
        width: "100%",
        color: '#EEEEEE',
        height: "auto",
        marginBottom: 10,
        marginTop: 10,
        marginHorizontal: 10,
        fontSize: 22,
        fontWeight: "500"
    },
    lightBottomTagInput: {
        width: "100%",
        color: '#555555',
        height: "auto",
        position: 'absolute',
        bottom: 150,
        fontSize: 22,
        fontWeight: "500",
        marginHorizontal: 15,
    },
    darkBottomTagInput: {
        width: "100%",
        color: '#EEEEEE',
        height: "auto",
        position: 'absolute',
        bottom: 150,
        fontSize: 22,
        fontWeight: "500",
        marginHorizontal: 15,
    },
    lightTextContainer: {
        color: '#444444',
        // height: 400,
        marginTop: 10,
        marginHorizontal: 5,
        borderRadius: 10,
        // borderWidth: 1,
        // borderColor: '#DDDDDD',
    },
    darkTextContainer: {
        color: '#EEEEEE',
        // height: 400,
        marginTop: 10,
        marginHorizontal: 5,
        borderRadius: 10,
        // borderWidth: 1,
        // borderColor: '#333333'
    },
    lightTextInput: {
        color: '#666666',
        fontSize: 22,
        marginHorizontal: 10,
        fontWeight: "500",
    },
    darkTextInput: {
        color: '#EEEEEE',
        fontSize: 22,
        marginHorizontal: 10,
        fontWeight: "500",
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
        // flex: 1,
        color: '#5b5b5b',
        fontSize: 21,
        fontWeight: "500",
        // marginBottom: 6,
        // alignSelf: 'center',
        // marginRight: 8,
        // marginTop: 10,
    },
    darkBottomText: {
        color: '#EEEEEE',
        fontSize: 21,
        fontWeight: "500",
        // alignSelf: 'center',
        // marginBottom: 6,
        // marginRight: 8,
        // marginTop: 10,
    },
});




export default CreatePostScreen;
