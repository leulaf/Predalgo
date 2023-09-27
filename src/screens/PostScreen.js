

import React, {} from 'react';
import { View, LogBox, TouchableOpacity, Text, StyleSheet, Dimensions, RefreshControl, StatusBar, Touchable } from 'react-native';
import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';

import Constants from 'expo-constants';

import PostText from '../shared/Text/PostText';
import TitleText from '../shared/Text/TitleText';

import Animated, {FadeIn} from 'react-native-reanimated';

import { FlashList } from '@shopify/flash-list';

import ThreeDotsSheet from '../components/comments/shared/ThreeDotsSheet';

import LottieView from 'lottie-react-native';

import { Image } from 'expo-image';
import ResizableImage from '../shared/functions/ResizableImage';

import { fetchFirstTenPostCommentsByRecent, fetchFirstTenPostCommentsByPopular, fetchNextTenPopularComments } from '../shared/post/GetPostComments';

import ImageView from "react-native-image-viewing";

import CreateMeme from '../shared/functions/CreateMeme';

import ContentBottom from '../components/postTypes/ContentBottom';

import PostBottom from '../components/postTypes/PostBottom';

import ReplyBottomSheet from '../components/replyBottom/comments/PostReplyBottomSheet';

import MainComment from '../components/comments/mainComment/MainComment';

import getItemType from '../shared/functions/GetItemType'
import overrideItemLayout from '../shared/functions/OverrideItemLayout'


import SimpleTopBar from '../ScreenTop/SimpleTopBar';

import Repost from '../../assets/repost.svg'


const refreshAnimation = require('../../assets/animations/Refreshing.json');
const refreshingHeight = 100;

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;


const navToMeme = (navigation, memeName, template, templateUploader, imageHeight, imageWidth) => () => {
    navigation.navigate('Meme', {
        uploader: templateUploader,
        memeName: memeName,
        template: template,
        height: imageHeight,
        width: imageWidth,
    })
}


const onNavToPost =  (navigation, postId, title, tags, profile, profilePic, username, imageUrl, template, templateUploader, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount) => () => {
    navigation.push('Post', {
        postId: postId,
        title: title,
        tags: tags,
        imageUrl: imageUrl,
        memeName: memeName,
        template: template,
        templateUploader: templateUploader ? templateUploader : null,
        templateState: null,
        imageHeight: imageHeight,
        imageWidth: imageWidth,
        text: text,
        likesCount: likesCount,
        commentsCount: commentsCount,
        profile: profile,
        username: username,
        profilePic: profilePic,
    });
}


const replyBottomSheet = (navigation, theme, postId, profile, username) => (
    <ReplyBottomSheet
        theme={theme}
        navigation={navigation}
        replyToPostId = {postId}
        replyToProfile = {profile}
        replyToUsername={username}
    />
);

const goToProfile = (navigation, profile, username, profilePic) => () => {
    console.log(profilePic)
    navigation.push('Profile', {
        profile: profile,
        username: username,
        profilePic: profilePic,
    })
}

