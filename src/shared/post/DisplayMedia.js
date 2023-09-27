import React from 'react';

import ImageView from "react-native-image-viewing";

import PostBottom from '../../components/postTypes/PostBottom';

import { useNavigation } from '@react-navigation/native';

import { TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";

import CreateMeme from "../functions/CreateMeme";

import ResizableImage from "../functions/ResizableImage";

const windowWidth = Dimensions.get('screen').width;

const goToProfile = (navigation, profile, username, profilePic) => () => {
    navigation.push('Profile', {
        user: profile,
        username: username,
        profilePic: profilePic,
    })
}

const onNavToPost = (navigation, item, image, setIsImageFocused) => () => {
    setIsImageFocused(false);

    navigation.push('Post', {
        postId: item.id,
        title: item.title,
        tags: item.tags,
        imageUrl: image,
        templateUploader: item.templateUploader,
        memeName: item.memeName,
        template: item.template,
        // templateState: item.templateState,
        template: item.template,
        templateState: null,
        imageHeight: item.imageHeight,
        imageWidth: item.imageWidth,
        text: item.text,
        likesCount: item.likesCount,
        commentsCount: item.commentsCount,
        profile: item.profile,
        username: item.username,
        profilePic: item.profilePic,
    });
}

// Load Meme with template and template state
export default DisplayMeme = React.memo(({ theme, index, item, }) => {
    const navigation = useNavigation();
    const editorRef = React.useRef(null);
    const [image, setImage] = React.useState(item.imageUrl ? item.imageUrl : item.template);
    const [isImageFocused, setIsImageFocused] = React.useState(false);


    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={
                index % 2 == 1 ?
                {marginLeft: 2, marginRight: 4, marginBottom: 6} 
                :
                {marginLeft: 4, marginRight: 2, marginBottom: 6} 
            }
            onPress={onNavToPost(navigation, item, image, setIsImageFocused)}
            onLongPress={() => setIsImageFocused(!isImageFocused)}
        >
            
            <ResizableImage 
                image={image}
                maxWidth={windowWidth/2 - 8}
                maxHeight={500}
                height={item.imageHeight}
                width={item.imageWidth}
                style={{borderRadius: 10}}
            />

            <ImageView
                images={[{uri: image}]}
                imageIndex={0}
                visible={isImageFocused}
                onRequestClose={() => setIsImageFocused(false)}
                animationType="fade"
                presentationStyle="overFullScreen"
                doubleTapToZoomEnabled={true}
                FooterComponent={({ imageIndex }) => 
                    <View style={{backgroundColor: 'rgba(0,0,0,0.5)', height: 90}}>
                        <PostBottom
                            postId={item.id}
                            likesCount={item.likesCount}
                            commentsCount={item.commentsCount}
                            templateUploader={item.templateUploader}
                            navToPost={onNavToPost(navigation, item, image, setIsImageFocused)}
                            theme='imageFocused'
                        />
                    </View>
                }
            />


            {
                (item.template && image == item.template) &&

                <CreateMeme image={image} templateState={item.templateState} setFinished={() => null}setImage={setImage} id={item.id}/>
            }
        </TouchableOpacity>
    )
}, itemEquals);


const itemEquals = (prev, next) => {
    return prev.item.id === next.item.id
}

const styles = StyleSheet.create({
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        // marginLeft: 10,
        // marginRight: 6,
        // marginVertical: 10,
    },
    lightUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#444444',
        textAlign: "left",
        // marginTop: 6,
    },
    darkUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#DDDDDD',
        textAlign: "left",
        // marginTop: 6,
    },
    lightContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 15,
        borderRadius: 15,
    },
    darkContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        marginBottom: 15,
        borderRadius: 15,
    },
    lightLikeCountText: {
        fontSize: 16,
        fontWeight: "400",
        color: '#444444',
        marginRight: 5
    },
    darkLikeCountText: {
        fontSize: 16,
        fontWeight: "400",
        color: '#EEEEEE',
        marginRight: 5
    },
});