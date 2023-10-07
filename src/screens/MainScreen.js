import React, {useState, useEffect, useContext} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ScrollView, Image, View, Text, StyleSheet, TextInput} from 'react-native';
import {ThemeContext} from '../../context-store/context';
import GlobalStyles from '../constants/GlobalStyles';
import { BlurView } from 'expo-blur';
import TopBar from '../ScreenTop/TopBar';

import GamesScreen from '../screens/GamesScreen';
import HomeScreen from '../screens/HomeScreen';
import TvMoviesScreen from '../screens/TvMoviesScreen';
// import SideBar from '../components/SideBar';

const Top_Tab = createMaterialTopTabNavigator();

const MainScreen = ({navigation, openDrawer}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [term, setTerm] = useState('');

    // Sets the header to the SimpleTopBar component
    // useEffect(() => {
    //     navigation.setOptions({
    //         header: () => <TopBar
    //             // openDrawer={() => openDrawer()}
    //         />
    //     });
    // }, []);

    return (
            <>
                <Top_Tab.Navigator 
                initialRouteName="For You"
                screenOptions={
                    {
                        tabBarBackground: () => (
                            <BlurView 
                                tint = {theme == 'light' ?  "light" : "dark"}
                                intensity={theme == 'light' ?  100 : 100}
                                style={StyleSheet.absoluteFill}
                            />
                        ),
                        tabBarLabelStyle: {fontSize: 16, fontWeight: "700", marginBottom: 30},
                        tabBarStyle: theme == 'light' ? styles.lightTabBarStyle : styles.darkTabBarStyle,
                        tabBarIndicatorStyle: theme == 'light' ? styles.lightIndicatorStyle : styles.darkIndicatorStyle,
                        tabBarActiveTintColor: theme == 'light' ? '#2D2D2D' : '#F6F6F6',
                        tabBarInactiveTintColor: theme == 'light' ? '#929292' : '#C8C8C8',
                        // tabBarScrollEnabled: true, // makes the tabs scrollable
                        // hide tab bar
                        tabBarVisible: false,
                        lazy: true, // only renders the screen when the tab is pressed
                        header: <TopBar 
                            term={term} 
                            onTermChange={(newTerm) => setTerm(newTerm)} // setTerm alone would also work
                            // onTermSubmit={() => searchApi(term)} // searchApi alone would also work
                        />,
                    }
                }
                >
                    <Top_Tab.Screen name="Following" component={GamesScreen} />
                    <Top_Tab.Screen name="For You" component={HomeScreen} />
                    <Top_Tab.Screen name="Tv/Movies" component={TvMoviesScreen} />
                </Top_Tab.Navigator>
                {/* <SideBar/> */}
            </>
            
    );
}

const styles = StyleSheet.create({
    lightTabBarStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        position: 'absolute', 
        height: 40, 
        width: '100%',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
    },
    darkTabBarStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        position: 'absolute', 
        height: 40, 
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
        backgroundColor: '#555555', 
        width: 90, 
        marginLeft: 24,
    }
});

export default React.memo(MainScreen);