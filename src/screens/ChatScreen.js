import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import { ShowSearchContext } from '../../context-store/context';

const ChatScreen = ({navigation}) => {
    const {showSearch,setShowSearch} = useContext(ShowSearchContext);
    
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
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Chat Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({});

export default ChatScreen;