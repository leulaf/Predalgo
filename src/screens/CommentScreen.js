import React, { useEffect, useState, useContext } from 'react';
import { View, LogBox, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';

import Constants from 'expo-constants';

import PostText from '../shared/Text/PostText';

import Animated, {FadeIn} from 'react-native-reanimated';

import { FlashList } from '@shopify/flash-list';

import { Image } from 'expo-image';
import ResizableImage from '../shared/functions/ResizableImage';

import getItemType from '../shared/functions/GetItemType'
import overrideItemLayout from '../shared/functions/OverrideItemLayout'

import { fetchFirstTenCommentsByPopular, fetchNextTenPopularComments } from '../shared/comment/GetComments';

import ImageView from "react-native-image-viewing";

import CreateMeme from '../shared/functions/CreateMeme';

import ContentBottom from '../components/postTypes/ContentBottom';

import CommentBottom from '../components/comments/CommentBottom';

import ReplyBottomSheet from '../components/replyBottom/comments/CommentReplyBottomSheet';

import MainComment from '../components/comments/mainComment/MainComment';

import SimpleTopBar from '../ScreenTop/SimpleTopBar';



const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;


const navToMeme = (navigation, memeName, template, templateUploader, imageHeight, imageWidth) => () => {
    navigation.navigate('Meme', {
        uploader: templateUploader,
        memeName: memeName,
        template: template,
        height: imageHeight,
        width: imageWidth,
    })
}



const onNavToComment =  (navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, template, templateUploader, imageHeight, imageWidth, text, likesCount, commentsCount) => () => () => {
    navigation.push('Comment', {
        commentId: commentId,
        replyToPostId: replyToPostId,
        replyToCommentId: replyToCommentId,
        replyToProfile: profile,
        replyToUsername: username,
        imageUrl: image,
        memeName: memeName,
        template: template,
        templateUploader: templateUploader,
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



const replyBottomSheet = (onReply, navigation, theme, replyToPostId, commentId, profile, username) => (
    <ReplyBottomSheet
        onReplying={onReply}
        navigation={navigation}
        theme={theme}
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

const Header = React.memo(({theme, navigation, memeName, contentBottom, image, imageHeight, imageWidth, text, tags, profile, username, profilePic, ImageFocused}) => {
    const [following, setFollowing] = useState(false);

    const [isImageFocused, setIsImageFocused] = React.useState(false);

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
                            styles.lightFollowButton
                        :
                            styles.darkFollowButton
                    }
                    onPress={toggleFollowing()}
                >
                    <Text style={
                        theme == 'light' ?
                            styles.lightFollowText
                        :
                            styles.darkFollowText
                        }
                    >
                        {following ? 'Following' : 'Follow'}
                    </Text>
                </TouchableOpacity>
            </View>


            <View style={{marginBottom: 8}}>

                <PostText text={text}/>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setIsImageFocused(!isImageFocused)}
                >
                    <ResizableImage 
                        image={image}
                        height={imageHeight}
                        width={imageWidth}
                        maxWidth={windowWidth-6}
                        maxHeight={windowHeight}
                        style={{marginTop: 5, borderRadius: 15, alignSelf: 'center'}}
                    />


                    
                    <ImageView
                        images={[{uri: image}]}
                        imageIndex={0}
                        visible={isImageFocused}
                        onRequestClose={() => setIsImageFocused(false)}
                        animationType="fade"
                        doubleTapToZoomEnabled={true}
                        FooterComponent={({ imageIndex }) => 
                            {ImageFocused}
                        }
                    />
                </TouchableOpacity>
                
                {/* Content bottom */}
                <View style={{marginLeft: 5, marginTop: 5, marginBottom: 0}}>
                    {contentBottom}
                </View>

            </View>
            
        </Animated.View>
    );
}, imageEquals);

const imageEquals =(prev, next) => {
    return prev.image === next.image
}


const ImageComment = React.memo(({item, index, navigation, theme})=>{
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
            templateUploader={item.templateUploader}
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

const TextComment = React.memo(({item, index, navigation, theme})=>{
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
    
    const {profile, commentId, comments, onReply, replyToCommentId, replyToPostId, username, profilePic, text, imageUrl, template, templateUploader, templateState, imageWidth, imageHeight, memeName, tags, likesCount, commentsCount, fromMemeScreen} = route.params;

    const [commentsList, setCommentsList] = useState(comments ? comments :[ {id: "one"}, {id: "two"}]);

    const {imageReply, setImageReply, options, setOptions} = useContext(AuthenticatedUserContext);

    const [image, setImage] = useState(imageUrl ? imageUrl : template);
    const [finished, setFinished] = useState(template  && !(imageUrl)? false : true);

    const contentBottom = (
        <ContentBottom
            memeName={memeName}
            tags={tags}
            navToMeme={!fromMemeScreen ? navToMeme(navigation, memeName, template, templateUploader, imageHeight, imageWidth) : () => navigation.goBack()}
        />
    );

    const ImageFocused = (
        <View style={{backgroundColor: 'rgba(0,0,0,0.5)', height: 90}}>
            <CommentBottom
                commentID={commentId}
                replyToCommentId={replyToCommentId}
                replyToPostId={replyToPostId}
                likesCount={likesCount}
                commentsCount={commentsCount}
                theme='dark'
            />
        </View>     
    )


    useEffect(() => {
        commentsList.length > 2 ?  null : commentsCount > 0 && getFirstTenCommentsByPopular();

        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, []);


    const getFirstTenCommentsByPopular = React.useCallback(async() => {

        const comments = await fetchFirstTenCommentsByPopular(replyToPostId, commentId);
        setCommentsList(commentsList => [...commentsList, ...comments]);
    }, []);

    const getNextTenPopularComments = React.useCallback(async() => {

        const comments = await fetchNextTenPopularComments(replyToPostId, commentId, commentsList[commentsList.length-1].snap);
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
                    memeName={memeName}
                    imageHeight={imageHeight}
                    imageWidth={imageWidth}
                    text={text}
                    tags={tags}
                    profile={profile}
                    username={username}
                    profilePic={profilePic}
                    contentBottom={contentBottom}
                    ImageFocused={ImageFocused}
                />
            );
        }else if (index === 1) {
            return (
                <View style={[theme == 'light' ? styles.lightContainer : styles.darkContainer, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]}>
                    <CommentBottom
                        commentID={commentId}
                        replyToCommentId={replyToCommentId}
                        replyToPostId={replyToPostId}
                        likesCount={likesCount}
                        commentsCount={commentsCount}
                        theme={theme}
                        navToComment={onNavToComment(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, template, templateUploader, imageHeight, imageWidth, text, likesCount, commentsCount)}
                    />
                </View>
            );
        }else if(item.imageHeight){
            return (
                <ImageComment item={item} navigation={navigation} index={index} theme={theme}/>
            );
        }else{
            return (
                <TextComment item={item} navigation={navigation} index={index} theme={theme}/>
            );
        }
    }, [theme, image,]);


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

                showsVerticalScrollIndicator={false}

                removeClippedSubviews={true}

                estimatedItemSize={200}
                estimatedListSize={{height: windowHeight, width: windowWidth}}

                ListHeaderComponent={

                    <SimpleTopBar
                        theme={theme}
                        // ****** use goToReplyDirectly when navigating to comment directly instead of a post/comment ******
                        // goToReplyDirectly={route?.params?.replyToPostId || route?.params?.replyToCommentId ? true : false}
                        title={"Comment"}
                        onGoBack={onGoBack}
                        replyToCommentId={replyToCommentId}
                        replyToPostId={replyToPostId}
                    />

                }

                ListFooterComponent={
                    <View 
                        style={[
                            theme == 'light' ? styles.lightMainContainer : styles.darkMainContainer
                            , {height: 200, marginTop: 5}
                        ]}
                    />
                }

                getItemType={getItemType}
                
                // overrideItemLayout={overrideItemLayout}

                keyExtractor={keyExtractor}

                contentContainerStyle={{backgroundColor: theme == 'light' ? '#F4F4F4' : '#000000'}}
            />

            {replyBottomSheet(onReply, navigation, theme, replyToPostId, commentId, profile, username)}

            {
                options && 

                <View
                    style={styles.threeDotsOverlay}
                >
                    <TouchableOpacity
                        onPressIn = {() => setOptions("close")}
                        style={{backgroundColor: 'rgba(0,0,0,0)', height: "100%", width: "100%"}}
                    >

                    </TouchableOpacity>
                    <ThreeDotsSheet
                        profile={options.profile}
                        commentId={options.commentId}
                        replyToPostId={options.replyToPostId}
                        replyToCommentId={options.replyToCommentId}
                        image={options.image}
                        text={options.text}
                        theme={theme}
                    />
                </View>
                
            }
        </View>

        {/* Load Meme with template and template state */}
        {!finished && <CreateMeme image={image} templateState={templateState} setFinished={setFinished} setImage={setImage} id={commentId}/>}
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
    threeDotsOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        width: "100%",
        height:"100%",
        position: 'absolute',
        top: 0
    },
    lightUserContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 12,
        marginBottom: 5,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    darkUserContainer: {
        backgroundColor: '#151515',
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 12,
        marginBottom: 5,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    lightUsername: {
        fontSize: 16,
        fontWeight: "600",
        // color: '#444444',
        color: '#000',
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
        // color: '#777777',
        color: '#000',
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
        backgroundColor: '#222222',
        borderRadius: 20,
        width: "auto",
        height: 37,
        marginRight: 6,
        marginBottom: 4,
        // borderWidth: 1.3,
        // borderColor: '#CCCCCC',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    darkFollowButton: {
        flexDirection: 'column',
        backgroundColor: '#333333',
        borderRadius: 20,
        width: "auto",
        height: 37,
        marginRight: 6,
        marginBottom: 4,
        borderWidth: 1.3,
        borderColor: '#555555',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    lightFollowText: {
        fontSize: 17,
        color: '#FFFFFF',
        fontWeight: "600",
        alignSelf: 'center',
        marginBottom: 1,
        marginHorizontal: 12,
    },
    darkFollowText: {
        fontSize: 17,
        color: '#ffffff',
        fontWeight: "600",
        alignSelf: 'center',
        marginBottom: 1,
        marginHorizontal: 12,
    },
});

export default React.memo(CommentScreen);
