

///
//
///
///
///
//

///
//
///
///
///
//

///
//
///
///
///
//

///
//
///
///
///
//

///
//
///
///
///
//

///
//
///
///
///
//

// import React, { useEffect, useRef, useState, useContext } from 'react';
// import { View, FlatList, LogBox, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
// import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';


// import { Image } from 'expo-image';
// import ResizableImage from '../shared/ResizableImage';

// import { fetchFirstTenPostCommentsByRecent, fetchFirstTenPostCommentsByPopular, fetchNextTenPopularComments } from '../shared/post/GetPostComments';

// import GlobalStyles from '../constants/GlobalStyles';
// import ContentBottom from '../components/postTypes/ContentBottom';
// import PostBottom from '../components/postTypes/PostBottom';
// import ReplyBottomSheet from '../components/replyBottom/PostReplyBottomSheet';

// import MainComment from '../components/commentTypes/MainComment';


// import SimpleTopBar from '../components/SimpleTopBar';

// import PinturaEditor from "@pqina/react-native-expo-pintura";



// const HEADER_HEIGHT = 200; 
// const STICKY_HEADER_HEIGHT = 50; 

// const windowWidth = Dimensions.get("screen").width;
// const windowHeight = Dimensions.get("screen").height;

// const contentBottom = (memeName, tags) => (
//     <ContentBottom
//         memeName={memeName}
//         tags={tags}
//     />
// );

// const replyBottomSheet = (navigation, postId, profile, username) => (
//     <ReplyBottomSheet
//         navigation={navigation}
//         replyToPostId = {postId}
//         replyToProfile = {profile}
//         replyToUsername={username}
//     />
// );

// const goToProfile = (navigation, profile, username, profilePic) => () => {
//     navigation.push('Profile', {
//         user: profile,
//         username: username,
//         profilePic: profilePic,
//     })
// }

// const PostScreen = ({navigation, route}) => {
//     const {theme,setTheme} = useContext(ThemeContext);
//     // const [commentsList, setCommentsList] = useState([{id: "one"}, {id: "two"}]);
//     const [commentsList, setCommentsList] = useState([]);
//     const {title, profile, likesCount, commentsCount, imageUrl, template, templateState, imageHeight, imageWidth, text, username, repostUsername, profilePic, postId, memeName, tags} = route.params;

//     const {imageReply, setImageReply} = useContext(AuthenticatedUserContext);

//     const [image, setImage] = useState(imageUrl ? imageUrl : template);
//     const [finished, setFinished] = useState(template ? false : true);
//     const [updating, setUpdating] = useState(false);

//     const flatListRef = useRef(null);
//     const editorRef = useRef(null);

//     useEffect(() => {
//         getFirstTenPostCommentsByPopular();

//         LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

//         navigation.setOptions({
//             header: () => <SimpleTopBar title={"Back"}/>
//         });
//     }, []);


//     const getFirstTenPostCommentsByPopular = React.useCallback(async() => {
//         await fetchFirstTenPostCommentsByPopular(postId).then((comments) => {
            
//             setCommentsList(comments);
            
//         });
//     }, []);

//     const getNextTenPopularComments = () => {
//         console.log("fetch next ten comments by popular after ", commentsList[commentsList.length-1])
//         fetchNextTenPopularComments(postId, commentsList[commentsList.length-1]).then((comments) => {
            

//         setCommentsList(commentsList => [...commentsList, ...comments]);
            
            
//         });
//     };

//     const onGoBack = React.useCallback(() => {
//         if(imageReply && imageReply.forCommentOnPost){
//             setImageReply(null)
//         }
//         navigation.goBack(null);
//     }, [imageReply]);

//     //  Load Meme with template and template state
//     // Load Meme with template and template state
//     const CreateMeme = React.memo(({image}) => {
//         return (
//             <PinturaEditor
//                 ref={editorRef}
                
