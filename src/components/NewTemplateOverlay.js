import React, {} from 'react';

import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Overlay } from 'react-native-elements';
import { StackActions } from '@react-navigation/native';

import {uploadNewTemplate, addNewTemplate} from '../shared/functions/AddNewTemplate';

import { getAuth } from 'firebase/auth';

const auth = getAuth();

const window = Dimensions.get('window');


export default NewTemplateOverlay = ({navigation, template, height, width, overlayVisible, setOverlayVisible}) => {
    const [newTemplate, setNewTemplate] = React.useState(false);
    const [newMemeName, setNewMemeName] = React.useState("");

    const uploadAndNavigate = async () => {
        uploadNewTemplate(template, newMemeName, height, width)
            .then((newUrl) => {
                setOverlayVisible(false);
                navigation.dispatch(
                    StackActions.replace('Meme', {
                        uploader: auth.currentUser.displayName,
                        memeName: newMemeName,
                        template: newUrl,
                        height: height,
                        width: width,
                    })
                );
            });
    }

    return (
        <Overlay isVisible={overlayVisible} onBackdropPress={() => setOverlayVisible(false)} overlayStyle={{borderRadius: 20}}>
                
            {/* <Text style={styles.askText}>Can other users use the original image to create memes?</Text> */}
            
            {/* <View style={{flexDirection: 'row', alignSelf: 'center'}}> */}
                
                {/* No */}
                {/* <TouchableOpacity
                    onPress={() =>
                        {
                            setOverlayVisible(false);
                            navigation.navigate('CreatePost', {imageUrl: imageResult});
                        }
                    }
                    style={styles.answerButton}
                >
                    <Text style={styles.answerText}>No</Text>
                </TouchableOpacity> */}

                {/* Yes */}
                {/* <TouchableOpacity
                    onPress={() =>
                        setNewTemplate(true)
                    }
                    style={styles.answerButton}
                >
                    <Text style={styles.answerText}>Yes</Text>
                </TouchableOpacity>
            </View> */}

            {/* Ask user to enter meme name */}
            {

                    <View>
                        <Text style={styles.askText}>What do you want to name the template?</Text>

                        {/* Meme Template Name */}
                        <TextInput
                            secureTextEntry={false}
                            multiline
                            blurOnSubmit
                            maxLength={150}
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
                                uploadAndNavigate()
                            }
                            style={styles.answerButton}
                        >
                            <Text style={styles.answerText}>Done</Text>
                        </TouchableOpacity>

                    </View>
                    
            }

        </Overlay>
    )
}

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
})