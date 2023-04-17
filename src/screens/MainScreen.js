import React, {useState, useEffect, useContext} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ScrollView, Image, View, Text, StyleSheet, TextInput} from 'react-native';
import {ThemeContext} from '../../context-store/context';
import {ShowSearchContext} from '../../context-store/context';
import GlobalStyles from '../constants/GlobalStyles';

import SearchBar from '../components/SearchBar';

import GamesScreen from '../screens/GamesScreen';
import HomeScreen from '../screens/HomeScreen';
import TvMoviesScreen from '../screens/TvMoviesScreen';
import SideBar from '../components/SideBar';

const Top_Tab = createMaterialTopTabNavigator();

export default function MainScreen({navigation}){
    const {theme,setTheme} = useContext(ThemeContext);
    const [term, setTerm] = useState('');
    const {showSearch,setShowSearch} = useContext(ShowSearchContext);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          // The screen is focused
          setShowSearch(true);
        });
    
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    return (
            <>
                <Top_Tab.Navigator 
                initialRouteName="For You"
                screenOptions={
                    {
                        tabBarLabelStyle: {fontSize: 16, fontWeight: 'bold', marginBottom: 30},

                        tabBarStyle: theme == 'light' ? styles.lightTabBarStyle : styles.darkTabBarStyle,
                        tabBarIndicatorStyle: theme == 'light' ? styles.lightIndicatorStyle : styles.darkIndicatorStyle,
                        tabBarActiveTintColor: theme == 'light' ? '#2D2D2D' : '#F6F6F6',
                        tabBarInactiveTintColor: theme == 'light' ? '#929292' : '#C8C8C8',
                        // tabBarScrollEnabled: true, // makes the tabs scrollable
                        // hide tab bar
                        tabBarVisible: false,
                        header: <SearchBar 
                            term={term} 
                            onTermChange={(newTerm) => setTerm(newTerm)} // setTerm alone would also work
                            // onTermSubmit={() => searchApi(term)} // searchApi alone would also work
                        />,
                    }
                }
                >
                    <Top_Tab.Screen name="Games" component={GamesScreen} />
                    <Top_Tab.Screen name="For You" component={HomeScreen} />
                    <Top_Tab.Screen name="Tv/Movies" component={TvMoviesScreen} />
                </Top_Tab.Navigator>
                <SideBar/>
            </>
            
    );
}

const styles = StyleSheet.create({
    lightTabBarStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.90)', 
        position: 'absolute', 
        height: 35, 
        width: '100%',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
    },
    darkTabBarStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)', 
        position: 'absolute', 
        height: 35, 
        width: '100%',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
    },
    lightIndicatorStyle: {
        backgroundColor: '#AAAAAA', 
        width: 90, 
        marginLeft: 24,
    },
    darkIndicatorStyle: {
        backgroundColor: '#444444', 
        width: 90, 
        marginLeft: 24,
    }
});
