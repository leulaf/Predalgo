import React, { } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { ThemeContext, AuthenticatedUserContext } from '../../../context-store/context';
import { Overlay } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import onShare from '../../shared/post/SharePost';

import Feather from '@expo/vector-icons/Feather';

import TitleText from '../../shared/Text/TitleText';

import Animated, { FadeIn } from 'react-native-reanimated';

import GlobalStyles from '../../constants/GlobalStyles';

import ContentBottom from './ContentBottom';
import PostBottom from './PostBottom';

import DeleteIcon from '../../../assets/trash_delete.svg';
import ReportIcon from '../../../assets/danger.svg';

import ThreeDotsLight from '../../../assets/three_dots_light.svg';
import ThreeDotsDark from '../../../assets/three_dots_dark.svg';

// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'; // repost icon "repeat"

import Repost from '../../../assets/repost.svg';

import { getAuth } from 'firebase/auth';

const auth = getAuth();

const onNavToPost = (navigation, postId, title, tags, profile, profilePic, username, imageUrl, template, templateUploader, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount, repostedWithComment, reposterUsername, reposterProfile, reposterProfilePic) => () => {
    navigation.push('Post', {
        postId: postId,
        title: title,
        tags: tags,
        imageUrl: imageUrl,
        memeName: memeName,
        template: template,
        templateUploader: templateUploader ? templateUploader : null,
        templateState: null,
        imageHeight: imageHeight,
        imageWidth: imageWidth,
        text: text,
        likesCount: likesCount,
        commentsCount: commentsCount,
        profile: profile,
        username: username,
        profilePic: profilePic,
        reposterUsername: reposterUsername,
        reposterProfile: reposterProfile,
        reposterProfilePic: reposterProfilePic,
        repostedWithComment: repostedWithComment,
    });
}


const navToMeme = (navigation, memeName, template, templateUploader, imageHeight, imageWidth) => () => {
    navigation.navigate('Meme', {
        uploader: templateUploader,
        memeName: memeName,
        template: template,
        height: imageHeight,
        width: imageWidth,
    })
}


const goToProfile = (navigation, profile, username, profilePic) => () => {
    navigation.push('Profile', {
        profile: profile,
        username: username,
        profilePic: profilePic,
    })
}


