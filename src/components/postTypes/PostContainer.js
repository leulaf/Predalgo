import React, {useContext, useState, useEffect} from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { Image } from 'expo-image';
import {ThemeContext} from '../../../context-store/context';
import { Overlay } from 'react-native-elements';
import { firebase, storage, db, ref, deleteObject } from '../../config/firebase';
import { doc, getDoc, getDocs, where, collection, query, deleteDoc, updateDoc, increment } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';

import TitleText from '../../shared/Text/TitleText';

import Animated, {FadeIn} from 'react-native-reanimated';

import GlobalStyles from '../../constants/GlobalStyles';

import ContentBottom from './ContentBottom';
import PostBottom from './PostBottom';

import DeleteIcon from '../../../assets/trash_delete.svg';
import ReportIcon from '../../../assets/danger.svg';

import ThreeDotsLight from '../../../assets/three_dots_light.svg';
import ThreeDotsDark from '../../../assets/three_dots_dark.svg';

const onNavToPost =  (navigation, postId, title, tags, profile, profilePic, username, imageUrl, template, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount) => () => {
    navigation.push('Post', {
        postId: postId,
        title: title,
        tags: tags,
        imageUrl: imageUrl,
        memeName: memeName,
        template: false,
        templateState: null,
        imageHeight: imageHeight,
        imageWidth: imageWidth,
        text: text,
        likesCount: likesCount,
        commentsCount: commentsCount,
        profile: profile,
        username: username,
        profilePic: profilePic,
    });
}

