import React, {} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Keyboard, Alert } from 'react-native';
import uuid from 'react-native-uuid';

import {BlurView} from 'expo-blur';

import LinkLight from '../../assets/link_light.svg';
import LinkDark from '../../assets/link_dark.svg';

function isValidUrl(string) {
    const urlRegexSafe = require('url-regex-safe');
    const matches = string.match(urlRegexSafe());

    return matches?.length == 1 && matches[0].length == string.length;
}

// Format link url string to later parse and display as clickable link
// (if link name is empty, just use link input) (if link input is empty, don't add link or link name)
// final link string format: [link URL](link name)
const LinkInput = ({theme, linkView, setLinkView, setCurrentSelection, currentSelection, replyTextToPost, setReplyTextToPost, handleFocus}) => {
    
    const [linkName, setLinkName] = React.useState(replyTextToPost.substring(currentSelection.start, currentSelection.end));
    const [linkInput, setLinkInput] = React.useState("");

    const linkNameViewID = uuid.v4();
    const linkViewID = uuid.v4();

    const linkRef = React.useRef(null);

    let link

    // icons
    if(theme == 'light'){
        link = <LinkLight width={26} height={26} marginLeft={2} marginRight={0} marginTop={4}/>;
    }else{
        link = <LinkDark width={26} height={26} marginLeft={2} marginRight={0} marginTop={4} />;
    }


    const handleDone = () => () => {
        // if link name is empty, just display link URL as clickable link
        // if link input is empty, don't add link or link name
        // if link name and link input are empty, don't add link or link name
        // if link name and link input are not empty, add link and link name and make link name clickable
        if(linkInput != "" && isValidUrl(linkInput)){

            // add formatted link with name to reply text
            const linkWithName = 
            replyTextToPost.substring(0, currentSelection.start) + 
            "[" + linkInput
            .replace("http://", "")
            .replace("https://", "")
            .replace("www.", "") + 
            "]" + 
            "(" + linkName + ")" + 
            replyTextToPost.substring(currentSelection.end);

            setReplyTextToPost(linkWithName);

            setCurrentSelection(
                {
                    selection: {
                        start: linkWithName.length-1,
                        end: linkWithName.length-1
                    }
                }
            );

            setLinkView(false);
        }else if(linkInput != "" && !isValidUrl(linkInput)){

            Alert.alert('Invalid URL\nPlease enter a valid URL')
        }else{
            setLinkView(false);
        }

        
    }
    

    // (if link name is empty, just display link URL as clickable link)
    // create a function to check the format of the link string is correct

    return (
        <View
            style={theme == 'light' ? styles.lightBottomContainer : styles.darkBottomContainer}
        >

            {/* Link Name */}
            <View
                style={theme == 'light' ? styles.linkNameLightContainer : styles.linkNameDarkContainer}
            >
                {/* Link Icon */}
                {link}

                <TextInput
                    // ref={(input) => { replyTextToPostRef.current = input; }}
                    inputAccessoryViewID={linkNameViewID}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => handleFocus()}
                    // onBlur={() =>  } // focus lost
                    blurOnSubmit={false}
                    maxLength={100}
                    multiline={false}
                    style={[theme == 'light' ? styles.lightInputStyle : styles.darkInputStyle, {marginHorizontal: 0,}]} 
                    placeholder="Link Name"
                    value={linkName}
                    placeholderTextColor={theme == "light" ? "#555555" : "#BBBBBB"}
                    onChangeText={
                        newTerm => 
                        setLinkName(
                            newTerm
                            .replace("(", "")
                            .replace(")", "")
                            .replace("[", "")
                            .replace("]", "")
                            .replace(" ", "")
                            .replace("http://", "")
                            .replace("https://", "")
                            .replace("www.", "")
                        )
                    }
                    onSubmitEditing={() => linkRef.current.focus()}
                    // onEndEditing={(newTerm) => 
                    //     commentTextOnPost(
                    //         newTerm,
                    //         replyToProfile,
                    //         replyToPostId,
                    //         replyToUsername,
                    //     ).then((comment) => {
                    //         
                    //     })
                    // }
                />
            </View>


            {/* Link */}
            <View
                style={theme == 'light' ? styles.linkLightContainer : styles.linkDarkContainer}
            >
                <TextInput
                    ref={(input) => { linkRef.current = input; }}
                    inputAccessoryViewID={linkViewID}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => handleFocus()}
                    // onBlur={() => } // focus lost
                    blurOnSubmit={false}
                    maxLength={100}
                    multiline={false}
                    style={theme == 'light' ? styles.lightInputStyle : styles.darkInputStyle} 
                    placeholder="https://example.com"
                    value={linkInput}
                    placeholderTextColor={theme == "light" ? "#555555" : "#BBBBBB"}
                    onChangeText={
                        newTerm => 
                        setLinkInput(
                            newTerm
                            .replace("(", "")
                            .replace(")", "")
                            .replace("[", "")
                            .replace("]", "")
                            .replace(" ", "")
                        )
                    }
                    onSubmitEditing={() => handleDone()} // Call done function to put the link text with URL&Name in the comment
                    // onEndEditing={(newTerm) => 
                    //     commentTextOnPost(
                    //         newTerm,
                    //         replyToProfile,
                    //         replyToPostId,
                    //         replyToUsername,
                    //     ).then((comment) => {
                    //         
                    //     })
                    // }
                />
            </View>


            {/* Done Button */}
            <TouchableOpacity
                style={theme == 'light' ? styles.lightDoneButton: styles.darkDoneButton}
                onPress={handleDone()}
            >
                <Text style={theme == 'light' ? styles.lightDoneStyle : styles.darkDoneStyle}>Done</Text>
            </TouchableOpacity>
            
        </View>
    );
};


