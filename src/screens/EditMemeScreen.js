import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, Text, TextInput, ImageBackground, StyleSheet, TouchableOpacity, Alert, Dimensions} from 'react-native';
import { Overlay } from 'react-native-elements';
import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';

import { BlurView } from 'expo-blur';

import Emojis from '../constants/EmojiStickers';

import EditImageTopBar from '../ScreenTop/EditImageTopBar';

import { StackActions } from '@react-navigation/native';

import {uploadNewTemplate, addNewTemplate} from '../shared/functions/AddNewTemplate';

import PinturaEditor from "@pqina/react-native-expo-pintura";

import {
    // The method used to register the plugins
    setPlugins,

    // The plugins we want to use
    plugin_sticker,
    plugin_sticker_locale_en_gb
} from '@pqina/pintura';

// This registers the plugins with Pintura Image Editor
setPlugins(plugin_sticker);

import {
    createMarkupEditorToolStyle,
    createMarkupEditorToolStyles,
} from "@pqina/pintura";

import { getAuth } from "firebase/auth";

const auth = getAuth();

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const lightBackground = require('../../assets/AddPostBackgroundLight.png');
const darkBackground = require('../../assets/AddPostBackgroundDark.png');

import NewTemplateOverlay from '../components/NewTemplateOverlay';

