import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {ThemeContext} from '../../context-store/context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const MemesSearchBar = ({term, setTerm}) => {
    const navigation = useNavigation();
    const {theme,setTheme} = useContext(ThemeContext);
    const [tempTerm, setTempTerm] = useState(term);

    return (
        <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
            
            <View style={{flexDirection: 'row', marginTop: 40, alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>

                {/* Search bar */}
                <View style={theme == 'light' ? styles.lightSearchBar : styles.darkSearchBar}>
                    <Feather name="search" style={theme == "light" ? styles.lightIconStyle : styles.darkIconStyle}/>
                    <TextInput
                        autoFocus={true}
                        autoCapitalize="none"
                        autoCorrect={false}
                        maxLength={50}
                        style={theme == 'light' ? styles.lightInputStyle : styles.darkInputStyle} 
                        placeholder="Search"
                        value={tempTerm}
                        placeholderTextColor={theme == "light" ? "#777777" : "#AAAAAA"}
                        onChangeText={newTerm => setTempTerm(newTerm)}
                        onEndEditing={(newTerm) => setTerm(newTerm.nativeEvent.text)}
                    />
                </View>

                {/* Cancel button */}
                <TouchableOpacity
                    style={{justifyContent: 'center'}}
                    onPress={() => navigation.goBack(null)}
                >
                    <Text style={theme == 'light' ? styles.lightCancelStyle : styles.darkCancelStyle}>
                        Cancel
                    </Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    lightSearchBar: {
        height: 40,
        width: 325,
        borderRadius: 20,
        marginLeft: 8,
        marginRight: 9,
        marginBottom: 0,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#FEFEFE',
        borderWidth: 1.5,
        borderColor: '#DDDDDD',
    },
    darkSearchBar: {
        height: 40,
        width: 325,
        borderRadius: 20,
        marginLeft: 8,
        marginRight: 9,
        marginBottom: 0,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#141414',
        borderWidth: 1.5,
        borderColor: '#242424',
    },
    lightInputStyle: {
        flex: 1,
        fontSize: 18,
        color: '#444444',
    },
    darkInputStyle: {
        flex: 1,
        fontSize: 18,
        color: '#EEEEEE',
    },
    lightCancelStyle: {
        fontSize: 18,
        color: '#444444',
    },
    darkCancelStyle: {
        fontSize: 18,
        color: '#EEEEEE',
    },
    lightIconStyle: {
        fontSize: 22,
        alignSelf: 'center',
        marginHorizontal: 7,
        color: '#777777',
    },
    darkIconStyle: {
        fontSize: 22,
        alignSelf: 'center',
        marginHorizontal: 7,
        color: '#888888',
    },
    lightContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 105,
    },
    darkContainer: {
        flexDirection: 'row',
        height: 105,
        backgroundColor: '#0C0C0C',
    },

});

export default MemesSearchBar;
