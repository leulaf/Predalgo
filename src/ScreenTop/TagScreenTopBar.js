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


const TagScreenTopBar = ({theme, tag, navigation}) => {
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
            <View style={theme == 'light' ? styles.lightTopContainer : styles.darkTopContainer}>

                {/* back button */}
                <TouchableOpacity 
                            style={{ marginTop: 0, height: 18, width:18, alignItems: 'center', alignContent: 'flex-start', justifyContent: 'flex-start',}}
                            onPress={() => navigation.goBack()}
                >
                    {back}
                    
                </TouchableOpacity>


                {/* Post/Comment */}
                {
                    
                    <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
                        {tag}
                    </Text>

                    // :

                    // <Text style={[theme == 'light' ? styles.lightText : styles.darkText, {marginLeft: 24}]}>
                    //     Refreshing
                    // </Text>
                }

                {/* Three dots - options button */}
                <TouchableOpacity
                    // onPress={() => {navigation.goBack()}}
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
        fontSize: 22,
        // color: '#004FE7',
        color: '#000',
        fontWeight: "600",
        marginBottom: 2,
        marginLeft: 15,
        letterSpacing: 0.5,
    },
    darkText: {
        fontSize: 22,
        // color: '#839EFF',
        color: '#FFF',
        fontWeight: "600",
        marginTop: 1,
        marginLeft: 15,
        letterSpacing: 0.5,
    },
});


export default TagScreenTopBar;
