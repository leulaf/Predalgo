// import React, { } from 'react';
// import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
// import { Image } from 'expo-image';
// import {ThemeContext, AuthenticatedUserContext} from '../../../context-store/context';
// import { Overlay } from 'react-native-elements';
// import { useNavigation } from '@react-navigation/native';
// import onShare from '../../shared/post/SharePost';

// import TitleText from '../../shared/Text/TitleText';

// import PostText from '../../shared/Text/PostText';

// import Animated, {FadeIn} from 'react-native-reanimated';

// import GlobalStyles from '../../constants/GlobalStyles';

// import ContentBottom from './ContentBottom';
// import PostBottom from './PostBottom';

// import DeleteIcon from '../../../assets/trash_delete.svg';
// import ReportIcon from '../../../assets/danger.svg';

// import ThreeDotsLight from '../../../assets/three_dots_light.svg';
// import ThreeDotsDark from '../../../assets/three_dots_dark.svg';

// // import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'; // repost icon "repeat"

// import Repost from '../../../assets/repost.svg';

// import { getAuth } from 'firebase/auth';

// const auth = getAuth();

// const onNavToPost =  (navigation, postId, title, tags, profile, reposterProfile, profilePic, reposterProfilePic, username, reposterUsername, imageUrl, template, templateUploader, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount,) => () => {
//     navigation.push('Post', {
//         postId: postId,
//         title: title,
//         tags: tags,
//         imageUrl: imageUrl,
//         memeName: memeName,
//         template: template,
//         templateUploader: templateUploader ? templateUploader : null,
//         templateState: null,
//         imageHeight: imageHeight,
//         imageWidth: imageWidth,
//         text: text,
//         likesCount: likesCount,
//         commentsCount: commentsCount,
//         profile: profile,
//         reposterProfile: reposterProfile,
//         username: username,
//         reposterUsername: reposterUsername,
//         profilePic: profilePic,
//         reposterProfilePic: reposterProfilePic,
//     });
// }


// const navToMeme = (navigation, memeName, template, templateUploader, imageHeight, imageWidth) => () => {
//     navigation.navigate('Meme', {
//         uploader: templateUploader,
//         memeName: memeName,
//         template: template,
//         height: imageHeight,
//         width: imageWidth,
//     })
// }


// const goToProfile = (navigation, profile, username, profilePic) => () => {
//     navigation.push('Profile', {
//         profile: profile,
//         username: username,
//         profilePic: profilePic,
//     })
// }


// const RepostContainer = ({ title, imageUrl, imageHeight, imageWidth, text, memeName, template, templateUploader, templateState, likesCount, commentsCount, repostsCount, tags, content, profile, reposterProfile, postId, repostId, profilePic, reposterProfilePic, username, reposterUsername, repostComment }) => {
//     const navigation = useNavigation();
//     const {theme,setTheme} = React.useContext(ThemeContext);

//     const [deleted, setDeleted] = React.useState(false);

//     const {options, setOptions} = React.useContext(AuthenticatedUserContext);

//     let threeDots
    
//     if(theme == 'light'){
//         threeDots = <ThreeDotsLight width={40} height={40} style={styles.lightThreeDots}/>
//     }else{
//         threeDots = <ThreeDotsDark width={40} height={40} style={styles.darkThreeDots}/>
//     }
    

//     React.useEffect(() => {
//         if(options && options?.postId === postId && options.deleted === true){
//              // console.log(options)
//              // console.log('comment is deleted');
//              setDeleted(true)
//              setOptions(false);
//          }
//          if(options && options?.postId === postId && !(options?.text || (options?.image && imageUrl)) ){
//              // const watermarked = getWatermarkedImage(image, '../../../assets/add.svg');
 
//              setOptions({
//                  ...options,
//                  image: imageUrl,
//                  text: text,
//              });
//          }
//     }, [options]);


//     const clickedThreeDots = React.useCallback(() => () => {
//         if(repostComment){
//             setOptions({
//                 postId: repostId,
//                 profile: reposterProfile,
//                 image: imageUrl,
//                 text: text,
//             })
//         }else{
//             setOptions({
//                 postId: postId,
//                 repostId: repostId,
//                 profile: profile,
//                 image: imageUrl,
//                 text: text,
//             })
//         }
        
//     }, []);


//     const postBottom = (
//         <PostBottom
//             theme={theme}
//             postId={postId}
//             username={username}
//             profilePic={profilePic}
//             likesCount={likesCount}
//             commentsCount={commentsCount}
//             repostsCount={repostsCount}
//             onShare={onShare(text, imageUrl)}
//             navToPost={() => onNavToPost(navigation, postId, title, tags, profile, reposterProfile, profilePic, reposterProfilePic, username, reposterUsername, imageUrl, template, templateUploader, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
//         />
//     )
    
    
//     const contentBottom = (
//         <ContentBottom
//             memeName={memeName}
//             tags={tags}
//             navToPost={onNavToPost(navigation, postId, title, tags, profile, reposterProfile, profilePic, reposterProfilePic, username, reposterUsername, imageUrl, template, templateUploader, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
//             navToMeme={navToMeme(navigation, memeName, template, templateUploader, imageHeight, imageWidth)}
//             templateUploader={templateUploader}
//         />
//     )
//     // if post is deleted or content is null, don't show post
//     if (deleted || content == null || content == undefined) {  
//         return null;
//     }

//     return (
//         <Animated.View
//             entering={FadeIn} 
//             style={theme == 'light' ? GlobalStyles.lightPostContainer: GlobalStyles.darkPostContainer}
//         >

