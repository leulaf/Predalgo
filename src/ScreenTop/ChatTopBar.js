import React, {} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Image } from 'expo-image';
import Constants from 'expo-constants';

// dark mode icons
import BackDark from '../../assets/back_light.svg';


const ChatTopBar = ({theme, navigation, username, profilePic }) => {
    // ****** use navigateBackOnPress when navigating to comment directly instead of a post/comment ******

    let back

    if(theme == 'light'){
        back = <BackDark width={18} height={18} style={styles.lightBackIcon}/>
    }else{
        back = <BackDark width={18} height={18} style={styles.darkBackIcon}/>
    }


    return (
            <View style={[theme == 'light' ? styles.lightTopContainer : styles.darkTopContainer]}>

                <View style={styles.rowContainer}>
                    {/* back button */}
                    <TouchableOpacity 
                        style={{ marginTop: 0, height: 18, width:18, alignItems: 'center', alignContent: 'flex-start', justifyContent: 'flex-start',}}
                        onPress={() => navigation.goBack()}
                    >
                        {back}
                    </TouchableOpacity>


                    
                    <View style={{flexDirection: 'row', marginLeft: 20, justifyContent: 'center', alignItems: 'center'}}>
                        <Image
                            source={{uri: profilePic}}
                            style={[styles.profileImage]}
                        />

                        <Text style={[theme == 'light' ? styles.lightUsername : styles.darkUsername]}>
                            {username}
                        </Text>
                    </View>


                    <View/>
                </View>
            </View>
    );
}


const styles = StyleSheet.create({
    lightTopContainer: {
        backgroundColor: '#F4F4F4',
        height: Platform.OS === 'ios' ? Constants.statusBarHeight+50 : Constants.statusBarHeight+65,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'flex-end',
        // alignContent: 'center',
        // borderTopRightRadius: 15,
        // borderTopLeftRadius: 15,
        borderBottomWidth: .5,
        borderColor: '#CCC'
    },
    darkTopContainer: {
        backgroundColor: '#151515',
        height: Constants.statusBarHeight*2-5,
        flexDirection: 'row',
        alignItems: 'flex-end',

    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        marginBottom: 10
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
        marginLeft: 10,
        marginTop: 10,
    },
    darkText: {
        fontSize: 20,
        color: '#f2f2f2',
        fontWeight: "600",
        marginLeft: 10,
        marginTop: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        // marginRight: 5,
        padding: 5,
    },
    lightUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#444444',
        // textAlign: "left",
        marginLeft: 10,
        // marginTop: 10,
    },
    darkUsername: {
        fontSize: 16,
        fontWeight: "600",
        color: '#DDDDDD',
        // textAlign: "left",
        marginLeft: 10,
        // marginTop: 10,
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


export default ChatTopBar;
