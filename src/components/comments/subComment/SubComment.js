import React from 'react';

import styles from './Styles';

import {Text, TouchableOpacity, View, Dimensions} from 'react-native';

import { AuthenticatedUserContext } from '../../../../context-store/context';

import CommentText from '../../../shared/Text/CommentText';

import Animated, {FadeIn} from 'react-native-reanimated';

import ResizableImage from '../../../shared/functions/ResizableImage';

import CreateMeme from '../../../shared/functions/CreateMeme';

import SubCommentBottom from './SubCommentBottom';

import SubCommentTop from './SubCommentTop';

import CommentBottom from '../CommentBottom';

import ImageView from "react-native-image-viewing";

import { onNavToComment, onReply, navToMeme } from '../shared/CommentMethods';

import Down from '../../../../assets/down_light.svg';

import DownDark from '../../../../assets/down_dark.svg';

const windowWidth = Dimensions.get('screen').width;

const navToComment =  (navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, template, templateUploader, imageHeight, imageWidth, text, likesCount, commentsCount) => () => {
    navigation.push('Comment', {
        commentId: commentId,
        replyToPostId: replyToPostId,
        replyToCommentId: replyToCommentId,
        replyToProfile: profile,
        replyToUsername: username,
        imageUrl: image,
        memeName: memeName,
        templateUploader: templateUploader,
        template: template,
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


const SubComment = ({ navigation, theme, profile, username, profilePic, commentId, replyToCommentId, replyToPostId, text, imageUrl, memeName, templateUploader, template, templateState, imageWidth, imageHeight, likesCount, commentsCount,}) => {

    const [image, setImage] = React.useState(imageUrl ? imageUrl :  template);

    const [visible, setIsVisible] = React.useState(false);

    // see if you can move to outside function that contains CreateMeme,
    // CreatMeme would only render is template is not null/undefined
    const [finished, setFinished] = React.useState(template ? false : true);

    const {commentOptions, setCommentOptions} = React.useContext(AuthenticatedUserContext);

    React.useEffect(() => {
       if(commentOptions?.commentId === commentId && commentOptions.deleted === true){
            // console.log(commentOptions)
            // console.log('comment is deleted');
            setFinished("deleted")
            setCommentOptions(false);
        }
        if(commentOptions?.commentId === commentId && !(commentOptions?.text || (commentOptions?.image && image))){
            setCommentOptions({
                ...commentOptions,
                image: image,
                text: text,
            });
        }
    }, [commentOptions]);


    // console.log(template && template)

    const navToCommentFromImage = React.useCallback(() => () => () => {
        setIsVisible(false);

        navigation.push('Comment', {
            commentId: commentId,
            replyToPostId: replyToPostId,
            replyToCommentId: replyToCommentId,
            replyToProfile: profile,
            replyToUsername: username,
            imageUrl: image,
            memeName: memeName,
            templateUploader: templateUploader,
            template: template,
            imageHeight: imageHeight,
            imageWidth: imageWidth,
            text: text,
            likesCount: likesCount,
            commentsCount: commentsCount,
            profile: profile,
            username: username,
            profilePic: profilePic,
        })
    })

    const onLongPress = React.useCallback(() => () => {
        setCommentOptions({
            commentId: commentId,
            profile: profile,
            replyToPostId: replyToPostId,
            replyToCommentId: replyToCommentId,
            text: text,
            image: image,
        })
    }, [image]);


    if(finished == "deleted"){
        // set commentsList to null using ref for SubCommentBottom
        // console.log(finished)
        return null;
    }


    return (
        <Animated.View 
            entering={FadeIn}
            // onLayout={(event) => setViewWidth(event.nativeEvent.layout.width)} 
            style={theme == 'light' ? styles.lightCommentContainer : styles.darkCommentContainer}
        >

            {/* Load Meme with template and template state */}
            {!finished && <CreateMeme image={image} templateState={templateState} setFinished={setFinished} setImage={setImage} id={commentId}/>}
            
            {/* Comment Top */}
            <SubCommentTop 
                commentId={commentId}
                replyToCommentId={replyToCommentId}
                replyToPostId={replyToPostId}
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
                    activeOpacity={0.9}
                    onPress = {navToComment(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, template, templateUploader, imageHeight, imageWidth, text, likesCount, commentsCount)}
                    // style={theme == 'light' ? styles.lightCommentText : styles.darkCommentText}
                    onLongPress={onLongPress()}
                >
                    
                    <CommentText text={text}/>

                </TouchableOpacity>
            }
            
            {/* Comment Image */}
            {    
                imageHeight &&
            
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={{flexDirection: 'row', backgroundColor: 'black', marginTop: 11, borderRadius: 0, alignItems: 'center', justifyContent: 'center'}}
                    onPress = {
                        () => setIsVisible(true)
                        // navToComment(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, template, templateUploader, imageHeight, imageWidth, text, likesCount, commentsCount)
                    }
                    onLongPress={onLongPress()}
                >
                    <ResizableImage 
                        image={image}
                        height={imageHeight}
                        width={imageWidth}
                        maxHeight={550}
                        maxWidth={windowWidth - 10}
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
                                    navToComment={navToCommentFromImage()}
                                />
                            </View>
                            
                        )}
                    />
                </TouchableOpacity>
            }


            {/* Comment Footer */}
            <SubCommentBottom
                navigation={navigation}
                theme={theme}
                commentId={commentId}
                replyToCommentId={replyToCommentId}
                replyToPostId={replyToPostId}
                profile={profile}
                memeName={memeName}
                likesCount={likesCount}
                commentsCount={commentsCount}
                templateUploader={templateUploader}
                navToMeme={navToMeme(navigation, memeName, template, templateUploader, imageHeight, imageWidth)}
                onNavToComment={onNavToComment(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, template, templateUploader, imageHeight, imageWidth, text, likesCount, commentsCount)}
                onReply={onReply(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, template, templateUploader, imageHeight, imageWidth, text, likesCount, commentsCount)}
            />

            {/* Comment Footer */}
            {
                (commentsCount > 0 && memeName) &&

                    <View>
                        <View style={{height: 5, backgroundColor: theme == 'light' ? '#F2F2F2' : '#000000'}}/>
                        
                        <TouchableOpacity 
                            activeOpacity={0.9}
                            style={{
                                backgroundColor: theme == 'light' ? '#FFFFFF' : '#151515',
                                // backgroundColor: theme == 'light' ? '#EEEEEE' : '#171717',
                                borderBottomLeftRadius: 12.5, borderBottomRightRadius: 12.5, flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center' 
                            }}
                            onPress = {onNavToComment(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, template, templateUploader, imageHeight, imageWidth, text, likesCount, commentsCount)}
                        >
                            
                            {/* might need too edit input to intToString */}
                            <Text style={[theme == 'light' ? styles.lightViewText : styles.darkViewText,{
                                margin: 10,
                            }]}>
                                View {commentsCount} replies
                            </Text>

                            {
                                theme == 'light' ?
                                    <Down width={25} height={25} marginRight={5} />
                                :
                                    <DownDark width={25} height={25} marginRight={5} />
                            }
                            
                        </TouchableOpacity>
                    </View>
                        // <TouchableOpacity 
                        //     activeOpacity={0.9}
                        //     style={{
                        //         backgroundColor: theme == 'light' ? '#FFFFFF' : '#151515',
                        //         // backgroundColor: theme == 'light' ? '#EEEEEE' : '#171717',
                        //         borderBottomLeftRadius: 12.5, borderBottomRightRadius: 12.5, flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center' 
                        //     }}
                        //     onPress = {onNavToComment()}
                        // >
                            
                        //     {/* might need too edit input to intToString */}
                        //     <Text style={[theme == 'light' ? styles.lightViewText : styles.darkViewText,{
                        //         margin: 5,
                        //     }]}>
                        //         View {commentsCount} replies
                        //     </Text>

                        //     {
                        //         theme == 'light' ?
                        //             <Down width={25} height={25} marginRight={5} />
                        //         :
                        //             <DownDark width={25} height={25} marginRight={5} />
                        //     }
                            
                        // </TouchableOpacity>
            }
            
            
        </Animated.View>
    );
}


export default SubComment;
