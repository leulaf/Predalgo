import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {ThemeContext} from '../../context-store/context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { set } from 'react-native-reanimated';

const MemesSearchBar = ({term, setTerm}) => {
    const navigation = useNavigation();
    const {theme,setTheme} = useContext(ThemeContext);
    const [tempTerm, setTempTerm] = useState(term);

    return <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
        
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

        <TouchableOpacity
            style={{marginTop: 60}}
            onPress={() => navigation.goBack(null)}
        >
            <Text style={theme == 'light' ? styles.lightInputStyle : styles.darkInputStyle}>
                Cancel
            </Text>
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    lightSearchBar: {
        height: 40,
        width: 325,
        borderRadius: 20,
        marginLeft: 5,
        marginRight: 10,
        marginTop: 47,
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
        marginLeft: 5,
        marginRight: 10,
        marginTop: 47,
        marginBottom: 0,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#282828',
        borderWidth: 1.5,
        borderColor: '#444444',
    },
    lightInputStyle: {
        flex: 1,
        fontSize: 18,
        color: '#444444',
        alignSelf: 'center',
    },
    darkInputStyle: {
        flex: 1,
        fontSize: 18,
        color: '#EEEEEE',
        alignSelf: 'center',
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
        backgroundColor: 'white',
        height: 100,
        flexDirection: 'row',
    },
    darkContainer: {
        backgroundColor: '#1A1A1A',
        height: 100,
        flexDirection: 'row',
    },

});

export default MemesSearchBar;