//             {/* profile pic, username and title*/}
//             <View 
//                 style={{flexDirection: 'row', marginLeft: 10, marginTop: !reposterProfile && 10, alignItems: 'center', justifyContent: 'center', alignContent: 'center'}}
//             >
//                 {/* profile pic */}
//                 <TouchableOpacity
//                     activeOpacity={0.9}
//                     onPress={goToProfile(navigation, profile, username, profilePic)}
//                 >
//                     {profilePic != "" ? (
//                         <Image source={{ uri: profilePic }} style={styles.profileImage}/>
//                     ) : (
//                         <Image source={require('../../../assets/profile_default.png')} style={styles.profileImage} cachePolicy='disk'/>
//                     )}
//                 </TouchableOpacity>
                
//                 {/* username */}
//                 <TouchableOpacity
//                     activeOpacity={0.9}
//                     onPress={goToProfile(navigation, profile, username, profilePic)}

//                     style={{flexDirection: 'column', marginLeft: 5, alignItems: 'center', justifyContent: 'center', alignContent: 'center'}}
//                 >

//                     {/* username */}
//                     <Text style={theme == 'light' ? styles.lightUsername: styles.darkUsername}>
//                         @{username}
//                     </Text>


//                 </TouchableOpacity>
                
//                 <TouchableOpacity
//                     activeOpacity={0.9}
//                     onPress={onNavToPost(navigation, postId, title, tags, profile, reposterProfile, profilePic, reposterProfilePic, username, reposterUsername, imageUrl, template, templateUploader, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
//                     style={{flex: 1, height: 40}}
//                 />


                
//                 {/* three dots */}
//                 <TouchableOpacity 
//                     activeOpacity={0.9}
//                     style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 15, paddingLeft: 15, paddingRight: 10, }}
//                     // onPress= {toggleOverlay()}
//                     onPress= {clickedThreeDots()}
//                 >
//                     {threeDots}
//                 </TouchableOpacity>
//             </View>


//             {/* Repost comment */}
//             {/* <TouchableOpacity
//                 activeOpacity={0.9}
//                 onPress={onNavToPost(navigation, postId, title, tags, profile, reposterProfile, profilePic, reposterProfilePic, username, reposterUsername, imageUrl, template, templateUploader, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
//             > */}

//                 {/* Repost comment */}
//                 {/* <PostText repostComment={repostComment} numberOfLines={15}/>

//             </TouchableOpacity> */}
                
            
//             {/* Post content. Image, Text etc. */}
//             {/* <TouchableOpacity
//                 activeOpacity={0.9}
//                 onPress={onNavToPost(navigation, postId, title, tags, profile, reposterProfile, profilePic, reposterProfilePic, username, reposterUsername, imageUrl, template, templateUploader, templateState, memeName, imageHeight, imageWidth, text, likesCount, commentsCount)}
//             > */}

//                 {content}

//             {/* </TouchableOpacity> */}


//             {/* tags and meme name */}
//             {contentBottom}


//             {/* likes, comments, repost, share */}
//             {postBottom}

//         </Animated.View>
//     );
// }

// const styles = StyleSheet.create({
//     lightThreeDots: {
//         // marginLeft: 365,
//         color: '#000',
//         marginTop: -20,

//         // marginHorizontal: 10,
//     },
//     darkThreeDots: {
//         // marginLeft: 365,
//         color: '#FFF',
//         marginTop: -20,
//         // marginHorizontal: 10,
//     },
//     profileImage: {
//         width: 40,
//         height: 40,
//         borderRadius: 50,
//         // marginLeft: 10,
//         // marginRight: 6,
//         // marginVertical: 10,
//     },
//     memeName: {
//         width: 170,
//         marginTop: 8,
//         marginLeft: 0,
//         flexDirection: 'row',
//     },
//     lightUsername: {
//         fontSize: 16,
//         fontWeight: "600",
//         color: '#444444',
//         textAlign: "left",
//         // marginTop: 6,
//     },
//     darkUsername: {
//         fontSize: 16,
//         fontWeight: "600",
//         color: '#DDDDDD',
//         textAlign: "left",
//         // marginTop: 6,
//     },
//     lightReposterUsername: {
//         fontSize: 16,
//         fontWeight: "600",
//         color: '#555',
//         marginLeft: 8,
//         marginTop: 9,
//     },
//     darkReposterUsername: {
//         fontSize: 16,
//         fontWeight: "600",
//         color: '#CCC',
//         textAlign: "left",
//         marginLeft: 8,
//         marginTop: 9,
//     },
//     lightRepostIcon: {
//         color: "#606060",
//         marginLeft: 11,
//         marginTop: 10
//     },
//     darkRepostIcons: {
//         color: "#BBB",
//         marginLeft: 11,
//         marginTop: 10
//     },
//     lightPostTitle: {
//         fontSize: 22,
//         fontWeight: "600",
//         color: '#333333',
//         marginHorizontal: 12,
//         marginTop: 3,
//         // marginBottom: 1,
//         // width: 290,
//     },
//     darkPostTitle: {
//         fontSize: 22,
//         fontWeight: "600",
//         color: '#DDDDDD',
//         textAlign: "left",
//         marginHorizontal: 12,
//         marginTop: 3,
//         // marginBottom: 10,
//         // width: 290,
//     },
//     overlayText: {
//         fontSize: 22,
//         fontWeight: "500",
//         color: '#000000',
//         alignSelf: 'center',
//         marginHorizontal: 10,
//     },
// });

// export default RepostContainer;
