import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, StyleSheet,} from 'react-native';
import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';

import Emojis from '../constants/EmojiStickers';

import EditImageTopBar from '../ScreenTop/EditImageTopBar';

import PinturaEditor from "@pqina/react-native-expo-pintura";
import {
    createMarkupEditorToolStyle,
    createMarkupEditorToolStyles,
} from "@pqina/pintura";


const EditImageScreen = ({ navigation, route }) => {
    const { theme, setTheme } = useContext(ThemeContext);

    const { imageReply, setImageReply, imagePost, setImagePost } = useContext(AuthenticatedUserContext);

    const { imageUrl, forPost, forCommentOnComment, forCommentOnPost, cameraPic, width, height, imageState } = route.params;

    const [image, setImage] = useState(imageUrl);

    const [imageResult, setImageResult] = useState(null);
    const [storedImageState, setStoredImageState] = useState(null);

    const editorRef = useRef(null);

    const editorDefaults = {
        imageWriter: {
            quality: cameraPic ? .8 : 0.6,

            targetSize: {
                height: height < width ? height : 500,
                width: width < height ? width : 500,
            },
        },
    };

    const handleEditorLoad = () => {
        // Add image state to history stack if it exists
        if(imageState){
            editorRef.current.editor.history.write(
                imageState
            )
        }
    };

    const handleEditorProcess = async (res) => {
        // Turn imageState into string, replaces undefined values with null
        // const imageStateStr = stringifyImageState(res.imageState);

        setImageResult(res.dest);
        
        // Store imageStateStr for later usage
        setStoredImageState(res.imageState);
    };

    const onGoBack = () => {
        if(imageState){
            if(forCommentOnComment || forCommentOnPost){
                setImageReply({
                    uri: imageReply.uri,
                    undeditedUri: imageReply.undeditedUri,
                    height: height,
                    width: width,
                    forCommentOnComment: forCommentOnComment,
                    forCommentOnPost: forCommentOnPost,
                    imageState: imageState
                });
            }else{
                setImagePost({
                    uri: imagePost.uri,
                    undeditedUri: imagePost.undeditedUri,
                    height: height,
                    width: width,
                    imageState: imageState
                });
            }
            
            editorRef.current.editor.close();
            navigation.goBack(null);
        }else{
            editorRef.current.editor.close();
            navigation.goBack(null);
        }
        
    };


    useEffect(() => {
        
        if(imageResult != null && (forCommentOnComment || forCommentOnPost)){
            setImageReply({
                uri: imageResult,
                undeditedUri: imageUrl,
                height: height,
                width: width,
                forCommentOnComment: forCommentOnComment,
                forCommentOnPost: forCommentOnPost,
                imageState: storedImageState
            });

            setImageResult(null);
            editorRef.current.editor.close();
            navigation.goBack(null);
        }else if(imageResult != null){
            setImagePost({
                uri: imageResult,
                undeditedUri: imageUrl,
                height: height,
                width: width,
                imageState: storedImageState
            });

            setImageResult(null);
            editorRef.current.editor.close();
            navigation.goBack(null);
        }
    }, [imageResult])


    useEffect(() => {
        navigation.setOptions({
            header: () => <EditImageTopBar forMeme={false} onSave={() => editorRef.current.editor.processImage()} onGoBack={() => onGoBack()} navigation={navigation}/>,
        });
    }, []);


    return (
        <View style={styles.container}>

            <PinturaEditor
                ref={editorRef}
                {...editorDefaults}
                enableButtonRevert={false} // removes the revert button
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
                util={'filter'}
                utils={[
                    'filter',
                    'crop',
                    'finetune',
                    // 'annotate',
                    // 'decorate',
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
                stickers={Emojis}
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
                onProcess={handleEditorProcess}
                // onLoad={({ size }) => {
                //     // console.log("onLoad", size);
                // }}
                // onProcess={({ dest, imageState }) => {
                //     // dest is output file in dataURI format
                //     // console.log("onProcess", imageState, "size", dest.length);
                    
                // }}
            />

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
});

export default EditImageScreen;