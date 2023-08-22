import React from 'react';

import { TouchableOpacity, Dimensions } from 'react-native';

import styles from './Styles';

import CommentText from '../../../shared/Text/CommentText';

import Animated, {FadeIn} from 'react-native-reanimated';

import ResizableImage from '../../../shared/ResizableImage';

import CreateMeme from '../../../shared/CreateMeme';

import MainCommentBottom from './MainCommentBottom';

import MainCommentTop from './MainCommentTop';

import { onNavToComment, onReply } from '../shared/CommentMethods';

const windowWidth = Dimensions.get('window').width;

const onNavToCommentWithComments = (navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount, commentsList) => () => {
    navigation.push('Comment', {
        commentId: commentId,
        comments: commentsList && commentsList,
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
        profile: profile,
        username: username,
        profilePic: profilePic,
    })
}


// ******** React memo ********
const MainComment = ({ navigation, index, theme, profile, username, profilePic, commentId, replyToCommentId, replyToPostId, text, imageUrl, memeName, template, templateState, imageWidth, imageHeight, likesCount, commentsCount }) => {

    const [image, setImage] = React.useState(imageUrl ? imageUrl :  template);

    // Checks if the meme is finished loading
    // If finished == "deleted" then the comment is not rendered
    const [finished, setFinished] = React.useState(template ? false : true);

    const navToCommentWithComments = React.useCallback((commentsList) =>{

        navigation.push('Comment', {
            commentId: commentId,
            comments: commentsList && commentsList,
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
            profile: profile,
            username: username,
            profilePic: profilePic,
        })
            
    }, [image])

    if(finished == "deleted"){
        // set commentsList to null using ref for MainCommentBottom
        
        return null;
    }

    return (
        <Animated.View 
            // entering={index < 4 && StretchInY}
            entering={FadeIn}
            style={theme == 'light' ? styles.lightCommentContainer : styles.darkCommentContainer}
        >

            {/* Load Meme with template and template state */}
            {!finished && <CreateMeme image={image} templateState={templateState} setFinished={setFinished} setImage={setImage}/>}


            {/* Comment Top */}
            <MainCommentTop 
                commentId={commentId}
                replyToCommentId={replyToCommentId}
                replyToPostId={replyToPostId}
                setFinished={setFinished}
                navigation={navigation}
                onNavToComment={onNavToComment(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
                theme={theme}
                profile={profile}
                username={username}
                profilePic={profilePic}
            />
            

            {/* Comment Text */}
            {
                text &&

                <TouchableOpacity
                    activeOpacity={1}
                    onPress = {onNavToCommentWithComments(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
                    // style={theme == 'light' ? styles.lightCommentText : styles.darkCommentText}
                >
                    
                    <CommentText text={text}/>


                </TouchableOpacity>
            }
            
            {/* Comment Image */}
            {
                imageHeight &&

                <TouchableOpacity
                    activeOpacity={1}
                    style={{backgroundColor: '#000000', marginTop: 9, marginBottom: 2}}
                    onPress = {onNavToCommentWithComments(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
                >
                    <ResizableImage 
                        image={image}
                        height={imageHeight}
                        width={imageWidth}
                        maxHeight={550}
                        maxWidth={windowWidth}
                        style={{borderRadius: 0}}
                    />
                    
                </TouchableOpacity>
            }

            {/* Comment Footer */}
            <MainCommentBottom
                navigation={navigation}
                index={index}
                theme={theme}
                commentId={commentId}
                replyToCommentId={replyToCommentId}
                replyToPostId={replyToPostId}
                profile={profile}
                likesCount={likesCount}
                commentsCount={commentsCount}
                memeName={memeName}
                navToCommentWithComments={navToCommentWithComments}
                onNavToComment={onNavToComment(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
                onReply={onReply(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
            />

        </Animated.View>
    );
}

export default MainComment;
