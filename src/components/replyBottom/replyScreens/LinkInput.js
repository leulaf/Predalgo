import React, {useState, useContext} from 'react';
import { TouchableOpacity, StyleSheet, TextInput, Keyboard, InputAccessoryView, Alert } from 'react-native';
import uuid from 'react-native-uuid';

import {ThemeContext} from '../../../../context-store/context';


const LinkInput = ({linkInput, setLinkInput, replyTextToPostRef, textInputInFocus, currentIndex, handleFocus, handleBlur}) => {
    const {theme} = useContext(ThemeContext);
    const inputAccessoryViewID = uuid.v4();

    return (
        <TextInput
            ref={(input) => { replyTextToPostRef.current = input; }}
            inputAccessoryViewID={inputAccessoryViewID}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => handleFocus() }   //focus received
            onBlur={() =>  handleBlur() }     //focus lost
            maxLength={100}
            multiline={false}
            style={[
                theme == 'light' ? styles.lightInputStyle : styles.darkInputStyle, 
                {   
                    height: !textInputInFocus ? 35 :

                    (
                        currentIndex == 1 ? 225 : 415
                    ),
                    marginTop: 1,
                }
            ]} 
            placeholder="Reply to post"
            value={linkInput}
            placeholderTextColor={theme == "light" ? "#666666" : "#AAAAAA"}
            onChangeText={newTerm => setLinkInput(newTerm)}
            // onEndEditing={(newTerm) => 
            //     commentTextOnPost(
            //         newTerm,
            //         replyToProfile,
            //         replyToPostId,
            //         replyToUsername,
            //     ).then((comment) => {
            //         
            //         bottomSheetRef.current.snapToIndex(0);
            //     })
            // }
        />
    );
};


const styles = StyleSheet.create({
    lightInputStyle: {
        flex: 1,
        // height: 40,
        fontSize: 18,
        fontWeight: "400",
        marginHorizontal: 12,
        // marginVertical: 20,
        // alignSelf: 'center',
        color: '#222222',
    },
    darkInputStyle: {
        flex: 1,
        // height: 40,
        fontSize: 18,
        fontWeight: "400",
        marginHorizontal: 12,
        // marginVertical: 13,
        // alignSelf: 'center',
        color: '#F4F4F4',
    },
});

export default LinkInput;
