import React from 'react';
import { Text, Linking } from 'react-native';

const OpenURLButton = ({url, name, style}) => {
    
    const handleClick = () => {
        Linking.canOpenURL("https://" + url).then(supported => {
            if (supported) {
                console.log(name)
                Linking.openURL("https://" + url);
            } else {
                console.log("Don't know how to open URI: " + url);
            }
        });
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