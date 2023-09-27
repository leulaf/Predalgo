import React, { } from 'react';

import { TouchableOpacity } from 'react-native-gesture-handler';

import { AuthenticatedUserContext } from '../../../context-store/context';

import { useNavigation } from '@react-navigation/native';

import PostContainer from './PostContainer';

import PostText from '../../shared/Text/PostText';



const onNavToPost =  (navigation, postId, title, tags, profile, profilePic, username, text, likesCount, commentsCount) => () => {
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

const TextPost = ({ title, username, reposterUsername, profilePic, reposterProfilePic, text, tags, profile, reposterProfile, postId, likesCount, commentsCount, repostProfile, repostComment }) => {
    // const {theme,setTheme} = useContext(ThemeContext);
    // const [profilePicState, setProfilePicState] = useState(profilePic);
    // const [usernameState, setUsernameState] = useState(username);
    // const [repostUsername, setRepostUsername] = useState(null);
    const {options, setOptions} = React.useContext(AuthenticatedUserContext);
    const navigation = useNavigation();

    const onLongPress = React.useCallback(() => () => {
        setOptions({
            commentId: postId,
            profile: profile,
            text: text,
        })
    }, []);

    return (
        <PostContainer 
            title={title}
            text={text}
            likesCount={likesCount}
            commentsCount={commentsCount}
            tags={tags}
            memeText={false}
            profile={profile}
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
                >
                    <PostText numberOfLines={15} text={text}/>
                </TouchableOpacity>
            }
        />
    );
}


export default TextPost;
