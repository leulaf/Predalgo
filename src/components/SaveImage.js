import React from 'react';
import {Image, View, StyleSheet,} from 'react-native';

export default function SaveImage({ navigation, title, imageUrl, memeText, tags }) {
    return (
        <View>
            <View style={{flexDirection: "row"}}>
                <Image source={{ uri: imageUrl }} style={styles.image}/>
            </View>
        </View>
    );
}