import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, Text, TextInput, StyleSheet, Button, Image, TouchableOpacity, ScrollView, Alert} from 'react-native';
import { Overlay } from 'react-native-elements';
import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';

import EditImageTopBar from '../components/EditImageTopBar';

import { db, storage } from '../config/firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import firebase from 'firebase/compat/app';
import { set } from 'react-native-reanimated';

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

setPlugins(plugin_crop);

const EditMemeReply = ({ navigation, route }) => {
    const { theme, setTheme } = useContext(ThemeContext);
    const { imageUrl, memeName } = route.params;
    const [image, setImage] = useState(imageUrl);
    const [imageResult, setImageResult] = useState(null);
    const { imageReply, setImageReply } = useContext(AuthenticatedUserContext);

    const [overlayVisible, setOverlayVisible] = useState(false);
    const [newTemplate, setNewTemplate] = useState(false);
    const [newMemeName, setNewMemeName] = useState("");

    const editorRef = useRef(null);

    useEffect(() => {
        navigation.setOptions({
            header: () => <EditImageTopBar forMeme={true} onSave={() => editorRef.current.editor.processImage()}/>,
        });
    }, [navigation]);

    const setMeme = async (memeName) => {
        const q = query(
            collection(db, "imageTemplates"),
            where("name", "==", memeName),
            limit(1)
        );

        

        await getDocs(q)
        .then((snapshot) => {
            if (snapshot.docs.length == 0) {
                // console.log("no meme with that name");
                setOverlayVisible(false);
                editorRef.current.editor.close();
                setImageReply({imageUrl: imageResult, memeName: newMemeName});
            } else {
                // console.log("meme with that name exists");
                Alert.alert("Meme with that name already exists. Please choose a different name.");
            }

        });
        
    }


    return (
        <View style={styles.container}>

            <PinturaEditor
                ref={editorRef}

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
                onLoad={({ size }) => {
                    // console.log("onLoad", size);
                }}
                onProcess={({ dest, imageState }) => {
                    // dest is output file in dataURI format
                    // console.log("onProcess", imageState, "size", dest.length);

                    setImageResult(dest);
                    setOverlayVisible(true);
                    
                }}
            />

            {/* Ask user to upload template */}
            {/* Edit profile bio */}
            <Overlay isVisible={overlayVisible} onBackdropPress={() => setOverlayVisible(false)} overlayStyle={{borderRadius: 20}}>
                
                <Text style={styles.askText}>Can other users use the original image to create memes?</Text>
                
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    
                    {/* No */}
                    <TouchableOpacity
                        onPress={() =>
                            {
                                setOverlayVisible(false);
                                navigation.navigate('CreatePost', {imageUrl: imageResult});
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

                {/* Ask user to enter meme name */}
                {
                    newTemplate &&
                        <View>
                            <Text style={styles.askText}>What do you want to name the template?</Text>

                            {/* Meme Template Name */}
                            <TextInput
                                secureTextEntry={false}
                                multiline
                                blurOnSubmit
                                maxLength={15}
                                style={{fontSize: 20, width: 350, height: 50, alignSelf: 'center', marginBottom: 15, borderColor: 'gray', borderWidth: 1.5, marginTop: 10, borderRadius: 15}}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="  Meme Template Name"
                                placeholderTextColor= "#888888"
                                value={newMemeName}
                                onChangeText={(newValue) => setNewMemeName(newValue)}
                                // onEndEditing={( ) => console.log('submitted')}
                            />

                            {/* Done */}
                            <TouchableOpacity
                                onPress={() =>
                                    setMeme(newMemeName)
                                }
                                style={styles.answerButton}
                            >
                                <Text style={styles.answerText}>Done</Text>
                            </TouchableOpacity>

                        </View>
                        
                }

            </Overlay>
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
        fontWeight: 600,
        marginTop: 15,
        marginBottom: 10,
    },
    askText: {
        fontSize: 20,
        color: '#222222',
        fontWeight: 500,
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
        fontWeight: 500,
        alignSelf: 'center'
    },
});

export default EditMemeReply;