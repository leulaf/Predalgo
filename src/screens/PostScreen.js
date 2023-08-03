import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, LogBox, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';
import { FlashList } from '@shopify/flash-list';


import { Image } from 'expo-image';
import ResizableImage from '../shared/ResizableImage';



import { fetchFirstTenPostCommentsByRecent, fetchFirstTenPostCommentsByPopular } from '../shared/post/GetPostComments';

import { firebase, storage, db } from '../config/firebase';

import GlobalStyles from '../constants/GlobalStyles';

import ContentBottom from '../components/postTypes/ContentBottom';
import PostBottom from '../components/postTypes/PostBottom';
import ReplyBottomSheet from '../components/replyBottom/PostReplyBottomSheet';

import MainComment from '../components/commentTypes/MainComment';

import SimpleTopBar from '../components/SimpleTopBar';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';



const HEADER_HEIGHT = 200; 
const STICKY_HEADER_HEIGHT = 50; 

const windowWidth = Dimensions.get('window').width;


const PostScreen = ({navigation, route}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [commentsList, setCommentsList] = useState([]);
    const {title, profile, likesCount, commentsCount, imageUrl, template, templateState, imageHeight, imageWidth, text, username, repostUsername, profilePic, postId, memeName, tags} = route.params;

    const [replyTextToPost, setReplyTextToPost] = useState("");
    const [submittedText, setSubmittedText] = useState(null);

    const {imageReply, setImageReply} = useContext(AuthenticatedUserContext);

    const [image, setImage] = useState(imageUrl ? imageUrl : template);
    const [finished, setFinished] = useState(template ? false : true);

    const flashListRef = useRef(null);


    const contentBottom = <ContentBottom
        memeName={memeName}
        tags={tags}
    />;

    const replyBottomSheet = <ReplyBottomSheet
        commentList={commentsList}
        addNewComment={() => addNewComment()}
        navigation={navigation}
        replyToPostId = {postId}
        replyToProfile = {profile}
        replyToUsername={username}
    />;

    
    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, []);

    useEffect(() => {
        getFirstTenPostCommentsByPopular();
    }, []);

    const getFirstTenPostCommentsByPopular = async () => {
        await fetchFirstTenPostCommentsByPopular(postId).then((comments) => {
            
            setCommentsList(comments);
            
        });
    }

    // const addNewComment = (newComment) => {

    //     setTimeout(() => {
    //         setCommentsList([newComment, ...commentsList]).then(() => {

    //         })
    //     }, 3000);
    // }

    const onGoBack = () => {
        if(imageReply && imageReply.forCommentOnPost){
            setImageReply(null)
        }
        navigation.goBack(null);
    };

    // Sets the header of component
    useEffect(() => { 
        navigation.setOptions({
            header: () => <SimpleTopBar title={"Back"}/>
        });
    }, [navigation]);


    const renderItem = ({ item, index }) => {
        // index 0 is the header continng the profile pic, username, title and post content
        if (index === 0) {
            
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
                        <View
                            style={{flex: 1, flexDirection: 'column'}}
                        >

                            {
                                repostUsername ?
                                    <Text style={theme == 'light' ? styles.lightRepostUsername: styles.darkRepostUsername}>
                                        @{repostUsername} reposted
                                    </Text>
                                :
                                    null
                            }

                            <TouchableOpacity
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
                    </View>

                    {/* title */}
                    {
                        title &&
                        <Text numberOfLines={2} 
                            style={theme == 'light' ? styles.lightPostTitle: styles.darkPostTitle}>
                            {title}
                        </Text>
                    }

                    {/* content */}
                    
                    {text &&
                        <Text style={theme == "light" ? styles.lightPostText : styles.darkPostText}>
                            {text}
                        </Text>
                    }

                        <ResizableImage 
                        image={imageUrl}
                        height={imageHeight}
                        width={imageWidth}
                        maxWidth={windowWidth}
                        style={{marginTop: 14, borderRadius: 0, alignSelf: 'center'}}
                    />

                    {/* Content bottom */}
                    <View style={{marginLeft: 5, marginTop: 5, marginBottom: 5}}>
                        {contentBottom}
                    </View>

                </View>
            );

        } else if (index === 1) {
            return (

                <View style={[theme == 'light' ? styles.lightContainer : styles.darkContainer, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]}>
                    <PostBottom
                        postId={postId}
                        likesCount={likesCount}
                        commentsCount={commentsCount}
                    />

                    {index === commentsList.length-1 &&

                        <View style={{height: 600}}/>

                    }
                </View>
                
            );
        }else if (index === commentsList.length-1) {
            return (

                <View>
                    <MainComment
                        replyToPostId={postId}
                        profile={item.profile}
                        username={item.username}
                        profilePic={item.profilePic}
                        commentId={item.id}
                        text={item.text}
                        imageUrl={item.imageUrl}
                        memeName={item.memeName}
                        template={item.template}
                        templateState={item.templateState}
                        imageWidth={item.imageWidth}
                        imageHeight={item.imageHeight}
                        likesCount={item.likesCount}
                        commentsCount={item.commentsCount}
                    />
                    
                    <View style={{height: 200}}/>
                </View>
                
            );
        }

        return (
            <MainComment
                replyToPostId={postId}
                profile={item.profile}
                username={item.username}
                profilePic={item.profilePic}
                commentId={item.id}
                text={item.text}
                imageUrl={item.imageUrl}
                memeName={item.memeName}
                template={item.template}
                templateState={item.templateState}
                imageWidth={item.imageWidth}
                imageHeight={item.imageHeight}
                likesCount={item.likesCount}
                commentsCount={item.commentsCount}
            />
        );
    };

    // const keyExtractor = useCallback((item, index) => item.id, []);

    return (
        <View
            onTouchStart={e=> this.touchX = e.nativeEvent.pageX}
            onTouchEnd={e => {
            if (e.nativeEvent.pageX - this.touchX > 150)
                // console.log('Swiped Right')
                onGoBack();
            }}
            style={theme == 'light' ? styles.lightMainContainer : styles.darkMainContainer}
        >
            
            
            <FlashList
                ref={flashListRef}
                data={commentsList}
                // onEndReachedThreshold={0.2}
                // onEndReached={() => }
                estimatedItemSize={400}
                // keyExtractor={(item, index) => item.id}
                // keyExtractor={keyExtractor}
                extraData={[finished]}
                stickyHeaderIndices={[1]}
                renderItem={renderItem}

                removeClippedSubviews={true}

                // maxToRenderPerBatch={5}
                // updateCellsBatchingPeriod={100}
                // windowSizeprop={5}

                //optimization
                // removeClippedSubviews={true}
                // initialNumToRender={10}
                // maxToRenderPerBatch={10}
                // windowSize={10}
                // updateCellsBatchingPeriod={100}
                // onEndReachedThreshold={0.5}
                // onEndReached={() => {}} //need to implement infinite scroll
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
        marginBottom: 7,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    darkUserContainer: {
        backgroundColor: '#151515',
        flexDirection: 'row',
        marginTop: 16.5,
        marginLeft: 13,
        marginBottom: 7,
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
        marginHorizontal: 14,
        marginTop: 6,
    },
    darkPostText: {
        fontSize: 18,
        fontWeight: "400",
        color: '#F4F4F4',
        textAlign: 'auto',
        marginHorizontal: 14,
        marginTop: 6,
    },
    
});

export default PostScreen;
