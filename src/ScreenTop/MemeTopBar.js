import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {ThemeContext} from '../../context-store/context';
import { firebase, db, storage } from '../config/firebase';
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore"; 

// light mode icons
import BackLight from '../../assets/back.svg';
import BookmarkLight from '../../assets/saved_inactive.svg';

// dark mode icons
import BackDark from '../../assets/back_light.svg';
import BookmarkDark from '../../assets/saved_inactive_dark.svg';

const windowWidth = Dimensions.get('window').width;

const favoriteTemplate = async (name, url, height, width) => {

    const templateRef = doc(db, "favoriteImageTemplates", firebase.auth().currentUser.uid, "templates", name);
    const templateSnapshot = await getDoc(templateRef);
    
    if (!templateSnapshot.exists()) {
        // add post to likes collection
        await setDoc(templateRef, {
            name: name,
            url: url,
            height,
            width
        }).then(() => {
            Alert.alert('Added to favorites');
        })
    }else{
        deleteFavoriteTemplate(name);
    }

}

const deleteFavoriteTemplate = async (name) => {
    const templateRef = doc(db, 'favoriteImageTemplates', firebase.auth().currentUser.uid, "templates", name);

    deleteDoc(templateRef).then(() => {
        Alert.alert('Deleted from favorites');
    }).catch((error) => {
        console.log(error);
    });
}

const MemeTopBar = ({name, url, height, width}) => {
    const navigation = useNavigation();
    const {theme,setTheme} = useContext(ThemeContext);

    return (
        <View style={theme == 'light' ? styles.lightTopContainer : styles.darkTopContainer}>


            {/* back button */}
            <TouchableOpacity 
                        style={{flex: 1, flexDirection: 'row'}}
                        onPress={() => {navigation.goBack()}}
            >
                {
                    theme == 'light' ?
                        <BackLight style={styles.backIcon} width={22} height={22}/>
                    :
                        <BackDark style={styles.backIcon} width={22} height={22}/>
                }

                <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
                    {name.substring(0, Math.min(name.length, 12)) + '...'}
                </Text>
                
            </TouchableOpacity>


            {/* bookmark button */}
            <TouchableOpacity 
                        style={{flexDirection: 'row'}}
                        onPress={() => {favoriteTemplate(name, url, height, width)}}
            >
                {
                    theme == 'light' ?
                        <BookmarkLight style={styles.backIcon} width={23} height={23}/>
                    :
                        <BookmarkDark style={styles.backIcon} width={23} height={23}/>
                }
                
                <Text style={theme == 'light' ? styles.lightFavoriteText : styles.darkFavoriteText}>
                    Favorite
                </Text>
                
            </TouchableOpacity>
            
        </View>
    );
}


const styles = StyleSheet.create({
    lightTopContainer: {
        backgroundColor: '#FCFCFC',
        height: 90,
        flexDirection: 'row',
        borderBottomWidth: 1.5,
        borderColor: '#DDDDDD'
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
        marginTop: 53,
        marginLeft: 10,
        padding: 10,
    },
    lightText: {
        fontSize: 20,
        color: '#444444',
        fontWeight: '600',
        marginTop: 51,
        marginLeft: 5,
        marginRight: 10
    },
    darkText: {
        fontSize: 20,
        color: '#E4E4E4',
        fontWeight: '600',
        marginTop: 51,
        marginLeft: 5,
        marginRight: 10
    },
    lightFavoriteText: {
        fontSize: 20,
        color: '#222222',
        fontWeight: '600',
        marginTop: 51,
        marginLeft: 5,
        marginRight: 10
    },
    darkFavoriteText: {
        fontSize: 20,
        color: '#f2f2f2',
        fontWeight: '600',
        marginTop: 51,
        marginLeft: 5,
        marginRight: 10
    },
});


export default MemeTopBar;