const EditMemeScreen = ({ navigation, route }) => {
    const { theme, setTheme } = useContext(ThemeContext);
    const { imageUrl, uploader, memeName, replyMemeName, imageState, height, width, cameraPic, dontCompress, forMemePost, forPost, forMemeComment, forCommentOnPost, forCommentOnComment, templateExists, newTemplate} = route.params;

    const [templateUploader, setTemplateUploader] = useState(uploader);
    
    const [image, setImage] = useState(imageUrl);
    const [imageResult, setImageResult] = useState(null);

    const { imageReply, setImageReply, imagePost, setImagePost } = useContext(AuthenticatedUserContext);
    const [template, setTemplate] = useState( null);

    const [storedImageState, setStoredImageState] = useState(null);

    const [compressTemplate, setCompressTemplate] = useState(imageReply || imagePost ? false : true);

    const [overlayVisible, setOverlayVisible] = useState(false);


    const editorRef = useRef(null);
    const templateRef = useRef(null);

    const editorDefaults = {
        imageWriter: {
            quality: cameraPic ? .8 : 0.6,

            targetSize: {
                height: height < width ? height : 500,
                width: width < height ? width : 500,
            },

            locale: {
                ...plugin_sticker_locale_en_gb,
            },
        },
    };


    useEffect(() => {
        // navigation.setOptions({
        //     header: () => <EditImageTopBar forMeme={true} onSave={() => editorRef.current.editor.processImage()} onGoBack={() => onGoBack()} navigation={navigation}/>,
        // });
    }, []);

    // const stringifyImageState = (imageState) => {
    //     return JSON.stringify(imageState, (k, v) => (v === undefined ? null : v));
    // };
    
    // const parseImageState = (str) => {
    //     return JSON.parse(str);
    // };

    const handleEditorLoad = () => {
        // Add image state to history stack if it exists
        if(imageState){
            editorRef.current.editor.history.write(
                // parseImageState(imageState)
                imageState
            )
        }
    };

    const onGoBack = () => {

        if(imageState){
            // console.log(imageState);
            // console.log(imageReply);
            // console.log("**************************************");
            if(forPost){
                setImagePost({
                    memeName: replyMemeName,
                    uri: imagePost.uri,
                    undeditedUri: imagePost.undeditedUri,
                    template: imagePost.template,
                    templateUploader: imagePost.templateUploader,
                    height: height,
                    width: width,
                    forCommentOnComment: forCommentOnComment,
                    forCommentOnPost: forCommentOnPost,
                    imageState: imagePost.imageState,
                    templateExists: imagePost.templateExists,
                });
            }else if(forCommentOnComment || forCommentOnPost){
                setImageReply({
                    memeName: replyMemeName,
                    uri: imageReply.uri,
                    undeditedUri: imageReply.undeditedUri,
                    template: imageReply.template,
                    templateUploader: imageReply.templateUploader,
                    height: height,
                    width: width,
                    forCommentOnComment: forCommentOnComment,
                    forCommentOnPost: forCommentOnPost,
                    imageState: imageReply.imageState,
                    templateExists: imageReply.templateExists,
                });
            }
            editorRef.current.editor.close();
            setOverlayVisible(false);
            navigation.goBack(null);
        }else if(forMemeComment || forMemePost){
            navigation.dispatch(
                StackActions.replace('Upload', {
                    forCommentOnComment: forCommentOnComment,
                    forCommentOnPost: forCommentOnPost,
                    forMemeComment: forMemeComment,
                    forMemePost: forMemePost,
                })
            );
        }else{
            editorRef.current.editor.close();
            setOverlayVisible(false);
            navigation.goBack(null);
        }
        
    };

    // *** if user changes the name of template, 
    // there will be two templates with the same image ***
    // const checkNameAndNav = async (memeName) => {

    //     if(memeName == ""){
    //         Alert.alert("Please enter a name for the template.");
    //         return;
    //     }else if(replyMemeName && replyMemeName != true){
    //         setTemplateUploader(auth.currentUser.displayName);

    //         addNewTemplate(template, memeName, height, width).then(() => {
    //             if(forPost){
    //                 setImagePost({
    //                     memeName: memeName,
    //                     uri: imageResult,
    //                     undeditedUri: imagePost.undeditedUri,
    //                     template: imageState.template,
    //                     templateUploader: templateUploader,
    //                     height: height,
    //                     width: width,
    //                     forCommentOnComment: forCommentOnComment,
    //                     forCommentOnPost: forCommentOnPost,
    //                     imageState: storedImageState
    //                 });
    //             }else if(forCommentOnPost || forCommentOnComment){
    //                 setImageReply({
    //                     memeName: memeName,
    //                     uri: imageResult,
    //                     undeditedUri: imageReply.undeditedUri,
    //                     template: imageState.template,
    //                     templateUploader: templateUploader,
    //                     height: height,
    //                     width: width,
    //                     forCommentOnComment: forCommentOnComment,
    //                     forCommentOnPost: forCommentOnPost,
    //                     imageState: storedImageState
    //                 });
    //             }
    //             editorRef.current.editor.close();
    //             navigation.goBack(null);
    //             setOverlayVisible(false);
    //         })
    //     }else{
    //         setTemplateUploader(auth.currentUser.displayName);
            
    //         uploadNewTemplate(template, memeName, height, width)
    //             .then(async(newUrl) => {
    //                 if(forPost){
    //                     setImagePost({
    //                         memeName: memeName,
    //                         uri: imageResult,
    //                         undeditedUri: imageUrl,
    //                         template: newUrl,
    //                         templateUploader: templateUploader,
    //                         height: height,
    //                         width: width,
    //                         forCommentOnComment: forCommentOnComment,
    //                         forCommentOnPost: forCommentOnPost,
    //                         imageState: storedImageState
    //                     });
    //                 }else if(forCommentOnPost || forCommentOnComment){
    //                     setImageReply({
    //                         memeName: memeName,
    //                         uri: imageResult,
    //                         undeditedUri: imageUrl,
    //                         template: newUrl,
    //                         templateUploader: templateUploader,
    //                         height: height,
    //                         width: width,
    //                         forCommentOnComment: forCommentOnComment,
    //                         forCommentOnPost: forCommentOnPost,
    //                         imageState: storedImageState
    //                     });
    //                 } 

    //                 navigation.goBack(null);
    //                 setOverlayVisible(false);
    //                 editorRef.current.editor.close();
    //             });
    //     }


        
    // }

    const navToReply = async (memeName, dest, imageState) => {
        // console.log("replyMemeName", replyMemeName, "memeName", memeName);
        
        if(forPost){
            setImagePost({
                memeName: memeName,
                uri: dest,
                undeditedUri: templateExists ? imageUrl : image,
                template: templateExists ? imageUrl : null,
                templateUploader: templateUploader,
                height: height,
                width: width,
                forCommentOnComment: forCommentOnComment,
                forCommentOnPost: forCommentOnPost,
                imageState: imageState,
                templateExists: templateExists,
            });

            editorRef.current.editor.close();
            setOverlayVisible(false);
            navigation.goBack(null);
        }else if(forCommentOnComment || forCommentOnPost){
            setImageReply({
                memeName: memeName,
                uri: dest,
                undeditedUri: templateExists ? imageUrl : image,
                template: templateExists ? imageUrl : null,
                templateUploader: templateUploader,
                height: height,
                width: width,
                forCommentOnComment: forCommentOnComment,
                forCommentOnPost: forCommentOnPost,
                imageState: imageState,
                templateExists: templateExists,
            });

            editorRef.current.editor.close();
            setOverlayVisible(false);
            navigation.goBack(null);
        }else{
            setImagePost({
                memeName: memeName,
                uri: dest,
                undeditedUri: templateExists ? imageUrl : image,
                template: templateExists ? imageUrl : null,
                templateUploader: templateUploader,
                height: height,
                width: width,
                forCommentOnComment: forCommentOnComment,
                forCommentOnPost: forCommentOnPost,
                imageState: imageState,
                templateExists: templateExists,
            });
            navigation.dispatch(
                StackActions.replace('CreatePost', {
                    forCommentOnComment: forCommentOnComment,
                    forCommentOnPost: forCommentOnPost,
                    forMemeComment: forMemeComment,
                    forMemePost: forMemePost,
                })
            );
        }
        

        
    }


    return (
        <View style={theme == 'light' ? styles.lightBackground : styles.darkBackground}>

            <ImageBackground 
                source={theme == 'light' ? lightBackground : darkBackground} 
                resizeMode="cover"
                // height={windowHeight}
                // width={windowWidth}
                style={theme == 'light' ? styles.lightBackground : styles.darkBackground}
            >
                
                {/* <BlurView
                    tint = {theme == 'light' ?  "light" : "dark"}
                    intensity={theme == 'light' ?  10 : 6}
                    style={[StyleSheet.absoluteFill, {position: 'absolute', height: 175, top: 0, }]}
                />

                <BlurView
                    tint = {theme == 'light' ?  "light" : "dark"}
                    intensity={theme == 'light' ?  10 : 6}
                    style={[StyleSheet.absoluteFill, {position: 'absolute', height: 225, top: windowHeight - 225, left: 0, right: 0}]}
                /> */}

                <View
                    // tint = {theme == 'light' ?  "light" : "dark"}
                    // intensity={theme == 'light' ?  10 : 5}
                    style={[{backgroundColor: theme == 'light' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(20, 20, 20, 0.83)',
                        position: 'absolute', height: "17%", top: 0, left: 0, right: 0}]}
                />

                <View
                    // tint = {theme == 'light' ?  "light" : "dark"}
                    // intensity={theme == 'light' ?  5 : 5}
                    style={[{backgroundColor: theme == 'light' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(20, 20, 20, 0.83)',
                        position: 'absolute', height: "21%", top: "79%", left: 0, right: 0}]}
                />
                


                {/* <View
                    // tint = {theme == 'light' ?  "light" : "dark"}
                    // intensity={theme == 'light' ?  5 : 5}
                    style={[{backgroundColor: theme == 'light' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(20, 20, 20, 0.5)',
                        position: 'absolute', height: "100%", top: 0, left: 0, right: 0}]}
                /> */}


                {/* Top bar with back and finish button */}
                <EditImageTopBar forMeme={true} onSave={() => editorRef.current.editor.processImage()} onGoBack={() => onGoBack()} theme={theme} navigation={navigation}/>

                <PinturaEditor
                    ref={editorRef}
                    {...editorDefaults}
                    style={{
                        width: "100%",
                        height: "88%",
                        // borderWidth: 1,
                        // borderColor: "#fff",
                        marginTop: 5,
                    }}
                    cropEnableRotateMatchImageAspectRatio={'always'}
                    // cropSelectPresetOptions={[
                    //     [undefined, 'Custom'],
                    //     [1, 'Square'],
                    //     [4 / 3, 'Landscape'],
                    //     [3 / 4, 'Portrait'],
                    // ]}
                    enableButtonRevert={false} // removes the revert button
                    enableButtonExport={false} // removes the finished editing button with check mark
                    styleRules={theme == 'light' ? 
                        `
                            .pintura-editor {
                                --color-background: 255, 255, 255;
                                --color-foreground: 0, 0, 0;
                                --font-size: 18px;
                            }
                            .pintura-editor {
                                --color-focus: 255, 255, 255;
                            }
                            .pintura-editor {
                                --color-primary: #000000;
                                --color-primary-dark: #000000;
                                --color-primary-text: #000000;
                                --color-secondary: #000000;
                                --color-secondary-dark: #000000;
                            }
                        ` 
                    : 
                        `
                            .pintura-editor {
                                --color-background: 0, 0, 0;
                                --color-foreground: 255, 255, 255;
                                --font-size: 18px;
                            }
                            .pintura-editor {
                                --color-focus: 0, 0, 0;
                            }
                            .pintura-editor {
                                --color-primary: #ffffff;
                                --color-primary-dark: #ffffff;
                                --color-primary-text: #ffffff;
                                --color-secondary: #ffffff;
                                --color-secondary-dark: #ffffff;
                            }
                        ` 
                    }
                    util={'annotate'}
                    utils={[
                        'annotate',
                        'filter',
                        'finetune',
                        'crop',
                        'sticker',
                        // 'decorate',  
                        'frame',
                        'redact',
                        // 'resize',
                    ]}
                    stickers={Emojis}
                    stickerEnableSelectImagePreset={false}
                    markupEditorToolStyles={createMarkupEditorToolStyles({
                        text: createMarkupEditorToolStyle("text", {
                            fontSize: 100,
                            // color: theme == 'light' ? [0, 0, 0] : [255, 255, 255],
                        }),
                    })}
                    enableCanvasAlpha={true}
                    markupEditorToolbar={[
                        ['text', 'Text', { disabled: false }],
                        ['sharpie', 'Sharpie', { disabled: false }],
                        ['eraser', 'Eraser', { disabled: false }],
                        ['arrow', 'Arrow', { disabled: false }],
                        ['ellipse', 'Ellipse', { disabled: false }],
                        ['rectangle', 'Rectangle', { disabled: false }],
                        ['line', 'Line', { disabled: false }],
                        ['path', 'Path', { disabled: false }],
                        ['preset', 'Preset', { disabled: false }],
                    ]}
                    imageFrame={{
                        // current style properties
                        frameColor: theme == 'light' ? [0, 0, 0] : [255, 255, 255],
                    }}
                    // imageCropAspectRatio={1}
                    src={image}
                    onLoaderror={(err) => {
                        // console.log("onLoaderror", err);
                    }}
                    
                    onLoad={handleEditorLoad}
                    onProcess={({ dest, imageState }) => {
                        // dest is output file in dataURI format
                        // console.log("onProcess", imageState, "size", dest.length);
                        if(templateExists){
                            navToReply(replyMemeName, dest, imageState);
                        }else if(forCommentOnComment || forCommentOnPost || forPost){
                            setImageResult(dest);
                            // setStoredImageState(stringifyImageState(imageState));
                            setStoredImageState(imageState);

                            if(forPost){
                                setImagePost({
                                    memeName: memeName,
                                    uri: dest,
                                    undeditedUri: templateExists ? imageUrl : image,
                                    template: templateExists ? imageUrl : null,
                                    templateUploader: templateUploader,
                                    height: height,
                                    width: width,
                                    forCommentOnComment: forCommentOnComment,
                                    forCommentOnPost: forCommentOnPost,
                                    imageState: imageState,
                                    templateExists: true,
                                });
                            }else if(forCommentOnComment || forCommentOnPost){
                                setImageReply({
                                    memeName: memeName,
                                    uri: dest,
                                    undeditedUri: templateExists ? imageUrl : image,
                                    template: templateExists ? imageUrl : null,
                                    templateUploader: templateUploader,
                                    height: height,
                                    width: width,
                                    forCommentOnComment: forCommentOnComment,
                                    forCommentOnPost: forCommentOnPost,
                                    imageState: imageState,
                                    templateExists: true,
                                });
                            }
                            setOverlayVisible(true);
                        }else if(memeName){
                            // navigation.navigate('CreatePost', {imageUrl: dest, memeName: memeName});
                        }
                        
                    }}
                />

            </ImageBackground>


            {/* New template overlay */}
            {
                overlayVisible &&

                <NewTemplateOverlay
                    theme={theme}
                    template={template}
                    height={height}
                    width={width}
                    overlayVisible={overlayVisible}
                    setOverlayVisible={setOverlayVisible}
                    forCommentOnComment={forCommentOnComment}
                    forCommentOnPost={forCommentOnPost}
                    navigation={navigation}
                />
            }

            {/* Compresses the original template */}
            {
                compressTemplate &&
                
                <PinturaEditor
                    ref={templateRef}
                    
                    src={image}
                    onLoaderror={(err) => {
                    // console.log("onLoaderror", err);
                    }}
                    onLoad={({ size }) => {
                        templateRef.current.editor.processImage();
                    }}
        
                    {...editorDefaults}
        
                    onProcess={({ dest, imageState }) => {
                        // dest is output file in dataURI format
                        setTemplate(dest);
                        setCompressTemplate(false);
                        // templateRef.current.editor.close();
                    }}
                />

            }

        </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#fff",
        alignItems: "center",
        // justifyContent: "center",
    },
    darkBackground: {
        flex: 1,
        height: windowHeight*1.7,
        backgroundColor: "#000",
        // justifyContent: 'center',
    },
    lightBackground: {
        flex: 1,
        height: windowHeight*1.6,
        backgroundColor: "#fff",
        // justifyContent: 'center',
    },
    image: {
        // flex: 1,
        marginTop: 20,
        alignSelf: "center",
        resizeMode: "contain",
        // borderRadius: 0,
        // marginTop: 20,
        // marginBottom: 50,
        width: '100%',
        height: 400,
    },
    text: {
        fontSize: 20,
        color: '#333333',
        fontWeight: "600",
        marginTop: 15,
        marginBottom: 10,
    },
    askText: {
        fontSize: 20,
        color: '#222222',
        fontWeight: "500",
        alignSelf: 'center',
        marginTop: 5,
        marginBottom: 15,
    },
    answerButton: {
        width: 85,
        height: 50,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#AAAAAA',
        marginLeft: 10,
        marginTop: 15,
        marginRight: 40,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
   },
   answerText: {
        fontSize: 20,
        color: '#222222',
        fontWeight: "500",
        alignSelf: 'center'
    },
});

export default EditMemeScreen;