const styles = StyleSheet.create({
    lightBottomContainer: {
        flexDirection: 'row',
        flex: 1,
        height: 55,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        alignContent: 'center',
    },
    darkBottomContainer: {
        flexDirection: 'row',
        flex: 1,
        height: 55,
        backgroundColor: '#141414',
        alignItems: 'center',
        alignContent: 'center',
    },
    lightInputStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 400,
        marginHorizontal: 7,
        alignSelf: 'center',
        color: '#222222',
    },
    darkInputStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 400,
        marginHorizontal: 7,
        alignSelf: 'center',
        color: '#F4F4F4',
    },
    linkNameLightContainer: {
        flexDirection: 'row',
        width: 125,
        height: 40,
        marginLeft: 2,
        marginRight: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#999999',
        alignItems: 'center',
        alignContent: 'center',
    },
    linkNameDarkContainer: {
        flexDirection: 'row',
        width: 125,
        height: 40,
        marginLeft: 2,
        marginRight: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#4D4D4D',
        alignItems: 'center',
        alignContent: 'center',
    },
    linkLightContainer: {
        flex: 1,
        flexDirection: 'row',
        height: 40,
        marginRight: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#999999',
    },
    linkDarkContainer: {
        flex: 1,
        flexDirection: 'row',
        height: 40,
        marginRight: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#4D4D4D',
    },
    lightDoneButton: {
        width: 75,
        height: 40,
        borderRadius: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        marginRight: 7,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
   },
   darkDoneButton: {
        width: 75,
        height: 40,
        borderRadius: 100,
        borderWidth: 1.5,
        backgroundColor: 'rgba(100, 100, 100, 0.5)',
        borderColor: '#4A4A4A',
        marginRight: 7,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
   },
   lightDoneStyle: {
        fontSize: 18,
        fontWeight: 500,
        alignSelf: 'center',
        color: '#FFFFFF',
        marginBottom: 1,
    },
    darkDoneStyle: {
        fontSize: 18,
        fontWeight: 500,
        alignSelf: 'center',
        color: '#F4F4F4',
        marginBottom: 1,
    },
});

export default LinkInput;
