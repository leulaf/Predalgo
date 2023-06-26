import React, {useContext, useState, useEffect} from 'react';
import { View, StyleSheet, Dimensions} from 'react-native';
import Image from 'react-native-scalable-image';
import { useNavigation } from '@react-navigation/native';
import { firebase, storage, db } from '../../config/firebase';
import { doc, getDoc, deleteDoc, deleteObject, updateDoc, increment } from "firebase/firestore";
import PostContainer from './PostContainer';
import PostBottom from './PostBottom';

const ImageContainer = (props) => {
    const windowWidth = Dimensions.get('window').width;
    
    return (
        <Image 
            width={windowWidth} // this will make image take full width of the device
            source={props.imageSource} // pass the image source via props
            style={{borderRadius: 15}}
        />
    );
  };

const ImagePost = ({ title, imageUrl, memeText, tags, profile, postId, likesCount, commentsCount, repostProfile }) => {
    const navigation = useNavigation();
    const [profilePic, setProfilePic] = useState("");
    const [username, setUsername] = useState("");
    const [repostUsername, setRepostUsername] = useState(null);

    useEffect(() => {
        if(repostProfile != null){
            const userRef = doc(db, 'users', repostProfile);
            const userSnapshot = getDoc(userRef);

            userSnapshot.then((snapshot) => {
                if (snapshot.exists) {
                    setRepostUsername(snapshot.data().username);
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }
        
        const userRef = doc(db, 'users', profile);
        const userSnapshot = getDoc(userRef);

        userSnapshot.then((snapshot) => {
            if (snapshot.exists) {
                setProfilePic(snapshot.data().profilePic);
                setUsername(snapshot.data().username);
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }, []);

    if (username === "") {
        return null;
    }
    
    return (
        <PostContainer 
            title={title}
            profile={profile}
            postId={postId}
            profilePic={profilePic}
            username={username}
            repostUsername={repostUsername}
            content={
                <View >
                    <View style={{flexDirection: "row"}}>
                        <ImageContainer imageSource={{ uri: imageUrl }} />
                    </View>
                    <PostBottom
                        tags={tags}
                        memeText={memeText}
                        postId={postId}
                        likesCount={likesCount}
                        commentsCount={commentsCount}
                    />
                </View>
            }
        />
    );
}

// const ImagePost = ({ title, imageUrl, memeText, tags, profile, postId, likesCount, commentsCount, repostProfile }) => {
//     const navigation = useNavigation();
//     const [profilePic, setProfilePic] = useState("");
//     const [username, setUsername] = useState("");
//     const [repostUsername, setRepostUsername] = useState(null);

//     useEffect(() => {
//         if(repostProfile != null){
//             const userRef = doc(db, 'users', repostProfile);
//             const userSnapshot = getDoc(userRef);

//             userSnapshot.then((snapshot) => {
//                 if (snapshot.exists) {
//                     setRepostUsername(snapshot.data().username);
//                 } else {
//                     console.log("No such document!");
//                 }
//             }).catch((error) => {
//                 console.log("Error getting document:", error);
//             });
//         }
        
//         const userRef = doc(db, 'users', profile);
//         const userSnapshot = getDoc(userRef);

//         userSnapshot.then((snapshot) => {
//             if (snapshot.exists) {
//                 setProfilePic(snapshot.data().profilePic);
//                 setUsername(snapshot.data().username);
//             } else {
//                 console.log("No such document!");
//             }
//         }).catch((error) => {
//             console.log("Error getting document:", error);
//         });
//     }, []);

//     if (username === "") {
//         return null;
//     }
    
//     return (
//         <PostContainer 
//             title={title}
//             profile={profile}
//             postId={postId}
//             profilePic={profilePic}
//             username={username}
//             repostUsername={repostUsername}
//             content={
//                 <View >
//                     <View style={{flexDirection: "row"}}>
//                         <Image source={{ uri: imageUrl }} style={styles.image}/>
//                     </View>
//                     <PostBottom
//                         tags={tags}
//                         memeText={memeText}
//                         postId={postId}
//                         likesCount={likesCount}
//                         commentsCount={commentsCount}
//                     />
//                 </View>
//             }
//         />
//     );
// }



const styles = StyleSheet.create({
    image: {
        flex: 1,
        height: 400,
        borderRadius: 15,
    }
});

export default ImagePost;
