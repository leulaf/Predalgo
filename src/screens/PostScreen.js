import React, { useEffect, useCallback, useRef, useState, useContext } from 'react';
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

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;


const PostScreen = ({navigation, route}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [commentsList, setCommentsList] = useState(["one", "two"]);
    const {title, profile, likesCount, commentsCount, imageUrl, template, templateState, imageHeight, imageWidth, text, username, repostUsername, profilePic, postId, memeName, tags} = route.params;

    const [replyTextToPost, setReplyTextToPost] = useState("");
    const [submittedText, setSubmittedText] = useState(null);

    const {imageReply, setImageReply} = useContext(AuthenticatedUserContext);

    const [image, setImage] = useState(imageUrl ? imageUrl : template);
    const [finished, setFinished] = useState(template ? false : true);
    const [updating, setUpdating] = useState(false);

    const flashListRef = useRef(null);

    useEffect(() => {
        getFirstTenPostCommentsByPopular();

        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

        navigation.setOptions({
            header: () => <SimpleTopBar title={"Back"}/>
        });
    }, []);


    const contentBottom = <ContentBottom
        memeName={memeName}
        tags={tags}
    />;

    const replyBottomSheet = <ReplyBottomSheet
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


    const onGoBack = () => {
        if(imageReply && imageReply.forCommentOnPost){
            setImageReply(null)
        }
        navigation.goBack(null);
    };


    const renderItem = useCallback(({ item, index }) => {

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
                updating={updating}
                setUpdating={setUpdating}
            />
        );
    }, [updating, finished]);

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
                
                // onEndReachedThreshold={0.2} //need to implement infinite scroll
                // onEndReached={() => }

                extraData={[finished, updating]}
                stickyHeaderIndices={[1]}
                renderItem={renderItem}

                removeClippedSubviews={true}

                // keyExtractor={(item, index) => item + index}
                // keyExtractor={keyExtractor}
                
                estimatedItemSize={200}
                estimatedListSize={{height: windowHeight ,  width: windowWidth}}

                ListFooterComponent={
                    <View style={{height: 200}}/>
                }
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
        // backgroundColor: '#0C0C0C',
        backgroundColor: '#000000',
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













// import React, { Component, useEffect, useRef, useCallback,  useState, useContext } from 'react';
// import { View, LogBox, FlatList, TouchableOpacity, Text, StyleSheet, Dimensions, Alert } from 'react-native';
// import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';



// import { Image } from 'expo-image';
// import ResizableImage from '../shared/ResizableImage';

// import { fetchFirstTenPostCommentsByRecent, fetchFirstTenPostCommentsByPopular } from '../shared/post/GetPostComments';

// import GlobalStyles from '../constants/GlobalStyles';

// import PinturaLoadImage from '../shared/PinturaLoadImage';

// import ContentBottom from '../components/postTypes/ContentBottom';
// import PostBottom from '../components/postTypes/PostBottom';

// import ReplyBottomSheet from '../components/replyBottom/PostReplyBottomSheet';

// import MainComment from '../components/commentTypes/MainComment';

// import SimpleTopBar from '../components/SimpleTopBar';

// import PinturaEditor from "@pqina/react-native-expo-pintura";

// import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

// import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';

// import { useNavigation } from '@react-navigation/native';

// const HEADER_HEIGHT = 200; 
// const STICKY_HEADER_HEIGHT = 50; 

// const windowWidth = Dimensions.get('window').width;

// export default class PostScreen extends Component{
//     static contextType = ThemeContext
//     constructor(props){
//         super(props);
//         this.editorRef = React.createRef();
//         // this.props.navigation.setOptions({
//         //     header: () => <SimpleTopBar title={"Back"}/>
//         // });
//         // this.navigation = useNavigation();

//         this.state = {
//             dataProvider: new DataProvider((r1, r2) => {
//                 return r1 !== r2;
//             }),
//             commentsList: [],
//             imageUrl: this.props.route.params.imageUrl ||  this.props.route.params.template,
//             finished: false,
//         }
//     }

//     contentBottom = (
//         <ContentBottom
//             memeName={this.props.route.params.memeName}
//             tags={this.props.route.params.tags}
//         />
//     )

//     replyBottomSheet = (
//         <ReplyBottomSheet
//             navigation={this.props.route.params.navigation}
//             replyToPostId={this.props.route.params.replyToPostId}
//             replyToProfile = {this.props.route.params.profile}
//             replyToUsername={this.props.route.params.username}
//         />
//     )