const goToProfile = (navigation, profile, username, profilePic) => () => {
    navigation.push('Profile', {
        user: profile,
        username: username,
        profilePic: profilePic,
    })
}
const contentBottom = (memeName, tags) => (
    <ContentBottom
        memeName={memeName}
        tags={tags}
    />
)
const postBottom = (postId, likesCount, commentsCount) => (
    <PostBottom
        postId={postId}
        likesCount={likesCount}
        commentsCount={commentsCount}
    />
)
const PostContainer = ({ title, imageUrl, imageHeight, imageWidth, text, memeName, template, templateState, likesCount, commentsCount, tags, content, profile, postId, profilePic, username, repostUsername }) => {
    const navigation = useNavigation();
    const {theme,setTheme} = useContext(ThemeContext);

    const [deleted, setDeleted] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);


    let threeDots
    
    if(theme == 'light'){
        threeDots = <ThreeDotsLight width={40} height={40} style={styles.threeDots}/>
    }else{
        threeDots = <ThreeDotsDark width={40} height={40} style={styles.threeDots}/>
    }

    
    const toggleOverlay = React.useCallback(() => () => {
        setOverlayVisible(!overlayVisible);
    }, [overlayVisible]);


    const deletePost = React.useCallback(() => async() => {
        setOverlayVisible(false);
        const postRef = doc(db, 'allPosts', postId);
        const postSnapshot = await getDoc(postRef);
        data = postSnapshot.data();

        if (postSnapshot.exists) {
            await deleteDoc(postRef).then(async () => {
                
                Alert.alert('Post deleted!');
                setDeleted(true);


                // update posts count for current user
                const currentUserRef = doc(db, 'users', firebase.auth().currentUser.uid);

                await updateDoc(currentUserRef, {
                    posts: increment(-1)
                });


                if (data.imageUrl) {
                    const imageRef = ref(storage, data.imageUrl);

                    // Delete the file
                    await deleteObject(imageRef).then(() => {
                        // File deleted successfully
                        // console.log('Image deleted!');
                    }).catch((error) => {
                        // Uh-oh, an error occurred!
                        // console.log(error);
                    });
                } else if (data.memeName) {
                    const templateRef = doc(db, "imageTemplates", data.memeName);

                    await updateDoc(templateRef, {
                        useCount: increment(1)
                    });
                }

            }).catch((error) => {
                // console.log(error);
            })
        }
    }, []);


    // if post is deleted or content is null, don't show post
    if (deleted || content == null || content == undefined) {  
        return null;
    }


    return (
        <Animated.View
            entering={FadeIn} 
            style={theme == 'light' ? GlobalStyles.lightPostContainer: GlobalStyles.darkPostContainer}
        >


            {/* profile pic, username and title*/}
            <View 
                style={{flexDirection: 'row', marginLeft: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center', alignContent: 'center'}}
            >
                {/* profile pic */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={goToProfile(navigation, profile, username, profilePic)}
                >
                    {profilePic != "" ? (
                        <Image source={{ uri: profilePic }} style={styles.profileImage}/>
                    ) : (
                        <Image source={require('../../../assets/profile_default.png')} style={styles.profileImage} cachePolicy='disk'/>
                    )}
                </TouchableOpacity>
                
                {/* username */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={goToProfile(navigation, profile, username, profilePic)}

                    style={{flexDirection: 'column', marginLeft: 5, alignItems: 'center', justifyContent: 'center', alignContent: 'center'}}
                >

                    {
                        repostUsername ?
                            <Text style={theme == 'light' ? styles.lightRepostUsername: styles.darkRepostUsername}>
                                @{repostUsername} reposted
                            </Text>
                        :
                            null
                    }

                    {/* username */}
                    <Text style={theme == 'light' ? styles.lightUsername: styles.darkUsername}>
                        @{username}
                    </Text>


                </TouchableOpacity>
                
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, imageUrl, template, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
                    style={{flex: 1, height: 40}}
                />


                
                {/* three dots */}
                <TouchableOpacity 
                    activeOpacity={1}
                    style={{flexDirection: 'row'}}
                    onPress= {toggleOverlay()}
                >
                    {threeDots}
                </TouchableOpacity>
            </View>


            {/* title */}
            <TouchableOpacity
                activeOpacity={1}
                onPress={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, imageUrl, template, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
            >

                {/* title */}
                <TitleText title={title}/>

            </TouchableOpacity>
                
            
            {/* Post content. Image, Text etc. */}
            <TouchableOpacity
                activeOpacity={1}
                onPress={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, imageUrl, template, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
            >

                {content}

            </TouchableOpacity>


            {/* tags and meme name */}
            {contentBottom(memeName, tags)}


            {/* likes, comments, repost, share */}
            {postBottom(postId, likesCount, commentsCount)}


            {/* 
                an overlay popup that appears when you click on the three dots.
                if the post is from the current users, user can delete it.
                if the post is not from the current users, user can report it.
            */}
            <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay()}>
                
                {profile === firebase.auth().currentUser.uid ?
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{flexDirection: 'row'}}
                        onPress={deletePost()}
                    >
                        <DeleteIcon width={40} height={40} style={{marginLeft: 2}}/>
                        <Text style={styles.overlayText}>Delete Post</Text>
                    </TouchableOpacity>
                :
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{flexDirection: 'row'}}
                        onPress={toggleOverlay()}
                    >
                        <ReportIcon width={35} height={35} style={{marginLeft: 2}}/>
                        <Text style={styles.overlayText}>Report Post</Text>
                    </TouchableOpacity>
                }
            </Overlay>

        </Animated.View>
    );
}

const styles = StyleSheet.create({
    threeDots: {
        // marginLeft: 365,
        padding: 10,
        marginTop: -20,
        marginLeft: 5,
        marginRight: 10,
        // marginHorizontal: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        // marginLeft: 10,
        // marginRight: 6,
        // marginVertical: 10,
    },
    memeName: {
        width: 170,
        marginTop: 8,
        marginLeft: 0,
        flexDirection: 'row',
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
    lightRepostUsername: {
        fontSize: 16,
        fontWeight: '600',
        color: '#777777',
        textAlign: "left",
        marginBottom: 4,
    },
    darkRepostUsername: {
        fontSize: 16,
        fontWeight: '600',
        color: '#BBBBBB',
        textAlign: "left",
        marginBottom: 4,
    },
    lightPostTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333333',
        textAlign: "left",
        marginHorizontal: 12,
        marginTop: 3,
        // marginBottom: 1,
        // width: 290,
    },
    darkPostTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#DDDDDD',
        textAlign: "left",
        marginHorizontal: 12,
        marginTop: 3,
        // marginBottom: 10,
        // width: 290,
    },
    overlayText: {
        fontSize: 22,
        fontWeight: '500',
        color: '#000000',
        alignSelf: 'center',
        marginHorizontal: 10,
    },
});

export default PostContainer;
