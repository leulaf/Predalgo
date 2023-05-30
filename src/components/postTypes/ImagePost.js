import React from 'react';
import {Image, View, StyleSheet,} from 'react-native';
import FlexImage from 'react-native-flex-image';
import PostContainer from './PostContainer';
import PostBottom from './PostBottom';

const ImagePost = ({ navigation, title, imageUrl, memeText, tags, profile, postId }) => {
        return (
            <PostContainer 
                title={title}
                profile={profile}
                postId={postId}
                content={
                    <View>
                        <View style={{flexDirection: "row"}}>
                            <Image source={{ uri: imageUrl }} style={styles.image}/>
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
        height: 350,
        borderRadius: 15,

    }
});

export default ImagePost;