//     getFirstTenCommentsByPopular = async () => {
//         // console.log(this.props.replyToPostId, this.props.commentId)
//         // Alert.alert(this.props.route.params.replyToPostId) 
//         const comments = await fetchFirstTenPostCommentsByPopular(this.props.route.params.postId)
//         // Alert.alert(comments) 
//         // .then((comments) => {
            
//         //     console.log("commentsList: ", comments);
//         //     this.setState({
//         //         ...this.state,
//         //         dataProvider: this.state.dataProvider.cloneWithRows([...this.state.commentsList, ...comments]),
//         //         commentsList: [...this.state.commentsList, ...comments],
//         //     });

            
            
//         // });
//         // console.log("commentsList: ", comments);
//             this.setState({
//                 ...this.state,
//                 dataProvider: this.state.dataProvider.cloneWithRows([...this.state.commentsList, ...comments]),
//                 commentsList: [...this.state.commentsList, ...comments],
//             });
//     }

//     componentDidMount = () => {
//         // Get the first ten posts
//         // console.log("onComponentDidMount") 
//         // Alert.alert("onComponentDidMount") 
//         this.getFirstTenCommentsByPopular();

//         // Turn off warnings for VirtualizedLists should never be nested
//         // LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
//     }

//     layoutProvider = new LayoutProvider(index => {

//             // if (this.state.dataProvider.getDataForIndex(index)) {
//             //     return "header";
                
//             // }
//             return index

//         }
//     , (type, dim) => {
//             dim.width = windowWidth; //change this
//             dim.height = 250; //change this
//     })

    

//     setFinished = () => {
//         this.setState({
//             ...this.state,
//             finished: true,
//         });
//     }


    
    
 
//     render(){
//         if(this.state.dataProvider._data.length === 0){
//             // console.log("dataProvider is empty")
//             return null;
//         }else{
//             // console.log("dataProvider is not empty")
//         }

//         const {theme, setTheme} = this.context 

//         // const {heme,setTheme} = useContext(ThemeContext);

//         // const editorRef = useRef(null);

//         // const navigation = useNavigation();

//         onGoBack = () => {
//             // if(imageReply && imageReply.forCommentOnPost){
//             //     setImageReply(null)
//             // }
//             this.props.navigation.goBack(null);
//         };

//         const rowRenderer = (type, item, index, extendedState) => {
            

//             if (index === 0) {
//                 return (
//                     <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
//                         <View style={theme == 'light' ? styles.lightUserContainer : styles.darkUserContainer}>

//                             {/* profile pic */}
//                             <TouchableOpacity
//                                 onPress={() => 
//                                     this.props.navigation.push('Profile', {
//                                             user: this.props.route.params.profile,
//                                         })
//                                 }
//                             >
//                                 {this.props.route.params.profilePic != "" ? (
//                                     <Image source={{ uri: this.props.route.params.profilePic }} style={styles.profileImage} cachePolicy={'disk'}/>
//                                 ) : (
//                                     <Image source={require('../../assets/profile_default.png')} style={styles.profileImage} cachePolicy='disk'/>
//                                 )}
//                             </TouchableOpacity>
                            
//                             {/* username */}
//                             <TouchableOpacity
//                                 style={{flex: 1, flexDirection: 'column'}}
//                                 onPress={() => 
//                                     this.props.navigation.push('Profile', {
//                                             user: this.props.route.params.profile,
//                                         })
//                                 }
//                             >
//                                 <Text style={theme == 'light' ? styles.lightUsername : styles.darkUsername}>
//                                     @{this.props.route.params.username}
//                                 </Text>
//                             </TouchableOpacity>
    
//                         </View>
    
    
//                         <View style={{marginBottom: 8}}>
    
//                             {this.props.route.params.text &&
                            
//                                 <Text style={theme == 'light' ? styles.lightPostText : styles.darkPostText}>
//                                     {this.props.route.params.text}
//                                 </Text>
//                             }


//                             <ResizableImage 
//                                 image={ extendedState.finished ? this.state.imageUrl : this.state.imageUrl}
//                                 height={this.props.route.params.imageHeight}
//                                 width={this.props.route.params.imageWidth}
//                                 maxWidth={windowWidth}
//                                 style={{marginTop: 14, borderRadius: 0, alignSelf: 'center'}}
//                             />

    
//                             {/* Content bottom */}
//                             <View style={{marginLeft: 5, marginTop: 5, marginBottom: 0}}>
//                                 {this.contentBottom}
//                             </View>
    
