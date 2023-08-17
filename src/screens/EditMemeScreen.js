import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { Overlay } from 'react-native-elements';
import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';

import EditImageTopBar from '../ScreenTop/EditImageTopBar';

import { StackActions } from '@react-navigation/native';

import {uploadNewTemplate, addNewTemplate} from '../shared/AddNewTemplate';

import PinturaEditor from "@pqina/react-native-expo-pintura";
import {
    createMarkupEditorToolStyle,
    createMarkupEditorToolStyles,
} from "@pqina/pintura";

const EditMemeScreen = ({ navigation, route }) => {
    const { theme, setTheme } = useContext(ThemeContext);
    const { imageUrl, memeName, replyMemeName, imageState, height, width, cameraPic, dontCompress, forMemeComment, forCommentOnPost, forCommentOnComment, templateExists} = route.params;
    const [image, setImage] = useState(imageUrl);
    const [imageResult, setImageResult] = useState(null);

    const { imageReply, setImageReply } = useContext(AuthenticatedUserContext);
    const [template, setTemplate] = useState( null);

    const [storedImageState, setStoredImageState] = useState(null);

    const [compressTemplate, setCompressTemplate] = useState(imageReply ? false : true);

    const [overlayVisible, setOverlayVisible] = useState(false);
    const [newTemplate, setNewTemplate] = useState(false);
    const [newMemeName, setNewMemeName] = useState(replyMemeName && replyMemeName != true ? replyMemeName : "");

    const editorRef = useRef(null);
    const templateRef = useRef(null);

    const editorDefaults = {
        imageWriter: {
            quality: cameraPic ? .8 : 0.6,

            targetSize: {
                height: height < width ? height : 500,
                width: width < height ? width : 500,
            },
        },
    };


    // console.log(imageReply.undeditedUri, imageUrl);

    useEffect(() => {
        navigation.setOptions({
            header: () => <EditImageTopBar forMeme={true} onSave={() => editorRef.current.editor.processImage()} onGoBack={() => onGoBack()} navigation={navigation}/>,
        });
    }, []);

    const stringifyImageState = (imageState) => {
        return JSON.stringify(imageState, (k, v) => (v === undefined ? null : v));
    };
    
    const parseImageState = (str) => {
        return JSON.parse(str);
    };

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
            setImageReply({
                memeName: replyMemeName,
                uri: imageReply.uri,
                undeditedUri: imageReply.undeditedUri,
                template: imageReply.template,
                height: height,
                width: width,
                forCommentOnComment: forCommentOnComment,
                forCommentOnPost: forCommentOnPost,
                imageState: imageReply.imageState,
                templateExists: imageReply.templateExists,
            });
            editorRef.current.editor.close();
            setOverlayVisible(false);
            navigation.goBack(null);
        }else if(forMemeComment){
            navigation.dispatch(
                StackActions.replace('Upload', {
                    forCommentOnComment: forCommentOnComment,
                    forCommentOnPost: forCommentOnPost,
                    forMemeComment: true,
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
    const checkNameAndNav = async (memeName) => {

        if(memeName == ""){
            Alert.alert("Please enter a name for the template.");
            return;
        }else if(replyMemeName && replyMemeName != true){
            addNewTemplate(template, memeName, height, width).then(() => {
                if(forCommentOnPost || forCommentOnComment){
                    setImageReply({
                        memeName: memeName,
                        uri: imageResult,
                        undeditedUri: imageReply.undeditedUri,
                        template: imageState.template,
                        height: height,
                        width: width,
                        forCommentOnComment: forCommentOnComment,
                        forCommentOnPost: forCommentOnPost,
                        imageState: storedImageState
                    });
        
                    editorRef.current.editor.close();
                    navigation.goBack(null);
                    setOverlayVisible(false);
                }
            })
        }else{
            uploadNewTemplate(template, memeName, height, width)
                .then(async(newUrl) => {

                    if(forCommentOnPost || forCommentOnComment){
                        setImageReply({
                            memeName: memeName,
                            uri: imageResult,
                            undeditedUri: imageUrl,
                            template: newUrl,
                            height: height,
                            width: width,
                            forCommentOnComment: forCommentOnComment,
                            forCommentOnPost: forCommentOnPost,
                            imageState: storedImageState
                        });
            
                        
                        navigation.goBack(null);
                        setOverlayVisible(false);
                        editorRef.current.editor.close();
                    }
                });
        }


        
    }

    const navToReply = async (memeName, dest, imageState) => {
        setImageReply({
            memeName: memeName,
            uri: dest,
            undeditedUri: templateExists ? imageUrl : image,
            template: templateExists ? imageUrl : null,
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
    }


    return (
        <View style={styles.container}>

            <PinturaEditor
                ref={editorRef}
                {...editorDefaults}
                style={{
                    width: "100%",
                    height: "95%",
                    borderWidth: 1,
                    borderColor: "#fff",
                    marginTop: 5
                }}
                styleRules={`
                    .pintura-editor {
                        --color-background: 255, 255, 255;
                        --color-foreground: 0, 0, 0;
                    }
                `}
                util={'annotate'}
                utils={[
                    'annotate',
                    'filter',
                    'finetune',
                    'crop',
                    'decorate',
                    'sticker',
                    'frame',
                    'redact',
                    // 'resize',
                ]}
                markupEditorToolStyles={createMarkupEditorToolStyles({
                    text: createMarkupEditorToolStyle("text", {
                        fontSize: "10%",
                    }),
                })}
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
                    frameColor: [0, 0, 0],
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
                    }else if(forCommentOnComment || forCommentOnPost){
                        setImageResult(dest);
                        // setStoredImageState(stringifyImageState(imageState));
                        setStoredImageState(imageState);
                        setOverlayVisible(true);
                    }else if(memeName){
                        // navigation.navigate('CreatePost', {imageUrl: dest, memeName: memeName});
                    }
                    
                }}
            />

                

            {/* Ask user to upload template */}
            {/* Edit profile bio */}
            <Overlay isVisible={overlayVisible} onBackdropPress={() => setOverlayVisible(false)} overlayStyle={{borderRadius: 20}}>

               
                    { !(replyMemeName && replyMemeName != true) &&
                        <View>
                            <Text style={styles.askText}>Can other users use the original image to create memes?</Text>
                            
                            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                                
                                {/* No */}
                                <TouchableOpacity
                                    onPress={() =>
                                        {
                                            navToReply(true, imageResult, storedImageState);
                                            setOverlayVisible(false);
                                        }
                                    }
                                    style={styles.answerButton}
                                >
                                    <Text style={styles.answerText}>No</Text>
                                </TouchableOpacity>

                                {/* Yes */}
                                <TouchableOpacity
                                    onPress={() =>
                                        setNewTemplate(true)
                                    }
                                    style={styles.answerButton}
                                >
                                    <Text style={styles.answerText}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }


                {/* Ask user to enter meme name */}
                {
                    (newTemplate || (replyMemeName && replyMemeName != true)) &&

                        <View>
                            <Text style={styles.askText}>What do you want to name the template?</Text>

                            {/* Meme Template Name */}
                            <TextInput
                                blurOnSubmit
                                maxLength={15}
                                style={{fontSize: 20, width: 350, height: 50, alignSelf: 'center', marginBottom: 15, borderColor: 'gray', borderWidth: 1.5, marginTop: 10, borderRadius: 15}}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder= "  Meme Template Name"
                                placeholderTextColor= "#888888"
                                value={newMemeName}
                                onChangeText={(newValue) => setNewMemeName(newValue)}
                                // onEndEditing={( ) => console.log('submitted')}
                            />

                            {/* Done */}
                            <TouchableOpacity
                                onPress={() =>
                                    { 
                                        imageReply && JSON.stringify(storedImageState[0]) == JSON.stringify(imageReply.imageState[0]) && replyMemeName == newMemeName ?
                                            
                                            onGoBack()
                                        :
                                            checkNameAndNav(newMemeName)
                                    }
                                }
                                style={styles.answerButton}
                            >
                                <Text style={styles.answerText}>Done</Text>
                            </TouchableOpacity>

                        </View>
                        
                }

            </Overlay>

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
        backgroundColor: "#fff",
        alignItems: "center",
        // justifyContent: "center",
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
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 10,
    },
    askText: {
        fontSize: 20,
        color: '#222222',
        fontWeight: '500',
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
        fontWeight: '500',
        alignSelf: 'center'
    },
});

export default EditMemeScreen;