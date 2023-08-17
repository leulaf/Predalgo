import React, {useEffect, useState, useContext} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ThemeContext} from '../../context-store/context';
import UsersScreen from '../components/followingScreens/UsersScreen';
import SimpleTopBar from '../ScreenTop/SimpleTopBar';

const Top_Tab = createMaterialTopTabNavigator();

export default function FollowingScreen({navigation, route}){
    const {theme,setTheme} = useContext(ThemeContext);
    const {profile} = route.params;

    // Sets the header to the SimpleTopBar component
    useEffect(() => {
        navigation.setOptions({
            header: () => <SimpleTopBar title={"Following"}/>
        });
    }, []);

    return (
        <View style={{ flex: 1 }}>

            <Top_Tab.Navigator
                screenOptions={{
                tabBarLabelStyle: { fontSize: 18, fontWeight: '600', marginTop: 0 },
                tabBarStyle: {
                    backgroundColor: theme == 'light' ? 'rgba(255, 255, 255, 0.90)' : 'rgba(0, 0, 0, 0.25)',
                    position: 'absolute',
                    height: 40,
                    width: '100%',
                },
                tabBarIndicatorStyle: {
                    backgroundColor: theme == 'light' ? '#BBBBBB' : '#888888',
                },
                tabBarActiveTintColor: theme == 'light' ? '#444444' : '#EEEEEE',
                tabBarInactiveTintColor: theme == 'light' ? '#929292' : '#C8C8C8',
                tabBarScrollEnabled: true, // makes the tabs scrollable
                tabBarVisible: false,
                }}>
                {/* <Top_Tab.Screen name="Users" component={UsersScreen} /> */}
                <Top_Tab.Screen name="Users" component={UsersScreen} initialParams={{profile: profile}}/>
            </Top_Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
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
