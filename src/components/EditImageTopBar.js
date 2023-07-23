import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {ThemeContext} from '../../context-store/context';

// light mode icons
import BackLight from '../../assets/back.svg';

// dark mode icons
import BackDark from '../../assets/back_light.svg';

const windowWidth = Dimensions.get('window').width;

const EditMemeTopBar = ({ forMeme, onSave }) => {
    const navigation = useNavigation();
    const {theme,setTheme} = useContext(ThemeContext);

    return (
            <View style={styles.container}>
                
                <View style={styles.rowContainer}>
                    {/* back button */}
                    <TouchableOpacity 
                                style={{flexDirection: 'row'}}
                                onPress={() => {navigation.goBack()}}
                    >
                        <BackLight style={styles.backIcon} width={22} height={22}/>
                        
                    </TouchableOpacity>

                { forMeme ?
                        <Text style={styles.text}>
                            Tap and drag to add text
                        </Text>
                    :
                        <View style={{flex: 1}}/>
                }


                    {/* Finish button */}
                    <TouchableOpacity 
                                style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', alignContent: 'center'}}
                                onPress={() => onSave()}
                    >
                        <View style={styles.finishContainer}>
                            <Text style={styles.finishText}>
                                Finish
                            </Text>
                        </View>
                        
                    </TouchableOpacity>

                </View>
                
            </View>
    );
}


const styles = StyleSheet.create({
    container: {
        height: 90,
        backgroundColor: 'white',
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
    backIcon: {
        padding: 10,
    },
    finishText: {
        fontSize: 20,
        color: '#222222',
        fontWeight: '600',
    },
    text: {
        flex: 1,
        fontSize: 20,
        color: '#333333',
        fontWeight: '600',
        textAlign: 'center', 
    },
    finishContainer: {
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
    finishText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: '600',
        alignSelf: 'center',
    }
});


export default EditMemeTopBar;