//                 // src={image}
//                 // onClose={() => console.log('closed')}
//                 // onDestroy={() => console.log('destroyed')}
//                 // onLoad={() => 
//                 //     editorRef.current.editor.processImage(templateState)
//                 // }
//                 onInit={() => 
//                     editorRef.current.editor.processImage(image, templateState)
//                 }
//                 onProcess={async({ dest }) => {
//                     manipulateAsync(dest, [], ).then((res) => {
//                         setFinished(true);
//                         setImage(res.uri);
//                         // console.log(res.uri)
//                     })
//                 }}
//             />    
//         )
//     }, imageEquals)

//     const imageEquals = React.useCallback((prev, next) => {
//         return prev.image === next.image
//     }, [])

//     const Header = React.memo(({image}) => {
//         return (
//             <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
//                 <View 
//                     style={theme == 'light' ? styles.lightUserContainer : styles.darkUserContainer}
//                 >
//                     {/* profile pic */}
//                     <TouchableOpacity
//                         activeOpacity={1}
//                         onPress={goToProfile(navigation, profile, username, profilePic)}
//                     >
//                         {profilePic != "" ? (
//                             <Image source={{ uri: profilePic }} style={styles.profileImage} cachePolicy={'disk'}/>
//                         ) : (
//                             <Image source={require('../../assets/profile_default.png')} style={styles.profileImage} cachePolicy='disk'/>
//                         )}
//                     </TouchableOpacity>
                    
//                     {/* username */}
//                     <TouchableOpacity
//                         activeOpacity={1}
//                         style={{flex: 1, flexDirection: 'column'}}
//                         onPress={goToProfile(navigation, profile, username, profilePic)}
//                     >
//                         <Text style={theme == 'light' ? styles.lightUsername: styles.darkUsername}>
//                             @{username}
//                         </Text>
//                     </TouchableOpacity>

//                 </View>


//                 <View style={{marginBottom: 8}}>

//                     {text &&
//                         <Text style={theme == "light" ? styles.lightPostText : styles.darkPostText}>
//                             {text}
//                         </Text>
//                     }

//                      <ResizableImage 
//                         image={image}
//                         height={imageHeight}
//                         width={imageWidth}
//                         maxWidth={windowWidth}
//                         style={{marginTop: 14, borderRadius: 0, alignSelf: 'center'}}
//                     />
                    
//                     {/* Content bottom */}
//                     <View style={{marginLeft: 5, marginTop: 5, marginBottom: 0}}>
//                         {contentBottom(memeName, tags)}
//                     </View>

//                 </View>
                
//             </View>
//         );
//     }, imageEquals);

    

//     // try to get this to work
//     const Item = React.memo(({item})=>{
//         return (
//             <MainComment
//                 replyToPostId={postId}
//                 profile={item.profile}
//                 username={item.username}
//                 profilePic={item.profilePic}
//                 commentId={item.id}
//                 text={item.text}
//                 imageUrl={item.imageUrl}
//                 memeName={item.memeName}
//                 template={item.template}
//                 templateState={item.templateState}
//                 imageWidth={item.imageWidth}
//                 imageHeight={item.imageHeight}
//                 likesCount={item.likesCount}
//                 commentsCount={item.commentsCount}
//             />
//         );
//     }, itemEquals);

//     const itemEquals = React.useCallback((prev, next) => {
//         return prev.item.id === next.item.id
//     }, [])

//     const renderItem = React.useCallback(({ item, index }) => {
        
//         // index 0 is the header continng the profile pic, username, title and post content
//         if (index === 0) {
//             return (
//                 <Header image={image}/>
//             );
//         }else if (index === 1) {
//             return (
//                 <View style={[theme == 'light' ? styles.lightContainer : styles.darkContainer, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]}>
//                     <PostBottom
//                         postId={postId}
//                         likesCount={likesCount}
//                         commentsCount={commentsCount}
//                     />
//                 </View>
//             );
//         }else if (index > 2 && index % 2 == 1){
//             // <ListCommentBottom 
//             //     key={item.id}
//             //     profile={item.profile}
//             //     username={item.username}
//             //     profilePic={item.profilePic}
//             //     commentId={item.id}
//             //     text={item.text}
//             //     imageUrl={item.imageUrl}
//             //     memeName={item.memeName}
//             //     template={item.template}
//             //     templateState={item.templateState}
//             //     imageWidth={item.imageWidth}
//             //     imageHeight={item.imageHeight}
//             //     likesCount={item.likesCount}
//             //     commentsCount={item.commentsCount}
//             // />
//         }else if(index % 2 == 0){
//             return (
//                 <Item item={item}/>
//             );
//         }

