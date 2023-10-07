import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Alert} from 'react-native';
import { AuthenticatedUserContext } from '../../context-store/context';

import { saveImageTemplate, unsaveImageTemplate } from '../shared/functions/ImageTemplateFunctions';


import { getAuth } from 'firebase/auth';

// light mode icons
import BackLight from '../../assets/back.svg';
import BookmarkLight from '../../assets/saved_inactive.svg';
import BookmarkedLight from '../../assets/saved.svg';

// dark mode icons
import BackDark from '../../assets/back_light.svg';
import BookmarkDark from '../../assets/saved_inactive_dark.svg';
import BookmarkedDark from '../../assets/saved_dark.svg';

const windowWidth = Dimensions.get('window').width;

const auth = getAuth();

// const SaveTemplate = async (name, url, height, width) => {
//     return new Promise(async (resolve, reject) => {
//         const templateRef = doc(db, "savedImageTemplates", firebase.auth().currentUser.uid, "templates", name);
        
//         // add post to likes collection
//         await setDoc(templateRef, {
//             uploader: auth.currentUser.displayName,
//             name: name,
//             url: url,
//             height,
//             width
//         }).then(() => {
//             // Alert.alert('Saved template');
//             resolve(true);
//         }).catch((error) => {
//             // console.log(error);
//             reject(false);
//         });
//     });
// }

// const deleteSaveTemplate = async (name) => {
//     return new Promise(async (resolve, reject) => {
//         const templateRef = doc(db, 'savedImageTemplates', firebase.auth().currentUser.uid, "templates", name);

//         deleteDoc(templateRef).then(() => {
//             // Alert.alert('Unsaved template');
//             resolve(true);
//         }).catch((error) => {
//             // console.log(error);
//             reject(false);
//         });
//     });
// }

const MemeTopBar = ({navigation, theme, name, uploader, url, height, width, fromSavedTemplates}) => {
    const {user, setUser} = React.useContext(AuthenticatedUserContext);

    const [bookmarked, setBookmarked] = useState(fromSavedTemplates || user?.savedImageTemplates?.some((template) => template.name === name));

    const toggleBookmark =  () => async()  => {
        if(bookmarked){
            setBookmarked(false);

            await unsaveImageTemplate(name, url, uploader, height, width)
            .then((result) => {
                // !result && setBookmarked(true);
                setUser({
                    ...user,
                    savedImageTemplates: user.savedImageTemplates.filter((template) => {return template.name !== name})
                })
            })
            .catch((error) => {
                // console.log(error);
                setBookmarked(true)
            })
        }else{
            setBookmarked(true);

            await saveImageTemplate(name, url, uploader, height, width)
            .then((result) => {
                // !result && setBookmarked(false);
                setUser({
                    ...user,
                    savedImageTemplates: [...user.savedImageTemplates, {
                        name: name,
                        url: url,
                        uploader: uploader,
                        height: height,
                        width: width,
                    }]
                })
            })
            .catch((error) => {
                // console.log(error);
                setBookmarked(false)
            })
        }
    }

    let bookmarkIcon, bookmarkedIcon;
    if(theme == 'light'){
        bookmarkIcon = <BookmarkLight style={styles.bookmarkIcon} width={23} height={23}/>;
        bookmarkedIcon = <BookmarkedLight style={styles.bookmarkIcon} width={23} height={23}/>;
    }else{
        bookmarkIcon = <BookmarkDark style={styles.bookmarkIcon} width={23} height={23}/>;
        bookmarkedIcon = <BookmarkedDark style={styles.bookmarkIcon} width={23} height={23}/>;
    }


    return (
        <View style={theme == 'light' ? styles.lightTopContainer : styles.darkTopContainer}>


            {/* back button */}
            <TouchableOpacity
                activeOpacity={0.9}
                style={{flex: 1, flexDirection: 'row'}}
                onPress={() => {navigation.goBack()}}
            >
                {
                    theme == 'light' ?
                        <BackDark style={styles.lightBackIcon} width={22} height={22}/>
                    :
                        <BackDark style={styles.darkBackIcon} width={22} height={22}/>
                }

                <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
                    {name.substring(0, Math.min(name.length, 12)) + (name.length >= 12 ? '...' : '')}
                </Text>
                
            </TouchableOpacity>


            {/* bookmark button */}
            <TouchableOpacity 
                activeOpacity={0.3}
                style={{flexDirection: 'row'}}
                onPress={toggleBookmark()}
            >
                {
                    bookmarked ?
                        bookmarkedIcon
                    :
                        bookmarkIcon
                }
                
                <Text style={theme == 'light' ? styles.lightSaveText : styles.darkSaveText}>
                    {
                        bookmarked ?
                            "Saved"
                        :
                            "Save"
                    }
                </Text>
                
            </TouchableOpacity>
            
        </View>
    );
}


const styles = StyleSheet.create({
    lightTopContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        height: 90,
        width: "100%",
        flexDirection: 'row',
        // borderBottomWidth: 1.5,
        // borderColor: '#DDDDDD',
        position: 'absolute',
        top: 0,
    },
    darkTopContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        height: 90,
        width: "100%",
        flexDirection: 'row',
        // borderBottomWidth: 1.5,
        // borderColor: '#2f2f2f',
        position: 'absolute',
        top: 0,
    },
    bookmarkIcon: {
        // alignSelf: 'center',
        marginTop: 53,
        marginLeft: 10,
        padding: 10,
    },
    lightBackIcon: {
        // alignSelf: 'center',
        marginTop: 53,
        marginLeft: 10,
        padding: 10,
        color: '#000',
    },
    darkBackIcon: {
        // alignSelf: 'center',
        marginTop: 53,
        marginLeft: 10,
        padding: 10,
        color: '#fff',
    },
    lightText: {
        fontSize: 20,
        color: '#222222',
        fontWeight: "600",
        marginTop: 51,
        marginLeft: 5,
        marginRight: 10
    },
    darkText: {
        fontSize: 20,
        color: '#E4E4E4',
        fontWeight: "600",
        marginTop: 51,
        marginLeft: 5,
        marginRight: 10
    },
    lightSaveText: {
        fontSize: 20,
        color: '#222222',
        fontWeight: "600",
        marginTop: 51,
        marginLeft: 5,
        marginRight: 10
    },
    darkSaveText: {
        fontSize: 20,
        color: '#f2f2f2',
        fontWeight: "600",
        marginTop: 51,
        marginLeft: 5,
        marginRight: 10
    },
});


export default MemeTopBar;
