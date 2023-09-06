import React from 'react';

import { View, Text, TouchableOpacity } from 'react-native';

// import * as Haptics from 'expo-haptics';

import MemeName from '../shared/MemeName';

import styles from './Styles';

import { intToString, onLike, onDisike } from '../shared/CommentMethods';

// Mood indicator choices
import MoodIndicator from '../shared/MoodIndicator';

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
export default SubCommentBottom = ({navigation, theme, commentId, replyToPostId, replyToCommentId, memeName, profile, likesCount, commentsCount, onNavToComment, onReply, navToMeme}) => {
    
    const [emoji, setEmoji] = React.useState({
        id: commentId,
        show: "notLiked",
        chose: ""
    });


    let likes, alreadyLiked, reply, down

    if(theme == 'light'){
        likes = <Likes width={20} height={20} style={{ marginRight: 10 }}/>;
        alreadyLiked = <Liked width={20} height={20} style={{ marginRight: 5 }}/>;
        reply = <Reply width={18} height={18} style={{ marginRight: 5 }}/>;
        down = <Down width={25} height={25} style={{ marginRight: 5 }}/>;
    }else{
        likes = <LikesDark width={21} height={21} style={{ marginRight: 10 }}/>;
        alreadyLiked = <LikedDark width={21} height={21} style={{ marginRight: 5 }}/>;
        reply = <ReplyDark width={18} height={18} style={{ marginRight: 5 }}/>;
        down = <DownDark width={25} height={25} style={{ marginRight: 5 }}/>;
    }

    
    
    const toggleLike = () => async() => {
        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        // if(emoji){
        //     setEmoji(false);
        //     await onDisike(replyToPostId, commentId).then((result) => {
        //         setEmoji(!result)
        //     })
        // }else{

            if(emoji.show ==  "notLiked"){
                setEmoji({
                    id: commentId,
                    show: false,
                    chose: ""
                });
                await onLike(replyToPostId, commentId).then((result) => {
                        
                        !result && 
                        
                        setEmoji({
                            id: commentId,
                            show: "notLiked",
                            chose: ""
                        });
                })
            }else{
                setEmoji({
                    id: commentId,
                    show: false,
                    chose: ""
                });
            }
            
        // }
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
                    navToMeme={navToMeme}
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


            {/* Mood Indicator OR Like Button */}
            {
                    emoji.show != "notLiked" ?

                        <TouchableOpacity
                            activeOpacity={1}
                            style={{paddingLeft: 0, height: 40, flexDirection: 'row', alignItems: 'center', alignContent: 'center'}}
                            onPress={toggleLike()}
                        >
                            
                            {/* Mood Indicator */}
                            <MoodIndicator
                                id={commentId}
                                emoji={emoji}
                                setEmoji={setEmoji}
                            />

                            {
                                emoji.show != false &&
                                
                                <Text style={[theme == 'light' ? styles.lightBottomText: styles.darkBottomText, {marginRight: commentsCount < 100000 ? 20 : 30}]}>
                                    {intToString(likesCount + 1)} Likes
                                </Text>
                            }

                        </TouchableOpacity>

                    :
                    
                        // Like Button
                        <TouchableOpacity 
                            activeOpacity={1}
                            style={{ paddingRight: 10,  paddingLeft: 10, height: 40, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}
                            onPress={toggleLike()}
                        >

                            {likes}

                            <Text style={[theme == 'light' ? styles.lightBottomText: styles.darkBottomText, {marginRight: commentsCount < 100000 ? 20 : 30}]}>
                                {intToString(likesCount)}
                            </Text>

                        </TouchableOpacity>
                }

        </View>
    );
}