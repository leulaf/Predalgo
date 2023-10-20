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


import WebView from 'react-native-webview';

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


    if(repostComment?.length > 0){
        return (
            <PostContainer 
                // likesCount={repostLikesCount}
                // commentsCount={repostCommentsCount}
                likesCount={0}
                commentsCount={0}
                text={repostComment}
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
                            onPress={() => navToPostFromImage()}
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
                                    <>
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
                                            {/* <WebView
                            // originWhitelist={['*']}
                            automaticallyAdjustContentInsets={false}
              style={{backgroundColor:'#00000000'}}
                            source={{ 
                                html: `
                                <!DOCTYPE html>\n
                                <html>
                                  <head>
                                    <title>Hello World</title>
                                    <meta http-equiv="content-type" content="text/html; charset=utf-8">
                                    <meta name="viewport" content="width=320, user-scalable=no">
                                    <style type="text/css">
                                      body {
                                        margin: 0;
                                        padding: 0;
                                        font: 62.5% arial, sans-serif;
                                        background: transparent;
                                      }
                                    </style>
                                  </head>
                                  <body>
                                    <p>HTML content in transparent body.</p>
                                    <div style={{  }}><PinterestEmbed url="https://www.pinterest.co.uk/pin/615937686549521366/ "width={345} height={467}/></div>
                                  </body>
                                </html>
                                `
                                // '<body><h1><div style={{  }}><PinterestEmbed url="https://www.pinterest.co.uk/pin/615937686549521366/ "width={345} height={467}/></div></h1></body>' 
                            }}
                        /> */}
                        {/* <Instagram id="Cvx5dgaAOyq" /> */}
                        {/* <WebView
                            automaticallyAdjustContentInsets={false}
                            allowsInlineMediaPlayback={true} // self-explanntory
                            scrollEnabled={false}  // self-explanntory
                            allowsFullscreenVideo={true}  // not sure if this is applicable for the webview but don't want users causing weird bugs
                            domStorageEnabled={true}  // for TikTok's caching purposes
                            javaScriptEnabled={true}  // so the all-to-import script tag will run in the rendered HTML
                            originWhitelist={['*']}  // Allows the requests content header to TikTok to accept any IP address, pretty much
                            source={{url: `https://www.tiktok.com/@yana_pers1k/video/7260239338422684946`}}
                        /> */}


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
                                    
                                        {/* Load Meme with template and template state */}
                                        {template && template === image && <CreateMeme image={image} templateState={templateState} setFinished={() => null} setImage={setImage} id={postId}/>}
                                    </>
                                }
                            />

{/* <WebView
                            originWhitelist={['*']}
                            source={{ 
                                html: '<h1><div style={{  }}><PinterestEmbed url="https://www.pinterest.co.uk/pin/615937686549521366/ "width={345} height={467}/></div></h1>' 
                            }}
                        /> */}

                        </TouchableOpacity>


                        {/* <PinterestEmbed 
                            url="https://www.pinterest.co.uk/pin/615937686549521366/"
                            width={345}
                            height={467}
                        /> */}
    
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
                <>

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

{/* <View><PinterestEmbed 
                        url="https://www.pinterest.co.uk/pin/615937686549521366/"
                        width={345}
                        height={467}
                    /> 
                    </View>  */}
                    </TouchableOpacity>

                
                    {/* Load Meme with template and template state */}
                    {template && template === image && <CreateMeme image={image} templateState={templateState} setFinished={() => null} setImage={setImage} id={postId}/>}
                </>
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
