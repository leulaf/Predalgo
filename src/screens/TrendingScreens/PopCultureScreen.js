import React, {useContext} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {ThemeContext} from '../../../context-store/context';

const PopCultureScreen = ({navigation}) => {
    const {theme,setTheme} = useContext(ThemeContext);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme == 'light' ? '#F4F4F4' : "#282828" }}>
            <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: '700' }}>Chat Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({});

export default PopCultureScreen;