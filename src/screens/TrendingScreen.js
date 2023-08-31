import React, {useEffect, useContext} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import { BlurView } from 'expo-blur';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ThemeContext} from '../../context-store/context';
import FunnyScreen from '../screens/TrendingScreens/FunnyScreen';
import ScienceScreen from '../screens/TrendingScreens/ScienceScreen';
import SportsScreen from '../screens/TrendingScreens/SportsScreen';
import PopCultureScreen from '../screens/TrendingScreens/PopCultureScreen';
import TechnologyScreen from '../screens/TrendingScreens/TechnologyScreen';
import NewsScreen from '../screens/TrendingScreens/NewsScreen';

const Top_Tab = createMaterialTopTabNavigator();

export default function TrendingScreen({navigation}){
    const {theme,setTheme} = useContext(ThemeContext);

    return (
        
            <Top_Tab.Navigator 
            
            screenOptions={
                {
                    tabBarStyle: { position: 'absolute' },
                    tabBarBackground: () => (
                        <BlurView 
                            tint = {theme == 'light' ?  "light" : "dark"}
                            intensity={theme == 'light' ?  100 : 100}
                            style={StyleSheet.absoluteFill}
                        />
                    ),
                    tabBarLabelStyle: {fontSize: 18, fontWeight: 700, marginTop: 0},
                    tabBarStyle: {
                        backgroundColor: theme == 'light' ? 'rgba(255, 255, 255, 0.90)' : 'rgba(0, 0, 0, 0.7)', 
                        position: 'absolute', 
                        height: 40, 
                        width: '100%'
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: theme == 'light' ? '#AAAAAA' : '#555555',
                    },
                    tabBarActiveTintColor: theme == 'light' ? '#2D2D2D' : '#F6F6F6',
                    tabBarInactiveTintColor: theme == 'light' ? '#929292' : '#C8C8C8',
                    tabBarScrollEnabled: true, // makes the tabs scrollable
                    // hide tab bar
                    tabBarVisible: false,
                }
            }
            >
                <Top_Tab.Screen name="#Trending" component={CurrentScreen} />
                <Top_Tab.Screen name="#News" component={NewsScreen} />
                <Top_Tab.Screen name="#Pop Culture" component={PopCultureScreen} />
                <Top_Tab.Screen name="#Science" component={ScienceScreen} />
                <Top_Tab.Screen name="#Sports" component={SportsScreen} />
                <Top_Tab.Screen name="#Technology" component={TechnologyScreen} />
                <Top_Tab.Screen name="#Funny" component={FunnyScreen} />
            </Top_Tab.Navigator>

    );
}


const CurrentScreen = ({navigation}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme == 'light' ? '#F4F4F4' : "#282828" }}>
            <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 700 }}>Trending Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({});

// export default TrendingScreen;