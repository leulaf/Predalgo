import React from 'react';

import { View, Text, StyleSheet, TouchableOpacity, Share, Platform, Dimensions } from 'react-native';

import { AuthenticatedUserContext } from '../../../context-store/context';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import Feather from '@expo/vector-icons/Feather';

import Octicons from '@expo/vector-icons/Octicons';

import deletePost from '../../shared/post/DeletePost';

import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";

import { getAuth } from 'firebase/auth';

const auth = getAuth();

const window = Dimensions.get('window');


const onShare = async(text, image) => {
    try {
        const result = await Share.share({
            message: text,
            url: image
        });
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
            // shared with activity type of result.activityType
            } else {
            // shared
            }
        }
        else if (result.action === Share.dismissedAction) {
            // dismissed
        }
    } catch (error) {
        // alert(error.message);
    }
}

export default ThreeDotsSheet = ({profile, postId, text, image, theme}) => {
    const [bookmarked, setBookmarked] = React.useState(false);

    // ref
    const bottomSheetRef = React.useRef(null);

    // variables
    const snapPoints = React.useMemo(() => [ "1%", "40%"], []);

    const {options, setOptions} = React.useContext(AuthenticatedUserContext);

    const handleSheetAnimate = React.useCallback((from, to) => {
        // console.log('handleSheetAnimate', from, to);
        
        if(to == 0){
            setOptions(false)
        }
        
    }, [snapPoints]);

    // console.log(options)
    // setOptions(false)
    React.useEffect(() => {
        if(options == "close"){
            bottomSheetRef.current.snapToIndex(0);
        }
    }, [options])

    const deleteAndCheck = React.useCallback(() => async() => {
        setOptions({
            ...options,
            deleted: true
        })
        await deletePost(postId)
        .then(() => {
            // setOptions({
            //     ...options,
            //     deleted: true
            // })
        })
        .catch(() => {
            setOptions({
                ...options,
                deleted: false
            })
        })
    }, [])


    return (
        //<View style={styles.container}>
            <BottomSheet
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                onAnimate={handleSheetAnimate}

                // add bottom inset to elevate the sheet
                // bottomInset={46}

                // set `detached` to true
                // detached={true}


                style={styles.sheetContainer}
                backgroundStyle={{
                    backgroundColor: theme == 'light' ? 'rgba(255, 255, 255, 0)' : 'rgba(35, 35, 35, 0)',
                    // marginBottom: 10,
                    // flexDirection: 'column',
                }}

                // handleHeight={0}
                handleStyle={{backgroundColor: theme == 'light' ? '#F6F6F6' : '#1D1D1D', width: "95%", alignSelf: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15}}
                // handleIndicatorStyle={{height: 0, width: 0}}
                // handleComponent={null}
                handleIndicatorStyle={{backgroundColor: theme == 'light' ? '#000' : '#FFF'}}
            >

                <BottomSheetView style={theme == 'light' ? styles.lightContentContainer : styles.darkContentContainer}>
                    
                    {/* <View style={{flex: 1}}/> */}


                    {/* Share comment */}
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={theme == 'light' ? styles.lightButtonStyle : styles.darkButtonStyle}
                        onPress={() => {
                            onShare(text, image)
                            setOptions(false)
                        }}
                    >
                        <Feather
                            name={Platform.OS === 'ios' ? "share" : "share-2"}
                            size={25}

                            color={theme == 'light' ? '#111' : '#F8F8F8'}
                            marginLeft={15}
                            marginRight={13}
                            marginTop={0}
                        />
                        <Text
                            style={theme == 'light' ? styles.lightText : styles.darkText}
                        >
                            Share
                        </Text>
                    </TouchableOpacity>
                    
                    
                    {/* Save comment */}
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={theme == 'light' ? styles.lightButtonStyle : styles.darkButtonStyle}
                        onPress={() => setBookmarked(!bookmarked)}
                    >
                        <MaterialIcons
                            name={bookmarked ? "bookmark" : "bookmark-outline"}
                            size={29.5}

                            color={theme == 'light' ? '#333' : '#F4F4F4'}
                            marginLeft={12}
                            marginRight={13}
                            marginTop={0}
                        />
                        <Text style={theme == 'light' ? styles.lightText : styles.darkText}>Save</Text>
                    </TouchableOpacity>
                    
                    
                    
                    {/* Copy text comment, "title: ..., text: ..."" */}
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={theme == 'light' ? styles.lightButtonStyle : styles.darkButtonStyle}
                        onPress={() =>{ return null}}
                    >
                        <Feather
                            name="copy"
                            size={26}
                            color={theme == 'light' ? '#000' : '#FFF'}
                            marginLeft={16}
                            marginRight={14}
                            marginTop={0}
                        />
                        <Text
                            style={theme == 'light' ? styles.lightText : styles.darkText}
                        >
                            Copy text
                        </Text>
                    </TouchableOpacity>
                    
                    
                    
                    {
                        profile === auth.currentUser.uid ?

                        <TouchableOpacity 
                            activeOpacity={0.5}
                            style={theme == 'light' ? styles.lightButtonStyle : styles.darkButtonStyle}
                            onPress={deleteAndCheck()}
                        >
                            <Octicons
                                name="trash"
                                size={26}
                                color={theme == 'light' ? '#FF0000' : '#FF3535'}
                                marginLeft={19}
                                marginRight={19}
                                marginTop={1}
                            />
                            <Text style={theme == 'light' ? styles.lightText : styles.darkText}>Delete comment</Text>
                        </TouchableOpacity>
                    :

                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={theme == 'light' ? styles.lightButtonStyle : styles.darkButtonStyle}
                            onPress={() =>{ return null}}
                        >
                            <Feather
                                name="flag"
                                size={25}
                                color={theme == 'light' ? '#FF7A00' : '#FF4848'}
                                marginLeft={18}
                                marginRight={15}
                                marginTop={0}
                            />
                            <Text style={theme == 'light' ? styles.lightText : styles.darkText}>Report comment</Text>
                        </TouchableOpacity>
                    } 
                </BottomSheetView>
                










                {/* <View style={styles.contentContainer}> */}
                    {/* 
                        maybe turn three dots to X when clicked to indecate
                        that the user can click it again to close the sheet
                    */}

                    {/* 
                        IMPORTANT:
                        make the three dots that closes the sheet is from the same comment
                        if not then change the sheet to the new comment
                    
                    */}
                {/* </View> */}
                
            </BottomSheet>
        //</View>
    )
}

