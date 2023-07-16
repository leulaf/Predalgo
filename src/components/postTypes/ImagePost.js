import React, {useContext, useState, useEffect} from 'react';
import { View, StyleSheet, Dimensions} from 'react-native';
import { firebase, storage, db } from '../../config/firebase';
import { doc, getDoc, deleteDoc, deleteObject, updateDoc, increment } from "firebase/firestore";
import PostContainer from './PostContainer';
import ImageContainer from '../ImageContainer';

import { useNavigation } from '@react-navigation/native';


const ImagePost = ({ title, username = "", profilePic = "", imageUrl, memeName, tags, profile, postId, likesCount, commentsCount, repostProfile, repostComment }) => {
    const navigation = useNavigation();
    const [profilePicState, setProfilePicState] = useState(profilePic);
    const [usernameState, setUsernameState] = useState(username);
    const [repostUsername, setRepostUsername] = useState(null);
    const [repostProfilePic, setRepostProfilePic] = useState(null);

    useEffect(() => {
        if(repostProfile != null){
            const userRef = doc(db, 'users', repostProfile);
            const userSnapshot = getDoc(userRef);

            userSnapshot.then((snapshot) => {
                if (snapshot.exists) {
                    setRepostUsername(snapshot.data().username);
                    setRepostProfilePic(snapshot.data().profilePic);
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }
        
        if(usernameState == ""){
            const userRef = doc(db, 'users', profile);
            const userSnapshot = getDoc(userRef);

            userSnapshot.then((snapshot) => {
                if (snapshot.exists) {
                    setProfilePicState(snapshot.data().profilePic);
                    setUsernameState(snapshot.data().username);
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }
    }, []);

    if (usernameState === "") {
        return null;
    }
    
    return (
        <PostContainer 
            title={title}
            imageUrl={imageUrl}
            likesCount={likesCount}
            commentsCount={commentsCount}
            tags={tags}
            memeName={memeName}
            profile={profile}
            postId={postId}
            profilePic={profilePicState}
            username={usernameState}
            repostUsername={repostUsername}

            navigation={navigation}
            
            content={
                <View >
                    <View style={{flexDirection: "row", alignSelf: 'center'}}>
                        <ImageContainer imageSource={{ uri: imageUrl }} />
                    </View>
                </View>
            }
        />
    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        height: 400,
        borderRadius: 15,
    }
});

export default ImagePost;
