import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView, Image, Dimensions, InputAccessoryView, Keyboard, TouchableOpacity, Alert} from 'react-native';

import Constants from 'expo-constants';

import uuid from 'react-native-uuid';

import LinkInput from '../shared/LinkInput';

import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';

import UploadImagePost from '../shared/post/UploadImagePost';
import UploadTextPost from '../shared/post/UploadTextPost';
import {SaveMemePostData} from '../shared/post/UploadMemePost';

require('firebase/firestore');


// light mode icons
import BackLight from '../../assets/down_light.svg';
import ExitIconLight from '../../assets/xLight.svg';
import UploadLight from '../../assets/upload_light.svg';
import LinkLight from '../../assets/link_light.svg';
import CreateMemeLight from '../../assets/meme_create_light.svg';
import PostButtonLight from '../../assets/post_button_light.svg';
// import ExpandImage from '../../assets/expand_image.svg';
// import ShrinkImage from '../../assets/shrink_image.svg';

// dark mode icons
import BackDark from '../../assets/back_light.svg';
import ExitIconDark from '../../assets/xDark.svg';
import UploadDark from '../../assets/upload_dark.svg';
import LinkDark from '../../assets/link_dark.svg';
import CreateMemeDark from '../../assets/meme_create_dark.svg';
import PostButtonDark from '../../assets/post_button_dark.svg';

