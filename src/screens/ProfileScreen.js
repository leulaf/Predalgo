import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {ShowSearchContext} from '../../context-store/context';
import {AuthenticatedUserContext} from '../../context-store/context';
import Firebase from '../config/firebase';

const auth = Firebase.auth();
const user = Firebase.auth().currentUser;


const ProfileScreen = ({navigation}) => {
    const {showSearch,setShowSearch} = useContext(ShowSearchContext);
    const [email, setEmail] = useState('');

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setEmail(user.email);
            } else {
                setEmail("Not Signed In");
                // navigation.navigate('LogIn');
            }
        });
    }, []);

    const handleSignOut = async () => {
        try {
          await auth.signOut();
        } catch (error) {
          console.log(error);
        }
      };
    
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          // The screen is focused
          setShowSearch(false);
        });
    
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => handleSignOut()}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Profile {email}</Text>
        </View>
    );
}

const styles = StyleSheet.create({});

export default ProfileScreen;