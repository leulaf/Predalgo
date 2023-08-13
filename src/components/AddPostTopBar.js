import React, {useContext} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {ThemeContext} from '../../context-store/context';
import { Feather } from '@expo/vector-icons';

// light mode icons
import BackLight from '../../assets/back.svg';
import BookmarkLight from '../../assets/saved_inactive.svg';

// dark mode icons
import BackDark from '../../assets/back_light.svg';
import BookmarkDark from '../../assets/saved_inactive_dark.svg';

const AddPostTopBar = ({navToFavorites, navToSearchMemes}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const navigation = useNavigation();

    return <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
        
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
            
        </TouchableOpacity>

        <TouchableOpacity 
            style={theme == 'light' ? styles.lightBar : styles.darkBar}
            onPress={navToSearchMemes}
        >
            
            <Feather name="search" style={theme == "light" ? styles.lightIconStyle : styles.darkIconStyle}/>

            <Text style={theme == "light" ? styles.lightTextStyle : styles.darkTextStyle}>
                Search
            </Text>

        </TouchableOpacity>

        {/* bookmark button */}
        <TouchableOpacity 
            style={{flexDirection: 'row'}}
            onPress={navToFavorites}
        >
            {
                theme == 'light' ?
                    <BookmarkLight style={styles.saveIcon} width={24} height={24}/>
                :
                    <BookmarkDark style={styles.saveIcon} width={24} height={24}/>
            }

            
        </TouchableOpacity>

    </View>
}

const styles = StyleSheet.create({
    lightBar: {
        height: 36,
        width: 315,
        borderRadius: 20,
        marginRight: 10,
        marginTop: 40,
        marginBottom: 0,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#FEFEFE',
        borderWidth: 1.5,
        borderColor: '#DADADA',
    },
    darkBar: {
        height: 36,
        width: 315,
        borderRadius: 20,
        marginRight: 10,
        marginTop: 40,
        marginBottom: 0,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#141414',
        borderWidth: 1.5,
        borderColor: '#282828',
    },
    backButton: {
        marginTop: 55,
        marginLeft: 10,
        padding: 5,
    },
    saveIcon: {
        marginTop: 54,
        marginLeft: 5,
        padding: 5,
    },
    backIcon: {
        // alignSelf: 'center',
        marginTop: 57,
        marginHorizontal: 10,
        padding: 10,
    },
    lightText: {
        fontSize: 20,
        color: '#333333',
        fontWeight: '600',
        marginTop: 45,
        marginHorizontal: 5
    },
    darkText: {
        fontSize: 20,
        color: '#f2f2f2',
        fontWeight: '600',
        marginTop: 45,
        marginLeft: 5
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
});

export default AddPostTopBar;
 