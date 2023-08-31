import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

const SavedScreen = ({navigation}) => {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 700 }}>Saved Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({});

export default SavedScreen;