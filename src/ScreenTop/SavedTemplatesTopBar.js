import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {ThemeContext} from '../../context-store/context';
import { Feather } from '@expo/vector-icons';

// light mode icons
import BackLight from '../../assets/back.svg';

// dark mode icons
import BackDark from '../../assets/back_light.svg';

const SavedTemplatesTopBar = ({navToSearchMemes}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const navigation = useNavigation();

    return <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
        
        {/* back button */}
        <TouchableOpacity 
            style={{flexDirection: 'row', }}
            onPress={() => {navigation.goBack()}}
        >
            {
                theme == 'light' ?
                    <BackDark style={styles.lightBackButton} width={24} height={24}/>
                :
                    <BackDark style={styles.darkBackButton} width={24} height={24}/>
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

    </View>
}

const styles = StyleSheet.create({
    lightContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        height: 100,
        flexDirection: 'row',
        postition: 'absolute',
        top: 0,
    },
    darkContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        height: 100,
        flexDirection: 'row',
        postition: 'absolute',
        top: 0,
    },
    lightBar: {
        height: 38,
        flex: 1,
        borderRadius: 20,
        marginRight: 15,
        marginTop: 40,
        marginBottom: 0,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
    },
    darkBar: {
        height: 38,
        flex: 1,
        borderRadius: 20,
        marginRight: 15,
        marginTop: 40,
        marginBottom: 0,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#161616',
        borderWidth: 1.5,
        borderColor: '#2d2d2d',
    },
    lightBackButton: {
        marginTop: 55,
        marginLeft: 10,
        padding: 5,
        color: '#000',
    },
    darkBackButton: {
        marginTop: 55,
        marginLeft: 10,
        padding: 5,
        color: '#fff',
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
        fontWeight: "600",
        marginTop: 45,
        marginHorizontal: 5
    },
    darkText: {
        fontSize: 20,
        color: '#f2f2f2',
        fontWeight: "600",
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
    
});

export default SavedTemplatesTopBar;
 