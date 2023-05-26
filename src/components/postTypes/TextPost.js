import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {ThemeContext} from '../../../context-store/context';
import PostContainer from './PostContainer';
import PostBottom from './PostBottom';

const TextPost = ({ navigation, title, text, tags }) => {
    const {theme,setTheme} = useContext(ThemeContext);

    return (
        <PostContainer 
            title={title}
            content={
                <>
                    <View style={theme == "light" ? styles.lightTextContainer : styles.darkTextContainer}>
                            <Text numberOfLines={15} style={theme == "light" ? styles.lightText : styles.darkText}>{text}</Text>
                    </View>
                    <PostBottom tags={tags} memeText={false} hideBottom/>
                </>
                
            }
        />
    );
    }

const styles = StyleSheet.create({
    lightTextContainer: {
        minHeight: 353,
        maxHeight: 353,
        width: "100%",
        backgroundColor: "#FEFEFE",
        borderRadius: 13,
        borderColor: "#EEEEEE",
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    darkTextContainer: {
        minHeight: 353,
        maxHeight: 353,
        width: "100%",
        backgroundColor: "#1D1D1D",
        borderRadius: 13,
        borderColor: "#444444",
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    lightText: {
        fontSize: 20,
        fontWeight: "400",
        color: '#000000',
        textAlign: "left",
        marginLeft: 10,
        marginRight: 65,
        marginVertical: 10,
    },
    darkText: {
        fontSize: 20,
        fontWeight: "400",
        color: '#F2F2F2',
        textAlign: "left",
        marginLeft: 10,
        marginRight: 65,
        marginVertical: 10,
    }
});

export default TextPost;