//                         </View>
                        
//                     </View>
//                 );
//             }else if (index === 1) {
//                 return (

//                     <View style={[theme == 'light' ? styles.lightContainer : styles.darkContainer, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]}>
//                         <PostBottom
//                             postId={this.props.route.params.postId}
//                             likesCount={this.props.route.params.likesCount}
//                             commentsCount={this.props.route.params.commentsCount}
//                         />
    
//                         {index === this.state.commentsList.length-1 &&
    
//                             <View style={{height: 600}}/>
    
//                         }
//                     </View>
                    
                    
//                 );
//             }else if (index === this.state.commentsList.length-1) {
//                 return (
//                     <View>
//                         <MainComment
//                             replyToPostId={this.props.route.params.replyToPostId}
//                             profile={item.profile}
//                             username={item.username}
//                             profilePic={item.profilePic}
//                             commentId={item.id}
//                             text={item.text}
//                             imageUrl={item.imageUrl}
//                             memeName={item.memeName}
//                             template={item.template}
//                             templateState={item.templateState}
//                             imageWidth={item.imageWidth}
//                             imageHeight={item.imageHeight}
//                             likesCount={item.likesCount}
//                             commentsCount={item.commentsCount}
//                         />
//                         <View style={{height: 150}}/>
//                     </View>
                    
//                 );
//             }
    
//             return (
//                 <MainComment
//                     replyToPostId={this.props.route.params.replyToPostId}
//                     profile={item.profile}
//                     username={item.username}
//                     profilePic={item.profilePic}
//                     commentId={item.id}
//                     text={item.text}
//                     imageUrl={item.imageUrl}
//                     memeName={item.memeName}
//                     template={item.template}
//                     templateState={item.templateState}
//                     imageWidth={item.imageWidth}
//                     imageHeight={item.imageHeight}
//                     likesCount={item.likesCount}
//                     commentsCount={item.commentsCount}
//                 />
//             );
//         }
    



//         //NEED***NEED to make sure multiple instance of PinturaLoadImage are not created***
//         return (


//                 <View
//                     onTouchStart={e=> this.touchX = e.nativeEvent.pageX}
//                     onTouchEnd={e => {
//                     if (e.nativeEvent.pageX - this.touchX > 150)
//                         // console.log('Swiped Right')
//                         onGoBack();
//                     }}
//                     style={theme == 'light' ? styles.lightMainContainer : styles.darkMainContainer}
//                 >
                    
//                     {/* Load Meme with template and template state */}
//                     {
//                         !this.state.finished &&
                            
//                             <PinturaEditor
//                                 ref={this.editorRef}
                                
//                                 // src={image}
//                                 // onClose={() => console.log('closed')}
//                                 // onDestroy={() => console.log('destroyed')}
//                                 // onLoad={() => 
//                                 //     editorRef.current.editor.processImage(templateState)
//                                 // }

//                                 onInit={() => 
//                                     this.editorRef.current.editor.processImage(this.props.route.params.template, this.props.route.params.templateState)
//                                 }

//                                 onProcess={async({ dest }) => {
//                                         // console.log("processing image")
//                                         manipulateAsync(dest, [], ).then((res) => {
//                                             // setFinished({});
//                                             // setImage(res.uri);
//                                             this.setFinished();
//                                             this.setState({
//                                                 ...this.state,
//                                                 imageUrl: res.uri,
//                                             });
//                                         // console.log(res.uri)
//                                     })
//                                 }}
//                             />    
//                     }


//                     <RecyclerListView
//                         dataProvider={this.state.dataProvider}

//                         layoutProvider={this.layoutProvider}

//                         rowRenderer={rowRenderer}

//                         extendedState={{finished: this.state.finished}}

//                         forceNonDeterministicRendering={true}

//                         // onEndReachedThreshold={0.2}
//                         // onEndReached={() => }











//                         // data={commentsList}
                        
//                         // estimatedItemSize={400}
//                         // keyExtractor={(item, index) => item.id + '-' + index}
//                         // keyExtractor={keyExtractor}
//                         // extraData={finished}
//                         // stickyHeaderIndices={[1]}
//                         // renderItem={renderItem}

