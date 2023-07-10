import React, {useContext, useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { Image } from 'expo-image';
import {ThemeContext} from '../../../context-store/context';
import { Overlay } from 'react-native-elements';
import { ref } from "firebase/storage";
import { firebase, storage, db } from '../../config/firebase';
import { doc, getDoc, deleteDoc, deleteObject, updateDoc, increment } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import GlobalStyles from '../../constants/GlobalStyles';

import DeleteIcon from '../../../assets/trash_delete.svg';
import ReportIcon from '../../../assets/danger.svg';

import ThreeDotsLight from '../../../assets/three_dots_light.svg';
import ThreeDotsDark from '../../../assets/three_dots_dark.svg';

const PostContainer = ({ title, content, profile, postId, profilePic, username, repostUsername }) => {
    const navigation = useNavigation();
    const {theme,setTheme} = useContext(ThemeContext);

    const [deleted, setDeleted] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);
    let threeDots
    
    if(theme == 'light'){
        threeDots = <ThreeDotsLight width={40} height={40} style={styles.threeDots}/>
    }else{
        threeDots = <ThreeDotsDark width={40} height={40} style={styles.threeDots}/>
    }

    const deletePost = () => {
        if(deleted){
            return;
        }
        const postRef = doc(db, 'allPosts', postId);
        const postSnapshot = getDoc(postRef);
        
        postSnapshot.then((snapshot) => {
            if (snapshot.exists) {
                deleteDoc(postRef).then(() => {
                    Alert.alert('Post deleted!');

                    setDeleted(true);

                    // update posts count for current user
                    const currentUserRef = doc(db, 'users', firebase.auth().currentUser.uid);

                    updateDoc(currentUserRef, {
                        posts: increment(-1)
                    });

                }).catch((error) => {
                    console.log(error);
                });

                data = snapshot.data();
                // console.log(data.imageUrl);

                // if (data.imageUrl) {
                //     const imageRef = ref(storage, "gs://predalgo-backend.appspot.com/profilePics/adaptive-icon.png");
  
                //     // Delete the file
                //     deleteObject(imageRef).then(() => {
                //         // File deleted successfully
                //         console.log('Image deleted!');
                //     }).catch((error) => {
                //         // Uh-oh, an error occurred!
                //         console.log(error);
                //     });
                // }
            }

            
        })
    
        
    }

    if (deleted) {
        return null;
    }

    return (
        <View style={theme == 'light' ? GlobalStyles.lightPostContainer: GlobalStyles.darkPostContainer}>
            
            {/* profile pic, username and title*/}
            <View 
                style={{flexDirection: 'row'}}
            >
                {/* profile pic */}
                <TouchableOpacity
                    onPress={() => {
                        navigation.push('Profile', {
                            user: profile,
                            username: username,
                            profilePic: profilePic,
                        });
                    }}
                >
                    {profilePic != "" ? (
                        <Image source={{ uri: profilePic }} style={styles.profileImage}/>
                    ) : (
                        <Image source={require('../../../assets/profile_default.png')} style={styles.profileImage} cachePolicy='disk'/>
                    )}
                </TouchableOpacity>
                
                {/* username and title */}
                <View style={{flexDirection: 'column'}}>

                    {
                        repostUsername ?
                            <Text style={theme == 'light' ? styles.lightUsername: styles.darkUsername}>
                                @{repostUsername} reposted
                            </Text>
                        :
                            null
                    }

                    {/* username */}
                    <Text style={theme == 'light' ? styles.lightUsername: styles.darkUsername}>
                        @{username}
                    </Text>


                    {/* title */}
                    <Text numberOfLines={2} 
                        style={theme == 'light' ? styles.lightPostTitle: styles.darkPostTitle}>
                            {title ?
                                title
                            :
                                ""
                            }
                    </Text>

                </View>
                
                {/* three dots */}
                <TouchableOpacity 
                    style={{flexDirection: 'row'}}
                    onPress= {() => setOverlayVisible(true)}
                >
                    {threeDots}
                </TouchableOpacity>
                
            </View>

            {content}

            {/* 
                an overlay popup that appears when you click on the three dots.
                if the post is from the current users, user can delete it.
                if the post is not from the current users, user can report it.
            */}

            <Overlay isVisible={overlayVisible} onBackdropPress={() => setOverlayVisible(false)} overlayStyle={{borderRadius: 100}}>
                
                {profile === firebase.auth().currentUser.uid ?
                    <TouchableOpacity
                        style={{flexDirection: 'row'}}
                        onPress={() => {
                            setOverlayVisible(false);
                            deletePost();
                        }
                    }>
                        <DeleteIcon width={40} height={40} style={{marginLeft: 2}}/>
                        <Text style={styles.overlayText}>Delete Post</Text>
                    </TouchableOpacity>
                :
                    <TouchableOpacity
                        style={{flexDirection: 'row'}}
                        onPress={() => {
                            setOverlayVisible(false);
                        }
                    }>
                        <ReportIcon width={35} height={35} style={{marginLeft: 2}}/>
                        <Text style={styles.overlayText}>Report Post</Text>
                    </TouchableOpacity>
                }
            </Overlay>

        </View>
    );
}

const styles = StyleSheet.create({
    threeDots: {
        // marginLeft: 365,
        padding: 10,
        marginTop: -3,
        marginHorizontal: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginHorizontal: 5,
        marginVertical: 8,
    },
    lightUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#666666',
        textAlign: "left",
        marginTop: 6,
    },
    darkUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#CCCCCC',
        textAlign: "left",
        marginTop: 6,
    },
    lightPostTitle: {
        fontSize: 22,
        fontWeight: "500",
        color: '#333333',
        textAlign: "left",
        marginRight: 10,
        marginBottom: 10,
        width: 290,
    },
    darkPostTitle: {
        fontSize: 22,
        fontWeight: "500",
        color: '#DDDDDD',
        textAlign: "left",
        marginRight: 10,
        marginBottom: 10,
        width: 290,
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
