import React, { useEffect, useState, useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import {ThemeContext} from '../../context-store/context';

import { Image } from 'expo-image';
import ResizableImage from 'react-native-scalable-image';

import { firebase, storage, db } from '../config/firebase';

import GlobalStyles from '../constants/GlobalStyles';

import ContentBottom from '../components/postTypes/ContentBottom';
import PostBottom from '../components/postTypes/PostBottom';
import ReplyBottomSheet from '../components/CommentReplyBottomSheet';

import MainComment from '../components/commentTypes/MainComment';

import SimpleTopBar from '../components/SimpleTopBar';

const HEADER_HEIGHT = 200; 
const STICKY_HEADER_HEIGHT = 50; 

const windowWidth = Dimensions.get('window').width;

const ImageContainer = (props) => {    
    return (
        <ResizableImage 
            width={windowWidth} // this will make image take full width of the device
            source={props.imageSource} // pass the image source via props
            style={{ marginTop: 5, alignSelf: 'center' }}
        />
    );
};

const CommentScreen = ({navigation, route}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const commentsList = ['Header', ...[...Array(50)].map((_, i) => `Item ${i}`)];
    const {profile, likesCount, commentsCount, imageUrl, text, username, profilePic, commentId, memeName} = route.params;

    const [replyToPost, setReplyToPost] = useState("");


    const replyBottomSheet = <ReplyBottomSheet
        replyToPost={replyToPost}
        setReplyToPost={setReplyToPost}
        mainComment={true}
    />;

    // Sets the header of component
    useEffect(() => {
        navigation.setOptions({
            header: () => <SimpleTopBar title={"Back"}/>
        });
    }, [navigation]);

    const navigateToTag = async(tag) => {
        if(tag.charAt(0) == '#'){
            navigation.push('Tag', {tag: tag});
        }else if(tag.charAt(0) == '@'){
            const username = tag.substring(1);

            const q = query(collection(db, "users"), where("username", "==", username));

            let user = null;

            await getDocs(q).then((snapshot) => {
                snapshot.docs.map((doc) => {
                    const data = doc.data();
                    user = { ...data, id: doc.id }; // Add the id property to the user object
                });
            });

            if(user){
                navigation.push('Profile', { user: user });
            }

        }
    }

    const renderItem = ({ item, index }) => {
        // index 0 is the header continng the profile pic, username, title and post content
        if (index === 0) {
            let content
            
            if (imageUrl != null) {
                content = (
                    // <View>
                        <ImageContainer imageSource={{ uri: imageUrl }} />
                    // </View> 
                    
                );
            }else if (text != null) {
                content = (
                    // <View >
                            <Text style={theme == "light" ? styles.lightPostText : styles.darkPostText}>
                                {text
                            }</Text>
                    // </View>
                );
            }

            return (
                <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
                    <View 
                        style={[theme == 'light' ? styles.lightContainer : styles.darkContainer, { flexDirection: 'row'}]}
                    >
                        {/* profile pic */}
                        <TouchableOpacity
                            onPress={() => 
                                navigation.push('Profile', {
                                    user: profile,
                                    username: username,
                                    profilePic: profilePic,
                                })
                            }
                        >
                            {profilePic != "" ? (
                                <Image source={{ uri: profilePic }} style={styles.profileImage}/>
                            ) : (
                                <Image source={require('../../assets/profile_default.png')} style={styles.profileImage} cachePolicy='disk'/>
                            )}
                        </TouchableOpacity>
                        
                        {/* username */}
                        <View
                            style={{flex: 1, flexDirection: 'column'}}
                        >



                            <Text style={theme == 'light' ? styles.lightUsername: styles.darkUsername}>
                                @{username}
                            </Text>

                        </View>
                    </View>

                    {/* title */}
                    {/* {
                        title &&
                        <Text numberOfLines={2} 
                            style={theme == 'light' ? styles.lightPostTitle: styles.darkPostTitle}>
                            {title}
                        </Text>
                    } */}

                    {/* content */}
                    <View style={{marginBottom: 15}}>
                        {content}
                    </View>
                    
                </View>
            );

        } else if (index === 1) {
            return (
                <View style={[theme == 'light' ? styles.lightContainer : styles.darkContainer, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]}>
                    {/* <PostBottom
                        postId={postId}
                        likesCount={likesCount}
                        commentsCount={commentsCount}
                    /> */}
                </View>
                
            );
        }
        
        if (index === commentsList.length-1) {
            return (
                <View style={[theme == 'light' ? styles.lightContainer : styles.darkContainer, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]}>
                    <MainComment
                        profile={item.profile}
                        username={item.username}
                        profilePic={item.profilePic}
                        commentId={item.commentId}
                        text={item.text ? item.text : null}
                        likesCount={item.likesCount}
                        commentsCount={item.commentsCount}
                    />
                    <View style={{height: 150}}/>
                </View>
                
            );
        }

        return (
            // <MainComment
            //     profile={profile}
            //     username={username}
            //     profilePic={profilePic}
            //     commentId={commentId}
            //     text={text}
            //     likesCount={likesCount}
            //     commentsCount={commentsCount}
            // />
            null
        );
    };

    return (
        <View style={[theme == 'light' ? styles.lightMainContainer : styles.darkMainContainer, { flex: 1}]}>
            
            
            <FlatList
                data={commentsList}
                renderItem={renderItem}
                keyExtractor={item => item}
                stickyHeaderIndices={[1]}
            />

            {replyBottomSheet}

        </View>

    );
};

const styles = StyleSheet.create({
    header: {
        height: HEADER_HEIGHT,
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stickyHeader: {
        height: STICKY_HEADER_HEIGHT,
        backgroundColor: 'lightgreen',
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        padding: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginLeft: 13,
        marginRight: 5,
        marginVertical: 4,
        marginTop: 9,
    },
    lightMainContainer: {
        flex: 1,
        backgroundColor: 'FEFEFE',
    },
    darkMainContainer: {
        flex: 1,
        backgroundColor: '#0C0C0C',
    },
    lightContainer: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 10, borderBottomRightRadius: 15
    },
    darkContainer: {
        backgroundColor: '#151515',
        borderBottomLeftRadius: 10, borderBottomRightRadius: 15
    },
    lightUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#444444',
        textAlign: "left",
        marginTop: 6,
    },
    darkUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#DDDDDD',
        textAlign: "left",
        marginTop: 6,
    },
    lightRepostUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#777777',
        textAlign: "left",
        marginTop: 6,
    },
    darkRepostUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#BBBBBB',
        textAlign: "left",
        marginTop: 6,
    },
    lightPostTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: '#333333',
        textAlign: "left",
        marginHorizontal: 12.5,
        // marginTop: 1,
        // marginVertical: 2,
        // width: 290,
    },
    darkPostTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: '#DDDDDD',
        textAlign: "left",
        marginHorizontal: 12.5,
        // marginTop: 1,
        // marginVertical: 2,
        // width: 290,
    },
    lightBottomSheet: {
        backgroundColor: '#FFFFFF',
        height: "100%",
    },
    darkBottomSheet: {
        backgroundColor: '#141414',
        height: "100%",
    },
    lightFollowButton: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        width: 110,
        height: 30,
        marginLeft: 5,
        marginTop: 12,
        marginBottom: 10,
        borderWidth: 1.5,
        borderColor: '#888888'
    },
    darkFollowButton: {
        flexDirection: 'column',
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        width: 110,
        height: 30,
        marginLeft: 5,
        marginTop: 12,
        marginBottom: 10,
        borderWidth: 1.5,
        borderColor: '#888888'
    },
    lightFollowText: {
        fontSize: 18,
        color: '#222222',
        fontWeight: '600',
        alignSelf: 'center',
        marginTop: 1
    },
    darkFollowText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: '600',
        alignSelf: 'center',
        marginTop: 1
    },
    lightPostText: {
        fontSize: 18,
        fontWeight: "400",
        color: '#222222',
        textAlign: 'auto',
        marginHorizontal: 13,
        marginTop: 5,
    },
    darkPostText: {
        fontSize: 18,
        fontWeight: "400",
        color: '#F4F4F4',
        textAlign: 'auto',
        marginHorizontal: 13,
        marginTop: 5,
    },
    lightReplyToPostContainer: {
        flex: 1,
        // flexDirection: 'column',
        backgroundColor: '#FFFFFF',
    },
    darkReplyToPostContainer: {
        flex: 1,
        backgroundColor: '#141414',
    },
    lightReplyToPostBar: {
        height: 40,
        width: "96%",
        borderRadius: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: '#FBFBFB',
        borderWidth: 1,
        borderColor: '#EDEDED',
    },
    darkReplyToPostBar: {
        height: 40,
        width: "96%",
        borderRadius: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: '#202020',
        borderWidth: 1,
        borderColor: '#262626',
    },
    lightInputStyle: {
        flex: 1,
        // height: 40,
        fontSize: 18,
        fontWeight: "400",
        marginHorizontal: 10,
        // alignSelf: 'center',
        color: '#222222',
    },
    darkInputStyle: {
        flex: 1,
        // height: 40,
        fontSize: 18,
        fontWeight: "400",
        marginHorizontal: 10,
        // alignSelf: 'center',
        // marginTop: 5,
        color: '#F4F4F4',
    },
});

export default CommentScreen;
