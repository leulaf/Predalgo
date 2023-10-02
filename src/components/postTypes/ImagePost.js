import React, { } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';

import { AuthenticatedUserContext } from '../../../context-store/context';

import PostText from '../../shared/Text/PostText';

import PostContainer from './PostContainer';

import CreateMeme from '../../shared/functions/CreateMeme';

import ResizableImage from '../../shared/functions/ResizableImage';

import { useNavigation } from '@react-navigation/native';

import ImageView from "react-native-image-viewing";

import PostBottom from './PostBottom';

const onNavToPost =  (navigation, postId, title, tags, profile, reposterProfile, profilePic, reposterProfilePic, username, reposterUsername, text, image, template, templateUploader, templateState, memeName, imageHeight, imageWidth, likesCount, commentsCount) => {
    navigation.push('Post', {
        postId: postId,
        title: title,
        tags: tags,
        text: text,
        imageUrl: image,
        memeName: memeName,
        template: template,
        templateUploader: templateUploader ? templateUploader : null,
        templateState: null,
        imageHeight: imageHeight,
        imageWidth: imageWidth,
        likesCount: likesCount,
        commentsCount: commentsCount,
        profile: profile,
        reposterProfile: reposterProfile,
        username: username,
        reposterUsername: reposterUsername,
        profilePic: profilePic,
        reposterProfilePic: reposterProfilePic,
    });
}


const windowWidth = Dimensions.get("window").width;

