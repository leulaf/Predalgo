import React, { } from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert} from 'react-native';

import {ThemeContext} from '../../../context-store/context';

import { onLikePost, onDisikePost } from '../../shared/post/LikeDislikePost';

import intToString from '../../shared/functions/intToString';

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

const PostBottom = ({ postId, likesCount, commentsCount, navToPost }) => {
    const {theme,setTheme} = React.useContext(ThemeContext);
    const [liked, setLiked] = React.useState(false);

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


    const toggleLike = () => async() => {
        if(liked){
            setLiked(false);
            await onDisikePost(postId)
            .then((res) => {
                !res && setLiked(true);
            })
            .catch((e) => {
                setLiked(true);
            })
        }else{
            setLiked(true);
            await onLikePost(postId)
            .then((res) => {
                !res && setLiked(false);
            })
            .catch((e) => {
                setLiked(false);
            })
        }
    }


    return (
        <View style={{flex: 1, width: '100%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around'}}>     
            
            
            {/* Comments button */}
            <TouchableOpacity
                style={styles.bottomButtonContainer}
                onPress={navToPost}
            >
                    {comments}

                    <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                        {intToString(commentsCount)}
                    </Text>
            </TouchableOpacity>

            
            {/* Likes button */}
            <TouchableOpacity
                style={styles.bottomButtonContainer}
                onPress={toggleLike()}
            >
                {liked ?
                    alreadyLiked
                :
                    likes
                }

                <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                    {liked ? intToString(likesCount + 1) : intToString(likesCount)}
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
        // marginLeft: 5,
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
        fontWeight: '400',
        color: '#444444',
    },
    darkBottomText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#EEEEEE',
    },
});

export default PostBottom;