const Header = React.memo(({theme, navigation, contentBottom, title, memeName, image, imageHeight, imageWidth, text, tags, profile, reposterProfile, username, reposterUsername, profilePic, reposterProfilePic, ImageFocused }) => {
    const [following, setFollowing] = React.useState(false);

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
            {
                reposterUsername &&

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={goToProfile(navigation, reposterProfile, reposterUsername, reposterProfilePic)}
                    style = {{flexDirection: 'row'}}
                >
                    <Repost
                        width={19}
                        height={19}
                        style={theme == 'light' ? styles.lightRepostIcon: styles.darkRepostIcons}
                    />
                    <Text style={theme == 'light' ? styles.lightReposterUsername: styles.darkReposterUsername}>
                        Reposted by @{reposterUsername}
                    </Text>
                </TouchableOpacity>
            }

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

                    {/* title */}
                    {title && <TitleText title={title}/>}

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
                            presentationStyle="overFullScreen"
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


const ImageComment = React.memo(({item, theme, index, navigation})=>{
    return (
        <MainComment
            navigation={navigation}
            index={index}
            theme={theme}
            replyToPostId={item.replyToPostId}
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
        />
    );
}, itemEquals);


const itemEquals = (prev, next) => {
    return prev.item.id === next.item.id
}

const TextPost = React.memo(({item, theme, index, navigation})=>{
    return (
        <MainComment
            navigation={navigation}
            index={index}
            theme={theme}
            replyToPostId={item.replyToPostId}
            profile={item.profile}
            username={item.username}
            profilePic={item.profilePic}
            commentId={item.id}
            text={item.text}
            likesCount={item.likesCount}
            commentsCount={item.commentsCount}
        />
    );
}, itemEquals);


const keyExtractor = (item, index) => item.id.toString + "-" + index.toString();


const PostScreen = ({navigation, route}) => {
    const {theme,setTheme} = React.useContext(ThemeContext);
    const [commentsList, setCommentsList] = React.useState([{id: "one"}, {id: "two"}]);
    const {title, profile, reposterProfile, likesCount, commentsCount, imageUrl, template, templateUploader, templateState, imageHeight, imageWidth, text, username, reposterUsername, profilePic, reposterProfilePic, postId, memeName, tags, fromMemeScreen} = route.params;

    const {imageReply, setImageReply, options, setOptions} = React.useContext(AuthenticatedUserContext);

    const [image, setImage] = React.useState(imageUrl ? imageUrl : template);
    
    const [finished, setFinished] = React.useState(template && !(imageUrl) ? false : true);

    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const [extraPaddingTop, setExtraPaddingTop] = React.useState(false);

    const refreshViewRef = React.useRef(null);

    // Used for tracking the scroll to make the refresh animation work correctly
    const [offsetY, setOffsetY] = React.useState(0);
    

    const ImageFocused = (
        <View style={{backgroundColor: 'rgba(0,0,0,0.5)', height: 90}}>
            <PostBottom
                postId={postId}
                likesCount={likesCount}
                commentsCount={commentsCount}
                theme='imageFocused'
            />
        </View>
    )

    // let progress = 0;

    // if (offsetY <= 0) {
    //     progress = -offsetY / refreshingHeight;
    // }

    const contentBottom = (
        <ContentBottom
            memeName={memeName}
            tags={tags}
            navToMeme={!fromMemeScreen ? navToMeme(navigation, memeName, template, templateUploader, imageHeight, imageWidth) : () => navigation.goBack()}
            templateUploader={templateUploader}
        />
    );


    React.useEffect(() => {
        commentsCount > 0 && getFirstTenPostCommentsByPopular();

        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, []);


    React.useEffect(() => {
        if (isRefreshing) {
          setExtraPaddingTop(true);

          refreshViewRef.current.play();
        } else {
          extraPaddingTop && setExtraPaddingTop(false);
        }
    }, [isRefreshing]);


    const getFirstTenPostCommentsByPopular = React.useCallback(async() => {

        const comments = await fetchFirstTenPostCommentsByPopular(postId);
        setCommentsList(commentsList => [...commentsList, ...comments]);
    }, []);

    const getNextTenPopularComments = React.useCallback(async() => {
        
        const comments = await fetchNextTenPopularComments(postId, commentsList[commentsList.length-1].snap);
        commentsList[commentsList.length-1].snap = null;
        setCommentsList(commentsList => [...commentsList, ...comments]);
    }, [commentsList]);


    function onScroll(event) {
        const { nativeEvent } = event;
        const { contentOffset } = nativeEvent;
        const { y } = contentOffset;
        setOffsetY(y);
    }

    // const togglextraPaddingTop = React.useCallback((action) => {
    //     if(action == "removeAndWait"){
    //         setExtraPaddingTop(false);

    //         setTimeout(() => {
    //             setExtraPaddingTop(false);
    //         }
    //         , 1000);
    //     }
    // }, [extraPaddingTop]);


    const onGoBack = React.useCallback(() => {
        if(imageReply && imageReply.forCommentOnPost){
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
                    title={title}
                    memeName={memeName}
                    imageHeight={imageHeight}
                    imageWidth={imageWidth}
                    text={text}
                    tags={tags}
                    profile={profile}
                    reposterProfile={reposterProfile}
                    username={username}
                    reposterUsername={reposterUsername}
                    profilePic={profilePic}
                    reposterProfilePic={reposterProfilePic}
                    contentBottom={contentBottom}
                    ImageFocused={ImageFocused}
                />
            );
        }else if (index === 1) {
            return (
                <View style={[theme == 'light' ? styles.lightContainer : styles.darkContainer, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]}>
                    <PostBottom
                        postId={postId}
                        likesCount={likesCount}
                        commentsCount={commentsCount}
                        theme={theme}
                        navToPost={() => onNavToPost(navigation, postId, title, tags, profile, profilePic, username, imageUrl, template, templateUploader, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
                    />
                </View>
            );
        }else if(item.imageHeight){
            return (
                <ImageComment item={item} navigation={navigation} index={index} theme={theme}/>
            );
        }else{
            return (
                <TextPost item={item} navigation={navigation} index={index} theme={theme}/>
            );
        }
    }, [theme, image])
    

    return (
        <View
            style={
                theme == 'light' ?
                    styles.lightMainContainer
                    // [styles.lightMainContainer, {backgroundColor: offsetY > 0 ? '#F4F4F4' : '#FFFFFF'}]
                :
                    styles.darkMainContainer
                    // [styles.darkMainContainer, {backgroundColor: offsetY > 0 ? '#000000' : '#151515'}]
            }
        >
            
            
            {/* Load Meme with template and template state */}
            {!finished && <CreateMeme image={template} templateState={templateState} setFinished={setFinished} setImage={setImage} id={postId}/>}

            
            

            {/* Top */}
            <View 
                style={[
                    theme == 'light' ? styles.lightContainer : styles.darkContainer, 
                    {height: Constants.statusBarHeight + 10}
                ]}
            />


            
            {/* Refresh animation */}
            {
                offsetY < 0 && 
                <>
                    <LottieView
                        ref={refreshViewRef}
                        autoPlay
                        style={[styles.lottieView]}
                        // source={theme == 'light' ? refreshAnimationLight : refreshAnimationDark}
                        source={refreshAnimation}
                        // progress={progress}
                        colorFilters={[
                            { keypath: "Path", 
                                color: theme == 'light' ? "#005fff" : "#FFF" },
                        ]}
                    />

                    {/* <View style={{marginBottom: 10}}/> */}
                </>
            }


            {/* List */}
            <FlashList
                data={commentsList}
                
                onEndReached={commentsList[commentsList.length-1].snap && getNextTenPopularComments }
                onEndReachedThreshold={1} //need to implement infinite scroll

                // extraData={[]}
                stickyHeaderIndices={[1]}
                renderItem={renderItem}

                showsVerticalScrollIndicator={false}

                removeClippedSubviews={true}

                estimatedItemSize={200}
                estimatedListSize={{height: windowHeight ,  width: windowWidth}}

                ListHeaderComponent={
                    <SimpleTopBar
                        theme={theme}
                        title={"Post"}
                        onGoBack={onGoBack}
                        extraPaddingTop={extraPaddingTop}
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


                refreshControl={
                    <RefreshControl 
                        refreshing={isRefreshing}
                        onRefresh={() => {
                            setExtraPaddingTop(true);
                            setIsRefreshing(true);
                            setTimeout(() => {
                                setIsRefreshing(false);
                            }, 2000);
                        }}
                        // progressViewOffset={progress}
                        tintColor={'rgba(255, 255, 255, 0.0)'}
                        // progressViewOffset={0}
                    />
                }

                // refreshing={isRefreshing}

                // onRefresh={() => {
                //     setExtraPaddingTop(true);
                //     setIsRefreshing(true);
                //     setTimeout(() => {
                //         setIsRefreshing(false);
                //     }, 3000);
                // }}

                // refreshControl={
                //     <View/>
                // }

                // progressViewOffset={progress}

                // onResponderRelease={console.log("sadfadsfdfasdfsa")}

                onScroll={onScroll}
                // onScroll={(e) => {
                //     scrollY.setValue(e.nativeEvent.contentOffset.y) && console.log("e.nativeEvent.contentOffset.y");
                // }}

                getItemType={getItemType}

                // overrideItemLayout={overrideItemLayout}
                
                keyExtractor={keyExtractor}

                contentContainerStyle={{backgroundColor: theme == 'light' ? '#F4F4F4' : '#000000'}}
            />

            {replyBottomSheet(navigation, theme, postId, profile, username)}

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
        // backgroundColor: '#F4F4F4',
        backgroundColor: '#FFF',
    },
    darkMainContainer: {
        flex: 1,
        // backgroundColor: '#0C0C0C',
        // backgroundColor: '#000000',
        backgroundColor: '#151515',
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
    lightReposterUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#555',
        marginLeft: 8,
        marginTop: 9,
    },
    darkReposterUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#CCC',
        textAlign: "left",
        marginLeft: 8,
        marginTop: 9,
    },
    lightRepostIcon: {
        color: "#606060",
        marginLeft: 11,
        marginTop: 10
    },
    darkRepostIcons: {
        color: "#BBB",
        marginLeft: 11,
        marginTop: 10
    },
    lottieView: {
        height: refreshingHeight,
        position: 'absolute',
        top: 10,
        left: 0,
        right: 9,
        marginBottom: 15
    },
    lightFollowButton: {
        flexDirection: 'column',
        backgroundColor: '#222222',
        borderRadius: 20,
        width: "auto",
        height: 37,
        marginRight: 6,
        marginBottom: 4,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    darkFollowButton: {
        flexDirection: 'column',
        backgroundColor: '#EAEAEA',
        borderRadius: 20,
        width: "auto",
        height: 37,
        marginRight: 6,
        marginBottom: 4,
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
        color: '#000000',
        fontWeight: "600",
        alignSelf: 'center',
        marginBottom: 1,
        marginHorizontal: 12,
    },
 
});

export default PostScreen;
