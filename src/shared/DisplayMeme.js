import PinturaEditor from "@pqina/react-native-expo-pintura";

import React from 'react';

import {onLikePost, onDisikePost} from './post/LikeDislikePost';

import { Image } from "expo-image";

import { useNavigation } from '@react-navigation/native';

import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

import { manipulateAsync } from 'expo-image-manipulator';

import intToString from "./intToString";

import ResizableImage from "./ResizableImage";


// light mode icons
import Likes from '../../assets/likes.svg';
import Liked from '../../assets/liked.svg';

// dark mode icons
import LikesDark from '../../assets/likes_dark.svg';
import LikedDark from '../../assets/liked_dark.svg';

const goToProfile = (navigation, profile, username, profilePic) => () => {
    navigation.push('Profile', {
        user: profile,
        username: username,
        profilePic: profilePic,
    })
}

const onNavToPost = (navigation, item, image) => () => {

    navigation.push('Post', {
        postId: item.postId,
        title: item.title,
        tags: item.tags,
        imageUrl: image,
        memeName: item.memeName,
        // template: item.template,
        // templateState: item.templateState,
        template: false,
        templateState: null,
        imageHeight: item.imageHeight,
        imageWidth: item.imageWidth,
        text: item.text,
        likesCount: item.likesCount,
        commentsCount: item.commentsCount,
        profile: item.profile,
        username: item.username,
        profilePic: item.profilePic,
    });
}

// Load Meme with template and template state
export default DisplayMeme = React.memo(({ theme, item, maxHeight, maxWidth, style }) => {
    const navigation = useNavigation();
    const editorRef = React.useRef(null);
    const [image, setImage] = React.useState(null);
    const [liked, setLiked] = React.useState(false);

    let likes, alreadyLiked;

    if(theme == 'light'){
        likes = <Likes width={23} height={23} style={{ marginRight: 7 }}/>;
        alreadyLiked = <Liked width={23} height={23} style={{ marginRight: 7 }}/>;
    }else{
        likes = <LikesDark width={24} height={24} style={{ marginRight: 7 }}/>;
        alreadyLiked = <LikedDark width={24} height={24} style={{ marginRight: 7 }}/>;
    }

    const toggleLike = () => async() => {
        if(liked){
            setLiked(false);
            await onDisikePost(item.id)
            .then((res) => {
                !res && setLiked(true);
            })
            .catch((e) => {
                setLiked(true);
            })
        }else{
            setLiked(true);
            await onLikePost(item.id)
            .then((res) => {
                !res && setLiked(false);
            })
            .catch((e) => {
                setLiked(false);
            })
        }
    }

    return (
        <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>

            <View 
                style={{flexDirection: 'row', width: "100%", marginVertical: 8, alignItems: 'center', justifyContent: 'center', alignContent: 'center'}}
            >
                {/* profile pic */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={goToProfile(navigation, item.profile, item.username, item.profilePic)}
                >
                    {item.profilePic != "" ? (
                        <Image source={{ uri: item.profilePic }} style={styles.profileImage}/>
                    ) : (
                        <Image source={require('../../assets/profile_default.png')} style={styles.profileImage} cachePolicy='disk'/>
                    )}
                </TouchableOpacity>
                
                {/* username */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={goToProfile(navigation, item.profile, item.username, item.profilePic)}

                    style={{flexDirection: 'column', marginLeft: 5, alignItems: 'center', justifyContent: 'center', alignContent: 'center'}}
                >

                    {/* username */}
                    <Text style={theme == 'light' ? styles.lightUsername: styles.darkUsername}>
                        @{item.username}
                    </Text>


                </TouchableOpacity>
                
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onNavToPost(navigation, item, image)}
                    style={{flex: 1, height: 40}}
                />

                {/* Like button */}
                <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignContent: 'center', marginRight: 10}}
                    onPress={toggleLike()}
                >
                    {liked ?
                        alreadyLiked
                    :
                        likes
                    }

                    <Text style={theme == 'light' ? styles.lightLikeCountText : styles.darkLikeCountText}>
                        {liked ? intToString(item.likesCount + 1) : intToString(item.likesCount)}
                    </Text>
                </TouchableOpacity>

            </View>

            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onNavToPost(navigation, item, image)}
            >

                <ResizableImage
                    image={image ? image : item.template}
                    style={style}
                    height={item.imageHeight}
                    width={item.imageWidth}
                    maxHeight={maxHeight}
                    maxWidth={maxWidth}
                />
                

            {
                    !(image) &&

                    <PinturaEditor
                        ref={editorRef}
                        
                        src={item.template}
                        // onClose={() => console.log('closed')}
                        // onDestroy={() => console.log('destroyed')}
                        onLoad={() => 
                            editorRef.current.editor.processImage(item.templateState)
                        }
                        // onInit={() => {
                        //     editorRef.current.editor.processImage(template, templateState)
                        // }}
                        onProcess={async({ dest }) => {
                            manipulateAsync(dest, [], ).then((res) => {
                                setImage(res.uri);
                                // console.log(res.uri)
                            })
                        }}
                    /> 
                }

            </TouchableOpacity>
        </View>
    )
}, itemEquals);


const itemEquals = (prev, next) => {
    return prev.item.id === next.item.id
}

const styles = StyleSheet.create({
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        // marginLeft: 10,
        // marginRight: 6,
        // marginVertical: 10,
    },
    lightUsername: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444444',
        textAlign: "left",
        // marginTop: 6,
    },
    darkUsername: {
        fontSize: 16,
        fontWeight: '600',
        color: '#DDDDDD',
        textAlign: "left",
        // marginTop: 6,
    },
    lightContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 15,
        borderRadius: 15,
    },
    darkContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        marginBottom: 15,
        borderRadius: 15,
    },
    lightLikeCountText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#444444',
    },
    darkLikeCountText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#EEEEEE',
    },
});