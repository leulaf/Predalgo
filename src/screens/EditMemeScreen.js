import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Button, Image, TouchableOpacity, ScrollView} from 'react-native';
// import { PESDK } from "react-native-photoeditorsdk";
import {ThemeContext} from '../../context-store/context';
import PinturaEditor from "@pqina/react-native-pintura";
import {
    createMarkupEditorToolStyle,
    createMarkupEditorToolStyles,
} from "@pqina/pintura";
import EditMemeTopBar from '../components/EditMemeTopBar';

const EditMemeScreen = ({ navigation, route }) => {
    const { theme, setTheme } = useContext(ThemeContext);
    const { imageUrl, memeId, memeName } = route.params;
    const [image, setImage] = useState(imageUrl);

    const editorRef = useRef(null);

    useEffect(() => {
        navigation.setOptions({
        header: () => <EditMemeTopBar title={"Back"} onSave={() => editorRef.current.editor.processImage()}/>,
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Tap and drag to add text
            </Text>

            <PinturaEditor
                ref={editorRef}
                style={{
                    width: "100%",
                    height: "90%",
                    borderWidth: 1,
                    borderColor: "#fff",
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

                    // preview
                    navigation.navigate('CreatePost', {imageUrl: dest, memeId: memeId, memeName: memeName});
                }}
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
});

export default EditMemeScreen;