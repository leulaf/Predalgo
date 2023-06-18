import React, {useContext, useState, useEffect,} from 'react';
import {View, TextInput, StyleSheet, Button, Image, TouchableOpacity, ScrollView} from 'react-native';
// import { PESDK } from "react-native-photoeditorsdk";
import {ThemeContext} from '../../context-store/context';
import GlobalStyles from '../constants/GlobalStyles';
import AddPostTop from '../components/AddPostTop';

let counter = 0;

const EditMemeScreen = ({ navigation, route }) => {
    const { theme, setTheme } = useContext(ThemeContext);
    const { imageUrl, memeId, memeName } = route.params;
    const [image, setImage] = useState(imageUrl);
    const [textInputs, setTextInputs] = useState([]);

    useEffect(() => {
        
    }, []);
    
    const handleAddTextInput = () => {
        const id = counter++;
        const newTextInput = {
            id,
            x: '50',
            y: '50',
            height: '100',
            width: '200',
            fontSize: '20',
            text: '',
        };
        setTextInputs([...textInputs, newTextInput]);
    };

    // delete text input
    const handleDeleteTextInput = (id) => {
        const updatedInputs = textInputs.filter((textInput) => textInput.id !== id);
        setTextInputs(updatedInputs);
    };

    // update text input
    const handleInputChange = (text, id, inputType) => {
        const updatedInputs = textInputs.map((textInput) => {
        if (textInput.id === id) {
            return { ...textInput, [inputType]: text };
        }
        return textInput;
        });
        setTextInputs(updatedInputs);
    };

    // update text
    const handleTextInputChange = (text, id) => {
        const updatedInputs = textInputs.map((textInput) => {
        if (textInput.id === id) {
            return { ...textInput, text };
        }
        return textInput;
        });
        setTextInputs(updatedInputs);
    };

    useEffect(() => {
        navigation.setOptions({
        header: () => <AddPostTop />,
        });
    }, [navigation]);

    return (
        <ScrollView automaticallyAdjustKeyboardInsets={true} style={theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer}>
            
            <Image source={{ uri: image }} style={styles.image} />
        
            <View style={{ marginBottom: 20 }}>
                <Button title="Add Text Input" onPress={handleAddTextInput} />
                {textInputs.map((textInput) => (
                    <View key={textInput.id}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <TextInput
                                style={styles.smallTextInput}
                                keyboardType="numeric"
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="X"
                                value={textInput.x}
                                onChangeText={(text) => handleInputChange(text, textInput.id, 'x')}
                            />
                            <TextInput
                                style={styles.smallTextInput}
                                keyboardType="numeric"
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Y"
                                value={textInput.y}
                                onChangeText={(text) => handleInputChange(text, textInput.id, 'y')}
                            />
                            <TextInput
                                style={styles.smallTextInput}
                                keyboardType="numeric"
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Height"
                                value={textInput.height}
                                onChangeText={(text) => handleInputChange(text, textInput.id, 'height')}
                            />
                            <TextInput
                                style={styles.smallTextInput}
                                keyboardType="numeric"
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Width"
                                value={textInput.width}
                                onChangeText={(text) => handleInputChange(text, textInput.id, 'width')}
                            />
                            <TextInput
                                style={styles.smallTextInput}
                                keyboardType="numeric"
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Font"
                                value={textInput.fontSize}
                                onChangeText={(text) => handleInputChange(text, textInput.id, 'fontSize')}
                            />
                        </View>
                        <TextInput
                            style={styles.textInput}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="Text here"
                            placeholderTextColor="#888888"
                            value={textInput.text}
                            onChangeText={(text) => handleTextInputChange(text, textInput.id)}
                        />
                        <Button title="Delete" onPress={() => handleDeleteTextInput(textInput.id)} />
                    </View>
                ))}
            </View>
        </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    textInputsContainer: {
        marginTop: 10,
        width: 300,
        height: 400,
        flexDirection: 'row',
        // alignContent: 'center',
        // justifyContent: 'center',
    },
    textInput: {
        marginTop: 5,
        width: "95%",
        alignSelf: 'center',
        height: 50,
        backgroundColor: "#FFFFFF",
        borderColor: '#CCCCCC',
        borderWidth: 3,
        borderRadius: 20,
        padding: 10,
        fontSize: 18,
    },
    smallTextInput: {
        marginTop: 5,
        marginHorizontal: 5,
        width: "17%",
        height: 50,
        backgroundColor: "#FFFFFF",
        borderColor: '#CCCCCC',
        borderWidth: 3,
        borderRadius: 20,
        padding: 10,
        fontSize: 16,
    },
    lightText: {
        fontSize: 22,
        color: '#444444',
        fontWeight: '600',
        alignSelf: 'center',
        marginHorizontal: 10,
        marginTop: 5,
    },
    darkText: {
        fontSize: 22,
        color: '#f2f2f2',
        fontWeight: '600',
        alignSelf: 'center',
        marginHorizontal: 10,
        marginTop: 5,
    },
});

export default EditMemeScreen;