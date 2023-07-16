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
import Reply from '../../../assets/reply_light.svg';
import Down from '../../../assets/down_light.svg';

// dark mode icons
import ThreeDotsDark from '../../../assets/three_dots_dark.svg';
import LikesDark from '../../../assets/likes_dark.svg';
import LikedDark from '../../../assets/liked_dark.svg';
import ReplyDark from '../../../assets/reply_dark.svg';
import DownDark from '../../../assets/down_dark.svg';

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
        const likedRef = doc(db, "likedComments", firebase.auth().currentUser.uid, postId, commentId);
        const likedSnapshot = await getDoc(likedRef);
      
        if (!likedSnapshot.exists()) {
          // add post to likes collection
          await setDoc(likedRef, {});
          // update like count for Comment
          const postRef = doc(db, 'allPosts', postId);
      
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
        deleteDoc(doc(db, "likedComments", firebase.auth().currentUser.uid, postId, commentId))

        // update like count for Comment
        const postRef = doc(db, 'allPosts', postId);

        updateDoc(postRef, {
            likesCount: increment(-1)
        }).then(() => {
            setLikeCount(likeCount - 1);
            setLiked(false);
        });
    }

    let threeDots, likes, alreadyLiked, reply, down
    
    if(theme == 'light'){
        threeDots = <ThreeDotsLight width={35} height={35} style={styles.threeDots}/>
        likes = <Likes width={19.8} height={19.8} style={{ marginRight: 5 }}/>;
        alreadyLiked = <Liked width={19.8} height={19.8} style={{ marginRight: 5 }}/>;
        reply = <Reply width={18.9} height={18.9} style={{ marginRight: 5 }}/>;
        down = <Down width={24} height={24} style={{ marginRight: 5 }}/>;
    }else{
        threeDots = <ThreeDotsDark width={35} height={35} style={styles.threeDots}/>
        likes = <LikesDark width={19.8} height={19.8} style={{ marginRight: 5 }}/>;
        alreadyLiked = <LikedDark width={19.8} height={19.8} style={{ marginRight: 5 }}/>;
        reply = <ReplyDark width={18.9} height={18.9} style={{ marginRight: 5 }}/>;
        down = <DownDark width={22} height={22} style={{ marginRight: 5 }}/>;
    }

    if(deleted){
        return null;
    }

    return (
        <View style={theme == 'light' ? styles.lightCommentContainer : styles.darkCommentContainer}>
            
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
                    <Image source={{uri: profilePic}} style={styles.profileImage} />
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
            <Text style={theme == 'light' ? styles.lightCommentText : styles.darkCommentText}>
                {text}
            </Text>

            {/* Reply and Like */}
            <View style={{ flexDirection: 'row', marginBottom: 10, marginRight: 0 }}>
                
                {/* View replies */}
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center', marginLeft: 10 }}>
                    
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
                        {likeString} likes
                    </Text>

                </TouchableOpacity>
            </View>

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
        marginVertical: 8,
    },
    lightCommentContainer: {
        backgroundColor: '#FFFFFF',
        marginTop: 7,
    },
    darkCommentContainer: {
        backgroundColor: '#1A1A1A',
        marginTop: 7,
    },
    lightUsername: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
        color: '#555555',
        textAlign: "left",
    },
    darkUsername: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
        color: '#DDDDDD',
        textAlign: "left",
    },
    lightCommentText: {
        fontSize: 16,
        fontWeight: "400",
        color: '#000000',
        letterSpacing: 0.3,
        textAlign: "left",
        marginHorizontal: 11,
        marginBottom: 10,
    },
    darkCommentText: {
        fontSize: 16,
        fontWeight: "400",
        color: '#F6F6F6',
        letterSpacing: 0.3,
        textAlign: "left",
        marginHorizontal: 11,
        marginBottom: 15,
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
