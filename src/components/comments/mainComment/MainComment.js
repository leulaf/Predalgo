import React from 'react';

import { TouchableOpacity, View, Dimensions } from 'react-native';

import styles from './Styles';

import CommentText from '../../../shared/Text/CommentText';

import Animated, {FadeIn} from 'react-native-reanimated';

import ResizableImage from '../../../shared/functions/ResizableImage';

import CreateMeme from '../../../shared/functions/CreateMeme';

import MainCommentBottom from './MainCommentBottom';

import MainCommentTop from './MainCommentTop';

import CommentBottom from '../CommentBottom';

import ImageView from "react-native-image-viewing";

import { onNavToComment, onReply, navToMeme } from '../shared/CommentMethods';

const windowWidth = Dimensions.get('window').width;

const onNavToCommentWithComments = (navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, template, templateUploader, imageHeight, imageWidth, text, likesCount, commentsCount, commentsList) => () => {
    navigation.push('Comment', {
        commentId: commentId,
        comments: commentsList && commentsList,
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


// ******** React memo ********
const MainComment = ({ navigation, index, theme, profile, username, profilePic, commentId, replyToCommentId, replyToPostId, text, imageUrl, memeName, template, templateUploader, templateState, imageWidth, imageHeight, likesCount, commentsCount }) => {

    const [image, setImage] = React.useState(imageUrl ? imageUrl :  template);

    const [visible, setIsVisible] = React.useState(false);

    // Checks if the meme is finished loading
    // If finished == "deleted" then the comment is not rendered
    const [finished, setFinished] = React.useState(template ? false : true);

    const navToCommentWithComments = React.useCallback((commentsList) => () => {

        setIsVisible(false);

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
            style={[theme == 'light' ? styles.lightCommentContainer : styles.darkCommentContainer,
                {borderColor: theme == 'light' ? 
                    index != 2 ? '#E8E8E8' : "#FFFFFF"
                    : 
                    index != 2 ? '#202020' : "#151515"
                }
            ]}
        >

            {/* Load Meme with template and template state */}
            {!finished && <CreateMeme image={image} templateState={templateState} setFinished={setFinished} setImage={setImage} id={commentId}/>}


            {/* Comment Top */}
            <MainCommentTop 
                commentId={commentId}
                replyToCommentId={replyToCommentId}
                replyToPostId={replyToPostId}
                setFinished={setFinished}
                navigation={navigation}
                onNavToComment={onNavToComment(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, template, templateUploader, imageHeight, imageWidth, text, likesCount, commentsCount)}
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
                    onPress = {onNavToCommentWithComments(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, template, templateUploader, imageHeight, imageWidth, text, likesCount, commentsCount)}
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
                    onPress = {
                        // onNavToCommentWithComments(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, template, templateUploader, imageHeight, imageWidth, text, likesCount, commentsCount)
                        () => setIsVisible(true)
                    }
                >
                    <ResizableImage 
                        image={image}
                        height={imageHeight}
                        width={imageWidth}
                        maxHeight={550}
                        maxWidth={windowWidth}
                        style={{borderRadius: 0}}
                    />

                    <ImageView
                        images={[{uri: image}]}
                        imageIndex={0}
                        visible={visible}
                        onRequestClose={() => setIsVisible(false)}
                        animationType="fade"
                        doubleTapToZoomEnabled={true}
                        FooterComponent={({ imageIndex }) => (
                            <View style={{backgroundColor: 'rgba(0,0,0,0.5)', height: 90}}>
                                <CommentBottom
                                    commentID={commentId}
                                    replyToCommentId={replyToCommentId}
                                    replyToPostId={replyToPostId}
                                    likesCount={likesCount}
                                    commentsCount={commentsCount}
                                    theme='dark'
                                    navToComment={navToCommentWithComments}
                                />
                            </View>
                            
                        )}
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
                templateUploader={templateUploader}
                navToMeme={navToMeme(navigation, memeName, template, templateUploader, imageHeight, imageWidth)}
                navToCommentWithComments={navToCommentWithComments}
                onNavToComment={onNavToComment(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, template, templateUploader, imageHeight, imageWidth, text, likesCount, commentsCount)}
                onReply={onReply(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, template, templateUploader, imageHeight, imageWidth, text, likesCount, commentsCount)}
            />

        </Animated.View>
    );
}

export default MainComment;
