import React from 'react';

import { View, Text, TouchableOpacity } from 'react-native';

import MemeName from '../shared/MemeName';

import styles from './Styles';

import { intToString, onLike, onDisike } from '../shared/CommentMethods';

// light mode icons
import Likes from '../../../../assets/likes.svg';
import Liked from '../../../../assets/liked.svg';
import Reply from '../../../../assets/reply_comment_light.svg';
import Down from '../../../../assets/down_light.svg';

// dark mode icons
import LikesDark from '../../../../assets/likes_dark.svg';
import LikedDark from '../../../../assets/liked_dark.svg';
import ReplyDark from '../../../../assets/reply_comment_dark.svg';
import DownDark from '../../../../assets/down_dark.svg';


// ******** React memo ********
export default SubCommentBottom = ({navigation, theme, commentId, replyToPostId, replyToCommentId, memeName, profile, likesCount, commentsCount, onNavToComment, onReply,}) => {
    
    const [liked, setLiked] = React.useState(false);

    let likes, alreadyLiked, reply, down

    if(theme == 'light'){
        likes = <Likes width={20} height={20} style={{ marginRight: 5 }}/>;
        alreadyLiked = <Liked width={20} height={20} style={{ marginRight: 5 }}/>;
        reply = <Reply width={18} height={18} style={{ marginRight: 5 }}/>;
        down = <Down width={25} height={25} style={{ marginRight: 5 }}/>;
    }else{
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



    return (
        <View style={{ height: 40, flexDirection: 'row', marginTop: 2,  alignItems: 'center', alignContent: 'center' }}>
                
            {/* View replies */}
            {
                (commentsCount > 0 && !(memeName)) &&

                <TouchableOpacity
                    activeOpacity={1}
                    style={{ margin: 2, width: 150, height: 40, flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center', marginLeft: 0 }}
                    onPress = {onNavToComment()}
                > 
                
                    <View style={theme == 'light' ? styles.lightViewReplyLine : styles.darkViewReplyLine}/>

                    <Text style={theme == 'light' ? styles.lightViewText: styles.darkViewText}>
                        View {intToString(commentsCount)} replies
                    </Text>
                </TouchableOpacity>
            }

            {/* Meme Name */}
            {
                memeName &&
                <MemeName
                    theme={theme}
                    memeName={memeName}
                    navigation={navigation}
                />
            }

            {/* Spacer */}
            <TouchableOpacity
                activeOpacity={1}
                style={{flex: 1, height: 40, }}
                onPress={onNavToComment()}
            ></TouchableOpacity>

            {/* Reply */}
            <TouchableOpacity
                activeOpacity={1}
                style={{ paddingLeft: 10, height: 40, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}
                onPress={onReply()}
            >
                {reply}

                <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                    Reply
                </Text>
            </TouchableOpacity>
            
            {/* Like Button */}
            <TouchableOpacity
                activeOpacity={1}
                style={{ flexDirection: 'row', paddingLeft: 10, width: 110, height: 40, alignItems: 'center', alignContent: 'center' }}
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
    );
}