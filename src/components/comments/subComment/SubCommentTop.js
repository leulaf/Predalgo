import React from 'react';

import { Image } from 'expo-image';

import styles from './Styles';

import { TouchableOpacity, View, Text } from 'react-native';


import CommentOverlay from '../shared/CommentOverlay';

// light mode icons
import ThreeDotsLight from '../../../../assets/three_dots_light.svg';

// dark mode icons
import ThreeDotsDark from '../../../../assets/three_dots_dark.svg';


const goToProfile = (navigation, profile, username, profilePic) => () => {
    navigation.push('Profile', {
        user: profile,
        username: username,
        profilePic: profilePic,
    })
}


// ******** React memo ********
export default SubCommentTop = ({ commentId, replyToCommentId, replyToPostId, setFinished, navigation, theme, profile, username, profilePic, onNavToComment}) => {
    const [overlayVisible, setOverlayVisible] = React.useState(false);

    const toggleOverlay = React.useCallback(() => () => {
        setOverlayVisible(!overlayVisible);
    }, [overlayVisible]);




    let threeDots

    if(theme == 'light'){
        threeDots = <ThreeDotsLight width={33} height={33} style={{}}/>
    }else{
        threeDots = <ThreeDotsDark width={33} height={33} style={{}}/>
    }



    return (

        <View style={{marginTop: 8, flexDirection: 'row', alignItems: 'center'}}>
                
            {/* Profile Picture */}
            <TouchableOpacity 
                activeOpacity={1}
                onPress={goToProfile(navigation, profile, username, profilePic)}
            >
                <Image 
                    source={{uri: profilePic}} 
                    style={styles.profileImage} 
                    placeholder={require('../../../../assets/profile_default.png')}
                />
            </TouchableOpacity>


            {/* Username */}
            <TouchableOpacity
                activeOpacity={1}
                onPress={goToProfile(navigation, profile, username, profilePic)}
            >
                <Text style={theme == 'light' ? styles.lightUsername : styles.darkUsername}>
                    @{username}
                </Text>
            </TouchableOpacity>
            

            {/* Spacer */}
            <TouchableOpacity
                activeOpacity={1}
                style={{flex: 1, height: 30}}
                onPress={onNavToComment()}
            ></TouchableOpacity>


            {/* Three Dots */}
            <TouchableOpacity 
                activeOpacity={1}
                style={{flexDirection: 'row', marginTop: -15, marginRight: 10}}
                onPress= {toggleOverlay()}
            >
                {threeDots}
            </TouchableOpacity>


            {/* Overlay */}
            {
                overlayVisible && 
                
                <CommentOverlay 
                    commentId={commentId}
                    replyToCommentId={replyToCommentId}
                    replyToPostId={replyToPostId}
                    setFinished={setFinished}
                    profile={profile}
                    toggleOverlay={toggleOverlay}
                    theme={theme}
                />
            }
        
        </View>
    );
}

