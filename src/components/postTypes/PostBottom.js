import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase, storage, db } from '../../config/firebase';
import { query, where, collection, getDocs, addDoc, doc, getDoc, setDoc, deleteDoc, deleteObject, updateDoc, increment } from "firebase/firestore";
import TextTicker from 'react-native-text-ticker'
import {ThemeContext} from '../../../context-store/context';

import DarkMemeCreate from '../../../assets/post_meme_create_light.svg';
import LightMemeCreate from '../../../assets/post_meme_create_dark.svg';

import GlobalStyles from '../../constants/GlobalStyles';

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

const PostBottom = ({ memeName, tags, hideBottom, postId, likesCount, commentsCount }) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const navigation = useNavigation();
    const [likeCount, setLikeCount] = useState(likesCount);
    const [likeString, setLikeString] = useState("");
    const [commentCount, setCommentCount] = useState(commentsCount);
    const [liked, setLiked] = useState(false);

    let content
    let bottomTags

    let likes, alreadyLiked, comments, share, repost;

    if(theme == 'light'){
        comments = <Comments width={23} height={23} style={{ marginRight: 7, marginLeft: 3 }}/>;
        likes = <Likes width={23} height={23} style={{ marginRight: 7 }}/>;
        alreadyLiked = <Liked width={23} height={23} style={{ marginRight: 7 }}/>;
        share = <Share width={21} height={21} style={{ marginRight: 7 }}/>;
        repost = <Repost width={19} height={19} style={{ marginRight: 7 }}/>;
    }else{
        comments = <CommentsDark width={23} height={23} style={{ marginRight: 7, marginLeft: 3 }}/>;
        likes = <LikesDark width={23} height={23} style={{ marginRight: 7 }}/>;
        alreadyLiked = <LikedDark width={23} height={23} style={{ marginRight: 7 }}/>;
        share = <ShareDark width={21} height={21} style={{ marginRight: 7 }}/>;
        repost = <RepostDark width={19} height={19} style={{ marginRight: 7 }}/>;
    }

    // if like count is above 999 then display it as count/1000k + k
    // if like count is above 999999 then display it as count/1000000 + m
    // round down to whole number
    onUpdateLikeCount = (likeCount) => {
        if (likeCount > 999 && likeCount < 1000000) {
            setLikeString(Math.floor(likeCount / 1000) + "k");
        } else if (likeCount > 999999) {
            setLikeString(Math.floor(likeCount / 1000000) + "m");
        } else {
            setLikeString(likeCount);
        }
    }

    useEffect(() => {
        onUpdateLikeCount(likeCount);
    }, [likeCount]);

    // update like count and add post to liked collection
    const onLike = async () => {
        const likedRef = doc(db, "liked", firebase.auth().currentUser.uid, postId, postId);
        const likedSnapshot = await getDoc(likedRef);
      
        if (!likedSnapshot.exists()) {
            // add post to likes collection
            await setDoc(likedRef, {});
            // update like count for post
            const postRef = doc(db, 'allPosts', postId);
        
            updateDoc(postRef, {
                likesCount: increment(1)
            }).then(() => {
                setLikeCount(likeCount + 1);
            });
        }
      
        setLiked(true);
    };



    // update like count and add post to liked collection
    const onDisike = async () => {
        // delete post from likes collection
        deleteDoc(doc(db, "liked", firebase.auth().currentUser.uid, postId, postId))

        // update like count for user being followed
        const postRef = doc(db, 'allPosts', postId);

        updateDoc(postRef, {
            likesCount: increment(-1)
        }).then(() => {
            setLikeCount(likeCount - 1);
            setLiked(false);
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
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

            updateDoc(currentUserRef, {
                posts: increment(1)
            });

            Alert.alert("Reposted!");
        }).catch(function (error) {
            console.log(error);
        });
    };

    const navigateToTag = async(tag) => {
        if(tag.charAt(0) == '#'){
            navigation.push('Tag', {tag: tag});
        }else if(tag.charAt(0) == '@'){
            const username = tag.substring(1);

            const q = query(collection(db, "users"), where("username", "==", username));

            let user = null;

            await getDocs(q).then((snapshot) => {
                snapshot.docs.map((doc) => {
                    const data = doc.data();
                    user = { ...data, id: doc.id }; // Add the id property to the user object
                });
            });

            if(user){
                navigation.push('Profile', { user: user });
            }

        }
    }

    if(tags){
        bottomTags = tags.map((d, index) => 
            <TouchableOpacity
                key={index}
                onPress={() => navigateToTag(tags[index])}
            >
                <Text style={theme == 'light' ? GlobalStyles.lightPostBottomText: GlobalStyles.darkPostBottomText}>
                    {tags[index]}
                </Text>
            </TouchableOpacity>
        );
    }
    
    if (memeName && tags) {
        content =  <View flexDirection={"row"}>
            <TouchableOpacity
                onPress={() => navigation.push('Meme', {memeName: memeName})}
                style={styles.memeName}
            >
                
                {theme == "light" ?
                    <LightMemeCreate width={22} height={22} marginHorizontal={5} marginVertical={10}/>
                    :
                    <DarkMemeCreate width={22} height={22} marginHorizontal={5} marginVertical={10}/>
                }
                
                <TextTicker
                    style={theme == 'light' ? GlobalStyles.lightMemeName: GlobalStyles.darkMemeName}
                    duration={12000}
                    loop
                    // bounce
                    repeatSpacer={50}
                    marqueeDelay={1000}
                >
                    {memeName}
                </TextTicker>
                
            </TouchableOpacity>
            
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} marginLeft={30} >
                {bottomTags}
            </ScrollView>
        </View>
    } else if (memeName) {
        content =
            <TouchableOpacity 
                onPress={() => navigation.navigate('Meme', {memeName: memeName})}
                style={styles.memeName}
            >
                
                {theme == "light" ?
                    <LightMemeCreate width={22} height={22} marginHorizontal={5} marginVertical={10}/>
                    :
                    <DarkMemeCreate width={22} height={22} marginHorizontal={5} marginVertical={10}/>
                }

                <TextTicker
                    style={theme == 'light' ? GlobalStyles.lightMemeName: GlobalStyles.darkMemeName}
                    duration={12000}
                    loop
                    // bounce
                    repeatSpacer={50}
                    marqueeDelay={1000}
                >
                    {memeName}
                </TextTicker>
            </TouchableOpacity>
    }else if (tags) {
        content = <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} marginLeft={5}>
                    {bottomTags}
                </ScrollView>;
    } else {
      content = <View marginVertical={hideBottom ? 0 : 10}></View>;
    }

    content = <View style={{flexDirection: 'column'}}>
                {content}
                <View style={{flexDirection: 'row', height: 40, marginLeft: 10, alignItems: 'center', alignContent: 'center'}}>
                    
                    {/* Comments button */}
                    <TouchableOpacity
                        style={styles.bottomButtonContainer}
                        // onPress={() => navigation.navigate('Comments', {postId: postId})}
                    >
                        {comments}

                        <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                            {commentCount}
                        </Text>
                    </TouchableOpacity>

                    {/* Repost button */}
                    <TouchableOpacity
                        style={styles.bottomButtonContainer}
                        onPress={() => onRepost()}
                    >
                        {repost}

                        <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                            0
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
                    
                    {/* Share button */}
                    <TouchableOpacity
                        style={styles.bottomButtonContainer}
                        // onPress={() => }
                    >
                        {share}

                        <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                            Share
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
  
    return content;
}

const styles = StyleSheet.create({
    bottomLeftContainer: {
        flexDirection: 'row',
    },
    bottomButtonContainer: {
        flexDirection: 'row',
        marginRight: 55,
        alignItems: 'center',
        alignContent: 'center'
    },
    memeName: {
        width: 170,
        marginLeft: 0,
        flexDirection: 'row',
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
    hashTagAndAt: {
        fontSize: 20, 
        fontWeight: "400", 
        color: '#0147BD', 
        marginVertical: 7, 
        marginHorizontal: 5
    }
});

export default PostBottom;
