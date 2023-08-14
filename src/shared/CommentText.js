import React, {useEffect, useState, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import { ThemeContext } from '../../context-store/context';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';
import { firebase, storage, db } from '../config/firebase';
import { getDocs, where, limit, collection, query } from "firebase/firestore";

const navigateToTag = async(tag, navigation) => {

    if(tag.charAt(0) == '#'){
        navigation.push('Tag', {tag: tag});
    }else if(tag.charAt(0) == '@'){
        const username = tag.substring(1);

        const q = query(collection(db, "users"), where("username", "==", username), limit(1));

        const userSnap = await getDocs(q);   

        if(userSnap.docs.length > 0){
            const user = userSnap.docs[0].data();
            user.id = userSnap.docs[0].id;

            navigation.push('Profile', { user: user });
        }

    }
}

function padding(a, b, c, d) {
    return {
      paddingTop: a,
      paddingRight: b !== undefined ? b : a,
      paddingBottom: c !== undefined ? c : a,
      paddingLeft: d !== undefined ? d : (b !== undefined ? b : a)
    }
}

const splitText = (text, theme, navigation) => {
    let parts = text.split(' ');
    let currIndex = 0;

    let finalText = [];
    
    for (let i = 0; i < parts.length; i++) {
        
        if((parts[i].charAt(0) === '#' || parts[i].charAt(0) === '@') && parts[i].length > 1 && i == 0){
            // finalText.push( 
            //     <Text key={uuid.v4()} style={theme == 'light' ? styles.lightCommentText : styles.darkCommentText}>
            //         {parts.slice(currIndex, i).join(" ")}
            //     </Text>
            // );

            finalText.push(
                <Text
                    key={uuid.v4()}
                    suppressHighlighting={true}
                    onPress={() => navigateToTag(parts[i], navigation)}
                    style={theme == 'light' ? styles.lightLinkText : styles.darkLinkText}
                >
                    {parts[i]}
                </Text>
            );

            currIndex = i + 1;

        }else if((parts[i].charAt(0) === '#' || parts[i].charAt(0) === '@') && parts[i].length > 1){

            if(currIndex == 0){
                finalText.push( 
                    <Text key={uuid.v4()} style={theme == 'light' ? styles.lightCommentText : styles.darkCommentText}>
                        {parts.slice(currIndex, i).join(" ")}
                    </Text>
                );
            }else{
                finalText.push( 
                    <Text key={uuid.v4()} style={theme == 'light' ? styles.lightCommentText : styles.darkCommentText}>
                        {" " + parts.slice(currIndex, i).join(" ")}
                    </Text>
                );
            }
            

            finalText.push(
                <Text
                    key={uuid.v4()}
                    suppressHighlighting={true}
                    onPress={() => navigateToTag(parts[i], navigation)}
                    style={theme == 'light' ? styles.lightLinkText : styles.darkLinkText}
                >
                    {" " + parts[i]}
                </Text>
            );

            currIndex = i + 1;

        }else if(i == parts.length - 1 && currIndex != 0){
            finalText.push( 
                <Text key={uuid.v4()} style={theme == 'light' ? styles.lightCommentText : styles.darkCommentText}>
                    {" " + parts.slice(currIndex, i + 1).join(" ")}
                </Text>
            );
        }else if(i == parts.length - 1){
            finalText.push( 
                <Text key={uuid.v4()} style={theme == 'light' ? styles.lightCommentText : styles.darkCommentText}>
                    {parts.slice(currIndex, i + 1).join(" ")}
                    {/* {console.log(parts.slice(currIndex, i + 1))} */}
                </Text>
            );
        }
    }

    return finalText;
};

const CommentText = ({text}) => {
    const {theme} = useContext(ThemeContext);
    const navigation = useNavigation();

    
    return (

        <Text
            numberOfLines={15}
            style={styles.commentContainer}
        >

            {splitText(text, theme, navigation).map((textPart, index) => {
                // console.log(textPart);
                return textPart;
            })}
            
        </Text>
        
        
    );
}

const styles = StyleSheet.create({
    commentContainer: {
        marginHorizontal: 10,
        marginTop: 7,
        textAlign: 'auto',
    },
    lightCommentText: {
        fontSize: 18,
        fontWeight: "400",
        color: '#222222',
        // textAlign: 'auto',
        // marginBottom: 6,
    },
    darkCommentText: {
        fontSize: 18,
        fontWeight: "400",
        color: '#F4F4F4',
        textAlign: 'auto',
        // marginBottom: 6,
    },
    lightLinkText: {
        fontSize: 18,
        fontWeight: "400",
        color: 'blue',
        // textAlign: 'auto',
        // marginBottom: 6,
    },
    darkLinkText: {
        fontSize: 18,
        fontWeight: "400",
        color: '#00C5FF',
        textAlign: 'auto',
        // marginBottom: 6,
    }
})

export default CommentText;