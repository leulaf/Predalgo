import React, {useContext} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {ThemeContext} from '../../context-store/context';
import { Feather } from '@expo/vector-icons';
import MenuLight from '../../assets/menu_light.svg';
import MenuDark from '../../assets/menu_dark.svg';
import PredalgoLight from '../../assets/Predalgo_logo_light.svg';
import PredalgoDark from '../../assets/Predalgo_logo_dark.svg';

const SearchBar = ({navigation, term, onTermChange, onTermSubmit, openDrawer}) => {
    const {theme,setTheme} = useContext(ThemeContext);

    return <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
        <TouchableOpacity 
                onPress={() => openDrawer()}
                style={styles.menuButton}
            >
            {theme == "light" ?
                <MenuLight width={26} height={26}/>
                :
                <MenuDark width={26} height={26}/>
            }
            
        </TouchableOpacity>
        
        <View style={theme == 'light' ? styles.lightSearchBar : styles.darkSearchBar}>
            <Feather name="search" style={theme == "light" ? styles.lightIconStyle : styles.darkIconStyle}/>
            <TextInput 
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.inputStyle} 
                placeholder="Search"
                value={term}
                placeholderTextColor={theme == "light" ? "#777777" : "#AAAAAA"}
                onChangeText={newTerm => onTermChange(newTerm)}
                // onEndEditing={(newTerm) => onTermChange(newTerm)}
            />
        </View>

        {theme == "light" ?
            <PredalgoLight style={styles.logoStyle} width={35} height={35}/>
            :
            <PredalgoDark style={styles.logoStyle} width={35} height={35}/>
        }
    </View>
}

const styles = StyleSheet.create({
    lightSearchBar: {
        height: 36,
        width: 300,
        borderRadius: 20,
        marginLeft: 5,
        marginRight: 10,
        marginTop: 47,
        marginBottom: 0,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#FDFDFD',
        borderWidth: 1.5,
        borderColor: '#CCCCCC',
    },
    darkSearchBar: {
        height: 36,
        width: 300,
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
    inputStyle: {
        flex: 1,
        fontSize: 18,
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
    darkIconStyle: {
        fontSize: 22,
        alignSelf: 'center',
        marginHorizontal: 7,
        color: '#BBBBBB',
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
    menuButton: {
        marginTop: 55,
        marginLeft: 10,
        padding: 5,
    },
    logoStyle: {
        marginTop: 55,
        marginRight: 15,
    }
});

export default SearchBar;
 