const CreatePostScreen = ({navigation, route}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const {imagePost, setImagePost} = React.useContext(AuthenticatedUserContext);
    const [inputInFocus, setInputInFocus] = React.useState(false);
    const [currentSelection, setCurrentSelection] = React.useState({start: 0, end: 0});
    const [title, setTitle] = React.useState('');
    const [text, setText] = React.useState('');
    const {imageUrl, memeName, imageUrls, newTemplate, newTemplateImage} = route.params;
    const [linkView, setLinkView] = React.useState(false);
    const [tempTags, setTempTags] = React.useState('');
    const textInputAccessoryViewID = uuid.v4();
    const tagInputAccessoryViewID = uuid.v4();
    const [correctTags, setCorrectTags] = React.useState([]);
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
                style={theme == 'light' ? styles.lightTagInput : styles.darkTagInput}
                autoCapitalize="none"
                autoCorrect
                placeholder="@mentions #hashtags"
                placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
                value={tempTags}
                onChangeText={(newValue) => setTempTags(newValue)}
                onEndEditing={() => fixTags(tempTags)}
            />

            {/* line break */}
            <View style={{borderBottomColor: '#DDDDDD', borderBottomWidth: 1, marginHorizontal: 5, marginBottom: 15}}/>
        
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
                    style={{flexDirection: 'row', paddingTop: 3, paddingRight: 15}}
                    onPress={() => Keyboard.dismiss()}
                >
                    {down}
                </TouchableOpacity>


            </View>
            


        </View>
    ), [linkView, imagePost, text, tempTags, currentSelection, theme]);

    const handleFocus = () => {
        setInputInFocus(true);
    };

    const handleBlur = () => {
        setInputInFocus(false);
    };

    // let content;




    // if(imageUrl){
    //     content = (
    //         <>
    //             {expandImage ?
    //                 <TouchableOpacity
    //                         style={{flexDirection: 'column',}}
    //                         onPress={() => setExpandImage(!expandImage)}
    //                 >

    //                     <Image source={{ uri: imageUrl }} style={styles.imageExpanded} />

    //                     <View style={{flexDirection: 'row', position:'absolute', marginLeft: 285, marginTop:30}}>
    //                         <ShrinkImage width={26} height={26}/>
    //                         <Text style={{fontSize: 22, marginHorizontal: 10, fontWeight: 700,color: 'white'}}>
    //                             Shrink
    //                         </Text>
    //                     </View>
    //                 </TouchableOpacity>
    //             :
    //                 <TouchableOpacity
    //                     style={{flexDirection: 'column',}}
    //                     onPress={() => setExpandImage(!expandImage)}
    //                 >
                    
    //                     <Image source={{ uri: imageUrl }} style={styles.imageShrinked}  width={395} height={350}/>

    //                     <View style={{flexDirection: 'row', position:'absolute', marginLeft: 275, marginTop:30}}>
    //                         <ExpandImage width={24} height={24}/>
    //                         <Text style={{fontSize: 22, marginHorizontal: 10, fontWeight: 700,color: 'white'}}>
    //                             Expand
    //                         </Text>
    //                     </View>




    //                 </TouchableOpacity>
                    
    //             }
    //         </>
    //     )
    // }else{
    //     content = <View style={theme == 'light' ? styles.lightTextContainer : styles.darkTextContainer}>

    //         <TextInput
    //             style={theme == 'light' ? styles.lightTextInput : styles.darkTextInput}
    //             multiline
    //             maxLength={10000}
    //             blurOnSubmit={false}
    //             autoCapitalize="none"
    //             autoCorrect
    //             placeholder="Type your post here..."
    //             placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
    //             value={text}
    //             onChangeText={(newValue) => setText(newValue)}
    //         />

    //     </View>
    // }




    return (
        <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
                
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


                        {/* Reply Button */}
                        <TouchableOpacity
                             style={{flexDirection: 'row',borderWidth: 0, botderColor: "black"}}
                            onPress={ async () =>
                                    {
                                        Keyboard.dismiss();

                                        if(imagePost && imagePost.template){
                                            
                                            await onReplyWithMeme();

                                        }else if(imagePost){
                                            
                                            await onReplyWithImage();

                                        }else{

                                            await onReplyWithText();

                                        }
                                    }
                                }
                        >
                            {postButton}
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
                <View style={{borderBottomColor: '#CCCCCC', borderBottomWidth: 1, marginHorizontal: 13, marginTop: 8}}/>




                {/* Content of the post, TextInput, Image */}
                <View style={theme == 'light' ? styles.lightTextContainer : styles.darkTextContainer}>

                    <TextInput
                        inputAccessoryViewID={textInputAccessoryViewID}
                        style={[theme == 'light' ? styles.lightTextInput : styles.darkTextInput, {height: inputInFocus ? Dimensions.get('window').height * 0.3 : Dimensions.get('window').height * 0.5}]}
                        multiline
                        maxLength={10000}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        blurOnSubmit={false}
                        autoCapitalize="none"
                        autoCorrect
                        onSelectionChange={onSelectionChange}
                        placeholder="Type your post here..."
                        placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
                        value={text}
                        onChangeText={(newValue) => setText(newValue)}
                        
                    />

                </View>
                


                {/* Hashtags and mentions*/}
                <TextInput
                    inputAccessoryViewID={tagInputAccessoryViewID}
                    style={theme == 'light' ? styles.lightBottomTagInput : styles.darkBottomTagInput}
                    autoCapitalize="none"
                    autoCorrect
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="@mentions #hashtags"
                    placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
                    value={tempTags}
                    onChangeText={(newValue) => setTempTags(newValue)}
                    onEndEditing={() => fixTags(tempTags)}
                />



                {/* line break */}
                <View style={{borderBottomColor: '#DDDDDD', borderBottomWidth: 1, width: "100%", marginHorizontal: 5, marginBottom: 8, position: 'absolute', bottom: 125}}/>

                

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







                {/* Top of keyboard with different options */}
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
    lightInputTopContainer: {
        flexDirection: 'column',
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
        fontWeight: 500,
        color: '#5F5F5F',
        alignSelf: 'center',
    },
    darkUsername: {
        fontSize: 18,
        width: 200,
        fontWeight: 500,
        color: '#EEEEEE',
        alignSelf: 'center',
    },
    lightTitleInput: {
        color: '#555555',
        height: 40,
        marginTop: 15,
        marginHorizontal: 15,
        fontSize: 24,
        fontWeight: 500,
    },
    darkTitleInput: {
        color: '#EEEEEE',
        height: 40,
        marginHorizontal: 15,
        fontSize: 24,
        fontWeight: 500
    },
    lightTagInput: {
        width: "100%",
        color: '#555555',
        height: "auto",
        marginBottom: 10,
        marginHorizontal: 10,
        fontSize: 22,
        fontWeight: 500,
    },
    darkTagInput: {
        width: "100%",
        color: '#EEEEEE',
        height: "auto",
        marginHorizontal: 10,
        fontSize: 22,
        fontWeight: 500
    },
    lightBottomTagInput: {
        width: "100%",
        color: '#555555',
        height: "auto",
        position: 'absolute',
        bottom: 150,
        fontSize: 22,
        fontWeight: 500,
        marginHorizontal: 10,
    },
    darkBottomTagInput: {
        width: "100%",
        color: '#EEEEEE',
        height: "auto",
        position: 'absolute',
        bottom: 150,
        fontSize: 22,
        fontWeight: 500,
        marginHorizontal: 10,
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
        fontWeight: 500,
    },
    darkTextInput: {
        color: '#EEEEEE',
        fontSize: 22,
        marginHorizontal: 10,
        fontWeight: 500,
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
        fontWeight: '500',
        // marginBottom: 6,
        // alignSelf: 'center',
        // marginRight: 8,
        // marginTop: 10,
    },
    darkBottomText: {
        color: '#EEEEEE',
        fontSize: 21,
        fontWeight: '500',
        // alignSelf: 'center',
        // marginBottom: 6,
        // marginRight: 8,
        // marginTop: 10,
    },
});




export default CreatePostScreen;
