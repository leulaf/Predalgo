import React, {useContext, useRef, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity,  Dimensions} from 'react-native';
import { Image } from 'expo-image';
import GlobalStyles from '../../constants/GlobalStyles';
import { firebase, storage, db } from '../../config/firebase';
import { doc, getDoc, setDoc, deleteDoc, deleteObject, updateDoc, increment } from "firebase/firestore";
import {ThemeContext} from '../../../context-store/context';

import { fetchFirstFiveCommentsByRecent, fetchFirstFiveCommentsByPopular } from '../../shared/comment/GetComments';
import { FlashList } from '@shopify/flash-list';

import { useNavigation } from '@react-navigation/native';

// light mode icons
import Likes from '../../../assets/likes.svg';
import Liked from '../../../assets/liked.svg';
import Reply from '../../../assets/reply_comment_light.svg';
import Down from '../../../assets/down_light.svg';

// dark mode icons
import LikesDark from '../../../assets/likes_dark.svg';
import LikedDark from '../../../assets/liked_dark.svg';
import ReplyDark from '../../../assets/reply_comment_dark.svg';
import DownDark from '../../../assets/down_dark.svg';


// SecondaryComment is a comment that is a reply to a comment
import SubComment from './subComment/SubComment';


const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const onNavToComment =  (navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount) => () => {
    navigation.push('Comment', {
        commentId: commentId,
        replyToPostId: replyToPostId,
        replyToCommentId: replyToCommentId,
        replyToProfile: profile,
        replyToUsername: username,
        imageUrl: image,
        memeName: memeName,
        template: false,
        imageHeight: imageHeight,
        imageWidth: imageWidth,
        text: text,
        likesCount: likesCount,
        commentsCount: commentsCount,
        profile: profile,
        username: username,
        profilePic: profilePic,
    })
}

const onReply =  (navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount) => () => {
    navigation.push('Comment', {
        commentId: commentId,
        replyToPostId: replyToPostId,
        replyToCommentId: replyToCommentId,
        replyToProfile: profile,
        replyToUsername: username,
        imageUrl: image,
        memeName: memeName,
        imageHeight: imageHeight,
        imageWidth: imageWidth,
        text: text,
        likesCount: likesCount,
        commentsCount: commentsCount,
        onReply: true,
        profile: profile,
        username: username,
        profilePic: profilePic,
    })
}