//         // return (
//         //     <Item item={item}/>
//         // );
//     }, []);

//     // called when onEndReached shouldn't be called since there are no more items to get
//     const dummyFunction = React.useCallback(() => () => {
//         return true;
//     }, [])

    
//     // if(commentsList.length < 2){
//     //     return null
//     // }

    
//     const keyExtractor = React.useCallback((item, index) => item.id.toString + "-" + index.toString(), [])
//     return (
//         <View
//             onTouchStart={e=> this.touchX = e.nativeEvent.pageX}
//             onTouchEnd={e => {
//             if (e.nativeEvent.pageX - this.touchX > 150)
//                 // console.log('Swiped Right')
//                 onGoBack();
//             }}
//             style={theme == 'light' ? styles.lightMainContainer : styles.darkMainContainer}
//         >
//             {/* Load Meme with template and template state */}
//             {!finished && <CreateMeme image={image}/>}
            
//             <FlatList
//                 ref={flatListRef}
//                 data={commentsList}
                
//                 onEndReached={commentsList.length >= 10 ?  getNextTenPopularComments : dummyFunction}
//                 // onEndReachedThreshold={2} //need to implement infinite scroll

//                 stickyHeaderIndices={[1]}
//                 renderItem={renderItem}

//                 // showsVerticalScrollIndicator={false}


//                 // estimatedItemSize={400}
//                 // estimatedListSize={{height: windowHeight ,  width: windowWidth}}

//                 ListFooterComponent={
//                     <View style={{height: 200}}/>
//                 }

//                 keyExtractor={keyExtractor}

//                 // optimizations
//                 initialNumToRender={10}
//                 maxToRenderPerBatch={50}
//                 windowSize={50}
//                 // updateCellsBatchingPeriod={100}
//                 // removeClippedSubviews={true}
                

//             />

//             {replyBottomSheet(navigation, postId, profile, username)}

//         </View>
//     );
// };

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
//         // backgroundColor: '#0C0C0C',
//         backgroundColor: '#000000',
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
//         fontWeight: "600",
//         alignSelf: 'center',
//         marginTop: 1
//     },
//     darkFollowText: {
//         fontSize: 18,
//         color: '#ffffff',
//         fontWeight: "600",
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

// export default PostScreen;





//////
////
//////
////
//////
////
//////
////
//////
////
//////
////
//////
////
//////
////
//////
////
//////
////
//////
////
//////
////
//////
////
//////
////
//////
////
//////
////
//////
////
//////
////
//////
////
//////
////
//////
////






///////
////
////
///////
////
////
///////
////
////
///////
////
////
///////
////
////
///////
////
////
///////
////
////
///////
////
////
///////
////
////
///////
////
////
///////
////
////
///////
////
// ////

// import React, { useEffect, useRef, useState, useContext } from 'react';
// import { View, LogBox, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
// import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';
// import Animated, { SlideInDown } from 'react-native-reanimated';

// import { FlashList } from '@shopify/flash-list';

// import { Image } from 'expo-image';
// import ResizableImage from '../shared/ResizableImage';

// import { fetchFirstTenPostCommentsByRecent, fetchFirstTenPostCommentsByPopular, fetchNextTenPopularComments } from '../shared/post/GetPostComments';

// import GlobalStyles from '../constants/GlobalStyles';
// import ContentBottom from '../components/postTypes/ContentBottom';
// import PostBottom from '../components/postTypes/PostBottom';
// import ReplyBottomSheet from '../components/replyBottom/PostReplyBottomSheet';

