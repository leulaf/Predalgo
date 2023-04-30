import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView, Image, Dimensions} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {ThemeContext} from '../../context-store/context';

import firebase from 'firebase/compat/app';
require('firebase/firestore');

// light mode icons
import ExitIconLight from '../../assets/exit_light.svg';
import UploadLight from '../../assets/upload_light.svg';
import LinkLight from '../../assets/link_light.svg';
import CreateMemeLight from '../../assets/meme_create_light.svg';
import PostButtonLight from '../../assets/post_button_light.svg';
import ExpandImage from '../../assets/expand_image.svg';
import ShrinkImage from '../../assets/shrink_image.svg';

// dark mode icons
import ExitIconDark from '../../assets/exit_dark.svg';
import UploadDark from '../../assets/upload_dark.svg';
import LinkDark from '../../assets/link_dark.svg';
import CreateMemeDark from '../../assets/meme_create_dark.svg';
import PostButtonDark from '../../assets/post_button_dark.svg';

const win = Dimensions.get('window');

const CreatePostScreen = ({navigation, route}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [title, setTitle] = React.useState('');
    const [text, setText] = React.useState('');
    const {imageUrl, imageUrls} = route.params;
    const [tempTags, setTempTags] = React.useState('');
    const [uploading, setUploading] = useState(false) 
    const [correctTags, setCorrectTags] = React.useState([]);
    const [expandImage, setExpandImage] = React.useState(false);
    
    const uploadImagePost = async () => {
        setUploading(true)
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const filename = imageUrl.substring(imageUrl.lastIndexOf('/')+1);
        const childPath = `post/${firebase.auth().currentUser.uid}/${filename}`;
        var task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);
        
        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                console.log(snapshot);
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
            alert(snapshot);
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);
        
        try {
            await task;
        } catch (e){
            console.log(e)
            Alert.alert(
                'Error uploading image',
            );
        }
        setUploading(false)
        Alert.alert(
            'Photo uploaded!'
        );
    };

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
        console.log(tags);
    };

    let exitIcon, upload, link, createMeme, postButton;

    if(theme == 'light'){
        exitIcon = <ExitIconLight width={50} height={50} style={{marginLeft: 200,}} onPress={() => navigation.goBack()}/>;
        upload = <UploadLight width={35} height={35} style={{ marginLeft: 10, marginTop:2}}/>;
        link = <LinkLight width={33} height={33} style={{ marginLeft: 15, marginTop:4}}/>;
        createMeme = <CreateMemeLight width={30} height={30} style={{ marginLeft: 20, marginRight: 5, marginTop:5}}/>;
        postButton = <PostButtonLight width={115} height={40} style={{ marginLeft: 22, marginTop:2}}/>;
    }else{
        exitIcon = <ExitIconDark width={50} height={50} style={{marginLeft: 200}} onPress={() => navigation.goBack()}/>;
        upload = <UploadDark width={35} height={35} style={{ marginLeft: 10, marginTop:2}}/>;
        link = <LinkDark width={33} height={33} style={{ marginLeft: 15, marginTop:4}}/>;
        createMeme = <CreateMemeDark width={30} height={30} style={{ marginLeft: 20, marginRight: 5, marginTop:5}}/>;
        postButton = <PostButtonDark width={115} height={40} style={{ marginLeft: 22, marginTop:2}}/>;
    }

    let content;

    if(imageUrl){
        content = (
            <>
                {expandImage ? 
                    <TouchableOpacity
                            style={{flexDirection: 'column',}}
                            onPress={() => setExpandImage(!expandImage)}
                    >

                        <Image source={{ uri: imageUrl }} style={styles.imageExpanded} />

                        <View style={{flexDirection: 'row', position:'absolute', marginLeft: 265, marginTop:30}}>
                            <ShrinkImage width={30} height={30} style={{ }}/>
                            <Text style={{fontSize: 24, marginHorizontal: 10, fontWeight: 'bold',color: 'white',}}>
                                Shrink
                            </Text>
                            
                            
                        </View>
                    </TouchableOpacity>
                :
                    <TouchableOpacity
                        style={{flexDirection: 'column',}}
                        onPress={() => setExpandImage(!expandImage)}
                    >
                    
                        <Image source={{ uri: imageUrl }} style={styles.imageShrinked}  width={395} height={350}/>

                        <View style={{flexDirection: 'row', position:'absolute', marginLeft: 265, marginTop:30}}>
                            <ExpandImage width={30} height={30} style={{ }}/>
                            <Text style={{fontSize: 24, marginHorizontal: 10, fontWeight: 'bold',color: 'white',}}>
                                Expand
                            </Text>
                        </View>

                    </TouchableOpacity>
                    
                }
            </>
        )
    }else{
        content = <TextInput 
            style={theme == 'light' ? styles.lightTextInput : styles.darkTextInput}
            multiline
            maxLength={10000}
            blurOnSubmit
            autoCapitalize="none"
            autoCorrect
            placeholder="Type your post..."
            placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
            value={text}
            onChangeText={(newValue) => setText(newValue)}
        />
    }

    return (
        <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
            <ScrollView automaticallyAdjustKeyboardInsets={true} style={theme == 'light' ? styles.lightPostContainer : styles.darkPostContainer}>
                
                <View style={{flexDirection: 'row'}}>
                    <Image source={require('../../assets/profile_default.png')} style={{width: 40, height: 40, margin: 10}}/>
                    <Text style={theme == 'light' ? styles.lightUsername : styles.darkUsername}>Username</Text>

                    {exitIcon}
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
                <View style={{borderBottomColor: '#CCCCCC', borderBottomWidth: 2, marginHorizontal: 10,}}/>

                {/* Content of the post, TextInput, Image */}
                {content}

                {/* Hashtags and mentions*/}
                <TextInput 
                    style={theme == 'light' ? styles.lightTitleInput : styles.darkTitleInput}
                    autoCapitalize="none"
                    autoCorrect
                    placeholder="@mentions #hashtags"
                    placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
                    value={tempTags}
                    onChangeText={(newValue) => setTempTags(newValue)}
                    onEndEditing={() => fixTags(tempTags)}
                />

                <View style={{flexDirection: 'row', marginTop: 90}}>

                    <TouchableOpacity 
                            style={{flexDirection: 'row',}}
                            // onPress={onPress}
                        >
                        {upload}
                    </TouchableOpacity>  

                    <TouchableOpacity 
                        style={{flexDirection: 'row',}}
                        // onPress={onPress}

                    >
                        {createMeme}

                        <Text marginBottom={15} width={61} style={theme == 'light' ? styles.lightBottomText : styles.darkBottomText}>
                            Create Memes
                        </Text>
                    </TouchableOpacity>                    

                    <TouchableOpacity 
                        style={{flexDirection: 'row',}}
                        // onPress={onPress}

                    >
                        {link}
                        <Text style={theme == 'light' ? styles.lightBottomText : styles.darkBottomText}>
                            Link
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={{flexDirection: 'row',}}
                        onPress={() => uploadImagePost()}
                    >
                        {postButton}

                    </TouchableOpacity>
                    
                    
                </View>
                
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    lightContainer: {
        height: '100%',
        backgroundColor: '#F4F4F4',
        flexDirection: 'column',
    },
    darkContainer: {
        height: '100%',
        backgroundColor: '#282828',
        flexDirection: 'column',
    },
    lightPostContainer: {
        marginTop: 70,
        marginBottom: 80,
        backgroundColor: '#fff',
        height: '80%',
        width: '97%',
        alignSelf: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#CCCCCC',
    },
    darkPostContainer: {
        marginTop: 70,
        marginBottom: 80,
        backgroundColor: '#1A1A1A',
        height: '80%',
        width: '97%',
        alignSelf: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#555555',
    },
    lightUsername: {
        fontSize: 18,
        fontWeight: '500',
        color: '#444444',
        alignSelf: 'center',
    },
    darkUsername: {
        fontSize: 18,
        fontWeight: '500',
        color: '#EEEEEE',
        alignSelf: 'center',
    },
    lightTitleInput: {
        color: '#444444',
        height: 40, 
        margin: 10, 
        fontSize: 20, 
        fontWeight: '500',
    },
    darkTitleInput: {
        color: '#EEEEEE',
        height: 40, 
        margin: 10, 
        fontSize: 20, 
        fontWeight: '500'
    },
    lightTextInput: {
        color: '#444444',
        height: 400, 
        margin: 10, 
        fontSize: 20, 
        fontWeight: '500',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCCCCC',
    },
    darkTextInput: {
        color: '#EEEEEE',
        height: 400, 
        margin: 10, 
        fontSize: 20, 
        fontWeight: '500',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#444444',
    },
    imageShrinked: {
        alignSelf: "center", 
        borderRadius: 15,
        marginTop: 20,
        marginBottom: 50,
    },
    imageExpanded: {
        flex: 1,
        alignSelf: "center", 
        borderRadius: 15,
        marginTop: 20,
        marginBottom: 50,
        width: 400,
        height: win.height,
    },
    lightBottomText: {
        color: '#666666', 
        fontSize: 18, 
        fontWeight: '500', 
        alignSelf: 'center',
        marginLeft: 5,
    },
    darkBottomText: {
        color: '#DDDDDD', 
        fontSize: 18, 
        fontWeight: '500', 
        alignSelf: 'center',
        marginLeft: 5
    },
});

export default CreatePostScreen;