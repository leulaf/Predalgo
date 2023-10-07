import React, {} from 'react';

import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Overlay } from 'react-native-elements';
import { StackActions } from '@react-navigation/native';

import { AuthenticatedUserContext } from '../../context-store/context';

import {uploadNewTemplate, addNewTemplate} from '../shared/functions/AddNewTemplate';

import { getAuth } from 'firebase/auth';

const auth = getAuth();

const window = Dimensions.get('window');


export default NewTemplateOverlay = ({navigation, theme, template, height, width, overlayVisible, setOverlayVisible}, forCommentOnComment, forCommentOnPost) => {
    const [newTemplate, setNewTemplate] = React.useState(false);
    const [newMemeName, setNewMemeName] = React.useState("");
    const { imageReply, setImageReply } = React.useContext(AuthenticatedUserContext);

    const uploadAndNavigate = async () => {
        uploadNewTemplate(template, newMemeName, height, width)
            .then((newUrl) => {
                setOverlayVisible(false);

                if(forCommentOnComment || forCommentOnPost){
                    
                    setImageReply({
                        ...imageReply,
                        memeName: newMemeName,
                    });
                    navigation.goBack(null);
                }else{
                   navigation.dispatch(
                        StackActions.replace('Meme', {
                            uploader: auth.currentUser.displayName,
                            memeName: newMemeName,
                            template: newUrl,
                            height: height,
                            width: width,
                        })
                    ); 
                }
                
            });
    }

    return (
        <Overlay isVisible={overlayVisible} onBackdropPress={() => setOverlayVisible(false)} overlayStyle={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
                
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

            <Text style={theme == 'light' ? styles.lightAskText : styles.darkAskText}>What do you want to name the template?</Text>

            {/* Meme Template Name */}
            <View style={{borderColor: theme == 'light' ? '#000' : '#888', marginHorizontal: 3, borderWidth: 1, borderRadius: 15}}>
                <TextInput
                    secureTextEntry={false}
                    multiline
                    blurOnSubmit
                    maxLength={150}
                    style={{fontSize: 20, minHeight: 50, alignSelf: 'flex-start', marginTop: 10, marginHorizontal: 10, marginBottom: 0, borderRadius: 15}}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Meme Template Name"
                    placeholderTextColor= {theme == 'light' ? '#666' : '#BBB'}
                    value={newMemeName}
                    onChangeText={(newValue) => setNewMemeName(newValue)}
                    // onEndEditing={( ) => console.log('submitted')}
                />
            </View>

            {/* Done */}
            <TouchableOpacity
                onPress={() =>
                    uploadAndNavigate()
                }
                style={theme == 'light' ? styles.lightAnswerButton : styles.darkAnswerButton}
            >
                <Text style={theme == 'light' ? styles.lightAnswerText : styles.darkAnswerText}>Done</Text>
            </TouchableOpacity>


                    


        </Overlay>
    )
}

const styles = StyleSheet.create({
    lightContainer: {
        // flex: 1,
        // backgroundColor: '#F4F4F4',
        backgroundColor: '#FFF',
        borderRadius: 25,
    },
    darkContainer: {
        // flex: 1,
        // backgroundColor: '#0C0C0C',
        // backgroundColor: '#000000',
        backgroundColor: '#151515',
        borderRadius: 25,
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
    lightAskText: {
        fontSize: 20,
        color: '#222222',
        fontWeight: "500",
        alignSelf: 'center',
        margin: 5,
        marginBottom: 15
    },
    darkAskText: {
        fontSize: 20,
        color: '#FFF',
        fontWeight: "500",
        alignSelf: 'center',
        margin: 5,
        marginBottom: 15
    },
   lightAnswerButton: {
        flexDirection: 'column',
        backgroundColor: '#222222',
        borderRadius: 100,
        height: 50,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    darkAnswerButton: {
        flexDirection: 'column',
        backgroundColor: '#FFF',
        borderRadius: 100,
        height: 50,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    lightAnswerText: {
        fontSize: 22,
        color: '#FFF',
        fontWeight: "500",
        alignSelf: 'center'
    },
    darkAnswerText: {
        fontSize: 22,
        color: '#000',
        fontWeight: "500",
        alignSelf: 'center'
    },
})