// import MainComment from '../components/commentTypes/MainComment';

// import SimpleTopBar from '../components/SimpleTopBar';

// import PinturaEditor from "@pqina/react-native-expo-pintura";

// import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';




// const HEADER_HEIGHT = 200; 
// const STICKY_HEADER_HEIGHT = 50; 

// const windowWidth = Dimensions.get("screen").width;
// const windowHeight = Dimensions.get("screen").height;

// const contentBottom = (memeName, tags) => (
//     <ContentBottom
//         memeName={memeName}
//         tags={tags}
//     />
// );

// const replyBottomSheet = (navigation, postId, profile, username) => (
//     <ReplyBottomSheet
//         navigation={navigation}
//         replyToPostId = {postId}
//         replyToProfile = {profile}
//         replyToUsername={username}
//     />
// );

// const goToProfile = (navigation, profile, username, profilePic) => () => {
//     navigation.push('Profile', {
//         user: profile,
//         username: username,
//         profilePic: profilePic,
//     })
// }

// const PostScreen = ({navigation, route}) => {
//     const {theme,setTheme} = useContext(ThemeContext);
//     const [commentsList, setCommentsList] = useState([{id: "one"}, {id: "two"}]);
//     // const [commentsList, setCommentsList] = useState([]);
//     const {title, profile, likesCount, commentsCount, imageUrl, template, templateState, imageHeight, imageWidth, text, username, repostUsername, profilePic, postId, memeName, tags} = route.params;

//     const {imageReply, setImageReply} = useContext(AuthenticatedUserContext);

//     const [image, setImage] = useState(imageUrl ? imageUrl : template);
//     const [finished, setFinished] = useState(template ? false : true);
//     const [updating, setUpdating] = useState(false);

//     const [layoutProvider] = React.useState(
//         new LayoutProvider(index => {

//                 // if (this.state.dataProvider.getDataForIndex(index)) {
//                 //     return "header";
                    
//                 // }
//                 return index

//             }
//         , (type, dim) => {
//                 dim.width = windowWidth; //change this
//                 dim.height = 1000; //change this
//         })
//     )

//     const ListRef = useRef(null);
//     const editorRef = useRef(null);

//     useEffect(() => {
//         layoutProvider.shouldRefreshWithAnchoring = false;

//         getFirstTenPostCommentsByPopular();

//         LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

//         navigation.setOptions({
//             header: () => <SimpleTopBar title={"Back"}/>
//         });
//     }, []);


//     const getFirstTenPostCommentsByPopular = React.useCallback(async() => {
//         await fetchFirstTenPostCommentsByPopular(postId).then((comments) => {
            
//             setCommentsList(comments);
            
//         });
//     }, []);

//     const getNextTenPopularComments = () => {
//         if(commentsList.length < 3){
//             return null
//         }
//         // console.log("fetch next ten comments by popular after ", commentsList[commentsList.length-1])
//         fetchNextTenPopularComments(postId, commentsList[commentsList.length-1]).then((comments) => {
            
//             setCommentsList(commentsList => [...commentsList, ...comments]);
            
//         });
//     };

//     const onGoBack = React.useCallback(() => {
//         if(imageReply && imageReply.forCommentOnPost){
//             setImageReply(null)
//         }
//         navigation.goBack(null);
//     }, [imageReply]);

//     //  Load Meme with template and template state
//     // Load Meme with template and template state
//     const CreateMeme = React.memo(({image}) => {
//         return (
//             <PinturaEditor
//                 ref={editorRef}
                
//                 // src={image}
//                 // onClose={() => console.log('closed')}
//                 // onDestroy={() => console.log('destroyed')}
//                 // onLoad={() => 
//                 //     editorRef.current.editor.processImage(templateState)
//                 // }
//                 onInit={() => 
//                     editorRef.current.editor.processImage(image, templateState)
//                 }
//                 onProcess={async({ dest }) => {
//                     manipulateAsync(dest, [], ).then((res) => {
//                         setFinished(true);
//                         setImage(res.uri);
//                         // console.log(res.uri)
//                     })
//                 }}
//             />    
//         )
//     }, imageEquals)

