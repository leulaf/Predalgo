import React, { } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
// import { firebase, storage, db } from '../../config/firebase';
// import { doc, getDoc, deleteDoc, deleteObject, updateDoc, increment } from "firebase/firestore";
import PostContainer from './PostContainer';

import CreateMeme from '../../shared/functions/CreateMeme';

import ResizableImage from '../../shared/functions/ResizableImage';

import { useNavigation } from '@react-navigation/native';

import ImageView from "react-native-image-viewing";

import PostBottom from './PostBottom';

const onNavToPost =  (navigation, postId, title, tags, profile, profilePic, username, text, imageUrl, template, templateUploader, templateState, memeName, imageHeight, imageWidth, likesCount, commentsCount) => {
    navigation.push('Post', {
        postId: postId,
        title: title,
        tags: tags,
        text: text,
        imageUrl: imageUrl,
        memeName: memeName,
        template: template,
        templateUploader: templateUploader ? templateUploader : null,
        templateState: null,
        imageHeight: imageHeight,
        imageWidth: imageWidth,
        likesCount: likesCount,
        commentsCount: commentsCount,
        profile: profile,
        username: username,
        profilePic: profilePic,
    });
}

const windowWidth = Dimensions.get("screen").width;

const ImagePost = ({ title, username, profilePic, text, imageUrl, template, templateUploader, templateState, imageHeight, imageWidth, memeName, tags, profile, postId, likesCount, commentsCount, repostProfile, repostComment }) => {
    const navigation = useNavigation();
    // const [profilePicState, setProfilePicState] = useState(profilePic);
    // const [usernameState, setUsernameState] = useState(username);
    // const [repostUsername, setRepostUsername] = useState(null);
    // const [repostProfilePic, setRepostProfilePic] = useState(null);

    const [image, setImage] = React.useState(imageUrl ? imageUrl : template);

    const [finished, setFinished] = React.useState(template  && !(imageUrl) ? false : true);

    const [focused, setIsFocused] = React.useState(false);

    React.useEffect(() => {
        // if(repostProfile != null){
        //     const userRef = doc(db, 'users', repostProfile);
        //     const userSnapshot = getDoc(userRef);

        //     userSnapshot.then((snapshot) => {
        //         if (snapshot.exists) {
        //             setRepostUsername(snapshot.data().username);
        //             setRepostProfilePic(snapshot.data().profilePic);
        //         } else {
        //             // console.log("No such document!");
        //         }
        //     }).catch((error) => {
        //         // console.log("Error getting document:", error);
        //     });
        // }
        
        // if(usernameState == ""){
        //     const userRef = doc(db, 'users', profile);
        //     const userSnapshot = getDoc(userRef);

        //     userSnapshot.then((snapshot) => {
        //         if (snapshot.exists) {
        //             setProfilePicState(snapshot.data().profilePic);
        //             setUsernameState(snapshot.data().username);
        //         } else {
        //             // console.log("No such document!");
        //         }
        //     }).catch((error) => {
        //         // console.log("Error getting document:", error);
        //     });
        // }
    }, []);

    // if (usernameState === "") {
    //     return null;
    // }

    const navToPostFromImage = React.useCallback(() => {
        setIsFocused(false);
        onNavToPost(navigation, postId, title, tags, profile, profilePic, username, text, imageUrl, template, templateUploader, templateState, memeName, imageHeight, imageWidth, likesCount, commentsCount);
    })
    
    return (
        <PostContainer 
            title={title}
            imageUrl={image}
            template={template}
            templateUploader={templateUploader}
            // templateState={templateState}
            imageHeight={imageHeight}
            imageWidth={imageWidth}
            likesCount={likesCount}
            commentsCount={commentsCount}
            tags={tags}
            memeName={memeName}
            profile={profile}
            postId={postId}
            profilePic={profilePic}
            username={username}
            // repostUsername={repostUsername && repostUsername}

            navigation={navigation}
            
            content={
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setIsFocused(true)}
                    style={{flexDirection: "row", alignSelf: 'center'}}
                >
                    {/* Load Meme with template and template state */}
                    {!finished && <CreateMeme image={image} templateState={templateState} setFinished={setFinished} setImage={setImage}/>}
                    <ResizableImage 
                        image={image}
                        height={imageHeight}
                        width={imageWidth}
                        maxWidth={windowWidth-6}
                        maxHeight={600}
                        style={{ borderRadius: 10, alignSelf: 'center'}}
                    />

                    {focused &&
                        <ImageView
                            images={[{uri: image}]}
                            imageIndex={0}
                            visible={focused}
                            onRequestClose={() => setIsFocused(false)}
                            animationType="fade"
                            doubleTapToZoomEnabled={true}
                            FooterComponent={({ imageIndex }) => (
                                <View style={{backgroundColor: 'rgba(0,0,0,0.5)', height: 90}}>
                                    <PostBottom
                                        postId={postId}
                                        likesCount={likesCount}
                                        commentsCount={commentsCount}
                                        theme='imageFocused'
                                        navToPost={navToPostFromImage}
                                    />
                                </View>
                                
                            )}
                        />
                    }
                </TouchableOpacity>
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
