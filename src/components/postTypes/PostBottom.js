import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase, storage, db } from '../../config/firebase';
import { query, where, collection, getDocs, addDoc, doc, getDoc, setDoc, deleteDoc, deleteObject, updateDoc, increment } from "firebase/firestore";
import {ThemeContext} from '../../../context-store/context';

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

const PostBottom = ({ postId, likesCount, commentsCount }) => {
    const {theme,setTheme} = useContext(ThemeContext);
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
        comments = <Comments width={23} height={23} style={{ marginRight: 7 }}/>;
        likes = <Likes width={23} height={23} style={{ marginRight: 7 }}/>;
        alreadyLiked = <Liked width={23} height={23} style={{ marginRight: 7 }}/>;
        share = <Share width={21} height={21} style={{ marginRight: 7 }}/>;
        repost = <Repost width={19} height={19} style={{ marginRight: 7 }}/>;
    }else{
        comments = <CommentsDark width={23} height={23} style={{ marginRight: 7 }}/>;
        likes = <LikesDark width={24} height={24} style={{ marginRight: 7 }}/>;
        alreadyLiked = <LikedDark width={24} height={24} style={{ marginRight: 7 }}/>;
        share = <ShareDark width={21} height={21} style={{ marginRight: 7 }}/>;
        repost = <RepostDark width={19} height={19} style={{ marginRight: 7 }}/>;
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
        const likedRef = doc(db, "likedPosts", firebase.auth().currentUser.uid, postId, postId);
        const likedSnapshot = await getDoc(likedRef);
      
        if (!likedSnapshot.exists()) {
          // add post to likes collection
          await setDoc(likedRef, {});
          // update like count for post
          const postRef = doc(db, 'allPosts', postId);
      
          updateDoc(postRef, {
            likesCount: increment(1)
          }).then(() => {
            onUpdateLikeCount(likeCount + 1);
            setLikeCount(likeCount + 1);
             // update like count string
          });
        }
      
        setLiked(true);
    };

    // update like count and add post to liked collection
    const onDisike = async () => {
        // delete post from likes collection
        deleteDoc(doc(db, "likedPosts", firebase.auth().currentUser.uid, postId, postId))

        // update like count for post
        const postRef = doc(db, 'allPosts', postId);

        if(likeCount - 1 >= 0){
            updateDoc(postRef, {
                likesCount: increment(-1)
            }).then(() => {
                onUpdateLikeCount(likeCount - 1);
                setLikeCount(likeCount - 1);
                setLiked(false);
            });
        }

        
    }

    // upload repost to database
    const onRepost = async () => {
        // add text post to database
        await addDoc(collection(db, "allPosts"), {
            repostPostId: postId,
            creationDate: firebase.firestore.FieldValue.serverTimestamp(),
            profile: firebase.auth().currentUser.uid
        }).then(async (docRef) => {
            // update posts count for current user
            const currentUserRef = doc(db, 'users', firebase.auth().currentUser.uid);

            await updateDoc(currentUserRef, {
                posts: increment(1)
            });

            Alert.alert("Reposted!");
        }).catch(function (error) {
            console.log(error);
        });
    };

    return (
        <View style={{flex: 1, width: '100%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around'}}>     
            {/* Comments button */}
            <View
                style= {styles.commentsContainer}
            >
                    {comments}

                    <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                        {commentString}
                    </Text>
            </View>

            
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
                style={styles.shareButtonContainer}
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
    },
    commentsContainer: {
        height: 45,
        flexDirection:"row",
        alignSelf: 'flex-start',
        marginLeft: 5,
        paddingHorizontal: 10,
        alignItems: "center",
        alignContent: "center", 
        justifyContent: "center",
    },
    shareButtonContainer: {
        height: 45,
        width: 100,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    lightBottomText: {
        fontSize: 16,
        fontWeight: "400",
        color: '#444444',
    },
    darkBottomText: {
        fontSize: 16,
        fontWeight: "400",
        color: '#EEEEEE',
    },
});

export default PostBottom;
