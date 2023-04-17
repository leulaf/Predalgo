import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

const FunnyScreen = ({navigation}) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Chat Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({});

export default FunnyScreen;