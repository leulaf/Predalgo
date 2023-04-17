import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import Back from '../../assets/back.svg';
import { ShowSearchContext } from '../../context-store/context';

const AddPostScreen = ({navigation}) => {
    

    const {showSearch,setShowSearch} = useContext(ShowSearchContext);
    
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          // The screen is focused
          setShowSearch(false);
        });
    
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);
    
    // Removes the bottom navigation
    useEffect(() => {
      navigation.setOptions({
        tabBarStyle: {
          display: "none"
        }
      });
      return () => navigation.getParent()?.setOptions({
        tabBarStyle: undefined
      });
    }, [navigation]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Add Post Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({});

export default AddPostScreen;