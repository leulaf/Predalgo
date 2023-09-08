import React from 'react';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { AuthenticatedUserContext } from '../../../../context-store/context';

import BottomSheet from "@gorhom/bottom-sheet";

export default ThreeDotsSheet = ({commentId, theme}) => {
    // ref
    const bottomSheetRef = React.useRef(null);

    const [currentIndex, setCurrentIndex] = React.useState(0);

    // variables
    const snapPoints = React.useMemo(() => [ "25%", "1%"], []);

    const {commentOptions, setCommentOptions} = React.useContext(AuthenticatedUserContext);

    const handleSheetAnimate = React.useCallback((from, to) => {
        // console.log('handleSheetAnimate', from, to);
        
        if(to == 0){
            setCurrentIndex(0);
        }else if(to == 1){
            setCurrentIndex(1);
            setCommentOptions(false)
        }
        
    }, [snapPoints]);


    return (
        //<View style={styles.container}>
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                onAnimate={handleSheetAnimate}
                // add bottom inset to elevate the sheet
                // bottomInset={46}
        
                // set `detached` to true
                // detached={true}
                style={styles.sheetContainer}
                backgroundStyle={{
                    backgroundColor: theme == 'light' ? 'rgba(255, 255, 255, 1)' : 'rgba(32, 32, 32, 1)',
                    marginBottom: 10,
                    flexDirection: 'column',
                }}
            >
                <View style={styles.contentContainer}>
                    {/* 
                        maybe turn three dots to X when clicked to indecate
                        that the user can click it again to close the sheet
                    */}

                    {/* 
                        IMPORTANT:
                        make the three dots that closes the sheet is from the same comment
                        if not then change the sheet to the new comment
                    
                    */}
                </View>
                
        
            </BottomSheet>
        //</View>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        padding: 24,
        backgroundColor: "grey",
    },
    sheetContainer: {
        // flex: 1,
        // padding: 24,
        // width: '100%',
        // backgroundColor: "grey",
        // add horizontal space
        // marginHorizontal: 24,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        overflow: 'hidden',
        borderRadius: 20,
    },
    contentContainer: {
        // flex: 1,
        // width: '100%',
        // height: '100%',
        // alignItems: "center",
        height: 600,
        width: "95%",
        borderRadius: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        // alignItems: 'center',
        // alignContent: 'center',
        // justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1,
        borderColor: '#E2E2E2',
    },
    lightText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    darkText: {
        color: '#FFFFFF',
        fontSize: 18,
    }
})