import React, { } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { AuthenticatedUserContext } from '../../../context-store/context';

import Feather from '@expo/vector-icons/Feather';

import { getAuth } from 'firebase/auth';

const auth = getAuth();

import MoodIndicator from './MoodIndicator';

import { onLikePost, onDisikePost } from '../../shared/post/LikeDislikePost';

import Repost from '../../shared/post/Repost';

import intToString from '../../shared/functions/intToString';

// light mode icons
import Likes from '../../../assets/likes.svg';
import Liked from '../../../assets/liked.svg';
import Comments from '../../../assets/comments.svg';
import Share from '../../../assets/share.svg';
import RepostIcon from '../../../assets/repost.svg';


// dark mode icons
import LikesDark from '../../../assets/likes_dark.svg';
import LikedDark from '../../../assets/liked_dark.svg';
import CommentsDark from '../../../assets/comments_dark.svg';
import ShareDark from '../../../assets/share_dark.svg';
import RepostIconDark from '../../../assets/repost_dark.svg';


const PostBottom = ({ theme, postId, username, profilePic, likesCount, commentsCount, repostsCount, navToPost, onShare}) => {
    const {options, setOptions, user, setUser} = React.useContext(AuthenticatedUserContext);

    const [liked, setLiked] = React.useState({
        id: postId,
        show: "notLiked",
        chose: ""
    });

    let likes, alreadyLiked, comments, share, repost;
    if(theme == 'light'){
        comments = <Comments width={24} height={24} style={{ color: "#222222", marginRight: 8 }}/>;
        likes = <Likes width={24} height={24} style={{ color: "#222222", marginRight: 8 }}/>;
        alreadyLiked = <Liked width={24} height={24} style={{ color: "#222222", marginRight: 8 }}/>;
        share = <Share width={21} height={21} style={{ color: "#222222", marginRight: 8 }}/>;
        repost = <RepostIcon width={20} height={20} style={{ color: "#333333", marginRight: 9 }}/>;
    }else if(theme == 'imageFocused'){
        comments = <Comments width={24} height={24} style={{ color: "#E4E4E4", marginRight: 8 }}/>;
        likes = <Likes width={24} height={24} style={{ color: "#E4E4E4", marginRight: 8 }}/>;
        alreadyLiked = <Liked width={24} height={24} style={{ color: "#E4E4E4", marginRight: 8 }}/>;
        share = <Share width={21} height={21} style={{ color: "#E4E4E4", marginRight: 8 }}/>;
        repost = <RepostIcon width={20} height={20} style={{ color: "#E4E4E4", marginRight: 9 }}/>;
    }else{
        comments = <Comments width={24} height={24} style={{ color: "#D2D2D2", marginRight: 8 }}/>;
        likes = <Likes width={23} height={23} style={{ color: "#D5D5D5", marginRight: 8 }}/>;
        alreadyLiked = <Liked width={23} height={23} style={{ color: "#D5D5D5", marginRight: 8 }}/>;
        share = <Share width={21} height={21} style={{ color: "#DDDDDD", marginRight: 8 }}/>;
        repost = <RepostIcon width={19} height={19} style={{ color: "#D2D2D2", marginRight: 9 }}/>;
    }


    const onRepost = () => () => {
        setOptions({postId: postId, username: username, profilePic: profilePic, type: 'repost'});
    }

    const toggleLike = () => async() => {

        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        

        // if(liked.show == "notLiked"){
        //     const likedRef = doc(db, "likedPosts", auth.currentUser.uid, "posts", postId);
        //     const likedDocSnap = await getDoc(likedRef);

        //     if(likedDocSnap.exists()){
        //         setLiked({
        //             id: postId,
        //             show: false,
        //             chose: likedDocSnap.data().liked
        //         });
            // }else{
                setLiked({
                    id: postId,
                    show: false,
                    chose: ""
                });
                await onLikePost(postId)
                .then((result) => {
                        
                    !result && 
                    
                    setLiked({
                        id: postId,
                        show: "notLiked",
                        chose: ""
                    });
                })
                .catch((e) => {
                    setLiked({
                        id: postId,
                        show: "notLiked",
                        chose: ""
                    });
                });
            // }
        // }else{
        //     setLiked({
        //         id: postId,
        //         show: false,
        //         chose: ""
        //     });
        // }
    }


    return (

            <View style={{flex: 1, width: '100%', marginRight: 13, marginTop: 3, flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around'}}>     
            
                {/* Comments button */}
                {
                    (liked.show != false  || postId != liked.id) &&
                    <TouchableOpacity
                        style={styles.bottomButtonContainer}
                        onPress={() => navToPost()}
                    >
                            {comments}

                            <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                                {intToString(commentsCount)}
                            </Text>
                    </TouchableOpacity>
                }
                

                
                {/* Mood Indicator OR Like Button */}
                {
                    liked.show != "notLiked" && postId == liked.id ?
                        <TouchableOpacity
                            style={{paddingLeft: 10, width: liked.show != false ? 100 : 'auto', height: 40, flexDirection: 'row', alignItems: 'center', alignContent: 'center'}}
                            onPress={toggleLike()}
                        >
                            {/* {liked ?
                                alreadyLiked
                            :
                                likes
                            }

                            <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                                {liked ? intToString(likesCount + 1) : intToString(likesCount)}
                            </Text> */}
                            <MoodIndicator
                                postId={postId}
                                liked={liked}
                                setLiked={setLiked}
                            />

                            {
                                liked.show != false &&
                                <Text style={[theme == 'light' ? styles.lightBottomText: styles.darkBottomText, {marginLeft: -3}]}>
                                    {intToString(likesCount + 1)}
                                </Text>
                                
                            }
                        </TouchableOpacity>
                    :
                        <TouchableOpacity
                            style={styles.bottomButtonContainer}
                            onPress={toggleLike()}
                        >
                            {likes}

                            <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                                {intToString(likesCount)}
                            </Text> 
                        </TouchableOpacity>
                }
                
                
                {/* Repost button */}
                {
                    (liked.show != false  || postId != liked.id) &&
                    <TouchableOpacity
                        style={styles.bottomButtonContainer}
                        onPress={onRepost()}
                    >
                        <Feather
                            name={"repeat"}
                            size={23}

                            color={theme == 'light' ? '#525252' : '#F8F8F8'}
                            marginRight={8}

                            // marginTop={-7}
                        />
                        

                        <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                            {repostsCount || 0}
                        </Text>
                    </TouchableOpacity>
                }
                    
                
                
                
                {/* Share button */}
                {
                    (liked.show != false  || postId != liked.id) &&
                    <TouchableOpacity
                        style={[styles.bottomButtonContainer, {marginRight: 10}]}
                        onPress={onShare}
                    >
                        {share}

                        <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                            Share
                        </Text>
                    </TouchableOpacity>
                }
                    
            </View>
        // <View style={{flex: 1, width: '100%', marginRight: 13, flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around'}}>     
            
            
        //     {/* Comments button */}
        //     <TouchableOpacity
        //         style={styles.bottomButtonContainer}
        //         onPress={() => navToPost()}
        //     >
        //             {comments}

        //             <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
        //                 {intToString(commentsCount)}
        //             </Text>
        //     </TouchableOpacity>

            
        //     {/* Likes button */}
        //     { liked.show == "notLiked" &&
        //         <TouchableOpacity
        //             style={styles.bottomButtonContainer}
        //             onPress={toggleLike()}
        //         >
        //             {/* {liked ?
        //                 alreadyLiked
        //             :
        //                 likes
        //             }

        //             <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
        //                 {liked ? intToString(likesCount + 1) : intToString(likesCount)}
        //             </Text> */}
        //         </TouchableOpacity>
        //     }
            
            
        //     {/* Repost button */}
        //     <TouchableOpacity
        //         style={styles.bottomButtonContainer}
        //         // onPress={() => onRepost()}
        //     >
        //         {repost}

        //         <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
        //             0
        //         </Text>
        //     </TouchableOpacity>
            
            
            
        //     {/* Share button */}
        //     <TouchableOpacity
        //         style={[styles.bottomButtonContainer, {marginRight: 10}]}
        //         // onPress={() => }
        //     >
        //         {share}

        //         <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
        //             Share
        //         </Text>
        //     </TouchableOpacity>
        // </View>
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
    },
    lightBottomText: {
        fontSize: 16,
        fontWeight: "400",
        // color: '#444444',
        color: '#000',
    },
    darkBottomText: {
        fontSize: 16,
        fontWeight: "400",
        // color: '#E4E4E4',
        color: '#FFF',
    },
});

export default PostBottom;
