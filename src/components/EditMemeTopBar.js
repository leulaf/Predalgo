import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {ThemeContext} from '../../context-store/context';

// light mode icons
import BackLight from '../../assets/back.svg';

// dark mode icons
import BackDark from '../../assets/back_light.svg';

const windowWidth = Dimensions.get('window').width;

const EditMemeTopBar = ({title, onSave}) => {
    const navigation = useNavigation();
    const {theme,setTheme} = useContext(ThemeContext);

    return (
            <View style={styles.container}>
                

                {/* back button */}
                <TouchableOpacity 
                            style={{flexDirection: 'row'}}
                            onPress={() => {navigation.goBack()}}
                >
                    <BackLight style={styles.backIcon} width={22} height={22}/>
                    
                </TouchableOpacity>

                <View style={{flex: 1}}>
                
                </View>

                {/* back button */}
                <TouchableOpacity 
                            style={{flexDirection: 'column',}}
                            onPress={() => onSave()}
                >
                    <View style={styles.finishContainer}>
                        <Text style={styles.finishText}>
                            Finish
                        </Text>
                    </View>
                    
                </TouchableOpacity>

                
                
            </View>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: 90,
        flexDirection: 'row',
    },
    backIcon: {
        // alignSelf: 'center',
        marginTop: 60,
        marginLeft: 10,
        padding: 10,
    },
    text: {
        fontSize: 20,
        color: '#222222',
        fontWeight: '600',
        marginTop: 58,
        marginLeft: 5
    },
    finishContainer: {
        width: 80,
        height: 35,
        marginTop: 52,
        marginRight: 5,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#222222',
        backgroundColor: '#222222',
    },
    finishText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: '600',
        alignSelf: 'center',
        // marginTop: 45,
        marginTop: 3
    }
});


export default EditMemeTopBar;
