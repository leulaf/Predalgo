import React, { } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { AuthenticatedUserContext } from '../../../context-store/context';

import { useNavigation } from '@react-navigation/native';

import PostContainer from './PostContainer';

import PostText from '../../shared/Text/PostText';



const onNavToPost =  (navigation, postId, title, tags, profile, profilePic, username, text, likesCount, commentsCount) => () => {
    console.log('nav to post')
    navigation.push('Post', {
        postId: postId,
        title: title,
        tags: tags,
        text: text,
        likesCount: likesCount,
        commentsCount: commentsCount,
        profile: profile,
        username: username,
        profilePic: profilePic,
    });
}

const TextPost = ({ title, username, reposterUsername, profilePic, reposterProfilePic, text, tags, profile, reposterProfile, postId, repostId, likesCount, commentsCount, repostsCount, repostComment }) => {
    // const {theme,setTheme} = useContext(ThemeContext);
    // const [profilePicState, setProfilePicState] = useState(profilePic);
    // const [usernameState, setUsernameState] = useState(username);
    // const [repostUsername, setRepostUsername] = useState(null);
    const {options, setOptions} = React.useContext(AuthenticatedUserContext);
    const navigation = useNavigation();

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
                    <>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, text, likesCount, commentsCount)}
                            onLongPress={onLongPress(true)}
                        >
                        
                            <PostText numberOfLines={15} text={repostComment}/>

                        </TouchableOpacity>

                                
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, text, likesCount, commentsCount)}
                            // onLongPress={onLongPress(true)}
                            style={{marginHorizontal: '2%',}}
                        >
                            
                            <PostContainer 
                                title={title}
                                text={text}
                                likesCount={likesCount}
                                commentsCount={commentsCount}
                                // repostComment={repostComment}
                                repostsCount={repostsCount}
                                memeText={false}
                                profile={profile}
                                // repostId={repostId}
                                postId={postId}
                                profilePic={profilePic}
                                username={username}
                                // reposterProfile={reposterProfile}
                                // reposterUsername={reposterUsername}
                                // reposterProfilePic={reposterProfilePic}
                                repostedWithComment={true}
                    
                                navigation={navigation}
                    
                                content={
                                    // <View style={{marginBottom: 10}}>
                                        <PostText numberOfLines={10} text={text} repostedWithComment={true}/>
                                    // </View>
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
            likesCount={likesCount}
            commentsCount={commentsCount}
            repostComment={repostComment}
            repostsCount={repostsCount}
            tags={tags}
            memeText={false}
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
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, text, likesCount, commentsCount)}
                    onLongPress={onLongPress()}
                    style={{marginBottom: 5,}}
                >
                    <PostText numberOfLines={15} text={text}/>
                </TouchableOpacity>
            }
        />
    );
}


export default TextPost;
{/* <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, text, likesCount, commentsCount)}
                    onLongPress={onLongPress()}
                >
                    
                    <PostText numberOfLines={15} text={!repostComment ? text : repostComment}/>

                    {
                        repostComment &&
                            
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, text, likesCount, commentsCount)}
                                onLongPress={onLongPress()}
                                style={{marginLeft: '15%',}}
                            >
                                <PostContainer 
                                    title={title}
                                    text={text}
                                    likesCount={likesCount}
                                    commentsCount={commentsCount}
                                    repostComment={repostComment}
                                    repostsCount={repostsCount}
                                    tags={tags}
                                    memeText={false}
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
                                        <PostText numberOfLines={15} text={text}/>
                                    }
                                />
                            </TouchableOpacity>
                    }
                </TouchableOpacity> */}