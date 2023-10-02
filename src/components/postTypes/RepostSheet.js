import React from 'react';

import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';

import Constants from 'expo-constants';


import Repost from '../../shared/post/Repost';

import { AuthenticatedUserContext } from '../../../context-store/context';

import Feather from '@expo/vector-icons/Feather';

import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";

import { getAuth } from 'firebase/auth';

const auth = getAuth();

const window = Dimensions.get('screen');

export default RepostSheet = ({profile, postId, username, profilePic, theme}) => {
    const [comment, setComment] = React.useState('');
    const [repostWithComment, setRepostWithComment] = React.useState(false);

    // ref
    const bottomSheetRef = React.useRef(null);

    // variables
    const snapPoints = React.useMemo(() => [ "1%", "25%", "90"], []);

    const {options, setOptions} = React.useContext(AuthenticatedUserContext);

    const handleSheetAnimate = React.useCallback((from, to) => {
        // console.log('handleSheetAnimate', from, to);
        
        if(to == 0){
            setOptions(false)
        }else if(to == 2){
            setRepostWithComment(true);
        }
        
    }, [snapPoints]);

    const onRepost = React.useCallback(() => async() => {
        Repost(postId)
        bottomSheetRef.current.snapToIndex(0);
    }, [])

    const onRepostWithComment = React.useCallback(() => async() => {
        Repost(postId, username, profilePic, comment);
        bottomSheetRef.current.snapToIndex(0);
    }, [comment])

    return (
        <View
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                width: "100%",
                height:"100%",
                position: 'absolute',
                top: 0
            }}
        >
            <TouchableOpacity
                onPress = {() => bottomSheetRef.current.snapToIndex(0)}
                style={{backgroundColor: 'rgba(0,0,0,0)', height: "100%", width: "100%"}}
            />


            <BottomSheet
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                onAnimate={handleSheetAnimate}

                // add bottom inset to elevate the sheet
                // bottomInset={ repostWithComment ? 0 : 40 }

                // set `detached` to true
                // detached={true}

                style={styles.sheetContainer}
                backgroundStyle={{
                    backgroundColor: theme == 'light' ? 'rgba(255, 255, 255, 0)' : 'rgba(35, 35, 35, 0)',
                    // marginBottom: 10,
                    // flexDirection: 'column',
                }}

                // handleHeight={0}
                handleStyle={{backgroundColor: theme == 'light' ? '#FFF' : '#1D1D1D', width: "100%", alignSelf: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15}}
                // handleIndicatorStyle={{height: 0, width: 0}}
                // handleComponent={null}
                handleIndicatorStyle={{backgroundColor: theme == 'light' ? '#999' : '#FFF'}}
            >

                <BottomSheetView style={theme == 'light' ? styles.lightContentContainer : styles.darkContentContainer}>

                    {
                        !repostWithComment ?
                            <>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    style={theme == 'light' ? styles.lightButtonStyle : styles.darkButtonStyle}
                                    onPress={onRepost()}
                                >
                                    <Feather
                                        name="repeat"
                                        size={25}
                                        color={theme == 'light' ? '#444' : '#FF4848'}
                                        marginLeft={30}
                                        marginRight={20}
                                        marginTop={1.5}
                                    />
                                    <Text style={theme == 'light' ? styles.lightText : styles.darkText}>Repost</Text>
                                </TouchableOpacity>
                                
                                
                                
                                <TouchableOpacity
                                        activeOpacity={0.5}
                                        style={theme == 'light' ? styles.lightButtonStyle : styles.darkButtonStyle}
                                        onPress={() => bottomSheetRef.current.snapToIndex(2)}
                                    >
                                    <Feather
                                        name="edit-3"
                                        size={28}
                                        color={theme == 'light' ? '#444' : '#FF4848'}
                                        marginLeft={30}
                                        marginRight={20}
                                        marginTop={1.5}
                                    />
                                    <Text style={theme == 'light' ? styles.lightText : styles.darkText}>Repost with comment</Text>
                                </TouchableOpacity>
                            </>
                        :

                    
                        <View style={theme == 'light' ? styles.lightTextContainer : styles.darkTextContainer}>
                            
                            
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={theme == 'light' ? styles.lightDoneButton : styles.darkDoneButton}
                                onPress={onRepostWithComment()}
                            >
                                <Text style={theme == 'light' ? styles.lightDoneText : styles.darkDoneText}>
                                    Repost
                                </Text>
                            </TouchableOpacity>


                            <TextInput
                                // inputAccessoryViewID={textInputAccessoryViewID}
                                style={theme == 'light' ? styles.lightTextInput : styles.darkTextInput}
                                // height: window.height * 0.3
                                multiline
                                maxLength={10000}
                                // handleFocus={handleFocus}
                                // handleBlur={handleBlur}
                                // blurOnSubmit={false}
                                autoFocus={true}
                                autoCapitalize="none"
                                autoCorrect
                                // onSelectionChange={onSelectionChange}
                                placeholder= {"Type your comment here..."}
                                placeholderTextColor= { theme == 'light' ? "#888888" : "#CCCCCC"}
                                value={comment}
                                onChangeText={(newValue) => setComment(newValue)}
                            />

                            

                        </View>
                    }

                </BottomSheetView>
                
            </BottomSheet>
        </View>
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
        color: '#111',
        fontSize: 22,
        fontWeight: '500',
        alignSelf: 'center',
    },
    darkText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '500',
        alignSelf: 'center',
    },
    // container: {
    //     // flex: 1,
    //     padding: 24,
    //     backgroundColor: "grey",
    // },
    lightContentContainer: {
        // flex: 1,
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        // alignContent: "flex-end",
        // height: "100%",
        // width: "100%",
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        flexDirection: 'column',
        // alignItems: 'center',
        // alignContent: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#FFF',
        // backgroundColor: '#F6F6F6',
        // borderWidth: 1,
        // borderColor: '#E2E2E2',
    },
    darkContentContainer: {
        // flex: 1,
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        // height: "100%",
        // width: "100%",
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        flexDirection: 'column',
        // alignItems: 'center',
        // alignContent: 'center',
        justifyContent: 'flex-start',
        // backgroundColor: '#242424',
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
        // borderTopWidth: 0.3,
        borderColor: '#888',
    },
    darkButtonStyle: {
        flexDirection: 'row',
        width: "100%",
        height: 60,
        alignSelf: 'flex-start',
        justifiyContent: 'center',
        alignItems: 'center',
        // borderTopWidth: 0.3,
        borderColor: '#888',
    },
    lightTextContainer: {
        color: '#444444',
        // height: 400,
        marginHorizontal: 5,
        borderRadius: 10,
        maxHeight: window.height * 0.35,
        // borderWidth: 1,
        // borderColor: '#DDDDDD',
    },
    darkTextContainer: {
        color: '#EEEEEE',
        // height: 400,
        marginHorizontal: 5,
        maxHeight: window.height * 0.35,
        borderRadius: 10,
        // borderWidth: 1,
        // borderColor: '#333333'
    },
    lightTextInput: {
        color: '#666666',
        fontSize: 22,
        marginHorizontal: 12,
        fontWeight: "500",
    },
    darkTextInput: {
        color: '#EEEEEE',
        fontSize: 22,
        marginHorizontal: 12,
        fontWeight: "500",
    },
    lightDoneButton: {

        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#AAAAAA',
        marginLeft: 10,
        marginRight: 15,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
   },
   darkDoneButton: {

        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#AAAAAA',
        marginLeft: 10,
        marginRight: 15,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    lightDoneText: {
        color: '#111',
        fontSize: 20,
        fontWeight: '500',
        alignSelf: 'center',
        marginHorizontal: 12,
        marginVertical: 10,
    },
    darkDoneText: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '500',
        alignSelf: 'center',
    },
})