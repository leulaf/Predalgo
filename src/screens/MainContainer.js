import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ThemeContext} from '../../context-store/context';
import { DrawerActions } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
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

const Bottom_Tab = createBottomTabNavigator();

export default function MainContainer({navigation, openDrawer}) {
    const {theme,setTheme} = useContext(ThemeContext);
    let home, homeInactive, trend, trendInactive, post, saved, savedInactive, profile, profileInactive

    if(theme == "light"){
        home = <Home width={28} height={28}/>;
        homeInactive = <Home_Inactive width={28} height={28}/>;
        
        trend = <Trend width={29} height={30}/>;
        trendInactive = <Trend_Inactive width={29} height={30}/>;

        post = <Post width={60} height={60} style={{marginTop:10}}/>;
        
        saved = <Saved width={25} height={25}/>;
        savedInactive =  <Saved_Inactive width={25} height={25}/>;

        profile = <Profile width={30} height={30}/>;
        profileInactive = <Profile_Inactive width={30} height={30}/>;
    }else{
        home = <Home_Dark width={28} height={28}/>;
        homeInactive = <Home_Inactive_Dark width={28} height={28}/>;
        
        trend = <Trend_Dark width={29} height={30}/>;
        trendInactive =  <Trend_Inactive_Dark width={29} height={30}/>;

        post = <Post_Dark width={60} height={60} style={{marginTop:10}}/>;
       
        saved = <Saved_Dark width={25} height={25}/>;
        savedInactive =  <Saved_Inactive_Dark width={25} height={25}/>;
        
        profile = <Profile_Dark width={30} height={30}/>;
        profileInactive = <Profile_Inactive_Dark width={30} height={30}/>;
    }

    return (
        // <NavigationContainer>
            <Bottom_Tab.Navigator
            initialRouteName={homeName}
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
                    backgroundColor: theme == 'light' ? 'rgba(255, 255, 255, 0.97)' : 'rgba(29, 29, 29, 0.97)', // Translucent white background
                    position: 'absolute',
                    borderColor: "#000000",
                    borderTopWidth: 0,
                    height: 90
                },
                tabBarLabelStyle: { fontSize: 14 , fontWeight: '400'},
            })}
            >

                {/* <Tab.Screen name={homeName} component={HomeScreen} /> */}
                {/* <Bottom_Tab.Screen name={homeName} component={MainScreen}
                    options={{ header: () => <SearchBar 
                        term={term} 
                        onTermChange={(newTerm) => setTerm(newTerm)} // setTerm alone would also work
                        // onTermSubmit={() => searchApi(term)} // searchApi alone would also work
                    />}} 
                /> */}
                <Bottom_Tab.Screen name={homeName} component={MainScreen} 
                    options={{
                        header: () => <SearchBar 
                            // term={term} 
                            // onTermChange={(newTerm) => setTerm(newTerm)} // setTerm alone would also work
                            // onTermSubmit={() => searchApi(term)} // searchApi alone would also work
                            openDrawer={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                        />                        
                    }} 
                />
                <Bottom_Tab.Screen name={trendingName} component={TrendingScreen}
                    options={{
                        header: () => <SearchBar 
                            // term={term} 
                            // onTermChange={(newTerm) => setTerm(newTerm)} // setTerm alone would also work
                            // onTermSubmit={() => searchApi(term)} // searchApi alone would also work
                            openDrawer={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                        />
                    }} 
                />

                <Bottom_Tab.Screen name={addPostName} component={AddPostScreen} 
                    options={{
                        headerShown: false,
                        
                        
                    }} 
                />

                <Bottom_Tab.Screen name={savedName} component={SavedScreen}
                    options={{headerShown: false}} 
                />
                <Bottom_Tab.Screen name={profileName} component={MainProfileScreen} 
                    options={{
                        // headerShown: false
                        header: () => <MainProfileTop/>
                    }} 
                />

            </Bottom_Tab.Navigator>

        // </NavigationContainer>

    );
}
