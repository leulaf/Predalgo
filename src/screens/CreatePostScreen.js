import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView, Image} from 'react-native';
import {ThemeContext} from '../../context-store/context';
import { TouchableOpacity } from 'react-native-gesture-handler';



// light mode icons
import ExitIconLight from '../../assets/exit_light.svg';
import UploadLight from '../../assets/upload_light.svg';
import LinkLight from '../../assets/link_light.svg';
import CreateMemeLight from '../../assets/meme_create_light.svg';
import PostButtonLight from '../../assets/post_button_light.svg';

// dark mode icons
import ExitIconDark from '../../assets/exit_dark.svg';
import UploadDark from '../../assets/upload_dark.svg';
import LinkDark from '../../assets/link_dark.svg';
import CreateMemeDark from '../../assets/meme_create_dark.svg';
import PostButtonDark from '../../assets/post_button_dark.svg';


const CreatePostScreen = ({navigation, imageUrl, imageUrls}) => {
    const [title, setTitle] = React.useState('');
    const [text, setText] = React.useState('');
    const {theme,setTheme} = useContext(ThemeContext);

    let exitIcon, upload, link, createMeme, postButton;

    if(theme == 'light'){
        exitIcon = <ExitIconLight width={50} height={50} style={{marginLeft: 200,}} onPress={() => navigation.goBack()}/>
        upload = <UploadLight width={35} height={35} style={{ marginLeft: 10, marginTop:2}}/>;
        link = <LinkLight width={33} height={33} style={{ marginLeft: 15, marginTop:4}}/>;
        createMeme = <CreateMemeLight width={30} height={30} style={{ marginLeft: 20, marginRight: 5, marginTop:5}}/>;
        postButton = <PostButtonLight width={115} height={40} style={{ marginLeft: 22, marginTop:2}}/>;
    }else{
        exitIcon = <ExitIconDark width={50} height={50} style={{marginLeft: 200}} onPress={() => navigation.goBack()}/>
        upload = <UploadDark width={35} height={35} style={{ marginLeft: 10, marginTop:2}}/>;
        link = <LinkDark width={33} height={33} style={{ marginLeft: 15, marginTop:4}}/>;
        createMeme = <CreateMemeDark width={30} height={30} style={{ marginLeft: 20, marginRight: 5, marginTop:5}}/>;
        postButton = <PostButtonDark width={115} height={40} style={{ marginLeft: 22, marginTop:2}}/>;
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
                    autoCorrect
                    placeholder="Title *Optional*"
                    placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
                    value={title}
                    onChangeText={(newValue) => setTitle(newValue)}
                />

                {/* line break */}
                <View style={{borderBottomColor: '#CCCCCC', borderBottomWidth: 2, marginHorizontal: 10,}}/>

                {/* Text input */}
                <TextInput 
                    style={theme == 'light' ? styles.lightTextInput : styles.darkTextInput}
                    multiline
                    blurOnSubmit
                    autoCapitalize="none"
                    autoCorrect
                    placeholder="Type your post..."
                    placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
                    value={text}
                    onChangeText={(newValue) => setText(newValue)}
                />

                {/* Hashtags and mentions*/}
                <TextInput 
                    style={theme == 'light' ? styles.lightTitleInput : styles.darkTitleInput}
                    autoCapitalize="none"
                    autoCorrect
                    placeholder="@mentions #hashtags"
                    placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
                    value={title}
                    onChangeText={(newValue) => setTitle(newValue)}
                />

                {/* Botton buttons */}
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
                        // onPress={onPress}

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
        marginTop: 50,
        marginBottom: 100,
        backgroundColor: '#fff',
        height: '80%',
        width: '97%',
        alignSelf: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#CCCCCC',
    },
    darkPostContainer: {
        marginTop: 50,
        marginBottom: 100,
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
        fontWeight: '400',
        color: '#222222',
        alignSelf: 'center',
    },
    darkUsername: {
        fontSize: 18,
        fontWeight: '400',
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
        borderColor: '#555555',
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