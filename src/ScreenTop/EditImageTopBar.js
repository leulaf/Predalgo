import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';


// light mode icons
import BackLight from '../../assets/back.svg';

// dark mode icons
import BackDark from '../../assets/back_light.svg';

const windowWidth = Dimensions.get('window').width;

const EditMemeTopBar = ({ theme, forMeme, onSave, onGoBack, navigation}) => {



    return (
            <View style={styles.container}>
                
                <View style={styles.rowContainer}>
                    {/* back button */}
                    <TouchableOpacity 
                                style={{flexDirection: 'row'}}
                                onPress={() => {onGoBack()}}
                    >
                        {
                            theme == 'light' ?
                                <BackDark style={styles.lightBackIcon} width={22} height={22}/>
                            :
                                <BackDark style={styles.darkBackIcon} width={22} height={22}/>
                        }
                        
                    </TouchableOpacity>

                { forMeme ?
                        <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
                            Tap and drag to add text
                        </Text>
                    :
                        <View style={{flex: 1}}/>
                }


                    {/* Finish button */}
                    <TouchableOpacity 
                                style={theme == 'light' ? styles.lightFinishContainer : styles.darkFinishContainer}
                                onPress={() => onSave()}
                    >

                        <Text style={theme == 'light' ? styles.lightFinishText : styles.darkFinishText}>
                            Finish
                        </Text>
                        
                    </TouchableOpacity>

                </View>
                
            </View>
    );
}


const styles = StyleSheet.create({
    container: {
        height: 90,
        backgroundColor: 'rgba(255, 255, 255, 0.0)',
    },
    rowContainer: {
        flex: 1,
        marginTop: 55,
        marginHorizontal: 7,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    lightBackIcon: {
        // alignSelf: 'center',
        padding: 10,
        color: '#000',
    },
    darkBackIcon: {
        // alignSelf: 'center',
        padding: 10,
        color: '#fff',
    },
    finishText: {
        fontSize: 20,
        color: '#222222',
        fontWeight: "600",
    },
    lightText: {
        flex: 1,
        fontSize: 20,
        color: '#444444',
        fontWeight: "600",
        textAlign: 'center', 
    },
    darkText: {
        flex: 1,
        fontSize: 20,
        color: '#FAFAFA',
        fontWeight: "600",
        textAlign: 'center', 
    },
    lightFinishContainer: {
        width: 80,
        height: 35,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#222222',
        backgroundColor: '#222222',
        alignItems: 'center', 
        justifyContent: 'center', 
        alignContent: 'center'
    },
    darkFinishContainer: {
        width: 80,
        height: 35,
        borderRadius: 100,
        // borderWidth: 2,
        // borderColor: '#222222',
        backgroundColor: '#FFFFFF',
        alignItems: 'center', 
        justifyContent: 'center', 
        alignContent: 'center'
    },
    lightFinishText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: "600",
        alignSelf: 'center',
    },
    darkFinishText: {
        fontSize: 20,
        color: '#222222',
        fontWeight: "600",
        alignSelf: 'center',
    }
});


export default EditMemeTopBar;
