import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {ThemeContext} from '../../context-store/context';

// light mode icons
import BackLight from '../../assets/back.svg';

// dark mode icons
import BackDark from '../../assets/back_light.svg';


const windowWidth = Dimensions.get('window').width;

const ProfileTop = ({username}) => {
    const navigation = useNavigation();
    const {theme,setTheme} = useContext(ThemeContext);

    return (
            <View style={theme == 'light' ? styles.lightTopContainer : styles.darkTopContainer}>
                

                {/* Username / back button */}
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
                    
                    <Text style={theme == 'light' ? styles.lightUsername : styles.darkUsername}>
                        @{username}
                    </Text>
                    
                </TouchableOpacity>

                
                
            </View>
    );
}


const styles = StyleSheet.create({
    lightTopContainer: {
        backgroundColor: 'white',
        height: 75,
        flexDirection: 'row',
    },
    darkTopContainer: {
        backgroundColor: '#1A1A1A',
        height: 75,
        flexDirection: 'row',
    },
    backIcon: {
        // alignSelf: 'center',
        marginTop: 47,
        marginLeft: 5
    },
    lightUsername: {
        fontSize: 20,
        color: '#222222',
        fontWeight: '600',
        marginTop: 45,
        marginLeft: 5
    },
    darkUsername: {
        fontSize: 20,
        color: '#f2f2f2',
        fontWeight: '600',
        marginTop: 45,
        marginLeft: 5
    },
});


export default ProfileTop;
