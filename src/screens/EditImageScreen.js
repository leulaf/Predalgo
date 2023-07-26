import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, Text, TextInput, StyleSheet, Button, Image, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';

import EditImageTopBar from '../components/EditImageTopBar';

import PinturaEditor from "@pqina/react-native-expo-pintura";
import {
    createMarkupEditorToolStyle,
    createMarkupEditorToolStyles,
    createDefaultImageReader,
    createDefaultImageWriter,
    createDefaultImageOrienter,
    setPlugins,
    plugin_crop,
    locale_en_gb,
    plugin_crop_locale_en_gb,
} from "@pqina/pintura";
import { set } from 'react-native-reanimated';

setPlugins(plugin_crop);


const EditImageScreen = ({ navigation, route }) => {
    const { theme, setTheme } = useContext(ThemeContext);

    const { imageForPost, setImageForPost } = useContext(AuthenticatedUserContext);

    const { imageUrl, forComment, cameraPic, dontCompress, width, height, imageState } = route.params;

    const [image, setImage] = useState(imageUrl);

    const [imageResult, setImageResult] = useState(null);
    const [storedImageState, setStoredImageState] = useState(null);

    const editorRef = useRef(null);

    const editorDefaults = {
        imageWriter: { 
            quality: dontCompress ? 
                1 
            : 
                cameraPic ? .8 : 0.6,

            targetSize: {
                height: dontCompress || height < width ? height : 500,
                width: dontCompress || width < height ? width : 500,
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

    const handleEditorProcess = (res) => {
        // Turn imageState into string, replaces undefined values with null
        // const imageStateStr = stringifyImageState(res.imageState);
        setImageResult(res.dest);
        
        // Store imageStateStr for later usage
        setStoredImageState(res.imageState);
    };


    useEffect(() => {
        if(imageResult && forComment){
          setImageForPost({
                uri: imageResult,
                undeditedUri: imageUrl,
                height: height,
                width: width,
                imageState: storedImageState
        });

        setImage(null);
        editorRef.current.editor.close();
        navigation.goBack(null);
        }
    }, [imageResult, navigation])


    useEffect(() => {
        navigation.setOptions({
            header: () => <EditImageTopBar forMeme={false} onSave={() => editorRef.current.editor.processImage()}/>,
        });
    }, [navigation]);


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
                util={'filter'}
                utils={[
                    'filter',
                    'crop',
                    'finetune',
                    // 'annotate',
                    // 'decorate',
                    // 'sticker',
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
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 10,
    },
});

export default EditImageScreen;