const PostContainer = ({ title, imageUrl, imageHeight, imageWidth, text, memeName, template, templateUploader, templateState, likesCount, commentsCount, repostsCount, tags, content, profile, postId, profilePic, username, reposterUsername, reposterProfilePic, reposterProfile, repostedWithComment, repostComment }) => {
    const navigation = useNavigation();
    const { theme, setTheme } = React.useContext(ThemeContext);

    const [deleted, setDeleted] = React.useState(false);

    const { options, setOptions } = React.useContext(AuthenticatedUserContext);

    let threeDots

    if (theme == 'light') {
        threeDots = <ThreeDotsLight width={40} height={40} style={styles.lightThreeDots} />
    } else {
        threeDots = <ThreeDotsDark width={40} height={40} style={styles.darkThreeDots} />
    }


    React.useEffect(() => {
        if (options && options?.postId === postId && options?.deleted === true) {
            // console.log(options)
            // console.log('comment is deleted');
            setDeleted(true)
            setOptions(false);
        }
        if (options && options?.postId === postId && !(options?.text || (options?.image && imageUrl))) {
            // const watermarked = getWatermarkedImage(image, '../../../assets/add.svg');
            setOptions({
                ...options,
                image: imageUrl,
                text: text,
            });
        }
    }, [options]);


    const clickedThreeDots = React.useCallback(() => () => {

        setOptions({
            postId: postId,
            profile: profile,
            image: imageUrl,
            text: text,
        })

    }, []);

    { options }
    const postBottom = (
        <PostBottom
            theme={theme}
            postId={postId}
            username={username}
            profilePic={profilePic}
            likesCount={likesCount}
            commentsCount={commentsCount}
            repostsCount={repostsCount}
            onShare={onShare(text, imageUrl)}
            navToPost={() => onNavToPost(navigation, postId, title, tags, profile, profilePic, username, imageUrl, template, templateUploader, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount, repostedWithComment, reposterUsername, reposterProfile, reposterProfilePic)}
        />
    )


    const contentBottom = (
        <ContentBottom
            memeName={memeName}
            tags={tags}
            navToPost={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, imageUrl, template, templateUploader, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount, repostedWithComment, reposterUsername, reposterProfile, reposterProfilePic)}
            navToMeme={navToMeme(navigation, memeName, template, templateUploader, imageHeight, imageWidth)}
            templateUploader={templateUploader}
        />
    )

    const onLongPress = React.useCallback((repostWithComment) => () => {
        if(repostWithComment){
            setOptions({
                // postId: repostId,
                repostedId: postId,
                profile: reposterProfile,
                text: text,
                repostComment: repostComment,
            })
        }else{
            setOptions({
                postId: postId,
                // repostId: repostId,
                profile: profile,
                text: text,
            })
        }
        
    }, []);

    // if post is deleted or content is null, don't show post
    if (deleted || content == null || content == undefined) {
        return null;
    }

    return (
        <Animated.View
            entering={FadeIn}
            style={[theme == 'light' ? GlobalStyles.lightPostContainer : GlobalStyles.darkPostContainer, 
                {
                    borderRadius: repostedWithComment && 15,
                    borderWidth: repostedWithComment && 1,
                    marginTop: repostedWithComment ? 14 : 0,
                    marginBottom: repostedWithComment ? 3 : 8,
                }
            ]}
        >

            {
                (reposterUsername) &&

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={
                        goToProfile(navigation,
                            repostComment ? profile : reposterProfile,
                            repostComment ? username : reposterUsername,
                            repostComment ? profilePic : reposterProfilePic
                        )
                    }
                    style={{ flexDirection: 'row', marginTop: 5 }}
                >
                    {/* <Repost
                        width={19}
                        height={19}
                        style={theme == 'light' ? styles.lightRepostIcon : styles.darkRepostIcons}
                    /> */}
                    <Feather
                        name={"repeat"}
                        size={20}

                        color={theme == 'light' ? '#444' : '#F8F8F8'}
                        marginLeft={10}


                        marginTop={9}
                    />
                    {/* <MaterialCommunityIcons
                        name="repeat-variant"
                        size={28}
                        color={theme == 'light' ? '#555' : '#FF3535'}
                        marginLeft={10}
                        marginTop={5}
                    /> */}
                    <Text style={theme == 'light' ? styles.lightReposterUsername : styles.darkReposterUsername}>
                        Reposted by @{repostComment ? username : reposterUsername}
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, imageUrl, template, templateUploader, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount, repostedWithComment, reposterUsername, reposterProfile, reposterProfilePic)}
                        style={{ flex: 1 }}
                    />
                </TouchableOpacity>
            }


            {/* profile pic, username and title*/}
            <View
                style={{ flexDirection: 'row', marginLeft: 10, marginTop: repostedWithComment ? 7 : 14, marginBottom: title ? 8 : 10, alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}
            >
                {/* profile pic */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={goToProfile(navigation, profile, username, profilePic)}
                >
                    {profilePic != "" ? (
                        <Image source={{ uri: profilePic }} style={[styles.profileImage, {height: repostedWithComment ? 35 : 40, width: repostedWithComment ? 35 : 40}]} cachePolicy='disk' />
                    ) : (
                        <Image source={require('../../../assets/profile_default.png')} style={[styles.profileImage, {height: repostedWithComment ? 35 : 40, width: repostedWithComment ? 35 : 40}]} cachePolicy='disk' />
                    )}
                </TouchableOpacity>

                {/* username */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={goToProfile(navigation, profile, username, profilePic)}

                    style={{ flexDirection: 'column', marginLeft: 5, alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}
                >

                    {/* username */}
                    <Text style={[theme == 'light' ? styles.lightUsername : styles.darkUsername, {fontSize: repostedWithComment ? 15 : 16}]}>
                        @{username}
                    </Text>


                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, imageUrl, template, templateUploader, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount, repostedWithComment, reposterUsername, reposterProfile, reposterProfilePic)}
                    style={{ flex: 1, height: 40 }}
                />



                {/* three dots */}
                {
                    !repostedWithComment ?
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={{ flexDirection: 'row', marginBottom: 10, paddingTop: 10, paddingBottom: 0, paddingLeft: 15, paddingRight: 10 }}
                            // onPress= {toggleOverlay()}
                            onPress={clickedThreeDots()}
                        >
                            {threeDots}
                        </TouchableOpacity>
                    :
                        <Feather
                            name={"repeat"}
                            size={20}

                            color={theme == 'light' ? '#555' : '#F8F8F8'}
                            marginRight={15}
                            marginTop={-9}
                        />
                }
            </View>


            {/* title */}
            {
                title &&
                <TouchableOpacity
                    activeOpacity={0.9}
                    onLongPress={onLongPress()}
                    onPress={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, imageUrl, template, templateUploader, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount, repostedWithComment, reposterUsername, reposterProfile, reposterProfilePic)}
                >

                    {/* title */}
                    <TitleText title={title} repostedWithComment={repostedWithComment}/>

                </TouchableOpacity>
            }
                


            {/* Post content. Image, Text etc. */}
            {/* <TouchableOpacity
                activeOpacity={0.9}
                onPress={onNavToPost(navigation, postId, title, tags, profile, profilePic, username, imageUrl, template, templateUploader, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount, repostedWithComment, reposterUsername, reposterProfile, reposterProfilePic)}
            > */}

            {content}

            {/* </TouchableOpacity> */}


            {/* tags and meme name */}
            {contentBottom}


            {/* likes, comments, repost, share */}
            {!repostedWithComment && postBottom}

        </Animated.View>
    );
}

const styles = StyleSheet.create({
    lightThreeDots: {
        // marginLeft: 365,
        color: '#000',
        marginTop: -20,

        // marginHorizontal: 10,
    },
    darkThreeDots: {
        // marginLeft: 365,
        color: '#FFF',
        marginTop: -20,
        // marginHorizontal: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        // marginLeft: 10,
        // marginRight: 6,
        // marginVertical: 10,
    },
    memeName: {
        width: 170,
        marginTop: 8,
        marginLeft: 0,
        flexDirection: 'row',
    },
    lightUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#444444',
        textAlign: "left",
        // marginTop: 6,
    },
    darkUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#DDDDDD',
        textAlign: "left",
        // marginTop: 6,
    },
    lightReposterUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#555',
        marginLeft: 8,
        marginTop: 9,
    },
    darkReposterUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#CCC',
        textAlign: "left",
        marginLeft: 8,
        marginTop: 9,
    },
    lightRepostIcon: {
        color: "#606060",
        marginLeft: 12,
        marginTop: 10
    },
    darkRepostIcons: {
        color: "#BBB",
        marginLeft: 11,
        marginTop: 10
    },
    lightPostTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: '#333333',
        marginHorizontal: 12,
        marginTop: 3,
        // marginBottom: 1,
        // width: 290,
    },
    darkPostTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: '#DDDDDD',
        textAlign: "left",
        marginHorizontal: 12,
        marginTop: 3,
        // marginBottom: 10,
        // width: 290,
    },
    overlayText: {
        fontSize: 22,
        fontWeight: "500",
        color: '#000000',
        alignSelf: 'center',
        marginHorizontal: 10,
    },
});

export default PostContainer;
