import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {ThemeContext} from '../../context-store/context';

// light mode icons
import BackLight from '../../assets/back.svg';

// dark mode icons
import BackDark from '../../assets/back_light.svg';

const windowWidth = Dimensions.get('window').width;

const SimpleTopBar = ({title}) => {
    const navigation = useNavigation();
    const {theme,setTheme} = useContext(ThemeContext);

    return (
            <View style={theme == 'light' ? styles.lightTopContainer : styles.darkTopContainer}>
                

                {/* back button */}
                <TouchableOpacity 
                            style={{flexDirection: 'row'}}
                            onPress={() => {navigation.goBack()}}
                >
                    {
                        theme == 'light' ?
                            <BackLight style={styles.backIcon} width={22} height={22}/>
                        :
                            <BackDark style={styles.backIcon} width={22} height={22}/>
                    }
                    
                    <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
                        {title}
                    </Text>
                    
                </TouchableOpacity>

                
                
            </View>
    );
}


const styles = StyleSheet.create({
    lightTopContainer: {
        backgroundColor: 'white',
        height: 90,
        flexDirection: 'row',
        borderBottomWidth: 1.5,
        borderColor: '#efefef'
    },
    darkTopContainer: {
        backgroundColor: '#0C0C0C',
        height: 90,
        flexDirection: 'row',
        borderBottomWidth: 1.5,
        borderColor: '#2f2f2f'
    },
    backIcon: {
        // alignSelf: 'center',
        marginTop: 52,
        marginLeft: 10,
        padding: 10,
    },
    lightText: {
        fontSize: 20,
        color: '#222222',
        fontWeight: '600',
        marginTop: 50,
        marginLeft: 5
    },
    darkText: {
        fontSize: 20,
        color: '#f2f2f2',
        fontWeight: '600',
        marginTop: 50,
        marginLeft: 5
    },
});


export default SimpleTopBar;
