import React, {useContext} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {ThemeContext} from '../../context-store/context';
import { Feather } from '@expo/vector-icons';
import MenuLight from '../../assets/menu_light.svg';
import MenuDark from '../../assets/menu_dark.svg';
import PredalgoLight from '../../assets/Predalgo_logo_light.svg';
import PredalgoDark from '../../assets/Predalgo_logo_dark.svg';

const SearchBar = ({term, onTermChange, onTermSubmit, openDrawer}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const navigation = useNavigation();

    return <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
        <TouchableOpacity 
            onPress={() => openDrawer()}
            style={styles.menuButton}
        >
            {theme == "light" ?
                <MenuLight width={24} height={24}/>
                :
                <MenuDark width={24} height={24}/>
            }
            
        </TouchableOpacity>
        
        <TouchableOpacity 
            style={theme == 'light' ? styles.lightBar : styles.darkBar}
            onPress={() => navigation.navigate('Search')}
        >
            
            <Feather name="search" style={theme == "light" ? styles.lightIconStyle : styles.darkIconStyle}/>

            <Text style={theme == "light" ? styles.lightTextStyle : styles.darkTextStyle}>
                Search
            </Text>

        </TouchableOpacity>

        {theme == "light" ?
            <PredalgoLight style={styles.logoStyle} width={33} height={33}/>
            :
            <PredalgoDark style={styles.logoStyle} width={33} height={33}/>
        }
    </View>
}

const styles = StyleSheet.create({
    lightBar: {
        height: 36,
        width: 300,
        borderRadius: 20,
        marginLeft: 5,
        marginRight: 11,
        marginTop: 40,
        marginBottom: 0,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#FEFEFE',
        borderWidth: 1.5,
        borderColor: '#EAEAEA',
    },
    darkBar: {
        height: 36,
        width: 300,
        borderRadius: 20,
        marginLeft: 5,
        marginRight: 11,
        marginTop: 40,
        marginBottom: 0,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#141414',
        borderWidth: 1.5,
        borderColor: '#282828',
    },
    darkTextStyle: {
        flex: 1,
        alignSelf: 'center',
        fontSize: 18,
        color: '#AAAAAA',
    },
    lightTextStyle: {
        flex: 1,
        alignSelf: 'center',
        fontSize: 18,
        color: '#777777',
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
        backgroundColor: '#0C0C0C',
        height: 100,
        flexDirection: 'row',
    },
    menuButton: {
        marginTop: 52,
        marginLeft: 10,
        padding: 5,
    },
    logoStyle: {
        marginTop: 52,
        marginRight: 15,
    }
});

export default SearchBar;
 