import React, {useContext} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image, UIManager, findNodeHandle} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {ThemeContext} from '../../context-store/context';

// light mode icons
import UploadLight from '../../assets/upload_light.svg';
import LinkLight from '../../assets/link_light.svg';
import CreateMemeLight from '../../assets/meme_create_light.svg';

// dark mode icons
import UploadDark from '../../assets/upload_dark.svg';
import LinkDark from '../../assets/link_dark.svg';
import CreateMemeDark from '../../assets/meme_create_dark.svg';

const PostBar = ({}) => {
    const navigation = useNavigation();
    const {theme,setTheme} = useContext(ThemeContext);

    let upload, link, createMeme;

    if(theme == 'light'){
        upload = <UploadLight width={30} height={30} style={{ marginLeft: 15}}/>;
        link = <LinkLight width={30} height={30} style={{ marginLeft: 13}}/>;
        createMeme = <CreateMemeLight width={29} height={29} style={{ marginLeft: 10}}/>;
    }else{
        upload = <UploadDark width={30} height={30} style={{ marginLeft: 15}}/>;
        link = <LinkDark width={30} height={30} style={{ marginLeft: 13}}/>;
        createMeme = <CreateMemeDark width={29} height={29} style={{ marginLeft: 10}}/>;
    }

    return (
        <View style={theme == 'light' ? styles.lightMainContainer : styles.darkMainContainer}>

            {/* Profile picture */}
            <TouchableOpacity 
                // onPress={onPress}
            >
                <Image source={require('../../assets/profile_default.png')} style={{width: 40, height: 40, marginLeft: 8}}/>
            </TouchableOpacity>

            {/* Text input */}
            <TouchableOpacity 
             style={theme == 'light' ? styles.lightTextContainer : styles.darkTextContainer}
                onPress={() => navigation.navigate("CreatePost")}
            >
                <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
                    Type your post...
                </Text>
            </TouchableOpacity>


            {/* Icons */}

            <TouchableOpacity 
                // onPress={onPress}
            >
                {createMeme}
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => navigation.navigate("Upload")}
            >
                {upload}
            </TouchableOpacity>

            <TouchableOpacity 
                // onPress={onPress}
            >
                {link}
            </TouchableOpacity>


        </View>
    );
}

const styles = StyleSheet.create({
    lightMainContainer: {
        flexDirection: "row",
        width: "97%",
        height: 60,
        marginTop:  55,
        alignSelf: "center",
        alignItems: "center",
        backgroundColor: "#FBFBFB",
        borderWidth: 1,
        borderColor: "#CCCCCC",
        borderRadius: 30
    },
    darkMainContainer: {
        flexDirection: "row",
        width: "97%",
        height: 60,
        marginTop:  55,
        alignSelf: "center",
        alignItems: "center",
        backgroundColor: "#1A1A1A",
        borderWidth: 1,
        borderColor: "#444444",
        borderRadius: 30
    },
    lightTextContainer: {
        flexDirection: "row",
        width: "50%",
        height: 42,
        alignSelf: "center",
        alignItems: "center",
        marginLeft: 8,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#CCCCCC",
        borderRadius: 30
    },
    darkTextContainer: {
        flexDirection: "row",
        width: "50%",
        height: 42,
        alignSelf: "center",
        alignItems: "center",
        marginLeft: 8,
        backgroundColor: "#161616",
        borderWidth: 1,
        borderColor: "#444444",
        borderRadius: 30
    },
    lightText:{
        marginLeft: 10,
        fontSize: 16,
        fontWeight: "400",
        color: "#666666",
    },
    darkText:{
        marginLeft: 10,
        fontSize: 16,
        fontWeight: "400",
        color: "#CCCCCC",
    }
});

export default PostBar;