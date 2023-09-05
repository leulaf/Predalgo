import React from 'react';

import styles from './Styles';

import {Text, TouchableOpacity, View, Dimensions} from 'react-native';

import CommentText from '../../../shared/Text/CommentText';

import Animated, {FadeIn} from 'react-native-reanimated';

import ResizableImage from '../../../shared/functions/ResizableImage';

import CreateMeme from '../../../shared/functions/CreateMeme';

import SubCommentBottom from './SubCommentBottom';

import SubCommentTop from './SubCommentTop';

import { onNavToComment, onReply } from '../shared/CommentMethods';

import Down from '../../../../assets/down_light.svg';

import DownDark from '../../../../assets/down_dark.svg';

const windowWidth = Dimensions.get('screen').width;

const navToComment =  (navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount) => () => {
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


const SubComment = ({ navigation, theme, profile, username, profilePic, commentId, replyToCommentId, replyToPostId, text, imageUrl, memeName, template, templateState, imageWidth, imageHeight, likesCount, commentsCount,}) => {

    const [image, setImage] = React.useState(imageUrl ? imageUrl :  template);

    // see if you can move to outside function that contains CreateMeme,
    // CreatMeme would only render is template is not null/undefined
    const [finished, setFinished] = React.useState(template ? false : true);


    if(finished == "deleted"){
        // set commentsList to null using ref for SubCommentBottom
        console.log(finished)
        return null;
    }


    return (
        <Animated.View 
            entering={FadeIn}
            // onLayout={(event) => setViewWidth(event.nativeEvent.layout.width)} 
            style={theme == 'light' ? styles.lightCommentContainer : styles.darkCommentContainer}
        >

            {/* Load Meme with template and template state */}
            {!finished && <CreateMeme image={image} templateState={templateState} setFinished={setFinished} setImage={setImage}/>}
            
            {/* Comment Top */}
            <SubCommentTop 
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
                    onPress = {navToComment(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
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
                    style={{flexDirection: 'row', backgroundColor: 'black', marginTop: 11, borderRadius: 0, alignItems: 'center', justifyContent: 'center'}}
                    onPress = {navToComment(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
                >
                    <ResizableImage 
                        image={image}
                        height={imageHeight}
                        width={imageWidth}
                        maxHeight={550}
                        maxWidth={windowWidth - 10}
                        style={{borderRadius: 0}}
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
                onNavToComment={onNavToComment(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
                onReply={onReply(navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
            />

            {/* Comment Footer */}
            {
                (commentsCount > 0 && memeName) &&

                    <View>
                        <View style={{height: 5, backgroundColor: theme == 'light' ? '#F2F2F2' : '#000000'}}/>
                        
                        <TouchableOpacity 
                            activeOpacity={1}
                            style={{
                                backgroundColor: theme == 'light' ? '#FFFFFF' : '#151515',
                                // backgroundColor: theme == 'light' ? '#EEEEEE' : '#171717',
                                borderBottomLeftRadius: 12.5, borderBottomRightRadius: 12.5, flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center' 
                            }}
                            onPress = {onNavToComment()}
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
                        //     activeOpacity={1}
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
