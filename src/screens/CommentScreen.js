import React, { useEffect, useRef,  useState, useContext } from 'react';
import { View, LogBox, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';

import PostText from '../shared/Text/PostText';

import Animated, {FadeIn} from 'react-native-reanimated';

import { FlashList } from '@shopify/flash-list';

import { Image } from 'expo-image';
import ResizableImage from '../shared/ResizableImage';

import { fetchFirstTenCommentsByPopular, fetchNextTenPopularComments } from '../shared/comment/GetComments';

import GlobalStyles from '../constants/GlobalStyles';


import ContentBottom from '../components/postTypes/ContentBottom';

import CommentBottom from '../components/commentTypes/CommentBottom';

import ReplyBottomSheet from '../components/replyBottom/CommentReplyBottomSheet';

import MainComment from '../components/commentTypes/MainComment';

import SimpleTopBar from '../components/SimpleTopBar';

import PinturaEditor from "@pqina/react-native-expo-pintura";

import { manipulateAsync } from 'expo-image-manipulator';


const HEADER_HEIGHT = 200; 
const STICKY_HEADER_HEIGHT = 50; 

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

const Header = React.memo(({theme, navigation, memeName, image, imageHeight, imageWidth, text, tags, profile, username, profilePic }) => {
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
                    activeOpacity={1}
                    onPress={goToProfile(navigation, profile, username, profilePic)}
                >
                    {profilePic != "" ? (
                        <Image source={{ uri: profilePic }} style={styles.profileImage} cachePolicy={'disk'}/>
                    ) : (
                        <Image source={require('../../assets/profile_default.png')} style={styles.profileImage} cachePolicy='disk'/>
                    )}
                </TouchableOpacity>
                
                {/* username */}
                <TouchableOpacity
                    activeOpacity={1}
                    style={{flex: 1, flexDirection: 'column'}}
                    onPress={goToProfile(navigation, profile, username, profilePic)}
                >
                    <Text style={theme == 'light' ? styles.lightUsername: styles.darkUsername}>
                        @{username}
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
                    style={{marginTop: 14, borderRadius: 0, alignSelf: 'center'}}
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

const ImagePost = React.memo(({item, index, navigation})=>{
    // const tempString = Math.random();
    return (
        <MainComment
            navigation={navigation}
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

const TextPost = React.memo(({item, index, navigation})=>{
    return (
        <MainComment
            navigation={navigation}
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
    
    const {profile, commentId, comments, onReply, replyToCommentId, replyToPostId, username, profilePic, text, imageUrl, template, templateState, imageWidth, imageHeight, memeName, tags, likesCount, commentsCount} = route.params;
    // console.log(comments)
    const [commentsList, setCommentsList] = useState([comments ? comments : {id: "one"}, {id: "two"}]);

    const {imageReply, setImageReply} = useContext(AuthenticatedUserContext);

    const [image, setImage] = useState(imageUrl ? imageUrl : template);
    const [finished, setFinished] = useState(template ? false : true);

    const flashListRef = useRef(null);
    const editorRef = useRef(null);

    useEffect(() => {
        comments ?  setCommentsList(comments)  : getFirstTenCommentsByPopular();

        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        
        navigation.setOptions({
            header: () => <SimpleTopBar title={"Back"}/>
        });
    }, []);


    const getFirstTenCommentsByPopular = React.useCallback(async() => {

        setCommentsList(await fetchFirstTenCommentsByPopular(replyToPostId, commentId));
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


    // Load Meme with template and template state
    const CreateMeme = React.useCallback(({image}) => {
        return (
            <PinturaEditor
                ref={editorRef}
                
                // src={image}
                // onClose={() => console.log('closed')}
                // onDestroy={() => console.log('destroyed')}
                // onLoad={() => 
                //     editorRef.current.editor.processImage(templateState)
                // }
                onInit={() => 
                    editorRef.current.editor.processImage(image, templateState)
                }
                onProcess={async({ dest }) => {
                    manipulateAsync(dest, [], ).then((res) => {
                        setFinished(true);
                        setImage(res.uri);
                        // console.log(res.uri)
                    })
                }}
            />    
        )
    }, [])

    
    const renderItem = React.useCallback(({ item, index }) => {
        // console.log(item, "     ", index)
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
                    />
                </View>
            );
        }else if(item.imageUrl || item.template){
            return (
                <ImagePost item={item} index={index} navigation={navigation}/>
            );
        }else{
            return (
                <TextPost item={item} index={index} navigation={navigation}/>
            );
        }
    }, [theme, image]);

    if(commentsList < 5){
        return null
    }

    //NEED***NEED to make sure multiple instance of PinturaLoadImage are not created***
    return (
        <View
            style={theme == 'light' ? styles.lightMainContainer : styles.darkMainContainer}
        >
            {/* Load Meme with template and template state */}
            {!finished && <CreateMeme image={image}/>}

            <FlashList
                ref={flashListRef}
                data={commentsList}
                
                onEndReached={commentsList[commentsList.length-1].snap && getNextTenPopularComments }
                onEndReachedThreshold={1} //need to implement infinite scroll

                extraData={[commentsList]}
                stickyHeaderIndices={[1]}
                renderItem={renderItem}

                // showsVerticalScrollIndicator={false}

                removeClippedSubviews={true}

                estimatedItemSize={300}
                estimatedListSize={{height: windowHeight, width: windowWidth}}

                ListFooterComponent={
                    <View style={{height: 200}}/>
                }

                // keyExtractor={keyExtractor}
            />

            {replyBottomSheet(onReply, navigation, replyToPostId, commentId, profile, username)}
            
        </View>
    );

};

const styles = StyleSheet.create({
    header: {
        height: HEADER_HEIGHT,
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stickyHeader: {
        height: STICKY_HEADER_HEIGHT,
        backgroundColor: 'lightgreen',
        justifyContent: 'center',
        alignItems: 'center',
    },
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
        marginTop: 16.5,
        marginLeft: 13,
        // marginBottom: 7,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    darkUserContainer: {
        backgroundColor: '#151515',
        flexDirection: 'row',
        marginTop: 16.5,
        marginLeft: 13,
        // marginBottom: 7,
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
    lightPostTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: '#333333',
        textAlign: 'auto',
        marginHorizontal: 14,
        // marginTop: 1,
        // marginVertical: 2,
        // width: 290,
    },
    darkPostTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: '#DDDDDD',
        textAlign: 'auto',
        marginHorizontal: 14,
        // marginTop: 1,
        // marginVertical: 2,
        // width: 290,
    },
    lightFollowButton: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        width: 110,
        height: 30,
        marginLeft: 5,
        marginTop: 12,
        marginBottom: 10,
        borderWidth: 1.5,
        borderColor: '#888888'
    },
    darkFollowButton: {
        flexDirection: 'column',
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        width: 110,
        height: 30,
        marginLeft: 5,
        marginTop: 12,
        marginBottom: 10,
        borderWidth: 1.5,
        borderColor: '#888888'
    },
    lightFollowText: {
        fontSize: 18,
        color: '#222222',
        fontWeight: '600',
        alignSelf: 'center',
        marginTop: 1
    },
    darkFollowText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: '600',
        alignSelf: 'center',
        marginTop: 1
    },
    lightPostText: {
        fontSize: 18,
        fontWeight: "400",
        color: '#222222',
        textAlign: 'auto',
        marginHorizontal: 13.5,
        marginTop: 10,
    },
    darkPostText: {
        fontSize: 18,
        fontWeight: "400",
        color: '#F4F4F4',
        textAlign: 'auto',
        marginHorizontal: 13.5,
        marginTop: 10,
    },
});

export default CommentScreen;
