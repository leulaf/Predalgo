import React, {useContext} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {View, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ThemeContext} from '../../context-store/context';
import { DrawerActions } from '@react-navigation/native';
import TopBar from '../components/TopBar';

import { BlurView } from 'expo-blur';
import MainProfileTop from '../components/MainProfileTop';

// Light-Mode Icons
import Saved from '../../assets/saved.svg';
import Saved_Inactive from '../../assets/saved_inactive.svg';
import Home from '../../assets/home.svg';
import Home_Inactive from '../../assets/home_inactive.svg';
import Profile_Inactive from '../../assets/profile_inactive.svg';
import Profile from '../../assets/profile.svg';
import Trend_Inactive from '../../assets/topics_inactive.svg';
import Trend from '../../assets/topics.svg';
import Post from '../../assets/post.svg';

// Dark-Mode Icons
import Saved_Dark from '../../assets/saved_dark.svg';
import Saved_Inactive_Dark from '../../assets/saved_inactive_dark.svg';
import Home_Dark from '../../assets/home_dark.svg';
import Home_Inactive_Dark from '../../assets/home_inactive_dark.svg';
import Profile_Inactive_Dark from '../../assets/profile_inactive_dark.svg';
import Profile_Dark from '../../assets/profile_dark.svg';
import Trend_Inactive_Dark from '../../assets/trend_inactive_dark.svg';
import Trend_Dark from '../../assets/trend_dark.svg';
import Post_Dark from '../../assets/post_dark.svg';

// Screens
import MainScreen from './MainScreen';
import TrendingScreen from './TrendingScreen';
import MainProfileScreen from './MainProfileScreen';
import SavedScreen from './SavedScreen';
import AddPostScreen from './AddPostScreen';

// Screen Names
const homeName = 'Home';
const trendingName = 'Trend';
const profileName = 'Profile';
const savedName = 'Saved';
const addPostName = ' ';



export default function MainContainer({navigation, openDrawer}) {
    const {theme,setTheme} = useContext(ThemeContext);
    let home, homeInactive, trend, trendInactive, post, saved, savedInactive, profile, profileInactive

    const Bottom_Tab = createBottomTabNavigator(

    );

    if(theme == "light"){
        home = <Home width={27} height={27} style={{marginTop: 25}}/>;
        homeInactive = <Home_Inactive width={27} height={27} style={{marginTop: 25}}/>;
        
        trend = <Trend width={27} height={28} style={{marginTop: 25}}/>;
        trendInactive = <Trend_Inactive width={27} height={28} style={{marginTop: 25}}/>;

        post = <Post width={57} height={57} style={{marginTop: 33}}/>;
        
        saved = <Saved width={22} height={22} style={{marginTop: 25}}/>;
        savedInactive =  <Saved_Inactive width={22} height={22} style={{marginTop: 25}}/>;

        profile = <Profile width={27} height={27} style={{marginTop: 25}}/>;
        profileInactive = <Profile_Inactive width={27} height={27} style={{marginTop: 25}}/>;
    }else{
        home = <Home_Dark width={27} height={27} style={{marginTop: 25}}/>;
        homeInactive = <Home_Inactive_Dark width={27} height={27} style={{marginTop: 25}}/>;
        
        trend = <Trend_Dark width={27} height={28} style={{marginTop: 25}}/>;
        trendInactive =  <Trend_Inactive_Dark width={27} height={28} style={{marginTop: 25}}/>;

        post = <Post_Dark width={57} height={57} style={{marginTop: 33}}/>;
       
        saved = <Saved_Dark width={22} height={22} style={{marginTop: 25}}/>;
        savedInactive =  <Saved_Inactive_Dark width={22} height={22} style={{marginTop: 25}}/>;
        
        profile = <Profile_Dark width={27} height={27} style={{marginTop: 25}}/>;
        profileInactive = <Profile_Inactive_Dark width={27} height={27} style={{marginTop: 25}}/>;
    }

    const TabBar = ({ state, descriptors, navigation }) => {

            return (<BlurView tint="light" intensity={90} style={styles.blurView}>
        <Bottom_Tab {...props} style={styles.bottomTabBar} />
        </BlurView>)
    }
    

    return (
        
    //     <SafeAreaProvider>
    //   <View style={{ flex: 1 }}>
        // <NavigationContainer>
            <Bottom_Tab.Navigator
            initialRouteName={homeName}

            // tabBar={props => <TabBar {...props} />}
            screenOptions={({route}) => ({
                
                tabBarIcon: ({focused, color, size}) => {
                    if (route.name === homeName) {
                        return focused ? home: homeInactive;
                    } else if (route.name === trendingName) {
                        return focused ? trend : trendInactive;
                    } else if (route.name === profileName) {
                        return focused ? profile : profileInactive;
                    }else if (route.name === savedName) {
                        return focused ? saved : savedInactive;
                    }else if (route.name === addPostName) {
                        return post;
                    }
                },
                tabBarActiveTintColor: theme == 'light' ? 'black' : 'white',
                tabBarInactiveTintColor: theme == 'light' ? 'gray' : '#E4E4E4',
                tabBarStyle: {
                    backgroundColor: theme == 'light' ? 'rgba(255, 255, 255, 0.93)' : 'rgba(29, 29, 29, 0.95)', // Translucent white background
                    position: 'absolute',
                    borderColor: "#000000",
                    borderTopWidth: 0,
                    height: 85
                },
                tabBarLabelStyle: { marginTop: 20, fontSize: 11 , fontWeight: '500'},
            })}
            >

                {/* <Tab.Screen name={homeName} component={HomeScreen} /> */}
                {/* <Bottom_Tab.Screen name={homeName} component={MainScreen}
                    options={{ header: () => <TopBar 
                        term={term} 
                        onTermChange={(newTerm) => setTerm(newTerm)} // setTerm alone would also work
                        // onTermSubmit={() => searchApi(term)} // searchApi alone would also work
                    />}} 
                /> */}
                <Bottom_Tab.Screen name={homeName} component={MainScreen} 
                    options={{
                        // header: () => <TopBar 
                        //     // term={term} 
                        //     // onTermChange={(newTerm) => setTerm(newTerm)} // setTerm alone would also work
                        //     // onTermSubmit={() => searchApi(term)} // searchApi alone would also work
                        //     openDrawer={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                        // />                        
                    }} 
                />
                
                <Bottom_Tab.Screen name={trendingName} component={TrendingScreen}
                    options={{
                        // header: () => <TopBar 
                        //     // term={term} 
                        //     // onTermChange={(newTerm) => setTerm(newTerm)} // setTerm alone would also work
                        //     // onTermSubmit={() => searchApi(term)} // searchApi alone would also work
                        //     openDrawer={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                        // />
                    }} 
                />

                <Bottom_Tab.Screen name={addPostName} component={AddPostScreen} 
                    options={{
                        // headerShown: false,
                    }} 
                />

                <Bottom_Tab.Screen name={savedName} component={SavedScreen}
                    options={{headerShown: false}} 
                />

                <Bottom_Tab.Screen name={profileName} component={MainProfileScreen} 
                    options={{
                        // headerShown: false
                        // header: () => <MainProfileTop/>
                    }} 
                />

            </Bottom_Tab.Navigator>
        // </NavigationContainer>
        
       //  </SafeAreaProvider>

    );
}

const styles = StyleSheet.create({
    blurView: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    bottomTabBar: {
      backgroundColor: 'transparent',
    },
  });
  