const ListCommentBottom = ({ profile, username, profilePic, commentId, replyToCommentId, replyToPostId, text, imageUrl, memeName, template, templateState, imageWidth, imageHeight, likesCount, commentsCount }) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const navigation = useNavigation();

    const [commentsList, setCommentsList] = useState([{id: "fir"}]); // array of comments - replies to this comment
    // console.log(likesCount)
    const [image, setImage] = useState(imageUrl ? imageUrl :  template);

    const flashListRef = useRef(null);

    const [deleted, setDeleted] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);

    const [likeCount, setLikeCount] = useState(likesCount);
    const [likeString, setLikeString] = useState("");
    const [commentCount, setCommentCount] = useState(commentsCount);
    const [commentString, setCommentString] = useState("");
    const [liked, setLiked] = useState(false);

    const [viewMoreClicked, setViewMoreClicked] = useState(false);

    const editorRef = useRef(null);

    const [finished, setFinished] = useState(template ? false : true);

    useEffect(() => {
        onUpdateLikeCount(likesCount);
        onUpdateCommentCount(commentsCount); // update comment count string
    }, []);

    // if like count is above 999 then display it as count/1000k + k
    // if like count is above 999999 then display it as count/1000000 + m
    // round down to whole number
    const onUpdateLikeCount = React.useCallback((likeCount) => {
        if (likeCount === 0) {
          setLikeString("0");
        } else if (likeCount > 999 && likeCount < 1000000) {
          setLikeString(Math.floor(likeCount / 1000) + "k");
        } else if (likeCount > 999999) {
          setLikeString(Math.floor(likeCount / 1000000) + "m");
        } else {
          setLikeString(likeCount);
        }
    }, []);

    // if comment count is above 999 then display it as count/1000k + k
    // if comment count is above 999999 then display it as count/1000000 + m
    // round down to whole number
    const onUpdateCommentCount = React.useCallback((commentCount) => {
        if (commentCount === 0) {
          setCommentString("0");
        } else if (commentCount > 999 && commentCount < 1000000) {
          setCommentString(Math.floor(commentCount / 1000) + "k");
        } else if (commentCount > 999999) {
          setCommentString(Math.floor(commentCount / 1000000) + "m");
        } else {
          setCommentString(commentCount);
        }
    }, []);

    // update like count and add post to liked collection
    const onLike = React.useCallback(async () => {
        const likedRef = doc(db, "likedComments", firebase.auth().currentUser.uid, "comments", commentId);
        const likedSnapshot = await getDoc(likedRef);
      
        if (!likedSnapshot.exists()) {
            // add post to likes collection
            await setDoc(likedRef, {});
            
            // update like count for Comment
            const commentRef = doc(db, 'comments', replyToPostId, "comments", commentId);

            await updateDoc(commentRef, {
                likesCount: increment(1)
            }).then(() => {
                onUpdateLikeCount(likeCount + 1);
                setLikeCount(likeCount + 1);
            });
        }
      
        setLiked(true);
    }, [likeCount]);

    // update like count and add post to liked collection
    const onDisike = React.useCallback(async () => {
        // delete comment from likedComments collection
        await deleteDoc(doc(db, "likedComments", firebase.auth().currentUser.uid, "comments", commentId))

        // update like count for Comment
        const commentRef = doc(db, 'comments', replyToPostId, "comments", commentId);

        await updateDoc(commentRef, {
            likesCount: increment(-1)
        }).then(() => {
            onUpdateLikeCount(likeCount - 1);
            setLikeCount(likeCount - 1);
            setLiked(false);
        });
    }, [likeCount]);

  

    let likes, alreadyLiked, reply, down

    const getFirstFiveCommentsByPopular = React.useCallback(async () => {
        await fetchFirstFiveCommentsByPopular(replyToPostId, commentId).then((comments) => {
            // console.log("comments")
            setCommentsList(comments);
        });
    }, []);

    const onFirstViewMoreClicked = React.useCallback(() => async() => {
        if(viewMoreClicked){
            return;
        }
        setViewMoreClicked(true);
        await getFirstFiveCommentsByPopular();
    }, [viewMoreClicked]);
    
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

    const toggleLike = React.useCallback(() => async() => {
       liked ? await onDisike() : await onLike()
    }, [liked]);

    const toggleOverlay = React.useCallback(() => () => {
        setOverlayVisible(!overlayVisible);
    }, [overlayVisible]);

    const Item = React.memo(({item})=>{
        return (
            <SubComment
                replyToPostId={replyToPostId}
                replyToCommentId={commentId}
                profile={item.profile}
                username={item.username}
                profilePic={item.profilePic}
                commentId={item.id}
                text={item.text}
                imageUrl={item.imageUrl}
                memeName={item.memeName}
                template={item.template}
                templateState={item.templateState}
                imageWidth={item.imageWidth}
                imageHeight={item.imageHeight}
                likesCount={item.likesCount}
                commentsCount={item.commentsCount}
            />
        );
    }, itemEquals);

    const itemEquals = React.useCallback((prev, next) => {
        return prev.item.id === next.item.id
    }, [])

    const renderItem = React.useCallback(({ item, index }) => {
        if(index == 0){
            return (
                null
            );
        }

        return (
            <Item item={item}/>
        );
    }, []);

    if(deleted){
        return null;
    }

    return (
        <View style={theme == 'light' ? styles.lightCommentContainer : styles.darkCommentContainer}>



            {/* Reply and Like */}
            <View style={{ flexDirection: 'row', marginTop: 1,  alignItems: 'center', alignContent: 'center'  }}>

                {/* Spacer */}
                <TouchableOpacity
                    activeOpacity={1}
                    style={{flex: 1, height: 40, }}
                    onPress={onNavToComment(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
                ></TouchableOpacity>

                {/* Reply */}
                <TouchableOpacity 
                    activeOpacity={1}
                    style={{ paddingLeft: 10, height: 40, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}
                    onPress={onReply(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
                >
                    {reply}

                    <Text style={theme == 'light' ? styles.lightBottomText: styles.darkBottomText}>
                        Reply
                    </Text>
                </TouchableOpacity>
                
                {/* Like Button */}
                <TouchableOpacity 
                    activeOpacity={1}
                    style={{  width: 110, paddingLeft: 10, height: 40, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}
                    onPress={toggleLike()}
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


            {/* Replies - SubComments */}
            <View style={{backgroundColor: 
                    theme == 'light' ? 
                        commentCount > 0 ? '#F2F2F2' : '#FFFFFF'
                    : 
                        commentCount > 0 ? '#000000' : '#151515', 
                    minHeight: 3,
            }}>

                <FlashList
                    ref={flashListRef}
                    data={commentsList}
                    // onEndReachedThreshold={0.2}
                    // onEndReached={() => }
                    estimatedItemSize={300}

                    extraData={[commentsList]}
                    renderItem={renderItem}
                    
                    removeClippedSubviews={true}

                    estimatedListSize={{height: windowHeight, width: windowWidth}}

                    ListFooterComponent={
                        <View style={{ marginTop: 2, marginBottom: 2}}/>
                    }
                    keyExtractor={(item, index) => item.id.toString + "-" + index.toString()}

                    // maxToRenderPerBatch={5}
                    // updateCellsBatchingPeriod={100}
                    // windowSizeprop={5}

                    //optimization
                    
                    // initialNumToRender={10}
                    // maxToRenderPerBatch={10}
                    // windowSize={10}
                    // updateCellsBatchingPeriod={100}
                    // onEndReachedThreshold={0.5}
                    // onEndReached={() => {}} //need to implement infinite scroll
                />
            </View>

            
            {/* View replies */}
            {
                commentCount > 0 &&
                    <TouchableOpacity 
                        activeOpacity={1}
                        style={{
                            backgroundColor: theme == 'light' ? '#FFFFFF' : '#151515',
                            // backgroundColor: theme == 'light' ? '#EEEEEE' : '#171717',
                            borderBottomLeftRadius: 12.5, borderBottomRightRadius: 12.5, flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center' 
                        }}
                        onPress = {onFirstViewMoreClicked()}
                    >

                        <Text style={[theme == 'light' ? styles.lightViewText : styles.darkViewText,{
                            margin: 10,
                        }]}>
                            View {commentString} replies
                        </Text>

                        {down}
                        
                    </TouchableOpacity>
            }

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
        // marginVertical: 8,
        // marginBottom: 4,
    },
    lightCommentContainer: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderColor: "#EBEBEB",
        // borderWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginTop: 8,
        borderRadius: 12.5,
    },
    darkCommentContainer: {
        width: '100%',
        backgroundColor: '#151515',
        borderColor: "#202020",
        // borderWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        marginTop: 8,
        borderRadius: 12.5,
    },
    lightUsername: {
        fontSize: 14,
        fontWeight: 600,
        color: '#5D5D5D',
        textAlign: "left",
    },
    darkUsername: {
        fontSize: 14,
        fontWeight: 600,
        color: '#DADADA',
        textAlign: "left",
    },
    lightCommentText: {
        fontSize: 18,
        fontWeight: 400,
        color: '#222222',
        textAlign: 'auto',
        marginHorizontal: 10,
        marginTop: 7,
        // marginBottom: 6,
    },
    darkCommentText: {
        fontSize: 18,
        fontWeight: 400,
        color: '#F4F4F4',
        textAlign: 'auto',
        marginHorizontal: 10,
        marginTop: 8,
        // marginBottom: 6,
    },
    lightViewText: {
        fontSize: 13,
        fontWeight: 500,
        color: '#1D1D1D',
        marginRight: 2,
    },
    darkViewText: {
        fontSize: 13,
        fontWeight: 500,
        color: '#E6E6E6',
        marginRight: 2,
    },
    lightBottomText: {
        fontSize: 13,
        fontWeight: 500,
        color: '#555555',
        marginRight: 20,
    },
    darkBottomText: {
        fontSize: 13,
        fontWeight: 500,
        color: '#DDDDDD',
        marginRight: 20,
    },
    overlayText: {
        fontSize: 22,
        fontWeight: 500,
        color: '#000000',
        alignSelf: 'center',
        marginHorizontal: 10,
    },
});

export default ListCommentBottom;
