import React, {} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Constants from 'expo-constants';

// light mode icons
import BackLight from '../../assets/back.svg';

// dark mode icons
import BackDark from '../../assets/back_light.svg';

// light mode icons
import ThreeDotsLight from '../../assets/three_dots_light.svg';

// dark mode icons
import ThreeDotsDark from '../../assets/three_dots_dark.svg';


const SimpleTopBar = ({theme, title, onGoBack, replyToPostId, replyToCommentId, goToReplyDirectly, extraPaddingTop, clickedThreeDots}) => {
    // ****** use navigateBackOnPress when navigating to comment directly instead of a post/comment ******

    let threeDots, back

    if(theme == 'light'){
        threeDots = <ThreeDotsDark width={38} height={38} style={styles.lightThreeDotsIcon}/>
        back = <BackDark width={18} height={18} style={styles.lightBackIcon}/>
    }else{
        threeDots = <ThreeDotsDark width={38} height={38} style={styles.darkThreeDotsIcon}/>
        back = <BackDark width={18} height={18} style={styles.darkBackIcon}/>
    }


    return (
            <View style={[theme == 'light' ? styles.lightTopContainer : styles.darkTopContainer, {paddingTop: extraPaddingTop  === true && 0}]}>

                {/* back button */}
                <TouchableOpacity 
                            style={{ marginTop: 0, height: 18, width:18, alignItems: 'center', alignContent: 'flex-start', justifyContent: 'flex-start',}}
                            onPress={() => onGoBack()}
                >
                    {back}
                    
                </TouchableOpacity>


                {/* Post/Comment */}
                {
                    extraPaddingTop !== true ?
                    
                    <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
                        {title == 'Post' ? 'Post' : 'Reply to '}

                            {title == 'Comment' && (replyToPostId != null || replyToCommentId == null) &&
                            <Text
                                // ***FINISH IMPLEMENTING THIS***
                                onPress={() => {
                                    goToReplyDirectly ?
                                        null
                                    :
                                        onGoBack()
                                }}
                                style={theme == 'light' ? styles.lightLinkText : styles.darkLinkText}
                            >
                                {replyToCommentId ? 'Comment' : 'Post'}
                            </Text>
                            }
                    </Text>

                    :

                    <Text style={[theme == 'light' ? styles.lightText : styles.darkText, {marginLeft: 24}]}>
                        Refreshing
                    </Text>
                }

                {/* Three dots - options button */}
                <TouchableOpacity
                    // onPress={() => {navigation.goBack()}}
                    // clickedThreeDots={clickedThreeDots()}
                >
                    {threeDots}
                </TouchableOpacity>
                
            </View>
    );
}


const styles = StyleSheet.create({
    lightTopContainer: {
        backgroundColor: 'white',
        height: Constants.statusBarHeight-5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        // borderTopRightRadius: 15,
        // borderTopLeftRadius: 15,
        // borderBottomWidth: 1.5,
        // borderColor: '#efefef'
    },
    darkTopContainer: {
        backgroundColor: '#151515',
        height: Constants.statusBarHeight-5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        // alignContent: 'center',
        // justifyContent: 'center',
        // borderBottomWidth: 1.5,
        // borderColor: '#2f2f2f'
    },
    lightBackIcon: {
        // alignSelf: 'center',
        // marginTop: 52,
        color: '#000',
        marginLeft: 22,
        padding: 10,
    },
    darkBackIcon: {
        // alignSelf: 'center',
        // marginTop: 52,
        color: '#FFF',
        marginLeft: 22,
        padding: 10,
    },
    lightThreeDotsIcon: {
        color: '#000',
        marginBottom: 5,
        marginRight: 12
    },
    darkThreeDotsIcon: {
        color: '#FFF',
        marginBottom: 5,
        marginRight: 12
    },
    lightText: {
        fontSize: 20,
        color: '#000',
        fontWeight: "600",
        marginTop: 1,
        marginLeft: 15
    },
    darkText: {
        fontSize: 20,
        color: '#f2f2f2',
        fontWeight: "600",
        marginTop: 1,
        marginLeft: 15
    },
    lightLinkText: {
        fontSize: 20,
        fontWeight: "600",
        color: '#0052EF',
        marginTop: 1,
        marginLeft: 15
        // textAlign: 'auto',
        // marginBottom: 6,
    },
    darkLinkText: {
        fontSize: 20,
        fontWeight: "600",
        color: '#0094FF',
        marginTop: 1,
        marginLeft: 15
        // textAlign: 'auto',
        // // marginBottom: 6,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginRight: 5,
        padding: 10,
    },
    lightUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#444444',
        textAlign: "left",
        marginBottom: 1,
    },
    darkUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#DDDDDD',
        textAlign: "left",
        marginBottom: 1,
    },
    lightRepostUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#777777',
        textAlign: "left",
    },
    darkRepostUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#BBBBBB',
        textAlign: "left",
    },
});


export default SimpleTopBar;
