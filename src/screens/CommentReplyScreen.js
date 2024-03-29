import React, { useEffect, useState, useContext } from 'react';
import { View, LogBox, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';

import { doc, getDoc } from "firebase/firestore";

import Constants from 'expo-constants';

import PostText from '../shared/Text/PostText';

import Animated, {FadeIn} from 'react-native-reanimated';

import { FlashList } from '@shopify/flash-list';

import { Image } from 'expo-image';
import ResizableImage from '../shared/ResizableImage';

import getItemType from '../shared/GetItemType'
import overrideItemLayout from '../shared/OverrideItemLayout'

import { fetchFirstTenCommentsByPopular, fetchNextTenPopularComments } from '../shared/comment/GetComments';


import CreateMeme from '../shared/CreateMeme';

import ContentBottom from '../components/postTypes/ContentBottom';

import CommentBottom from '../components/comments/CommentBottom';

import ReplyBottomSheet from '../components/replyBottom/CommentReplyBottomSheet';

import MainComment from '../components/comments/mainComment/MainComment';

import SimpleTopBar from '../ScreenTop/SimpleTopBar';



const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const contentBottom = (memeName, tags) => (
    <ContentBottom
        memeName={memeName}
        tags={tags}
    />
);

const replyBottomSheet = (onReply, navigation, replyToPostId, commentId, profile, username) => (
    <ReplyBottomSheet
        onReplying={onReply}
        navigation={navigation}
        replyToPostId={replyToPostId}
        replyToCommentId={commentId}
        replyToProfile = {profile}
        replyToUsername={username}
    />
);

const goToProfile = (navigation, profile, username, profilePic) => () => {
    navigation.push('Profile', {
        user: profile,
        username: username,
        profilePic: profilePic,
    })
}

const Header = React.memo(({theme, navigation, memeName, image, imageHeight, imageWidth, text, tags, profile, username, profilePic, }) => {
    const [following, setFollowing] = useState(false);

    const toggleFollowing = React.useCallback(() => () => {
        // following ? onUnfollow() : onFollow();
        setFollowing(!following);
    }, [following]);

    return (
        <Animated.View
            entering={FadeIn}
            style={theme == 'light' ? styles.lightContainer : styles.darkContainer}
        >
            <View 
                style={theme == 'light' ? styles.lightUserContainer : styles.darkUserContainer}
            >
                {/* profile pic */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={goToProfile(navigation, profile, username, profilePic)}
                >
                    {profilePic != "" &&
                        <Image source={{ uri: profilePic }} style={styles.profileImage} placeholder={require('../../assets/profile_default.png')} cachePolicy={'disk'}/>
                    }
                </TouchableOpacity>
                
                {/* username */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={{flex: 1, flexDirection: 'column'}}
                    onPress={goToProfile(navigation, profile, username, profilePic)}
                >
                    <Text style={theme == 'light' ? styles.lightUsername: styles.darkUsername}>
                        @{username}
                    </Text>
                </TouchableOpacity>
                
                {/* Follow/Following button */}
                <TouchableOpacity
                activeOpacity={0.9}
                    style={
                        theme == 'light' ? 
                            !following ? styles.lightFollowButton : styles.lightFollowingButton
                        :
                            !following ? styles.darkFollowButton : styles.darkFollowingButton
                    }
                    onPress={toggleFollowing()}
                >
                    <Text style={
                        theme == 'light' ?
                            !following ? styles.lightFollowText : styles.lightFollowingText
                        :
                            !following ? styles.darkFollowText : styles.darkFollowingText
                        }
                    >
                        {following ? 'Following' : 'Follow'}
                    </Text>
                </TouchableOpacity>
            </View>


            <View style={{marginBottom: 8}}>

                <PostText text={text}/>

                <ResizableImage 
                    image={image}
                    height={imageHeight}
                    width={imageWidth}
                    maxWidth={windowWidth}
                    maxHeight={500}
                    style={{marginTop: 7, borderRadius: 10, alignSelf: 'center'}}
                />
                
                {/* Content bottom */}
                <View style={{marginLeft: 5, marginTop: 5, marginBottom: 0}}>
                    {contentBottom(memeName, tags)}
                </View>

            </View>
            
        </Animated.View>
    );
}, imageEquals);

const imageEquals =(prev, next) => {
    return prev.image === next.image
}


const ImagePost = React.memo(({item, index, navigation, theme})=>{
    // const tempString = Math.random();
    return (
        <MainComment
            navigation={navigation}
            theme={theme}
            replyToPostId={item.replyToPostId}
            replyToCommentId={item.replyToCommentId}
            profile={item.profile}
            username={item.username}
            profilePic={item.profilePic}
            commentId={item.id}
            text={item.text}
            imageUrl={item.imageUrl}
            memeName={item.memeName}
            // templateState={item.templateState && {"annotation": [{"color": [], "disableErase": true, "flipX": false, "flipY": false, "fontFamily": "sans-serif", "fontSize": "20%", "fontStyle": "normal", "fontVariant": "normal", "fontWeight": "normal", "format": "text", "height": "31.2280701754386%", "id": "7fs6et27a", "isEditing": false, "isSelected": false, "lineHeight": "120%", "opacity": 1, "rotation": 0, "text": "0.15567325678682167", "textAlign": "left", "width": "41.31578947368421%", "x": "2.631578944757731%", "y": "0.17543859301029396%"}, {"color": [], "disableErase": true, "flipX": false, "flipY": false, "fontFamily": "sans-serif", "fontSize": "20%", "fontStyle": "normal", "fontVariant": "normal", "fontWeight": "normal", "format": "text", "height": "33.33333333333333%", "id": "u8012jlbl", "isEditing": false, "isSelected": false, "lineHeight": "120%", "opacity": 1, "rotation": 0, "text": tempString.toString(), "textAlign": "left", "width": "40.26315789473684%", "x": "60.78947367898914%", "y": "0.1754386069339992%"}, {"color": [], "disableErase": true, "flipX": false, "flipY": false, "fontFamily": "sans-serif", "fontSize": "20%", "fontStyle": "normal", "fontVariant": "normal", "fontWeight": "normal", "format": "text", "height": "32.28070175438596%", "id": "inhrf4onv", "isEditing": false, "isSelected": false, "lineHeight": "120%", "opacity": 1, "rotation": 0, "text": tempString.toString(), "textAlign": "left", "width": "41.8421052631579%", "x": "0.26315789082079816%", "y": "71.75438597535504%"}, {"color": [], "disableErase": true, "flipX": false, "flipY": false, "fontFamily": "sans-serif", "fontSize": "20%", "fontStyle": "normal", "fontVariant": "normal", "fontWeight": "normal", "format": "text", "height": "32.98245614035087%", "id": "6bki5dmuu", "isEditing": false, "isSelected": false, "lineHeight": "120%", "opacity": 1, "rotation": 0, "text": tempString.toString(), "textAlign": "left", "width": "38.421052631578945%", "x": "62.368421050020885%", "y": "72.80701753515734%"}], "backgroundColor": [0, 0, 0, 0], "crop": {"height": 3024, "width": 4032, "x": 0, "y": 0}, "cropLimitToImage": true, "cropMaxSize": {"height": 32768, "width": 32768}, "cropMinSize": {"height": 1, "width": 1}, "decoration": [], "flipX": false, "flipY": false, "frame": {"disableStyle": ["backgroundColor", "strokeColor", "strokeWidth"], "frameColor": [0, 0, 0], "height": "100%", "width": "100%", "x": 0, "y": 0}, "redaction": [], "rotation": 0}}
            templateState={item.templateState}
            template={item.template}
            imageWidth={item.imageWidth}
            imageHeight={item.imageHeight}
            likesCount={item.likesCount}
            commentsCount={item.commentsCount}
            index={index}
        />
    );
}, itemEquals);


const itemEquals = (prev, next) => {
    return prev.item.id === next.item.id
}

const TextPost = React.memo(({item, index, navigation, theme})=>{
    return (
        <MainComment
            navigation={navigation}
            theme={theme}
            replyToPostId={item.replyToPostId}
            replyToCommentId={item.replyToCommentId}
            profile={item.profile}
            username={item.username}
            profilePic={item.profilePic}
            commentId={item.id}
            text={item.text}
            likesCount={item.likesCount}
            commentsCount={item.commentsCount}
            index={index}
        />
    );
}, itemEquals);


const keyExtractor = (item, index) => item.id.toString() + "-" + index.toString();

const CommentScreen = ({navigation, route}) => {
    const {theme,setTheme} = useContext(ThemeContext);

    const {commentId} = route.params;

    const [comment, setComment] = useState("Waiting for post to load");

    const [commentsList, setCommentsList] = useState([ {id: "one"}, {id: "two"}]);

    const {imageReply, setImageReply} = useContext(AuthenticatedUserContext);

    const [image, setImage] = useState("");
    
    const [finished, setFinished] = useState(false);


    useEffect(() => {
        const getPostWithComments = async() => {
            const commentRef = doc(db, "allPosts", commentId);
            const commentSnap = await getDoc(commentRef);

            if (commentSnap.exists()) {
                setComment(commentSnap.data());
                setImage(commentSnap.data().imageUrl ? commentSnap.data().imageUrl : commentSnap.data().template);
                setFinished(commentSnap.data().template ? false : true);
                getFirstTenCommentsByPopular();
            }else{
                // Make sure that the user is not going to this screen repeatedly and making calls to the database
                setComment("Post not found");
            }
        }
        
        getPostWithComments();

        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, []);


    const getFirstTenCommentsByPopular = React.useCallback(async() => {

        const comments = await fetchFirstTenCommentsByPopular(comment.replyToPostId, commentId);
        setCommentsList(commentsList => [...commentsList, ...comments]);
    }, []);

    const getNextTenPopularComments = React.useCallback(async() => {

        const comments = await fetchNextTenPopularComments(comment.replyToPostId, commentId, commentsList[commentsList.length-1].snap);
        commentsList[commentsList.length-1].snap = null;
        setCommentsList(commentsList => [...commentsList, ...comments]);
    }, [commentsList]);


    const onGoBack = React.useCallback(() => {
        if(imageReply && imageReply.forCommentOnComment){
            setImageReply(null)
        }
        navigation.goBack(null);
    }, [imageReply]);

    
    const renderItem = React.useCallback(({ item, index }) => {

        // index 0 is the header continng the profile pic, username, title and post content
        if (index === 0) {
            return (
                <Header
                    theme={theme}
                    image={image}
                    navigation={navigation}
                    memeName={comment.memeName}
                    imageHeight={comment.imageHeight}
                    imageWidth={comment.imageWidth}
                    text={comment.text}
                    tags={comment.tags}
                    profile={comment.profile}
                    username={comment.username}
                    profilePic={comment.profilePic}
                />
            );
        }else if (index === 1) {
            return (
                <View style={[theme == 'light' ? styles.lightContainer : styles.darkContainer, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]}>
                    <CommentBottom
                        commentID={commentId}
                        replyToCommentId={comment.replyToCommentId}
                        replyToPostId={comment.replyToPostId}
                        likesCount={comment.likesCount}
                        commentsCount={comment.commentsCount}
                    />
                </View>
            );
        }else if(item.imageHeight){
            return (
                <ImagePost item={item} navigation={navigation} theme={theme}/>
            );
        }else{
            return (
                <TextPost item={item} navigation={navigation} theme={theme}/>
            );
        }
    }, [theme, image,]);


    // Displayed while waiting for post or if post is not found
    if(comment == "Waiting for post to load" || comment == "Post not found"){
        return (
            <View
                style={[theme == 'light' ? styles.lightContainer : styles.darkContainer, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}
            >
                <Text style={theme == 'light' ? styles.lightNoPostText : styles.darkNoPostText}>
                   {comment}
                </Text>
            </View>
        );
    }


    //NEED***NEED to make sure multiple instance of PinturaLoadImage are not created***
    return (
        <>
        <View
            style={theme == 'light' ? styles.lightMainContainer : styles.darkMainContainer}
        >

            {/* Top */}
            <View style={[theme == 'light' ? styles.lightContainer : styles.darkContainer, {height: Constants.statusBarHeight,}]}/>

            <FlashList
                // ref={flashListRef}
                data={commentsList}
                
                onEndReached={commentsList[commentsList.length-1].snap && getNextTenPopularComments }
                onEndReachedThreshold={1} //need to implement infinite scroll

                // extraData={[]}
                stickyHeaderIndices={[1]}
                renderItem={renderItem}

                // showsVerticalScrollIndicator={false}

                removeClippedSubviews={true}

                estimatedItemSize={200}
                estimatedListSize={{height: windowHeight, width: windowWidth}}

                ListHeaderComponent={

                    <SimpleTopBar
                        title={"Comment"}
                        onGoBack={onGoBack}
                        replyToCommentId={comment.replyToCommentId}
                        replyToPostId={comment.replyToPostId}
                    />

                }

                ListFooterComponent={
                    <View style={{height: 200}}/>
                }

                getItemType={getItemType}
                
                // overrideItemLayout={overrideItemLayout}

                keyExtractor={keyExtractor}
            />

            {replyBottomSheet(comment.onReply, navigation, comment.replyToPostId, commentId, comment.profile, comment.username)}
        </View>

        {/* Load Meme with template and template state */}
        {!finished && <CreateMeme image={image} templateState={comment.templateState} setFinished={setFinished} setImage={setImage} id={commentId}/>}
        </>
    );

};

const styles = StyleSheet.create({
    item: {
        padding: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginRight: 5,
    },
    lightMainContainer: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    darkMainContainer: {
        flex: 1,
        // backgroundColor: '#0C0C0C',
        backgroundColor: '#000000',
    },
    lightContainer: {
        backgroundColor: 'white',
    },
    darkContainer: {
        backgroundColor: '#151515',
    },
    lightUserContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 13,
        marginBottom: 5,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    darkUserContainer: {
        backgroundColor: '#151515',
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 13,
        marginBottom: 5,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    lightUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#444444',
        textAlign: "left",
        marginBottom: 1,
    },
    darkUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#DDDDDD',
        textAlign: "left",
        marginBottom: 1,
    },
    lightRepostUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#777777',
        textAlign: "left",
    },
    darkRepostUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#BBBBBB',
        textAlign: "left",
    },
    lightFollowButton: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        width: 75,
        height: 40,
        marginRight: 6,
        marginBottom: 4,
        borderWidth: 1.5,
        borderColor: '#BBBBBB',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    darkFollowButton: {
        flexDirection: 'column',
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        width: 75,
        height: 40,
        marginRight: 6,
        marginBottom: 4,
        borderWidth: 1.5,
        borderColor: '#666666',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    lightFollowingButton: {
        flexDirection: 'column',
        backgroundColor: '#444444',
        borderRadius: 20,
        width: 95,
        height: 40,
        marginRight: 5,
        marginBottom: 4,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    darkFollowingButton: {
        flexDirection: 'column',
        backgroundColor: '#EEEEEE',
        borderRadius: 20,
        width: 95,
        height: 40,
        marginRight: 5,
        marginBottom: 4,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    lightFollowText: {
        fontSize: 17,
        color: '#222222',
        fontWeight: "600",
        alignSelf: 'center',
        marginBottom: 1
    },
    darkFollowText: {
        fontSize: 17,
        color: '#ffffff',
        fontWeight: "600",
        alignSelf: 'center',
        marginBottom: 1
    },
    lightFollowingText: {
        fontSize: 17,
        color: '#ffffff',
        fontWeight: "600",
        alignSelf: 'center',
        marginBottom: 1
    },
    darkFollowingText: {
        fontSize: 17,
        color: '#000000',
        fontWeight: "600",
        alignSelf: 'center',
        marginBottom: 1
    },
});

export default CommentScreen;