const styles = StyleSheet.create({
    sheetContainer: {
        // flex: 1,
        // padding: 24,
        // width: '100%',
        // height: '100%',
        // backgroundColor: "grey",
        // add horizontal space
        // marginHorizontal: 24,
        // flexDirection: 'column',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        // overflow: 'hidden',
        // borderRadius: 15,
        
    },
    
    lightText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: '500',
        alignSelf: 'center',
    },
    darkText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    // container: {
    //     // flex: 1,
    //     padding: 24,
    //     backgroundColor: "grey",
    // },
    lightContentContainer: {
        // flex: 1,
        width: '95%',
        height: window.width * .6,
        alignSelf: 'center',
        // alignContent: "flex-end",
        // height: "100%",
        // width: "100%",
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        flexDirection: 'column',
        // alignItems: 'center',
        // alignContent: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#F6F6F6',
        // borderWidth: 1,
        // borderColor: '#E2E2E2',
    },
    darkContentContainer: {
        // flex: 1,
        width: '95%',
        height: window.width * .6,
        alignSelf: 'center',
        // height: "100%",
        // width: "100%",
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        flexDirection: 'column',
        // alignItems: 'center',
        // alignContent: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#1D1D1D',
        // borderWidth: 1,
        // borderColor: '#E2E2E2',
    },
    lightButtonStyle: {
        flexDirection: 'row',
        width: "100%",
        height: 60,
        alignSelf: 'flex-start',
        justifiyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 0.3,
        borderColor: '#888',
    },
    darkButtonStyle: {
        flexDirection: 'row',
        width: "100%",
        height: 60,
        alignSelf: 'flex-start',
        justifiyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 0.3,
        borderColor: '#888',
    }
})