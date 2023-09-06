import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase, storage, db } from '../../config/firebase';
import { query, where, collection, getDocs, addDoc, doc, getDoc, setDoc, deleteDoc, deleteObject, updateDoc, increment } from "firebase/firestore";


// light mode icons
import Likes from '../../../assets/likes.svg';
import Liked from '../../../assets/liked.svg';
import Comments from '../../../assets/comments.svg';
import Share from '../../../assets/share.svg';
import Repost from '../../../assets/repost.svg';


// dark mode icons
import LikesDark from '../../../assets/likes_dark.svg';
import LikedDark from '../../../assets/liked_dark.svg';
import CommentsDark from '../../../assets/comments_dark.svg';
import ShareDark from '../../../assets/share_dark.svg';
import RepostDark from '../../../assets/repost_dark.svg';

const CommentBottom = ({ theme, commentId, replyToCommentId, replyToPostId, likesCount, commentsCount, navToComment }) => {

    const navigation = useNavigation();
    const [likeCount, setLikeCount] = useState(likesCount);
    const [likeString, setLikeString] = useState("");
    const [commentCount, setCommentCount] = useState(commentsCount);
    const [commentString, setCommentString] = useState("");
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        onUpdateLikeCount(likesCount); // update like count string
        onUpdateCommentCount(commentsCount); // update comment count string
    }, []);

    let content

    let likes, alreadyLiked, comments, share, repost;

    if(theme == 'light'){
        comments = <Comments width={24} height={24} style={{ color: "#222222", marginRight: 8 }}/>;
        likes = <Likes width={24} height={24} style={{ color: "#222222", marginRight: 8 }}/>;
        alreadyLiked = <Liked width={24} height={24} style={{ color: "#222222", marginRight: 8 }}/>;
        share = <Share width={21} height={21} style={{ color: "#222222", marginRight: 8 }}/>;
        repost = <Repost width={20} height={20} style={{ color: "#333333", marginRight: 9 }}/>;
    }else{
        comments = <Comments width={24} height={24} style={{ color: "#D2D2D2", marginRight: 8 }}/>;
        likes = <Likes width={23} height={23} style={{ color: "#D5D5D5", marginRight: 8 }}/>;
        alreadyLiked = <Liked width={23} height={23} style={{ color: "#D5D5D5", marginRight: 8 }}/>;
        share = <Share width={21} height={21} style={{ color: "#DDDDDD", marginRight: 8 }}/>;
        repost = <Repost width={19} height={19} style={{ color: "#D2D2D2", marginRight: 9 }}/>;
    }

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
        
            updateDoc(commentRef, {
                likesCount: increment(1)
            }).then(() => {
                onUpdateLikeCount(likeCount + 1);
                setLikeCount(likeCount + 1);
                onUpdateLikeCount(likeCount + 1); // update like count string
            });
        }
      
        setLiked(true);
    };

    // update like count and add post to liked collection
    const onDisike = async () => {
        // delete comment from likedComments collection
        await deleteDoc(doc(db, "likedComments", firebase.auth().currentUser.uid, "comments", commentId))

        // update like count for Comment
        if(likeCount - 1 >= 0){
            const commentRef = doc(db, 'comments', replyToPostId, "comments", commentId);

            await updateDoc(commentRef, {
                likesCount: increment(-1)
            }).then(() => {
                onUpdateLikeCount(likeCount - 1);
                setLikeCount(likeCount - 1);
                setLiked(false);
            });
        }
    }


    return (
        <View style={{flex: 1, width: '100%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around'}}>     
            {/* Comments button */}
            <TouchableOpacity
                style = {styles.commentsContainer}
                onPress ={navToComment()}
            >
                    {comments}

                    <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                        {commentString}
                    </Text>
            </TouchableOpacity>

            
            {/* Likes button */}
            <TouchableOpacity
                style={styles.bottomButtonContainer}
                onPress={() => liked ? onDisike() : onLike()}
            >
                {liked ?
                    alreadyLiked
                :
                    likes
                }

                <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                    {likeString}
                </Text>
            </TouchableOpacity>
            
            
            {/* Repost button */}
            <TouchableOpacity
                style={styles.bottomButtonContainer}
                // onPress={() => onRepost()}
            >
                {repost}

                <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                    0
                </Text>
            </TouchableOpacity>
            
            
            
            {/* Share button */}
            <TouchableOpacity
                style={[styles.bottomButtonContainer, {marginRight: 10}]}
                // onPress={() => }
            >
                {share}

                <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                    Share
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomLeftContainer: {
        flexDirection: 'row',
    },
    bottomButtonContainer: {
        height: 45,
        width: 100,  
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        // borderWidth: 1,
        // borderColor: '#fff',
    },
    commentsContainer: {
        height: 45,
        width: 90,
        flexDirection:"row",
        alignSelf: 'flex-start',
        // marginLeft: 5,
        paddingHorizontal: 10,
        alignItems: "center",
        alignContent: "center", 
        justifyContent: "center",
        // borderWidth: 1,
        // borderColor: '#fff',
    },
    lightBottomText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#444444',
    },
    darkBottomText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#EEEEEE',
    },
});

export default CommentBottom;