const ImagePost = ({ title, username, reposterUsername, profilePic, reposterProfilePic, text, imageUrl, template, templateUploader, templateState, imageHeight, imageWidth, memeName, tags, profile, reposterProfile, postId, repostId, likesCount, commentsCount, repostsCount, repostComment }) => {
    const {options, setOptions} = React.useContext(AuthenticatedUserContext);
    const navigation = useNavigation();

    const [image, setImage] = React.useState(imageUrl ? imageUrl : template);

    // const [finished, setFinished] = React.useState(template ? false : true);

    const [focused, setIsFocused] = React.useState(false);

    // console.log(reposterProfile, reposterUsername, reposterProfilePic)


    const onLongPress = React.useCallback((repostWithComment) => () => {
        if(repostWithComment){
            setOptions({
                postId: repostId,
                repostedId: postId,
                profile: reposterProfile,
                repostComment: repostComment,
            })
        }else{
            setOptions({
                postId: postId,
                repostId: repostId,
                profile: profile,
                text: text,
            })
        }
    }, []);


    const navToPostFromImage = React.useCallback(() => {
        setIsFocused(false);
        onNavToPost(navigation, postId, title, tags, profile, reposterProfile, profilePic, reposterProfilePic, username, reposterUsername, text, image, template, templateUploader, templateState, memeName, imageHeight, imageWidth, likesCount, commentsCount);
    })
    console.log("sss")
    console.log(postId, title, tags, profile, reposterProfile, profilePic, reposterProfilePic, username, reposterUsername, text, image, template, templateUploader, memeName, imageHeight, imageWidth, likesCount, commentsCount)

    if(repostComment?.length > 0){
        return (
            <PostContainer 
                // likesCount={repostLikesCount}
                // commentsCount={repostCommentsCount}
                likesCount={0}
                commentsCount={0}
                repostComment={repostComment}
                postId={repostId}
                profile={reposterProfile}
                username={reposterUsername}
                profilePic={reposterProfilePic}
                tags={tags}
    
                navigation={navigation}
    
                content={
                    // null
                    <>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => onNavToPost(navigation, postId, title, tags, profile, profilePic, username, text, likesCount, commentsCount)}
                            // onLongPress={onLongPress(true)}
                        >
                        
                            <PostText numberOfLines={15} text={repostComment}/>

                        </TouchableOpacity>

                                
                         <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => onNavToPost(navigation, postId, title, tags, profile, profilePic, username, text, likesCount, commentsCount)}
                            // onLongPress={onLongPress(true)}
                            style={{marginHorizontal: '2%',}}
                        >
                            
                            <PostContainer 
                                title={title}
                                text={text}
                                imageUrl={image}
                                template={template}
                                templateUploader={templateUploader}
                                // templateState={templateState}
                                imageHeight={imageHeight}
                                imageWidth={imageWidth}
                                likesCount={likesCount}
                                commentsCount={commentsCount}
                                repostsCount={repostsCount}
                                memeName={memeName}
                                profile={profile}
                                repostId={repostId}
                                postId={postId}
                                profilePic={profilePic}
                                username={username}
                                repostedWithComment={true}

                                navigation={navigation}
                                
                                content={
                                    <View>
                                        {
                                            text &&
                                            <TouchableOpacity
                                                activeOpacity={0.9}
                                                // onPress={navToPostFromImage}
                                                onLongPress={onLongPress()}
                                                style={{flexDirection: "column", alignSelf: 'center'}}
                                            >
                                                <PostText numberOfLines={5} text={text} forPost={true}/>
                                            </TouchableOpacity>
                                        }
                                        <TouchableOpacity
                                            activeOpacity={0.9}
                                            onPress={() => setIsFocused(true)}
                                            onLongPress={onLongPress()}
                                            style={{flexDirection: "column", alignSelf: 'center'}}
                                        >
                                            
                                            {/* Load Meme with template and template state */}
                                            {template && template === image && <CreateMeme image={image} templateState={templateState} setFinished={() => null} setImage={setImage} id={postId}/>}
                                            

                                            <ResizableImage 
                                                image={image}
                                                height={imageHeight}
                                                width={imageWidth}
                                                maxWidth={windowWidth*0.96}
                                                maxHeight={600}
                                                style={{ borderRadius: 10, alignSelf: 'center', marginTop: title || text ? 12 : 0}}
                                            />


                                            {focused &&
                                                <ImageView
                                                    images={[{uri: image}]}
                                                    imageIndex={0}
                                                    visible={focused}
                                                    onRequestClose={() => setIsFocused(false)}
                                                    animationType="fade"
                                                    doubleTapToZoomEnabled={true}
                                                    FooterComponent={({ imageIndex }) => (
                                                        <View style={{backgroundColor: 'rgba(0,0,0,0.5)', height: 90}}>


                                                            <PostBottom
                                                                postId={postId}
                                                                likesCount={likesCount}
                                                                commentsCount={commentsCount}
                                                                theme='imageFocused'
                                                                navToPost={navToPostFromImage}
                                                            />


                                                        </View>
                                                        
                                                    )}
                                                />
                                            }
                                        </TouchableOpacity>
                                    </View>
                                }
                            />

                        </TouchableOpacity>
                        
                    </>
                }
            />
        );
    }


    return (
        <PostContainer 
            title={title}
            text={text}
            imageUrl={image}
            template={template}
            templateUploader={templateUploader}
            // templateState={templateState}
            imageHeight={imageHeight}
            imageWidth={imageWidth}
            likesCount={likesCount}
            commentsCount={commentsCount}
            repostsCount={repostsCount}
            repostComment={repostComment}
            tags={tags}
            memeName={memeName}
            profile={profile}
            repostId={repostId}
            postId={postId}
            profilePic={profilePic}
            username={username}
            reposterProfile={reposterProfile}
            reposterUsername={reposterUsername}
            reposterProfilePic={reposterProfilePic}

            navigation={navigation}
            
            content={
                <View>
                    {
                        text &&
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={navToPostFromImage}
                            onLongPress={onLongPress()}
                            style={{flexDirection: "column", alignSelf: 'center'}}
                        >
                            <PostText numberOfLines={5} text={text} forPost={true}/>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => setIsFocused(true)}
                        onLongPress={onLongPress()}
                        style={{flexDirection: "column", alignSelf: 'center'}}
                    >
                        
                        {/* Load Meme with template and template state */}
                        {template && template === image && <CreateMeme image={image} templateState={templateState} setFinished={() => null} setImage={setImage} id={postId}/>}
                        

                        <ResizableImage 
                            image={image}
                            height={imageHeight}
                            width={imageWidth}
                            maxWidth={windowWidth-6}
                            maxHeight={600}
                            style={{ borderRadius: 10, alignSelf: 'center', marginTop: title || text ? 12 : 0}}
                        />


                        {focused &&
                            <ImageView
                                images={[{uri: image}]}
                                imageIndex={0}
                                visible={focused}
                                onRequestClose={() => setIsFocused(false)}
                                animationType="fade"
                                doubleTapToZoomEnabled={true}
                                FooterComponent={({ imageIndex }) => (
                                    <View style={{backgroundColor: 'rgba(0,0,0,0.5)', height: 90}}>


                                        <PostBottom
                                            postId={postId}
                                            likesCount={likesCount}
                                            commentsCount={commentsCount}
                                            theme='imageFocused'
                                            navToPost={navToPostFromImage}
                                        />


                                    </View>
                                    
                                )}
                            />
                        }
                    </TouchableOpacity>
                </View>
            }
        />
    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        height: 400,
        borderRadius: 15,
    }
});

export default ImagePost;
