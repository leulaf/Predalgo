import React from 'react';
import { Text, Linking } from 'react-native';
import {openBrowserAsync}  from 'expo-web-browser';


const OpenURLButton = ({url, name, style}) => {
    
    const handleClick = async() => {
        // Linking.canOpenURL("https://" + url).then(async supported => {
        //     if (supported) {
        //         await WebBrowser.openBrowserAsync("https://" + url);
        //         // console.log(name)
        //         // Linking.openURL("https://" + url);
        //     } else {
        //         // console.log("Don't know how to open URI: " + url);
        //     }
        // });
        await openBrowserAsync("https://" + url);
    };

    return (
        <Text
            onPress={handleClick}
            style={style}
        >
            {name ? name : url}
        </Text>
    );

}

export default OpenURLButton;