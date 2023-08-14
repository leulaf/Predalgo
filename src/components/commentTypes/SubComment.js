import React, {useContext, useRef, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions} from 'react-native';
import { Image } from 'expo-image';
import GlobalStyles from '../../constants/GlobalStyles';
import { firebase, storage, db, ref, deleteObject } from '../../config/firebase';
import { doc, getDoc, setDoc, deleteDoc, updateDoc, increment } from "firebase/firestore";
import {ThemeContext} from '../../../context-store/context';

import CommentText from '../../shared/Text/CommentText';

import Animated, {FadeIn} from 'react-native-reanimated';

import PinturaEditor from "@pqina/react-native-expo-pintura";

import { manipulateAsync } from 'expo-image-manipulator';

import { Overlay } from 'react-native-elements';

import ResizableImage from '../../shared/ResizableImage';

import { useNavigation } from '@react-navigation/native';

// light mode icons
import ThreeDotsLight from '../../../assets/three_dots_light.svg';
import Likes from '../../../assets/likes.svg';
import Liked from '../../../assets/liked.svg';
import Reply from '../../../assets/reply_comment_light.svg';
import Down from '../../../assets/down_light.svg';

// dark mode icons
import ThreeDotsDark from '../../../assets/three_dots_dark.svg';
import LikesDark from '../../../assets/likes_dark.svg';
import LikedDark from '../../../assets/liked_dark.svg';
import ReplyDark from '../../../assets/reply_comment_dark.svg';
import DownDark from '../../../assets/down_dark.svg';

import DeleteIcon from '../../../assets/trash_delete.svg';
import ReportIcon from '../../../assets/danger.svg';

import { getAuth } from "firebase/auth";
const auth = getAuth();

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const onNavToComment =  (navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount) => () => {
    navigation.push('Comment', {
        commentId: commentId,
        replyToPostId: replyToPostId,
        replyToCommentId: replyToCommentId,
        replyToProfile: profile,
        replyToUsername: username,
        imageUrl: image,
        memeName: memeName,
        imageHeight: imageHeight,
        imageWidth: imageWidth,
        text: text,
        likesCount: likesCount,
        commentsCount: commentsCount,
        onReply: false,
        profile: profile,
        username: username,
        profilePic: profilePic,
    });
}