//                         //optimization
//                         // removeClippedSubviews={true}
//                         // initialNumToRender={10}
//                         // maxToRenderPerBatch={10}
//                         // windowSize={10}
//                         // updateCellsBatchingPeriod={100}
//                         // onEndReachedThreshold={0.5}
//                         // onEndReached={() => {}} //need to implement infinite scroll
//                     />


//                     {this.replyBottomSheet}

                    
                    
//                 </View>


//         );
//     }
// }

// const styles = StyleSheet.create({
//     header: {
//         height: HEADER_HEIGHT,
//         backgroundColor: 'lightblue',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     stickyHeader: {
//         height: STICKY_HEADER_HEIGHT,
//         backgroundColor: 'lightgreen',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     item: {
//         padding: 10,
//     },
//     profileImage: {
//         width: 40,
//         height: 40,
//         borderRadius: 50,
//         marginRight: 5,
//     },
//     lightMainContainer: {
//         flex: 1,
//         backgroundColor: '#F4F4F4',
//     },
//     darkMainContainer: {
//         flex: 1,
//         backgroundColor: '#0C0C0C',
//     },
//     lightContainer: {
//         backgroundColor: 'white',
//     },
//     darkContainer: {
//         backgroundColor: '#151515',
//     },
//     lightUserContainer: {
//         backgroundColor: 'white',
//         flexDirection: 'row',
//         marginTop: 16.5,
//         marginLeft: 13,
//         marginBottom: 7,
//         alignItems: 'center',
//         alignContent: 'center',
//         justifyContent: 'center',
//     },
//     darkUserContainer: {
//         backgroundColor: '#151515',
//         flexDirection: 'row',
//         marginTop: 16.5,
//         marginLeft: 13,
//         marginBottom: 7,
//         alignItems: 'center',
//         alignContent: 'center',
//         justifyContent: 'center',
//     },
//     lightUsername: {
//         fontSize: 16,
//         fontWeight: "600",
//         color: '#444444',
//         textAlign: "left",
//         marginBottom: 1,
//     },
//     darkUsername: {
//         fontSize: 16,
//         fontWeight: "600",
//         color: '#DDDDDD',
//         textAlign: "left",
//         marginBottom: 1,
//     },
//     lightRepostUsername: {
//         fontSize: 16,
//         fontWeight: "600",
//         color: '#777777',
//         textAlign: "left",
//     },
//     darkRepostUsername: {
//         fontSize: 16,
//         fontWeight: "600",
//         color: '#BBBBBB',
//         textAlign: "left",
//     },
//     lightPostTitle: {
//         fontSize: 22,
//         fontWeight: "600",
//         color: '#333333',
//         textAlign: 'auto',
//         marginHorizontal: 14,
//         // marginTop: 1,
//         // marginVertical: 2,
//         // width: 290,
//     },
//     darkPostTitle: {
//         fontSize: 22,
//         fontWeight: "600",
//         color: '#DDDDDD',
//         textAlign: 'auto',
//         marginHorizontal: 14,
//         // marginTop: 1,
//         // marginVertical: 2,
//         // width: 290,
//     },
//     lightFollowButton: {
//         flexDirection: 'column',
//         backgroundColor: '#ffffff',
//         borderRadius: 20,
//         width: 110,
//         height: 30,
//         marginLeft: 5,
//         marginTop: 12,
//         marginBottom: 10,
//         borderWidth: 1.5,
//         borderColor: '#888888'
//     },
//     darkFollowButton: {
//         flexDirection: 'column',
//         backgroundColor: '#1A1A1A',
//         borderRadius: 20,
//         width: 110,
//         height: 30,
//         marginLeft: 5,
//         marginTop: 12,
//         marginBottom: 10,
//         borderWidth: 1.5,
//         borderColor: '#888888'
//     },
//     lightFollowText: {
//         fontSize: 18,
//         color: '#222222',
//         fontWeight: '600',
//         alignSelf: 'center',
//         marginTop: 1
//     },
//     darkFollowText: {
//         fontSize: 18,
//         color: '#ffffff',
//         fontWeight: '600',
//         alignSelf: 'center',
//         marginTop: 1
//     },
//     lightPostText: {
//         fontSize: 18,
//         fontWeight: "400",
//         color: '#222222',
//         textAlign: 'auto',
//         marginHorizontal: 14,
//         marginTop: 6,
//     },
//     darkPostText: {
//         fontSize: 18,
//         fontWeight: "400",
//         color: '#F4F4F4',
//         textAlign: 'auto',
//         marginHorizontal: 14,
//         marginTop: 6,
//     },
    
// });