//     const imageEquals = React.useCallback((prev, next) => {
//         return prev.image === next.image
//     }, [])

//     const Header = React.memo(({image}) => {
//         return (
//             <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
//                 <View 
//                     style={theme == 'light' ? styles.lightUserContainer : styles.darkUserContainer}
//                 >
//                     {/* profile pic */}
//                     <TouchableOpacity
//                         activeOpacity={1}
//                         onPress={goToProfile(navigation, profile, username, profilePic)}
//                     >
//                         {profilePic != "" ? (
//                             <Image source={{ uri: profilePic }} style={styles.profileImage} cachePolicy={'disk'}/>
//                         ) : (
//                             <Image source={require('../../assets/profile_default.png')} style={styles.profileImage} cachePolicy='disk'/>
//                         )}
//                     </TouchableOpacity>
                    
//                     {/* username */}
//                     <TouchableOpacity
//                         activeOpacity={1}
//                         style={{flex: 1, flexDirection: 'column'}}
//                         onPress={goToProfile(navigation, profile, username, profilePic)}
//                     >
//                         <Text style={theme == 'light' ? styles.lightUsername: styles.darkUsername}>
//                             @{username}
//                         </Text>
//                     </TouchableOpacity>

//                 </View>


//                 <View style={{marginBottom: 8}}>

//                     {text &&
//                         <Text style={theme == "light" ? styles.lightPostText : styles.darkPostText}>
//                             {text}
//                         </Text>
//                     }

//                      <ResizableImage 
//                         image={image}
//                         height={imageHeight}
//                         width={imageWidth}
//                         maxWidth={windowWidth}
//                         style={{marginTop: 14, borderRadius: 0, alignSelf: 'center'}}
//                     />
                    
//                     {/* Content bottom */}
//                     <View style={{marginLeft: 5, marginTop: 5, marginBottom: 0}}>
//                         {contentBottom(memeName, tags)}
//                     </View>

//                 </View>
                
//             </View>
//         );
//     }, imageEquals);

    

//     // try to get this to work
//     const Item = React.memo(({item, index})=>{
//         return (
//             <MainComment
//                 replyToPostId={postId}
//                 profile={item.profile}
//                 username={item.username}
//                 profilePic={item.profilePic}
//                 commentId={item.id}
//                 text={item.text}
//                 imageUrl={item.imageUrl}
//                 memeName={item.memeName}
//                 template={item.template}
//                 templateState={item.templateState}
//                 imageWidth={item.imageWidth}
//                 imageHeight={item.imageHeight}
//                 likesCount={item.likesCount}
//                 commentsCount={item.commentsCount}
//                 index={index}
//             />
//         );
//     }, itemEquals);

//     const itemEquals = React.useCallback((prev, next) => {
//         return prev.item.id === next.item.id
//     }, []);

//     const dataProvider = new DataProvider((r1, r2) => {
//         return r1 !== r2;
//     }).cloneWithRows(commentsList);


//     const rowRenderer = React.useCallback((type, item, index, extendedState) => {

//         // index 0 is the header continng the profile pic, username, title and post content
//         if (index === 0) {
//             return (
//                 <Header image={image}/>
//             );
//         }else if (index === 1) {
//             return (
//                 <View style={[theme == 'light' ? styles.lightContainer : styles.darkContainer, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]}>
//                     <PostBottom
//                         postId={item.replyToPostId}
//                         likesCount={likesCount}
//                         commentsCount={commentsCount}
//                     />
//                 </View>
//             );
//         }

//         return (
//             <Item item={item} index={index}/>
//         );
//     }, []);

//     // called when onEndReached shouldn't be called since there are no more items to get
//     const dummyFunction = React.useCallback(() => () => {
//         return true;
//     }, [])

//     const Footer = React.useCallback(() => {
//         return <View style={{height: 200}}/>
//     }, [])