const onReply =  (navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount) => () => {
    navigation.push('Comment', {
        commentId: commentId,
        replyToPostId: replyToPostId,
        replyToCommentId: replyToCommentId,
        replyToProfile: profile,
        replyToUsername: username,
        imageUrl: image,
        memeName: memeName,
        template: false,
        imageHeight: imageHeight,
        imageWidth: imageWidth,
        text: text,
        likesCount: likesCount,
        commentsCount: commentsCount,
        onReply: true,
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

const intToString = (commentCount) => {
    if (commentCount === 0) {

      return "0";
    } else if (commentCount > 999 && commentCount < 1000000) {

        return Math.floor(commentCount / 1000) + "k";
    } else if (commentCount > 999999) {

        return Math.floor(commentCount / 1000000) + "m";
    } else {

        return commentCount;
    }
};

// update like count and add post to liked collection
const onLike = async (replyToPostId, commentId) => {
    return new Promise(async (resolve, reject) => {
        const likedRef = doc(db, "likedComments", firebase.auth().currentUser.uid, "comments", commentId);
        const likedSnapshot = await getDoc(likedRef);
    
        if (!likedSnapshot.exists()) {

            // add post to likes collection
            await setDoc(likedRef, {});
            
            // update like count for Comment
            const commentRef = doc(db, 'comments', replyToPostId, "comments", commentId);

            await updateDoc(commentRef, {
                likesCount: increment(1)
            }).then(() => {
                resolve(true);
            })
        }else{
            resolve(true);
        }
    });
};

// update like count and add post to liked collection
const onDisike = async (replyToPostId, commentId) => {
    return new Promise(async (resolve, reject) => {
        // delete comment from likedComments collection
        await deleteDoc(doc(db, "likedComments", firebase.auth().currentUser.uid, "comments", commentId))

        // update like count for Comment
        const commentRef = doc(db, 'comments', replyToPostId, "comments", commentId);

        await updateDoc(commentRef, {
            likesCount: increment(-1)
        }).then(() => {
            resolve(true);
        })
    });
};

const SubComment = ({ profile, username, profilePic, commentId, replyToCommentId, replyToPostId, text, imageUrl, memeName, template, templateState, imageWidth, imageHeight, likesCount, commentsCount,}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const navigation = useNavigation();

    const [deleted, setDeleted] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);

    const [image, setImage] = useState(imageUrl ? imageUrl :  template);
    
    const [liked, setLiked] = useState(false);

    const editorRef = useRef(null);

    const [finished, setFinished] = useState(template ? false : true);


    const deleteComment = React.useCallback(() => async() => {
        const commentRef = doc(db, 'comments', replyToPostId, "comments", commentId);
        const commentSnapshot = await getDoc(commentRef);
        data = commentSnapshot.data();

        if (commentSnapshot.exists) {
            await deleteDoc(commentRef).then(async () => {
                
                Alert.alert('Comment deleted!');
                setDeleted(true);


                // update comment count for Comment or Post
                const commentRef = doc(db, 'comments', replyToPostId, "comments", replyToCommentId);

                await updateDoc(commentRef, {
                    commentsCount: increment(-1)
                })
                

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
                }

            }).catch((error) => {
                // console.log(error);
            })
        }
    }, []);


    let threeDots, likes, alreadyLiked, reply, down
    
    if(theme == 'light'){
        threeDots = <ThreeDotsLight width={33} height={33} style={styles.threeDots}/>
        likes = <Likes width={20} height={20} style={{ marginRight: 5 }}/>;
        alreadyLiked = <Liked width={20} height={20} style={{ marginRight: 5 }}/>;
        reply = <Reply width={18} height={18} style={{ marginRight: 5 }}/>;
        down = <Down width={25} height={25} style={{ marginRight: 5 }}/>;
    }else{
        threeDots = <ThreeDotsDark width={33} height={33} style={styles.threeDots}/>
        likes = <LikesDark width={21} height={21} style={{ marginRight: 5 }}/>;
        alreadyLiked = <LikedDark width={21} height={21} style={{ marginRight: 5 }}/>;
        reply = <ReplyDark width={18} height={18} style={{ marginRight: 5 }}/>;
        down = <DownDark width={25} height={25} style={{ marginRight: 5 }}/>;
    }


    const toggleLike = () => async() => {
        if(liked){
            await onDisike(replyToPostId, commentId).then((result) => {
                if(result){
                    setLiked(false);
                }
            })
        }else{
            await onLike(replyToPostId, commentId).then((result) => {
                if(result){
                    setLiked(true);
                }
            })
        }
    }


    const toggleOverlay = React.useCallback(() => () => {
        setOverlayVisible(!overlayVisible);
    }, [overlayVisible]);


    // Load Meme with template and template state
    // Load Meme with template and template state
    const CreateMeme = React.useCallback(({image}) => {
        return (
            <PinturaEditor
                ref={editorRef}
                
                // src={image}
                // onClose={() => console.log('closed')}
                // onDestroy={() => console.log('destroyed')}
                // onLoad={() => 
                //     editorRef.current.editor.processImage(templateState)
                // }
                onInit={() => 
                    editorRef.current.editor.processImage(image, templateState)
                }
                onProcess={async({ dest }) => {
                    manipulateAsync(dest, [], ).then((res) => {
                        setFinished(true);
                        setImage(res.uri);
                        // console.log(res.uri)
                    })
                }}
            />    
        )
    }, [])


    if(deleted){
        return null;
    }


    return (
        <Animated.View 
            entering={FadeIn}
            // onLayout={(event) => setViewWidth(event.nativeEvent.layout.width)} 
            style={theme == 'light' ? styles.lightCommentContainer : styles.darkCommentContainer}
        >
            
            {/* Profile Picture and Username */}
            <View style={{marginTop: 7, flexDirection: 'row', alignItems: 'center'}} >
                
                {/* Load Meme with template and template state */}
                {!finished && <CreateMeme image={image}/>}

                {/* Profile Picture */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={goToProfile(navigation, profile, username, profilePic)}
                >
                   <Image 
                        source={{uri: profilePic}} 
                        style={styles.profileImage} 
                        placeholder={require('../../../assets/profile_default.png')}
                    />
                </TouchableOpacity>

                {/* Username */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={goToProfile(navigation, profile, username, profilePic)}
                >
                    <Text style={theme == 'light' ? styles.lightUsername : styles.darkUsername}>
                        @{username}
                    </Text>
                </TouchableOpacity>
                

                {/* Spacer */}
                <TouchableOpacity
                    activeOpacity={1}
                    style={{flex: 1, height: 30}}
                    onPress={onNavToComment(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
                ></TouchableOpacity>


                {/* Three Dots */}
                <TouchableOpacity
                    activeOpacity={1}
                    style={{flexDirection: 'row', marginTop: -15, marginRight: 10}}
                    onPress= {toggleOverlay()}
                >
                    {threeDots}
                </TouchableOpacity>
            
            </View>

            {/* Comment Text */}
            {(text != null && text != "" && text != undefined) &&
                <TouchableOpacity
                    activeOpacity={1}
                    onPress = {onNavToComment(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
                    // style={theme == 'light' ? styles.lightCommentText : styles.darkCommentText}
                >
                    
                    <CommentText text={text}/>

                </TouchableOpacity>
            }
            
            {/* Comment Image */}
            <TouchableOpacity
                activeOpacity={1}
                style={{backgroundColor: 'black', marginTop: 11, borderRadius: 0}}
                onPress = {onNavToComment(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
            >
                <ResizableImage 
                    image={image}
                    height={imageHeight}
                    width={imageWidth}
                    maxHeight={500}
                    maxWidth={windowWidth - 10}
                    style={{borderRadius: 0}}
                />
            </TouchableOpacity>


            {/* Reply and Like */}
            <View style={{ height: 40, flexDirection: 'row', marginTop: 2,  alignItems: 'center', alignContent: 'center' }}>
                
                {/* View replies */}
                {
                    commentsCount > 0 &&

                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ margin: 2, width: 150, height: 40, flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center', marginLeft: 0 }}
                        onPress = {onNavToComment(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
                    > 
                    
                        <View style={theme == 'light' ? styles.lightViewReplyLine : styles.darkViewReplyLine}/>

                        <Text style={theme == 'light' ? styles.lightViewText: styles.darkViewText}>
                            View {commentsCount} replies
                        </Text>
                        
                    </TouchableOpacity>
                }


                {/* Spacer */}
                <TouchableOpacity
                    activeOpacity={1}
                    style={{flex: 1, height: 40, }}
                    onPress={onNavToComment(navigation, commentId, replyToPostId, replyToCommentId, profile,profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
                ></TouchableOpacity>

                {/* Reply */}
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ paddingLeft: 10, height: 40, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}
                    onPress={onReply(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
                >
                    {reply}

                    <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                        Reply
                    </Text>
                </TouchableOpacity>
                
                {/* Like Button */}
                <TouchableOpacity
                    activeOpacity={1}
                    style={{  flexDirection: 'row', paddingLeft: 10, width: 110, height: 40, alignItems: 'center', alignContent: 'center' }}
                    onPress={toggleLike()}
                >
                    
                    {liked ?
                        alreadyLiked
                    :
                        likes
                    }

                    <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                        {liked ? intToString(likesCount + 1) : intToString(likesCount)} Likes
                    </Text>

                </TouchableOpacity>
            </View>

            {/* 
                an overlay popup that appears when you click on the three dots.
                if the post is from the current users, user can delete it.
                if the post is not from the current users, user can report it.
            */}
            <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay()} overlayStyle={{borderRadius: 100}}>
                
                {profile === firebase.auth().currentUser.uid ?
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{flexDirection: 'row'}}
                        onPress={deleteComment()}
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
    profileImage: {
        width: 32,
        height: 32,
        borderRadius: 50,
        marginLeft: 8,
        marginRight: 5,
        marginVertical: 0,
        marginBottom: -3 // fix for bottom margin, change it later
    },
    lightCommentContainer: {
        marginTop: 5,
        backgroundColor: '#FFFFFF',
        marginLeft: 10,
        // marginTop: 3,
        borderLeftWidth: 1,
        borderLeftColor: '#DDDDDD',
        borderTopWidth: 1,
        borderTopColor: "#EBEBEB",
        borderBottomWidth: 0.5,
        borderBottomColor: "#DDDDDD",

        borderRadius: 10,
    },
    darkCommentContainer: {
        marginTop: 5,
        backgroundColor: '#141414',
        marginLeft: 10,
        // marginTop: 3,
        borderLeftWidth: 1,
        borderLeftColor: '#202020',
        borderTopWidth: 1,
        borderTopColor: "#222222",
        borderBottomWidth: 0.5,
        borderBottomColor: "#242424",
        borderRadius: 10,
    },
    lightUsername: {
        fontSize: 14.7,
        fontWeight: "600",
        color: '#5D5D5D',
        textAlign: "left",
    },
    darkUsername: {
        fontSize: 14,
        fontWeight: "600",
        color: '#DADADA',
        textAlign: "left",
    },
    lightCommentText: {
        fontSize: 16,
        fontWeight: "400",
        color: '#222222',
        letterSpacing: 0.3,
        textAlign: 'auto',
        marginHorizontal: 8,
        // marginBottom: 6,
        marginTop: 8,
    },
    darkCommentText: {
        fontSize: 16,
        fontWeight: "400",
        color: '#F2F2F2',
        letterSpacing: 0.3,
        textAlign: "left",
        marginHorizontal: 8,
        // marginBottom: 6,
        marginTop: 8,
    },
    lightViewReplyLine: {
        backgroundColor: '#BBBBBB',
        height: 1.5,
        width: 20,
        marginRight: 7,
    },
    darkViewReplyLine: {
        backgroundColor: '#BBBBBB',
        height: 1.5,
        width: 20,
        marginRight: 7,
    },
    lightViewText: {
        fontSize: 13,
        fontWeight: "500",
        color: '#444444',
        marginRight: 2,
    },
    darkViewText: {
        fontSize: 13,
        fontWeight: "500",
        color: '#DDDDDD',
        marginRight: 2,
    },
    lightBottomText: {
        fontSize: 13,
        fontWeight: "500",
        color: '#555555',
        marginRight: 20,
    },
    darkBottomText: {
        fontSize: 13,
        fontWeight: "500",
        color: '#DDDDDD',
        marginRight: 20,
    },
    overlayText: {
        fontSize: 22,
        fontWeight: "500",
        color: '#000000',
        alignSelf: 'center',
        marginHorizontal: 10,
    },
});

export default SubComment;
