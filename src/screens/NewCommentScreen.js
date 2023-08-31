import React, { useEffect, useRef, useCallback,  useState, useContext } from 'react';
import { View, LogBox, FlatList, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';



import { Image } from 'expo-image';
import ResizableImage from '../shared/ResizableImage';

import { fetchFirstTenCommentsByRecent, fetchFirstTenCommentsByPopular } from '../shared/comment/GetComments';

import GlobalStyles from '../constants/GlobalStyles';

import PinturaLoadImage from '../shared/PinturaLoadImage';

import ContentBottom from '../components/postTypes/ContentBottom';

import CommentBottom from '../components/commentTypes/CommentBottom';

import ReplyBottomSheet from '../components/replyBottom/CommentReplyBottomSheet';

import MainComment from '../components/commentTypes/MainComment';

import SimpleTopBar from '../components/SimpleTopBar';

import PinturaEditor, {} from "@pqina/react-native-expo-pintura";

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';


const HEADER_HEIGHT = 200; 
const STICKY_HEADER_HEIGHT = 50; 

const windowWidth = Dimensions.get('window').width;

export class CommentScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataProvider: new DataProvider((r1, r2) => {
                return r1 !== r2;
            }),
            commentsList: [],
            imageUrl: this.props.imageUrl,
        }
    }

    contentBottom = (
        <ContentBottom
            memeName={memeName}
            tags={tags}
        />
    )

    commentBottom = (
        <CommentBottom
            commentId={commentId}
            replyToPostId={replyToPostId}
            replyToCommentId={replyToCommentId}
            likesCount={likesCount}
            commentsCount={commentsCount}
        />
    );

    replyBottomSheet = <ReplyBottomSheet
        setOnReplying={() => setOnReplying}
        onReplying={onReply ? onReplying : null}
        navigation={navigation}
        replyToPostId={replyToPostId}
        replyToCommentId={commentId}
        replyToProfile = {profile}
        replyToUsername={username}
    />;

    getFirstTenCommentsByPopular = async () => {
        await fetchFirstTenCommentsByPopular(replyToPostId, commentId).then((comments) => {
            

            this.setState({
                ...this.state,
                dataProvider: this.state.dataProvider.cloneWithRows([...this.state.commentsList, ...comments]),
                commentsList: [...this.state.commentsList, ...comments],
            });
            
        });
    }

    onComponentDidMount = () => {
        // Get the first ten posts
        this.getFirstTenCommentsByPopular();

        // Turn off warnings for VirtualizedLists should never be nested
        // LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }

    layoutProvider = new LayoutProvider(index => {

            if (this.state.dataProvider.getDataForIndex(index)) {
                return "header";
                
            }

        }
    , (type, dim) => {
            dim.width = windowWidth; //change this
            dim.height = 50; //change this
    })

    rowRenderer = (type, item, index, extendedState) => {



        if (index === 0) {
            console.log("rendering item 0")
            return (
                <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
                    <View 
                        style={theme == 'light' ? styles.lightUserContainer : styles.darkUserContainer}
                    >
                        {/* profile pic */}
                        <TouchableOpacity
                            onPress={() => 
                                    navigation.push('Profile', {
                                        user: this.props.profile,
                                    })
                            }
                        >
                            {this.props.profilePic != "" ? (
                                <Image source={{ uri: this.props.profilePic }} style={styles.profileImage} cachePolicy={'disk'}/>
                            ) : (
                                <Image source={require('../../assets/profile_default.png')} style={styles.profileImage} cachePolicy='disk'/>
                            )}
                        </TouchableOpacity>
                        
                        {/* username */}
                        <TouchableOpacity
                            style={{flex: 1, flexDirection: 'column'}}
                            onPress={() => 
                                    navigation.push('Profile', {
                                        user: this.props.profile,
                                    })
                            }
                        >
                            <Text style={theme == 'light' ? styles.lightUsername: styles.darkUsername}>
                                @{this.props.username}
                            </Text>
                        </TouchableOpacity>

                    </View>


                    <View style={{marginBottom: 8}}>

                        {this.props.text &&
                            <Text style={theme == "light" ? styles.lightPostText : styles.darkPostText}>
                                {this.props.text}
                            </Text>
                        }

                        <ResizableImage 
                            image={extendedState.finished ? this.state.imageUrl : this.props.template}
                            height={this.props.imageHeight}
                            width={this.props.imageWidth}
                            maxWidth={windowWidth}
                            style={{marginTop: 14, borderRadius: 0, alignSelf: 'center'}}
                        />

                        {/* Content bottom */}
                        <View style={{marginLeft: 5, marginTop: 5, marginBottom: 5}}>
                            {contentBottom}
                        </View>

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
                        replyToPostId={this.props.replyToPostId}
                        replyToCommentId={this.props.commentId}
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
                    <View style={{height: 150}}/>
                </View>
                
            );
        }

        return (
            <MainComment
                replyToPostId={this.props.replyToPostId}
                replyToCommentId={this.props.commentId}
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
    }

    setFinished = () => {
        this.setState({
            ...this.state,
            finished: true,
        });
    }
    
 
    render(){
        if(this.state.dataProvider._data.length === 0){
            return null;
        }

        const {theme,setTheme} = useContext(ThemeContext);

        const editorRef = useRef(null);

        const navigation = this.props.navigation;

        onGoBack = () => {
            if(imageReply && imageReply.forCommentOnComment){
                setImageReply(null)
            }
            navigation.goBack(null);
        };
    

        // // Turn off warnings for VirtualizedLists should never be nested
        // useEffect(() => {
        //     LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        // }, []);

        // // Get the first ten posts
        // useEffect(() => {
        //     getFirstTenCommentsByPopular();
        // }, []);
        
        // Set the Top Bar
        useEffect(() => {
            navigation.setOptions({
                header: () => <SimpleTopBar title={"Back"}/>
            });
        }, [navigation]);

        //NEED***NEED to make sure multiple instance of PinturaLoadImage are not created***
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
                
                {/* Load Meme with template and template state */}
                {
                    (this.state.imageUrl == undefined || this.state.imageUrl == null || this.state.imageUrl == "") &&
                        
                        <PinturaEditor
                            ref={editorRef}
                            
                            // src={image}
                            // onClose={() => console.log('closed')}
                            // onDestroy={() => console.log('destroyed')}
                            // onLoad={() => 
                            //     editorRef.current.editor.processImage(templateState)
                            // }

                            onInit={() => 
                                editorRef.current.editor.processImage(this.props.template, this.props.templateState)
                            }

                            onProcess={async({ dest }) => {
                                    console.log("processing image")
                                    manipulateAsync(dest, [], ).then((res) => {
                                    // setFinished({});
                                    // setImage(res.uri);
                                    this.state.imageUrl = res.uri;
                                    // console.log(res.uri)
                                })
                            }}
                        />     
                }


                <RecyclerListView
                    dataProvider={this.state.dataProvider.cloneWithRows(this.state.commentsList)}

                    layoutProvider={this.layoutProvider}

                    rowRenderer={this.renderItem}

                    extendedState={{finished: this.state.finished}}

                    forceNonDeterministicRendering={true}

                    // onEndReachedThreshold={0.2}
                    // onEndReached={() => }











                    // data={commentsList}
                    
                    // estimatedItemSize={400}
                    // keyExtractor={(item, index) => item.id + '-' + index}
                    // keyExtractor={keyExtractor}
                    // extraData={finished}
                    // stickyHeaderIndices={[1]}
                    // renderItem={renderItem}

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
    }
}

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
        fontWeight: 600,
        color: '#444444',
        textAlign: "left",
        marginBottom: 1,
    },
    darkUsername: {
        fontSize: 16,
        fontWeight: 600,
        color: '#DDDDDD',
        textAlign: "left",
        marginBottom: 1,
    },
    lightRepostUsername: {
        fontSize: 16,
        fontWeight: 600,
        color: '#777777',
        textAlign: "left",
    },
    darkRepostUsername: {
        fontSize: 16,
        fontWeight: 600,
        color: '#BBBBBB',
        textAlign: "left",
    },
    lightPostTitle: {
        fontSize: 22,
        fontWeight: 600,
        color: '#333333',
        textAlign: 'auto',
        marginHorizontal: 14,
        // marginTop: 1,
        // marginVertical: 2,
        // width: 290,
    },
    darkPostTitle: {
        fontSize: 22,
        fontWeight: 600,
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
        fontWeight: 600,
        alignSelf: 'center',
        marginTop: 1
    },
    darkFollowText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 600,
        alignSelf: 'center',
        marginTop: 1
    },
    lightPostText: {
        fontSize: 18,
        fontWeight: 400,
        color: '#222222',
        textAlign: 'auto',
        marginHorizontal: 13.5,
        marginTop: 10,
    },
    darkPostText: {
        fontSize: 18,
        fontWeight: 400,
        color: '#F4F4F4',
        textAlign: 'auto',
        marginHorizontal: 13.5,
        marginTop: 10,
    },
});