//     return (
//         <View
//             onTouchStart={e=> this.touchX = e.nativeEvent.pageX}
//             onTouchEnd={e => {
//             if (e.nativeEvent.pageX - this.touchX > 150)
//                 // console.log('Swiped Right')
//                 onGoBack();
//             }}

//             // removeClippedSubviews={true} //check if this helps or causes problems
//             style={theme == 'light' ? styles.lightMainContainer : styles.darkMainContainer}
//         >
//             {/* Load Meme with template and template state */}
//             {!finished && <CreateMeme image={image}/>}
            
//             <RecyclerListView
//                 ref={ListRef}

//                 dataProvider={dataProvider}

//                 layoutProvider={layoutProvider}

//                 rowRenderer={rowRenderer}

//                 extendedState={{finished: finished, commentsList: commentsList}}

//                 forceNonDeterministicRendering={true}

//                 // onEndReachedThreshold={0.5} // Might Change later
//                 onEndReachedThresholdRelative={1} // Might Change later
//                 onEndReached={getNextTenPopularComments}

//                 canChangeSize={true} //Check if its really needed

//                 layoutSize={{height: windowHeight ,  width: windowWidth}}

//                 renderFooter={Footer}
                
//                 initialRenderIndex={0}

//                 // setHasFixedSize={true}

//                 // renderAheadOffset={1000}


//             />

//             {replyBottomSheet(navigation, postId, profile, username)}

//         </View> 
//     );
// };

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
//         // backgroundColor: '#0C0C0C',
//         backgroundColor: '#000000',
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
//         fontWeight: "600",
//         alignSelf: 'center',
//         marginTop: 1
//     },
//     darkFollowText: {
//         fontSize: 18,
//         color: '#ffffff',
//         fontWeight: "600",
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

// export default PostScreen;





































/////
////
/////
/////
////
//////////
////
//////////
////
//////////
////
//////////
////
//////////
////
//////////
////
//////////
////
//////////
////
//////////
////
//////////
////
//////////
////
//////////
////
//////////
////
//////////
////
//////////
////
//////////
////
//////////
////
//////////
////
/////






// import React, { Component, useEffect, useRef, useCallback,  useState, useContext } from 'react';
// import { View, LogBox, FlatList, TouchableOpacity, Text, StyleSheet, Dimensions, Alert } from 'react-native';
// import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';



// import { Image } from 'expo-image';
// import ResizableImage from '../shared/ResizableImage';

// import { fetchFirstTenPostCommentsByRecent, fetchNextTenPopularComments, fetchFirstTenPostCommentsByPopular } from '../shared/post/GetPostComments';

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
//             commentsList: [{id: "one"}, {id: "two"}],
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



    
//     // called when onEndReached shouldn't be called since there are no more items to get
//     dummyFunction =() => () => {
//         return true;
//     }

//     getNextTenPopularComments =async() => {

//         if(this.state.commentsList.length < 3){
//             return;
//         }

//         const comments = await fetchNextTenPopularComments(this.props.route.params.postId, this.state.commentsList[this.state.commentsList.length-1]);
//         console.log(comments)
//         this.setState({
//             ...this.state,
//             dataProvider: this.state.dataProvider.cloneWithRows([...this.state.commentsList, ...comments]),
//             commentsList: [...this.state.commentsList, ...comments],
//         });
//     };

//     Header =({image}) => {
//         return (
//             <View style={this.context.theme == 'light' ? styles.lightContainer : styles.darkContainer}>
//                     <View style={this.context.theme == 'light' ? styles.lightUserContainer : styles.darkUserContainer}>

//                         {/* profile pic */}
//                         <TouchableOpacity
//                             onPress={() => 
//                                 this.props.navigation.push('Profile', {
//                                         user: this.props.route.params.profile,
//                                     })
//                             }
//                         >
//                             {this.props.route.params.profilePic != "" ? (
//                                 <Image source={{ uri: this.props.route.params.profilePic }} style={styles.profileImage} cachePolicy={'disk'}/>
//                             ) : (
//                                 <Image source={require('../../assets/profile_default.png')} style={styles.profileImage} cachePolicy='disk'/>
//                             )}
//                         </TouchableOpacity>
                        
