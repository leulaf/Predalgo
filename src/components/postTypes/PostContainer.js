import React, {useContext, useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {ThemeContext} from '../../../context-store/context';
import { Overlay } from 'react-native-elements';
import { firebase, db } from '../../config/firebase';
import { doc, deleteDoc} from "firebase/firestore";
import GlobalStyles from '../../constants/GlobalStyles';

import DeleteIcon from '../../../assets/trash_delete.svg';
import ReportIcon from '../../../assets/danger.svg';

import ThreeDotsLight from '../../../assets/three_dots_light.svg';
import ThreeDotsDark from '../../../assets/three_dots_dark.svg';

const PostContainer = ({ navigation, title, content, profile, postId, userPostId }) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [overlayVisible, setOverlayVisible] = useState(false);
    let threeDots
    
    if(theme == 'light'){
        threeDots = <ThreeDotsLight width={40} height={40} style={styles.threeDots}/>
    }else{
        threeDots = <ThreeDotsDark width={40} height={40} style={styles.threeDots}/>
    }

    const deletePost = () => {
        const postRef = doc(db, 'allPosts', postId);
        const userPostRef = doc(db, "posts", firebase.auth().currentUser.uid, "userPosts", userPostId);
    
        deleteDoc(postRef).then(() => {
            Alert.alert('Post deleted! \n Refresh App to see changes.');
        }).catch((error) => {
            console.log(error);
        });

        deleteDoc(userPostRef).then(() => {
            // console.log("Document successfully deleted!");
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <View style={theme == 'light' ? GlobalStyles.lightPostContainer: GlobalStyles.darkPostContainer}>
            {title? 
                
                <View 
                    style={{flexDirection: 'row'}}
                >
                    <Text numberOfLines={2} 
                    style={theme == 'light' ? GlobalStyles.lightPostText: GlobalStyles.darkPostText}>{title}</Text>
                    
                    <TouchableOpacity 
                        style={{flexDirection: 'row'}}
                        onPress= {() => setOverlayVisible(true)}
                    >
                        {threeDots}
                    </TouchableOpacity>
                    
                </View>
            :
                <TouchableOpacity 
                    style={{flexDirection: 'row'}}
                    onPress= {() => setOverlayVisible(true)}
                >
                    <View style={{marginVertical: 22}}></View>
                    {threeDots}
                </TouchableOpacity>
            }

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

            {content}
        </View>
    );
    }

const styles = StyleSheet.create({
    threeDots: {
        // marginLeft: 365,
        padding: 10,
        marginHorizontal: 10,
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
