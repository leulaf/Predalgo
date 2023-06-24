import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase, storage, db } from '../../config/firebase';
import { collection, addDoc, doc, getDoc, setDoc, deleteDoc, deleteObject, updateDoc, increment } from "firebase/firestore";
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


// dark mode icons
import LikesDark from '../../../assets/likes_dark.svg';
import LikedDark from '../../../assets/liked_dark.svg';
import CommentsDark from '../../../assets/comments_dark.svg';
import ShareDark from '../../../assets/share_dark.svg';

const PostBottom = ({ memeText, tags, hideBottom, postId, likesCount, commentsCount }) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [likeCount, setLikeCount] = useState(likesCount);
    const [commentCount, setCommentCount] = useState(commentsCount);
    const [liked, setLiked] = useState(false);

    const navigation = useNavigation();
    let content
    let bottomTags

    let likes, alreadyLiked, comments, share

    if(theme == 'light'){
        comments = <Comments width={23} height={23} style={{ marginRight: 10, marginLeft: 3 }}/>;
        likes = <Likes width={23} height={23} style={{ marginRight: 10 }}/>;
        alreadyLiked = <Liked width={23} height={23} style={{ marginRight: 10 }}/>;
        share = <Share width={20} height={20} style={{ marginRight: 10 }}/>;
    }else{
        comments = <CommentsDark width={23} height={23} style={{ marginRight: 10, marginLeft: 3 }}/>;
        likes = <LikesDark width={23} height={23} style={{ marginRight: 10 }}/>;
        alreadyLiked = <LikedDark width={23} height={23} style={{ marginRight: 10 }}/>;
        share = <ShareDark width={20} height={20} style={{ marginRight: 10 }}/>;
    }

    // update like count and add post to liked collection
    const onLike = async () => {
        // add post to likes collection
        await setDoc(doc(db, "liked", firebase.auth().currentUser.uid, postId, postId), {});

        // update like count for user being followed
        const postRef = doc(db, 'allPosts', postId);

        updateDoc(postRef, {
            likesCount: increment(1)
        }).then(() => {
            setLikeCount(likeCount + 1);
            setLiked(true);
        })
    }

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

    if(tags){
        bottomTags = tags.map((d, index) => 
            <TouchableOpacity
                onPress={() => navigation.navigate('Tag', {tag: tags[index]})}
                key={index}
            >
                <Text style={theme == 'light' ? GlobalStyles.lightPostBottomText: GlobalStyles.darkPostBottomText}>
                    {tags[index]}
                </Text>
            </TouchableOpacity>
        );
    }
    
    if (memeText && tags) {
        content =  <View flexDirection={"row"}>
            <View style={styles.memeName}>
                
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
                    {memeText}
                </TextTicker>
                
            </View>
            
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} marginLeft={30} >
                {bottomTags}
            </ScrollView>
        </View>
    } else if (memeText) {
        content =
            <View style={styles.memeName}>
                
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
                    {memeText}
                </TextTicker>
            </View>
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
                        style={{flexDirection: 'row', marginRight: 50, alignItems: 'center', alignContent: 'center'}}
                        // onPress={() => navigation.navigate('Comments', {postId: postId})}
                    >
                        {comments}

                        <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                            {commentCount}
                        </Text>
                    </TouchableOpacity>

                    {/* Share button */}
                    <TouchableOpacity
                        style={{flexDirection: 'row', marginRight: 50, alignItems: 'center', alignContent: 'center'}}
                        // onPress={() => }
                    >
                        {share}

                        <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                            Share
                        </Text>
                    </TouchableOpacity>
                    
                    {/* Likes button */}
                    <TouchableOpacity
                        style={{flexDirection: 'row', marginRight: 50, alignItems: 'center', alignContent: 'center'}}
                        onPress={() => liked ? onDisike() : onLike()}
                    >
                        {liked ?
                            alreadyLiked
                        :
                            likes
                        }

                        <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                            {likeCount}
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
