import React, {useContext, useState, useEffect} from 'react';
import {View, FlatList, Text, StyleSheet, TouchableOpacity, Alert, Dimensions} from 'react-native';
import { Image } from 'expo-image';
import GlobalStyles from '../../constants/GlobalStyles';
import { firebase, storage, db } from '../../config/firebase';
import { doc, getDoc, setDoc, deleteDoc, deleteObject, updateDoc, increment } from "firebase/firestore";
import {ThemeContext} from '../../../context-store/context';

import { fetchFirstFiveCommentsByRecent, fetchFirstFiveCommentsByPopular } from '../../shared/comment/GetComments';

import ResizableImage from '../../shared/ResizableImage';

import { Overlay } from 'react-native-elements';

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

// SecondaryComment is a comment that is a reply to a comment
import SubComment from './SubComment';

import { getAuth } from "firebase/auth";
import { set } from 'react-native-reanimated';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
const auth = getAuth();

const windowWidth = Dimensions.get('window').width;

const MainComment = ({ profile, username, profilePic, commentId, replyToCommentId, replyToPostId, text, imageUrl, memeName, template, templateState, imageWidth, imageHeight, likesCount, commentsCount }) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const navigation = useNavigation();

    const [commentsList, setCommentsList] = useState([]); // array of comments - replies to this comment

    const [deleted, setDeleted] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [replyVisible, setReplyVisible] = useState(false);

    const [likeCount, setLikeCount] = useState(likesCount);
    const [likeString, setLikeString] = useState("");
    const [commentCount, setCommentCount] = useState(commentsCount);
    const [commentString, setCommentString] = useState("");
    const [liked, setLiked] = useState(false);

    const [viewMoreClicked, setViewMoreClicked] = useState(false);

    const [replyToComment, setReplyToComment] = useState("");

    const [repliesVisible, setRepliesVisible] = useState(false);
    const [replies, setReplies] = useState([]); // array of replies

    useEffect(() => {
        onUpdateLikeCount(likesCount);
        onUpdateCommentCount(commentsCount); // update comment count string
    }, []);

    // if like count is above 999 then display it as count/1000k + k
    // if like count is above 999999 then display it as count/1000000 + m
    // round down to whole number
    const onUpdateLikeCount = (likeCount) => {
        if (likeCount === 0) {
          setLikeString("0");
        } else if (likeCount > 999 && likeCount < 1000000) {
          setLikeString(Math.floor(likeCount / 1000) + "k");
        } else if (likeCount > 999999) {
          setLikeString(Math.floor(likeCount / 1000000) + "m");
        } else {
          setLikeString(likeCount);
        }
    };

    // if comment count is above 999 then display it as count/1000k + k
    // if comment count is above 999999 then display it as count/1000000 + m
    // round down to whole number
    const onUpdateCommentCount = (commentCount) => {
        if (commentCount === 0) {
          setCommentString("0");
        } else if (commentCount > 999 && commentCount < 1000000) {
          setCommentString(Math.floor(commentCount / 1000) + "k");
        } else if (commentCount > 999999) {
          setCommentString(Math.floor(commentCount / 1000000) + "m");
        } else {
          setCommentString(commentCount);
        }
    };

    // update like count and add post to liked collection
    const onLike = async () => {
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
                onUpdateLikeCount(likeCount + 1);
                setLikeCount(likeCount + 1);
            });
        }
      
        setLiked(true);
    };

    // update like count and add post to liked collection
    const onDisike = async () => {
        // delete comment from likedComments collection
        await deleteDoc(doc(db, "likedComments", firebase.auth().currentUser.uid, "comments", commentId))

        // update like count for Comment
        const commentRef = doc(db, 'comments', replyToPostId, "comments", commentId);

        await updateDoc(commentRef, {
            likesCount: increment(-1)
        }).then(() => {
            onUpdateLikeCount(likeCount - 1);
            setLikeCount(likeCount - 1);
            setLiked(false);
        });


    }

    const deleteComment = () => {
        if(deleted){
            return;
        }
        const commentRef = doc(db, 'comments', replyToPostId, "comments", commentId);
        const commentSnapshot = getDoc(commentRef);
        
        commentSnapshot.then(async (snapshot) => {
            if (snapshot.exists) {
                await deleteDoc(commentRef).then(async () => {
                    Alert.alert('Comment deleted!');

                    setDeleted(true);
                    
                    // update comment count for Comment or Post
                    if(replyToCommentId){
                        const commentRef = doc(db, 'comments', replyToPostId, "comments", replyToCommentId);

                        await updateDoc(commentRef, {
                            commentsCount: increment(-1)
                        }).then(() => {
                            onUpdateLikeCount(likeCount - 1);
                            setLikeCount(likeCount - 1);
                            setLiked(false);
                        });
                    }else{
                        const postRef = doc(db, 'allPosts', replyToPostId);

                        await updateDoc(postRef, {
                            commentsCount: increment(-1)
                        }).then(() => {
                            onUpdateLikeCount(likeCount - 1);
                            setLikeCount(likeCount - 1);
                            setLiked(false);
                        });
                    }

                }).catch((error) => {
                    // console.log(error);
                })

                

                data = snapshot.data();
                // console.log(data.imageUrl);

                // if (data.imageUrl) {
                //     const imageRef = ref(storage, "gs://predalgo-backend.appspot.com/profilePics/adaptive-icon.png");
  
                //     // Delete the file
                //     deleteObject(imageRef).then(() => {
                //         // File deleted successfully
                //         console.log('Image deleted!');
                //     }).catch((error) => {
                //         // Uh-oh, an error occurred!
                //         console.log(error);
                //     });
                // }
            }

            
        })
    
        
    }

    let threeDots, likes, alreadyLiked, reply, down

    const onNavToComment = () => {
        navigation.push('Comment', {
            commentId: commentId,
            replyToPostId: replyToPostId,
            replyToCommentId: replyToCommentId,
            replyToProfile: profile,
            replyToUsername: username,
            imageUrl: imageUrl,
            memeName: memeName,
            template: template,
            templateState: templateState,
            imageHeight: imageHeight,
            imageWidth: imageWidth,
            text: text,
            likesCount: likesCount,
            commentsCount: commentsCount,
            onReply: false,
            profile: auth.currentUser.uid,
            username: auth.currentUser.displayName,
            profilePic: auth.currentUser.photoURL,
        });
    }

    const onReply = () => {
        navigation.push('Comment', {
            commentId: commentId,
            replyToPostId: replyToPostId,
            replyToCommentId: replyToCommentId,
            replyToProfile: profile,
            replyToUsername: username,
            imageUrl: imageUrl,
            memeName: memeName,
            template: template,
            templateState: templateState,
            imageHeight: imageHeight,
            imageWidth: imageWidth,
            text: text,
            likesCount: likesCount,
            commentsCount: commentsCount,
            onReply: true,
            profile: auth.currentUser.uid,
            username: auth.currentUser.displayName,
            profilePic: auth.currentUser.photoURL,
        });
    }

    const getFirstFiveCommentsByPopular = async () => {
        await fetchFirstFiveCommentsByPopular(replyToPostId, commentId).then((comments) => {
            
            setCommentsList(comments);
            
        });
    }

    const onFirstViewMoreClicked = () => {
        setViewMoreClicked(true);
        getFirstFiveCommentsByPopular();
    }
    
    if(theme == 'light'){
        threeDots = <ThreeDotsLight width={33} height={33} style={{}}/>
        likes = <Likes width={20} height={20} style={{ marginRight: 5 }}/>;
        alreadyLiked = <Liked width={20} height={20} style={{ marginRight: 5 }}/>;
        reply = <Reply width={18} height={18} style={{ marginRight: 5 }}/>;
        down = <Down width={25} height={25} style={{ marginRight: 5 }}/>;
    }else{
        threeDots = <ThreeDotsDark width={33} height={33} style={{}}/>
        likes = <LikesDark width={21} height={21} style={{ marginRight: 5 }}/>;
        alreadyLiked = <LikedDark width={21} height={21} style={{ marginRight: 5 }}/>;
        reply = <ReplyDark width={18} height={18} style={{ marginRight: 5 }}/>;
        down = <DownDark width={25} height={25} style={{ marginRight: 5 }}/>;
    }

    if(deleted){
        return null;
    }

    return (
        <View style={theme == 'light' ? styles.lightCommentContainer : styles.darkCommentContainer}>
            
            {/* Profile Picture and Username */}
            <View style={{marginTop: 8, flexDirection: 'row', alignItems: 'center'}}>
                
                {/* Profile Picture */}
                <TouchableOpacity 
                    onPress={() => {
                        
                        navigation.push('Profile', {
                            user: profile,
                            username: username,
                            profilePic: profilePic,
                        })
                        
                    }}
                >
                    <Image 
                        source={{uri: profilePic}} 
                        style={styles.profileImage} 
                        placeholder={require('../../../assets/profile_default.png')}
                    />
                </TouchableOpacity>

                {/* Username */}
                <TouchableOpacity 
                    onPress={() => {
                        
                        navigation.push('Profile', {
                            user: profile,
                            username: username,
                            profilePic: profilePic,
                        })
                        
                    }}
                >
                    <Text style={theme == 'light' ? styles.lightUsername : styles.darkUsername}>
                        @{username}
                    </Text>
                </TouchableOpacity>
                

                {/* Spacer */}
                <TouchableOpacity
                    style={{flex: 1, height: 30}}
                    onPress={() => onNavToComment()}
                ></TouchableOpacity>

                {/* Three Dots */}
                <TouchableOpacity 
                    style={{flexDirection: 'row', marginTop: -15, marginRight: 10}}
                    onPress= {() => setOverlayVisible(true)}
                >
                    {threeDots}
                </TouchableOpacity>
            
            </View>

            {/* Comment Text */}
            {(text != null && text != "" && text != undefined) &&
                <TouchableOpacity 
                    onPress = {() => onNavToComment()}
                    // style={theme == 'light' ? styles.lightCommentText : styles.darkCommentText}
                >
                    
                    <Text style={theme == 'light' ? styles.lightCommentText : styles.darkCommentText}>
                        {text}
                    </Text>

                </TouchableOpacity>
            }
            
            {/* Comment Image */}
            {(imageUrl != null && imageUrl != "" && imageUrl != undefined) &&
                <TouchableOpacity
                    style={{backgroundColor: 'black', marginTop: 9, marginBottom: 2}}
                    onPress = {() => onNavToComment()}
                >
                    <ResizableImage 
                        image={imageUrl}
                        height={imageHeight}
                        width={imageWidth}
                        maxHeight={500}
                        maxWidth={windowWidth}
                        style={{borderRadius: 0}}
                    />
                </TouchableOpacity>
            }

            {/* Reply and Like */}
            <View style={{ flexDirection: 'row', marginTop: 1,  alignItems: 'center', alignContent: 'center'  }}>
                
                {/* View replies */}
                {/* {
                    commentCount > 0 && !viewMoreClicked?
                        
                    <TouchableOpacity
                        style={{ marginLeft: 12, height: 40, margin: 2, flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}
                        onPress = {() => {
                            !viewMoreClicked ? 
                                onFirstViewMoreClicked()
                            : 
                                null;
                        }}
                    >

                        <Text style={theme == 'light' ? styles.lightViewText: styles.darkViewText}>
                            View {commentString} replies
                        </Text>

                        {down}
                        
                    </TouchableOpacity>

                    : null
                } */}


                {/* Spacer */}
                <TouchableOpacity
                    style={{flex: 1, height: 40, }}
                    onPress={() => onNavToComment()}
                ></TouchableOpacity>

                {/* Reply */}
                <TouchableOpacity
                    style={{ paddingLeft: 10, height: 40, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}
                    onPress={() => onReply()}
                >
                    {reply}

                    <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                        Reply
                    </Text>
                </TouchableOpacity>
                
                {/* Like Button */}
                <TouchableOpacity
                    style={{  width: 110, paddingLeft: 10, height: 40, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}
                    onPress={async() => liked ? await onDisike() : await onLike()}
                >
                    
                    {liked ?
                        alreadyLiked
                    :
                        likes
                    }

                    <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                        {likeString} Likes
                    </Text>

                </TouchableOpacity>
            </View>


            {/* Replies - SubComments */}
            <View style={{backgroundColor: theme == 'light' ? '#F2F2F2' : '#0A0A0A' }}>
                <FlatList
                    data={commentsList}
                    keyExtractor={(item, index) => item.id + '-' + index}
                    renderItem={({ item, index }) => {
                        if(index == commentsList.length - 1){
                            return (

                                <View style={{marginTop: 2, marginBottom: 6}}>

                                    <SubComment
                                        replyToPostId={replyToPostId}
                                        replyToCommentId={commentId}
                                        profile={item.profile}
                                        username={item.username}
                                        profilePic={item.profilePic}
                                        commentId={item.id}
                                        text={item.text}
                                        imageUrl={item.imageUrl}
                                        memeName={item.memeName}
                                        template={item.template}
                                        templateState={item.templateState}
                                        imageWidth={item.imageWidth}
                                        imageHeight={item.imageHeight}
                                        likesCount={item.likesCount}
                                        commentsCount={item.commentsCount}
                                    />
                                </View>
                            );
                        }else if(index == 0){
                            return (

                                <View style={{marginTop: 2}}>

                                    <SubComment
                                        replyToPostId={replyToPostId}
                                        replyToCommentId={commentId}
                                        profile={item.profile}
                                        username={item.username}
                                        profilePic={item.profilePic}
                                        commentId={item.id}
                                        text={item.text}
                                        imageUrl={item.imageUrl}
                                        memeName={item.memeName}
                                        template={item.template}
                                        templateState={item.templateState}
                                        imageWidth={item.imageWidth}
                                        imageHeight={item.imageHeight}
                                        likesCount={item.likesCount}
                                        commentsCount={item.commentsCount}
                                    />
                                </View>
                            );
                        }

                        return (
                            <SubComment
                                replyToPostId={replyToPostId}
                                replyToCommentId={commentId}
                                profile={item.profile}
                                username={item.username}
                                profilePic={item.profilePic}
                                commentId={item.id}
                                text={item.text}
                                imageUrl={item.imageUrl}
                                memeName={item.memeName}
                                template={item.template}
                                templateState={item.templateState}
                                imageWidth={item.imageWidth}
                                imageHeight={item.imageHeight}
                                likesCount={item.likesCount}
                                commentsCount={item.commentsCount}
                            />
                        );
                    }}
                />
            </View>
            
            {/* View replies */}
            {
                commentCount > 0 
                // && viewMoreClicked
                ?
                    
                <TouchableOpacity
                    style={{ backgroundColor: theme == 'light' ? '#EEEEEE' : '#171717', borderBottomLeftRadius: 12.5, borderBottomRightRadius: 12.5, flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}
                    onPress = {() => {
                        !viewMoreClicked ? 
                            onFirstViewMoreClicked()
                        : 
                            null;
                    }}
                >

                    <Text style={[theme == 'light' ? styles.lightViewText : styles.darkViewText,{
                        margin: 10,
                    }]}>
                        View {commentString} replies
                    </Text>

                    {down}
                    
                </TouchableOpacity>

                : null
            }


            {/* 
                an overlay popup that appears when you click on the three dots.
                if the post is from the current users, user can delete it.
                if the post is not from the current users, user can report it.
            */}
            <Overlay isVisible={overlayVisible} onBackdropPress={() => setOverlayVisible(false)} overlayStyle={{borderRadius: 100}}>
                
                {profile === firebase.auth().currentUser.uid ?
                    <TouchableOpacity
                        style={{flexDirection: 'row'}}
                        onPress={async() => {
                            setOverlayVisible(false);
                            await deleteComment();
                        }
                    }>
                        <DeleteIcon width={40} height={40} style={{marginLeft: 2}}/>
                        <Text style={styles.overlayText}>Delete Post</Text>
                    </TouchableOpacity>
                :
                    <TouchableOpacity
                        style={{flexDirection: 'row'}}
                        onPress={() => {
                            setOverlayVisible(false);
                        }
                    }>
                        <ReportIcon width={35} height={35} style={{marginLeft: 2}}/>
                        <Text style={styles.overlayText}>Report Post</Text>
                    </TouchableOpacity>
                }
            </Overlay>
        </View>
    );
}

const styles = StyleSheet.create({
    profileImage: {
        width: 32,
        height: 32,
        borderRadius: 50,
        marginLeft: 10,
        marginRight: 5,
        // marginVertical: 8,
        // marginBottom: 4,
    },
    lightCommentContainer: {
        backgroundColor: '#FFFFFF',
        marginTop: 8,
        borderRadius: 12.5,
    },
    darkCommentContainer: {
        backgroundColor: '#121212',
        marginTop: 8,
        borderRadius: 12.5,
    },
    lightUsername: {
        fontSize: 14,
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
        fontSize: 18,
        fontWeight: "400",
        color: '#222222',
        textAlign: 'auto',
        marginHorizontal: 10,
        marginTop: 7,
        // marginBottom: 6,
    },
    darkCommentText: {
        fontSize: 18,
        fontWeight: "400",
        color: '#F4F4F4',
        textAlign: 'auto',
        marginHorizontal: 10,
        marginTop: 8,
        // marginBottom: 6,
    },
    lightViewText: {
        fontSize: 13,
        fontWeight: "500",
        color: '#1D1D1D',
        marginRight: 2,
    },
    darkViewText: {
        fontSize: 13,
        fontWeight: "500",
        color: '#E6E6E6',
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

export default MainComment;
