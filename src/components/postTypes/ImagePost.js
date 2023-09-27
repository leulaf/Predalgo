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


const windowWidth = Dimensions.get("screen").width;

const ImagePost = ({ title, username, reposterUsername, profilePic, reposterProfilePic, text, imageUrl, template, templateUploader, templateState, imageHeight, imageWidth, memeName, tags, profile, reposterProfile, postId, likesCount, commentsCount, repostComment }) => {
    const {options, setOptions} = React.useContext(AuthenticatedUserContext);
    const navigation = useNavigation();

    const [image, setImage] = React.useState(imageUrl ? imageUrl : template);

    // const [finished, setFinished] = React.useState(template ? false : true);

    const [focused, setIsFocused] = React.useState(false);


    const onLongPress = React.useCallback(() => () => {
        setOptions({
            commentId: postId,
            profile: profile,
            text: text,
        })
    }, []);

    const navToPostFromImage = React.useCallback(() => {
        setIsFocused(false);
        onNavToPost(navigation, postId, title, tags, profile, reposterProfile, profilePic, reposterProfilePic, username, reposterUsername, text, image, template, templateUploader, templateState, memeName, imageHeight, imageWidth, likesCount, commentsCount);
    })
    
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
            tags={tags}
            memeName={memeName}
            profile={profile}
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
                            style={{ borderRadius: 10, alignSelf: 'center'}}
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
