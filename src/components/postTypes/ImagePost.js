import React from 'react';
import {Image, View, StyleSheet,} from 'react-native';
import FlexImage from 'react-native-flex-image';
import PostContainer from './PostContainer';
import PostBottom from './PostBottom';

const ImagePost = ({ navigation, title, url, memeText, tags }) => {
        return (
            <PostContainer 
                title={title}
                content={
                    <View>
                        <View style={{flexDirection: "row"}}>
                            <Image source={{ uri: url }} style={styles.image}/>
                        </View>
                        <PostBottom tags={tags} memeText={memeText}/>
                    </View>
                }
            />
        );
    }

const styles = StyleSheet.create({
    image: {
        flex: 1,
        // marginHorizontal: 5,
        minHeight: 350,
        maxHeight: 350,
        borderRadius: 15,

    }
});

export default ImagePost;
