import React, { } from 'react';

import { TouchableOpacity } from 'react-native-gesture-handler';

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

const TextPost = ({ title, username, profilePic, text, tags, profile, postId, likesCount, commentsCount, repostProfile, repostComment }) => {
    // const {theme,setTheme} = useContext(ThemeContext);
    // const [profilePicState, setProfilePicState] = useState(profilePic);
    // const [usernameState, setUsernameState] = useState(username);
    // const [repostUsername, setRepostUsername] = useState(null);
    const navigation = useNavigation();

    React.useEffect(() => {
        // if(repostProfile != null){
        //     const userRef = doc(db, 'users', repostProfile);
        //     const userSnapshot = getDoc(userRef);

        //     userSnapshot.then((snapshot) => {
        //         if (snapshot.exists) {
        //             setRepostUsername(snapshot.data().username);
        //         } else {
        //             // console.log("No such document!");
        //         }
        //     }).catch((error) => {
        //         // console.log("Error getting document:", error);
        //     });
        // }

        // if(usernameState == ""){
        //     const userRef = doc(db, 'users', profile);
        //     const userSnapshot = getDoc(userRef);

        //     userSnapshot.then((snapshot) => {
        //         if (snapshot.exists) {
        //             setProfilePicState(snapshot.data().profilePic);
        //             setUsernameState(snapshot.data().username);
        //         } else {
        //             // console.log("No such document!");
        //         }
        //     }).catch((error) => {
        //         // console.log("Error getting document:", error);
        //     });
        // }
    }, []);

    // if (usernameState === "") {
    //     return null;
    // }

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
            // repostUsername={repostUsername}

            navigation={navigation}

            content={
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, text, likesCount, commentsCount)}
                >
                    <PostText numberOfLines={15} text={text}/>
                </TouchableOpacity>
            }
        />
    );
}


export default TextPost;
