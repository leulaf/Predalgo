import React, {useContext} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image, UIManager, findNodeHandle} from 'react-native';
import {ThemeContext} from '../../context-store/context';




// light mode icons
import Likes from '../../assets/likes.svg';
import Dislikes from '../../assets/dislikes.svg';
import Comments from '../../assets/comments.svg';
import Share from '../../assets/share.svg';


// dark mode icons
import LikesDark from '../../assets/likes_dark.svg';
import DislikesDark from '../../assets/dislikes_dark.svg';
import CommentsDark from '../../assets/comments_dark.svg';
import ShareDark from '../../assets/share_dark.svg';


const SideBar = ({navigation, profile, likeCount, dislikeCount, commentCount, sharePost}) => {
   const {theme,setTheme} = useContext(ThemeContext);
   let likes, dislikes, comments, share


   if(theme == 'light'){
       likes = <Likes width={35} height={35} style={{ marginTop: 5, marginBottom: 7, marginHorizontal: 10}}/>;
       dislikes = <Dislikes width={35} height={35} style={{ marginTop: 7, marginBottom: 5, marginRight: 3}}/>;
       comments = <Comments width={35} height={35} style={{  marginTop: 3, marginBottom: 2, alignSelf: "center"}}/>;
       share = <Share width={30} height={30} style={{ marginTop: 10, marginBottom: 2, alignSelf: "center", marginRight: 3}}/>;
   }else{
       likes = <LikesDark width={35} height={35} style={{ marginTop: 5, marginBottom: 7, marginHorizontal: 10}}/>;
       dislikes = <DislikesDark width={35} height={35} style={{ marginTop: 7, marginBottom: 5, marginRight: 3}}/>;
       comments = <CommentsDark width={35} height={35} style={{  marginTop: 3, marginBottom: 2, alignSelf: "center"}}/>;
       share = <ShareDark width={30} height={30} style={{ marginTop: 10, marginBottom: 2, alignSelf: "center", marginRight: 3}}/>;
   }


   return (
       <View style={{
           flexDirection: "column",
           alignItems: "center",
           marginTop: 285,
           marginLeft: 358,
           position: "absolute",
           position: "absolute",
           borderRadius: 50,
           backgroundColor: theme == 'light' ? "rgba(255, 255, 255, 0.8)" : 'rgba(29, 29, 29, 0.8)',
           borderStyle: "solid",
           borderColor: theme == 'light' ? "white" : "#222222",
           borderWidth: 1.5,
           width: 55,
           height: 285,
           alignItems: "center",
       }}


       >
          
           {/* Profile picture */}
           <TouchableOpacity
               // onPress={onPress}
           >
               <Image source={require('../../assets/profile_default.png')} style={{width: 45, height: 45, marginBottom: 7, marginTop: 4}}/>
           </TouchableOpacity>


           {/* Profile name */}
           <Text numberOfLines={1} style={theme == 'light' ? styles.lightText: styles.darkText}>
               999k
           </Text>


           {/* Like */}
           <TouchableOpacity
               // onPress={onPress}
           >
               {likes}
           </TouchableOpacity>


           {/* Like/Dislike Count */}
           <Text marginBottom={4} numberOfLines={1} style={theme == 'light' ? styles.lightText: styles.darkText}>
               999k
           </Text>


           {/* Dislike */}
           {/* <TouchableOpacity
               // onPress={onPress}
           >
               {dislikes}
           </TouchableOpacity> */}


           {/* Comments */}
           <TouchableOpacity
               // onPress={onPress}
           >
               {comments}
               <Text numberOfLines={1} style={theme == 'light' ? styles.lightText: styles.darkText}>333k</Text>
           </TouchableOpacity>


           {/* Share */}
           <TouchableOpacity
               // onPress={onPress}
           >
              
               {share}
               <Text numberOfLines={1} style={theme == 'light' ? styles.lightText: styles.darkText}>Share</Text>
           </TouchableOpacity>
          
       </View>
   );
}


const styles = StyleSheet.create({
   sideBar:{
       flexDirection: "column",
       alignItems: "center",
       marginTop: 350,
       marginLeft: 350,
       position: "absolute",
       position: "absolute",
       borderRadius: 50,
       backgroundColor: "rgba(255, 255, 255, 0.8)",
       borderStyle: "solid",
       borderColor: "white",
       borderWidth: 1.5,
       width: 60,
       height: 275,
       alignItems: "center",
   },
   lightText: {
       fontSize: 16,
       fontWeight: '500',
       color: '#222222'
   },
   darkText: {
       fontSize: 16,
       fontWeight: '500',
       color: '#EEEEEE'
   }
});


export default SideBar;