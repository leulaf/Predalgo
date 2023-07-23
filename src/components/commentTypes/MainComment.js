import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Image } from 'expo-image';
import GlobalStyles from '../../constants/GlobalStyles';
import { firebase, storage, db } from '../../config/firebase';
import { doc, getDoc, setDoc, deleteDoc, deleteObject, updateDoc, increment } from "firebase/firestore";
import {ThemeContext} from '../../../context-store/context';

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

// SecondaryComment is a comment that is a reply to a comment
import SecondaryComment from './SubComment';

const MainComment = ({ profile, username, profilePic, commentId, text, likesCount, commentsCount }) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const navigation = useNavigation();

    const [deleted, setDeleted] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [replyVisible, setReplyVisible] = useState(false);

    const [likeCount, setLikeCount] = useState(0);
    const [likeString, setLikeString] = useState("");
    const [commentCount, setCommentCount] = useState(0);
    const [commentString, setCommentString] = useState("");
    const [liked, setLiked] = useState(false);

    const [replyToComment, setReplyToComment] = useState("");

    const [repliesVisible, setRepliesVisible] = useState(false);
    const [replies, setReplies] = useState([]); // array of replies

    useEffect(() => {
        setLikeCount(likesCount);
        onUpdateLikeCount(likesCount);
        setCommentCount(commentsCount);
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
        const likedRef = doc(db, "likedComments", firebase.auth().currentUser.uid, replyToPostId, commentId);
        const likedSnapshot = await getDoc(likedRef);
      
        if (!likedSnapshot.exists()) {
          // add post to likes collection
          await setDoc(likedRef, {});
          // update like count for Comment
          const postRef = doc(db, 'allPosts', replyToPostId);
      
          updateDoc(postRef, {
            likesCount: increment(1)
          }).then(() => {
            setLikeCount(likeCount + 1);
            onUpdateLikeCount(likeCount + 1); // update like count string
          });
        }
      
        setLiked(true);
    };

    // update like count and add post to liked collection
    const onDisike = async () => {
        // delete comment from likedComments collection
        deleteDoc(doc(db, "likedComments", firebase.auth().currentUser.uid, replyToPostId, commentId))

        // update like count for Comment
        const postRef = doc(db, 'allPosts', replyToPostId);

        updateDoc(postRef, {
            likesCount: increment(-1)
        }).then(() => {
            setLikeCount(likeCount - 1);
            setLiked(false);
        });
    }

    let threeDots, likes, alreadyLiked, reply, down
    
    if(theme == 'light'){
        threeDots = <ThreeDotsLight width={33} height={33} style={{}}/>
        likes = <Likes width={20} height={20} style={{ marginRight: 5 }}/>;
        alreadyLiked = <Liked width={20} height={20} style={{ marginRight: 5 }}/>;
        reply = <Reply width={18} height={18} style={{ marginRight: 5 }}/>;
        down = <Down width={24} height={24} style={{ marginRight: 5 }}/>;
    }else{
        threeDots = <ThreeDotsDark width={33} height={33} style={{}}/>
        likes = <LikesDark width={21} height={21} style={{ marginRight: 5 }}/>;
        alreadyLiked = <LikedDark width={21} height={21} style={{ marginRight: 5 }}/>;
        reply = <ReplyDark width={18} height={18} style={{ marginRight: 5 }}/>;
        down = <DownDark width={22} height={22} style={{ marginRight: 5 }}/>;
    }

    if(deleted){
        return null;
    }

    const mainComment = <View style={theme == 'light' ? styles.lightCommentContainer : styles.darkCommentContainer}>
            
            {/* Profile Picture and Username */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                
                {/* Profile Picture */}
                <TouchableOpacity 
                    onPress={() => {
                        {
                            profile != firebase.auth().currentUser.uid &&

                                navigation.push('Profile', {
                                    user: profile,
                                    username: username,
                                    profilePic: profilePic,
                                })
                        }
                        
                    }}
                >
                    <Image 
                        source={{uri: profilePic}} 
                        style={styles.profileImage} 
                        placeholder={require('../../../assets/profile_default.png')}
                    />
                </TouchableOpacity>

                {/* Username */}
                <Text style={theme == 'light' ? styles.lightUsername : styles.darkUsername}>
                    @{username}
                </Text>

                {/* Three Dots */}
                <TouchableOpacity 
                    style={{flexDirection: 'row', marginRight: 10}}
                    onPress= {() => setOverlayVisible(true)}
                >
                    {threeDots}
                </TouchableOpacity>
            
            </View>

            {/* Comment Text */}
            <TouchableOpacity style={theme == 'light' ? styles.lightCommentText : styles.darkCommentText}>
                {text}
            </TouchableOpacity>

            {/* Reply and Like */}
            <View style={{ flexDirection: 'row', marginBottom: 10, marginRight: 0 }}>
                
                {/* View replies */}
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center', marginLeft: 13 }}>
                    
                    {
                        commentCount > -1 &&
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}
                            onPress = {() => onViewRelies()}
                        >
                            {/* <View style={theme == 'light' ? styles.lightViewReplyLine : styles.darkViewReplyLine}>
                            </View> */}
                            

                            <Text style={theme == 'light' ? styles.lightViewText: styles.darkViewText}>
                                View {commentString} replies
                            </Text>

                            {down}
                            
                        </TouchableOpacity>
                    }

                </View>

                {/* Reply */}
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}
                    onPress={() => setReplyVisible(true)}
                >
                    {reply}

                    <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                        Reply
                    </Text>
                </TouchableOpacity>
                
                {/* Like Button */}
                <TouchableOpacity
                    style={{  flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}
                    onPress={() => liked ? onDisike() : onLike()}
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

            
            {/* Secondary comment */}
            <SecondaryComment 
                mainCommentId={commentId}
                profilePic={profilePic}
                username={username}
                likesCount={likesCount}
                commentsCount={commentsCount}
                text={text}
            />

        </View>

    return (
        mainComment
    );
}

const styles = StyleSheet.create({
    profileImage: {
        width: 32,
        height: 32,
        borderRadius: 50,
        marginLeft: 11,
        marginRight: 5,
        marginVertical: 8,
        marginBottom: 4,
    },
    lightCommentContainer: {
        backgroundColor: '#FFFFFF',
        marginTop: 7,
    },
    darkCommentContainer: {
        backgroundColor: '#151515',
        marginTop: 7,
    },
    lightUsername: {
        flex: 1,
        fontSize: 14,
        fontWeight: "600",
        color: '#5D5D5D',
        textAlign: "left",
    },
    darkUsername: {
        flex: 1,
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
        marginHorizontal: 13,
        marginBottom: 6,
    },
    darkCommentText: {
        fontSize: 16,
        fontWeight: "400",
        color: '#F2F2F2',
        letterSpacing: 0.3,
        textAlign: "left",
        marginHorizontal: 13,
        marginBottom: 6,
    },
    lightViewReplyLine: {
        backgroundColor: '#BBBBBB',
        height: 1.5,
        width: 33,
        marginRight: 10,
    },
    darkViewReplyLine: {
        backgroundColor: '#BBBBBB',
        height: 1.5,
        width: 35,
        marginRight: 10,
    },
    lightViewText: {
        fontSize: 13,
        fontWeight: "500",
        color: '#555555',
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
});

export default MainComment;
