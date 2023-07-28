import React, { useEffect, useState, useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import {ThemeContext} from '../../context-store/context';

import { Image } from 'expo-image';
import ResizableImage from '../shared/ResizableImage';

import { fetchFirstTenCommentsByRecent, fetchFirstTenCommentsByPopular } from '../shared/comment/GetComments';

import GlobalStyles from '../constants/GlobalStyles';

import CommentBottom from '../components/commentTypes/CommentBottom';

import ReplyBottomSheet from '../components/replyBottom/CommentReplyBottomSheet';

import MainComment from '../components/commentTypes/MainComment';

import SimpleTopBar from '../components/SimpleTopBar';

const HEADER_HEIGHT = 200; 
const STICKY_HEADER_HEIGHT = 50; 

const windowWidth = Dimensions.get('window').width;


const CommentScreen = ({navigation, route}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [commentsList, setCommentsList] = useState([]);
    const {profile, commentId, onReply, replyToCommentId, replyToPostId, username, profilePic, text, imageUrl, imageWidth, imageHeight, memeName, likesCount, commentsCount} = route.params;

    const [onReplying, setOnReplying] = useState(onReply ? onReply : false);

    let commentBottom = (

        <CommentBottom
            commentId={commentId}
            replyToPostId={replyToPostId}
            replyToCommentId={replyToCommentId}
            likesCount={likesCount}
            commentsCount={commentsCount}
        />

    );

    const replyBottomSheet = <ReplyBottomSheet
        setOnReplying={() => setOnReplying}
        onReplying={onReply ? onReplying : null}
        navigation={navigation}
        replyToPostId={replyToPostId}
        replyToCommentId={commentId}
        replyToProfile = {profile}
        replyToUsername={username}
    />;

    useEffect(() => {
        getFirstTenCommentsByPopular();
    }, []);

    const getFirstTenCommentsByPopular = async () => {
        await fetchFirstTenCommentsByPopular(replyToPostId, commentId).then((comments) => {
            
            setCommentsList(comments);
            
        });
    }

    // Sets the header of component
    useEffect(() => {
        navigation.setOptions({
            header: () => <SimpleTopBar title={"Back"}/>
        });
    }, [navigation]);


    const renderItem = ({ item, index }) => {
        // index 0 is the header continng the profile pic, username, title and post content
        if (index === 0) {
            
            let topText, image


            if (text != null && text != "") {
                topText = (
                    <Text style={theme == "light" ? styles.lightPostText : styles.darkPostText}>
                        {text}
                    </Text>
                );
            }else{
                topText = null;
            }


            if (imageUrl != null) {
                image = (
                    <ResizableImage 
                        image={imageUrl}
                        height={imageHeight}
                        width={imageWidth}
                        maxWidth={windowWidth}
                        style={{marginTop: 14, borderRadius: 0, alignSelf: 'center'}}
                    />
                );
            }else{
                image = null;
            }

            return (
                <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
                    <View 
                        style={theme == 'light' ? styles.lightUserContainer : styles.darkUserContainer}
                    >
                        {/* profile pic */}
                        <TouchableOpacity
                            onPress={() => 
                                    navigation.push('Profile', {
                                        user: profile,
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
                        <TouchableOpacity
                            style={{flex: 1, flexDirection: 'column'}}
                            onPress={() => 
                                    navigation.push('Profile', {
                                        user: profile,
                                    })
                            }
                        >
                            <Text style={theme == 'light' ? styles.lightUsername: styles.darkUsername}>
                                @{username}
                            </Text>
                        </TouchableOpacity>

                    </View>


                    <View style={{marginBottom: 8}}>

                        {topText}

                        {image}

                    </View>
                    
                </View>
            );

        }else if (index === 1) {
            return (
                <View style={[theme == 'light' ? styles.lightContainer : styles.darkContainer, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]}>
                    {commentBottom}

                    {index === commentsList.length-1 &&

                        <View style={{height: 600}}/>

                    }

                </View>
                
            );
        }else if (index === commentsList.length-1) {
            return (
                <View>
                    <MainComment
                        replyToPostId={replyToPostId}
                        replyToCommentId={commentId}
                        profile={item.profile}
                        username={item.username}
                        profilePic={item.profilePic}
                        commentId={item.id}
                        text={item.text ? item.text : null}
                        imageUrl={item.imageUrl ? item.imageUrl : null}
                        imageWidth={item.imageWidth ? item.imageWidth : null}
                        imageHeight={item.imageHeight ? item.imageHeight : null}
                        likesCount={item.likesCount}
                        commentsCount={item.commentsCount}
                    />
                    <View style={{height: 150}}/>
                </View>
                
            );
        }

        return (
            <MainComment
                replyToPostId={replyToPostId}
                replyToCommentId={commentId}
                profile={item.profile}
                username={item.username}
                profilePic={item.profilePic}
                commentId={item.id}
                text={item.text ? item.text : null}
                imageUrl={item.imageUrl ? item.imageUrl : null}
                imageWidth={item.imageWidth ? item.imageWidth : null}
                imageHeight={item.imageHeight ? item.imageHeight : null}
                likesCount={item.likesCount}
                commentsCount={item.commentsCount}
            />
        );
    };

    return (
        <View style={[theme == 'light' ? styles.lightMainContainer : styles.darkMainContainer, { flex: 1}]}>
            
            
            <FlatList
                onTouchStart={e=> this.touchX = e.nativeEvent.pageX}
                onTouchEnd={e => {
                if (e.nativeEvent.pageX - this.touchX > 150)
                    // console.log('Swiped Right')
                    navigation.goBack()
                }}
                data={commentsList}
                keyExtractor={(item, index) => item.id + '-' + index}
                stickyHeaderIndices={[1]}
                renderItem={({ item, index }) => {
                    return (
                        renderItem({ item, index })
                    );
                }}
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
        marginRight: 5,
    },
    lightMainContainer: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    darkMainContainer: {
        flex: 1,
        backgroundColor: '#0C0C0C',
    },
    lightContainer: {
        backgroundColor: 'white',
    },
    darkContainer: {
        backgroundColor: '#151515',
    },
    lightUserContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        marginTop: 16.5,
        marginLeft: 13,
        // marginBottom: 7,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    darkUserContainer: {
        backgroundColor: '#151515',
        flexDirection: 'row',
        marginTop: 16.5,
        marginLeft: 13,
        // marginBottom: 7,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    lightUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#444444',
        textAlign: "left",
        marginBottom: 1,
    },
    darkUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#DDDDDD',
        textAlign: "left",
        marginBottom: 1,
    },
    lightRepostUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#777777',
        textAlign: "left",
    },
    darkRepostUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#BBBBBB',
        textAlign: "left",
    },
    lightPostTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: '#333333',
        textAlign: 'auto',
        marginHorizontal: 14,
        // marginTop: 1,
        // marginVertical: 2,
        // width: 290,
    },
    darkPostTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: '#DDDDDD',
        textAlign: 'auto',
        marginHorizontal: 14,
        // marginTop: 1,
        // marginVertical: 2,
        // width: 290,
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
        marginHorizontal: 13.5,
        marginTop: 10,
    },
    darkPostText: {
        fontSize: 18,
        fontWeight: "400",
        color: '#F4F4F4',
        textAlign: 'auto',
        marginHorizontal: 13.5,
        marginTop: 10,
    },
});

export default CommentScreen;