//                         {/* username */}
//                         <TouchableOpacity
//                             style={{flex: 1, flexDirection: 'column'}}
//                             onPress={() => 
//                                 this.props.navigation.push('Profile', {
//                                         user: this.props.route.params.profile,
//                                     })
//                             }
//                         >
//                             <Text style={this.context.theme == 'light' ? styles.lightUsername : styles.darkUsername}>
//                                 @{this.props.route.params.username}
//                             </Text>
//                         </TouchableOpacity>

//                     </View>


//                     <View style={{marginBottom: 8}}>

//                         {this.props.route.params.text &&
                        
//                             <Text style={this.context.theme == 'light' ? styles.lightPostText : styles.darkPostText}>
//                                 {this.props.route.params.text}
//                             </Text>
//                         }


//                         <ResizableImage 
//                             image={image}
//                             height={this.props.route.params.imageHeight}
//                             width={this.props.route.params.imageWidth}
//                             maxWidth={windowWidth}
//                             style={{marginTop: 14, borderRadius: 0, alignSelf: 'center'}}
//                         />


//                         {/* Content bottom */}
//                         <View style={{marginLeft: 5, marginTop: 5, marginBottom: 0}}>
//                             {this.contentBottom}
//                         </View>

//                     </View>
                    
//                 </View>
//         );
//     }

//     // try to get this to work
//     Item =({item})=>{
//         return (
//             <MainComment
//                 replyToPostId={item.replyToPostId}
//                 profile={item.profile}
//                 username={item.username}
//                 profilePic={item.profilePic}
//                 commentId={item.id}
//                 text={item.text}
//                 imageUrl={item.imageUrl}
//                 memeName={item.memeName}
//                 template={item.template}
//                 templateState={item.templateState}
//                 imageWidth={item.imageWidth}
//                 imageHeight={item.imageHeight}
//                 likesCount={item.likesCount}
//                 commentsCount={item.commentsCount}
//             />
//         );
//     }
//     render(){
//         const {theme, setTheme} = this.context 
//         // const {theme,setTheme} = useContext(ThemeContext);
//         // const [commentsList, setCommentsList] = useState([{id: "one"}, {id: "two"}]);

//         // const {imageReply, setImageReply} = useContext(AuthenticatedUserContext);



    

//         const rowRenderer =(type, item, index, extendedState) => {

//             // index 0 is the header continng the profile pic, username, title and post content
//             if (index === 0) {
//                 return (
//                     <this.Header image={this.state.imageUrl}/>
//                 );
//             }else if (index === 1) {
//                 return (
//                     <View style={[theme == 'light' ? styles.lightContainer : styles.darkContainer, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]}>
//                         <PostBottom
//                             postId={item.replyToPostId}
//                             likesCount={this.props.route.params.likesCount}
//                             commentsCount={this.props.route.params.commentsCount}
//                         />
//                     </View>
//                 );
//             }
    
//             return (
//                 <this.Item item={item}/>
//             );
//         };
        
    
        


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
//                     {/* {!this.state.finished && <CreateMeme image={this.state.imageUrl}/>} */}


//                     <RecyclerListView
//                         dataProvider={this.state.dataProvider}

//                         layoutProvider={this.layoutProvider}

//                         rowRenderer={rowRenderer}

//                         extendedState={{finished: this.state.finished, commentsList: this.state.commentsList}}

//                         forceNonDeterministicRendering={true}

//                         onEndReachedThreshold={.1}
//                         onEndReachedThresholdRelative={0.2}
//                         onEndReached={this.getNextTenPopularComments}











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
//         fontWeight: "600",
//         alignSelf: 'center',
//         marginTop: 1
//     },
//     darkFollowText: {
//         fontSize: 18,
//         color: '#ffffff',
//         fontWeight: "600",
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
