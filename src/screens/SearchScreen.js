import React, {useEffect, useState, useContext} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ThemeContext} from '../../context-store/context';
import { Feather } from '@expo/vector-icons';
import SearchUser from '../components/searchBy/SearchUsers';
import SearchBar from '../components/SearchBar';

const Top_Tab = createMaterialTopTabNavigator();

export default function TrendingScreen({navigation}){
    const {theme,setTheme} = useContext(ThemeContext);
    const [term, setTerm] = useState('');

    // useEffect(() => {
    //     navigation.setOptions({
    //         header: <SearchBar
    //             term={term}
    //             onTermChange={(newTerm) => setTerm(newTerm)} // setTerm alone would also work
    //             // onTermSubmit={() => searchApi(term)} // searchApi alone would also work
    //         />,
    //     });
    // }, []);

    return (
            <Top_Tab.Navigator 
                screenOptions={
                    {
                        tabBarLabelStyle: {fontSize: 18, fontWeight: 'bold', marginTop: 0},
                        tabBarStyle: {
                            backgroundColor: theme == 'light' ? 'rgba(255, 255, 255, 0.90)' : 'rgba(0, 0, 0, 0.25)', 
                            position: 'absolute', 
                            height: 40, 
                            width: '100%'
                        },
                        tabBarIndicatorStyle: {
                            backgroundColor: theme == 'light' ? '#AAAAAA' : '#444444',
                        },
                        tabBarActiveTintColor: theme == 'light' ? '#2D2D2D' : '#F6F6F6',
                        tabBarInactiveTintColor: theme == 'light' ? '#929292' : '#C8C8C8',
                        tabBarScrollEnabled: true, // makes the tabs scrollable
                        // hide tab bar
                        tabBarVisible: false,
                    }
                }
                >
                    <Top_Tab.Screen name="Users" component={CurrentScreen} />

            </Top_Tab.Navigator>
    );
}


const CurrentScreen = ({navigation}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme == 'light' ? '#F4F4F4' : "#282828" }}>
            <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Trending Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    lightSearchBar: {
        height: 36,
        width: 300,
        borderRadius: 20,
        marginLeft: 5,
        marginRight: 10,
        marginTop: 47,
        marginBottom: 0,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#FEFEFE',
        borderWidth: 1.5,
        borderColor: '#DDDDDD',
    },
    darkSearchBar: {
        height: 36,
        width: 300,
        borderRadius: 20,
        marginLeft: 5,
        marginRight: 10,
        marginTop: 47,
        marginBottom: 0,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#282828',
        borderWidth: 1.5,
        borderColor: '#444444',
    },
    inputStyle: {
        flex: 1,
        fontSize: 18,
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
    darkIconStyle: {
        fontSize: 22,
        alignSelf: 'center',
        marginHorizontal: 7,
        color: '#BBBBBB',
    },
    lightContainer: {
        backgroundColor: 'white',
        height: 100,
        flexDirection: 'row',
    },
    darkContainer: {
        backgroundColor: '#1A1A1A',
        height: 100,
        flexDirection: 'row',
    },
});

// export default TrendingScreen;