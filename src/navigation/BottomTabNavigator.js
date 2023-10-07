import React, {useContext, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { BlurView } from 'expo-blur';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';
import TopBar from '../ScreenTop/TopBar';
import MainProfileTop from '../ScreenTop/MainProfileTop';

import ThreeDotsSheet from '../components/postTypes/ThreeDotsSheet';
import RepostSheet from '../components/postTypes/RepostSheet';

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
import MainScreen from '../screens/MainScreen';
import TrendingScreen from '../screens/TrendingScreen';
import MainProfileScreen from '../screens/MainProfileScreen';
import SavedScreen from '../screens/SavedScreen';
import AddPostScreen from '../screens/AddPostScreen';

// Screen Names
const homeName = 'Home';
const trendingName = 'Trend';
const profileName = 'Profile';
const savedName = 'Saved';
const addPostName = ' ';


function BottomTabNavigator ({navigation}) {
    const {theme,setTheme} = useContext(ThemeContext);
    const {options, setOptions} = React.useContext(AuthenticatedUserContext);
    // const [showBottomSheet, setShowBottomSheet] = useState(false);
    // const bottomSheetRef = React.useRef(null);
    // const snapPoints = React.useMemo(() => ['1', '100%'], []);

    // const navigation =  
    let home, homeInactive, trend, trendInactive, post, saved, savedInactive, profile, profileInactive

    const Bottom_Tab = createBottomTabNavigator();

    if(theme == "light"){
        home = <Home width={27} height={27} />;
        homeInactive = <Home_Inactive width={27} height={27} />;

        trend = <Trend width={27} height={28}/>;
        trendInactive = <Trend_Inactive width={27} height={28}/>;

        post = <Post width={55} height={55}/>;

        saved = <Saved width={22} height={22}/>;
        savedInactive =  <Saved_Inactive width={22} height={22}/>;

        profile = <Profile width={27} height={27}/>;
        profileInactive = <Profile_Inactive width={27} height={27}/>;
    }else{
        home = <Home_Dark width={27} height={27} />;
        homeInactive = <Home_Inactive_Dark width={27} height={27} />;

        trend = <Trend_Dark width={27} height={28}/>;
        trendInactive = <Trend_Inactive_Dark width={27} height={28}/>;

        post = <Post_Dark width={55} height={55}/>;

        saved = <Saved_Dark width={22} height={22}/>;
        savedInactive =  <Saved_Inactive_Dark width={22} height={22}/>;

        profile = <Profile_Dark width={27} height={27}/>;
        profileInactive = <Profile_Inactive_Dark width={27} height={27}/>;
    }


    // const toggleBottomSheet = () => {
    //     bottomSheetRef.current.snapToIndex(showBottomSheet ? 0 : 1);
    //     setShowBottomSheet(!showBottomSheet);
    // }


    const DummyScreen = () =>
    {
        return null
    }
    

    return (
        <>
            <Bottom_Tab.Navigator
            initialRouteName={homeName}
            // tabBar={TabBar}
            
            screenOptions={({route}) => ({
                tabBarStyle: { position: 'absolute' },
                tabBarBackground: () => (
                    <BlurView 
                        tint = {theme == 'light' ?  "light" : "dark"}
                        intensity={theme == 'light' ?  100 : 100}
                        style={StyleSheet.absoluteFill}
                    />
                ),
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
                    // backgroundColor: theme == 'light' ? 'rgba(255, 255, 255, 1' : 'rgba(0, 0, 0, 0.5)', // Translucent white background
                    backgroundColor: theme == 'light' ? 'transparent' : 'rgba(0, 0, 0, 0.6)', // Translucent white background
                    position: 'absolute',
                    borderColor: "#000000",
                    borderTopWidth: 0,
                    height: 85
                },
                tabBarLabelStyle: { fontSize: 11 , fontWeight: "500"},
            })}
            >
                <Bottom_Tab.Screen name={homeName} component={MainScreen}
                 options={{
                        header: () => <TopBar 
                            // term={term} 
                            // onTermChange={(newTerm) => setTerm(newTerm)} // setTerm alone would also work
                            // onTermSubmit={() => searchApi(term)} // searchApi alone would also work
                            openDrawer={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                        />
                    }} 
                />
                
                <Bottom_Tab.Screen name={trendingName} component={TrendingScreen}
                    options={{
                        header: () => <TopBar 
                            // term={term} 
                            // onTermChange={(newTerm) => setTerm(newTerm)} // setTerm alone would also work
                            // onTermSubmit={() => searchApi(term)} // searchApi alone would also work
                            openDrawer={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                        />
                    }}
                />

                {/* <Bottom_Tab.Screen name={addPostName} component={AddPostScreen} 
                    initialParams={{ forCommentOnComment: false, forCommentOnPost: false }}
                    options={{
                        drawerIcon: ({color}) => (
                            <Ionicons name="home-outline" size={22} color={color} />
                        ),
                        
                    }} 
                /> */}

                <Bottom_Tab.Screen 
                    name={addPostName}
                    component={
                        DummyScreen
                    } 
                    options={{
                        tabBarButton: props => (
                            <TouchableOpacity {...props}
                                onPress={() => 
                                    navigation.navigate("AddPost", {
                                        forCommentOnComment: false,
                                        forCommentOnPost: false,
                                        forPost: false,
                                    })
                                } 
                            />
                        ),
                    }}
                />

                <Bottom_Tab.Screen name={savedName} component={SavedScreen}
                    options={{
                        drawerIcon: ({color}) => (
                            <Ionicons name="home-outline" size={22} color={color} />
                        ),
                    }} 
                />

                <Bottom_Tab.Screen name={profileName} component={MainProfileScreen} 
                    options={{
                        drawerIcon: ({color}) => (
                            <Ionicons name="home-outline" size={22} color={color} />
                        ),
                        header: () => <MainProfileTop />,
                        // headerShown: false
                    }} 
                />

            </Bottom_Tab.Navigator>

            {
                options ? 

                    options.type === 'repost' ?

                        <RepostSheet
                            // profile={options.profile}
                            repostId={options.repostId}
                            postId={options.postId}
                            username={options.username}
                            profilePic={options.profilePic}
                            // image={options.image}
                            // text={options.text}
                            theme={theme}
                        />

                    :

                        <ThreeDotsSheet
                            profile={options.profile}
                            repostId={options.repostId}
                            postId={options.postId}
                            image={options.image}
                            text={options.text}
                            theme={theme}
                        />
                :
                    null
                
            }
            {/* <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                // onAnimate={handleSheetAnimate}
                // onChange={() => handleSheetChanges}
                enablePanDownToClose={true}
                keyboardBehavior="interactive"
                backgroundComponent={() =>
                    <BlurView
                        tint = {theme == 'light' ?  "light" : "dark"}
                        intensity={theme == 'light' ? 60 : 50}
                        style={[StyleSheet.absoluteFill, {}]}
                    />
                }
                style={{
                    backgroundColor: theme == 'light' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(32, 32, 32, 0.3)',  // <==== HERE
                    overflow: 'hidden',
                    borderRadius: 20,
                    // shadowColor: theme == 'light' ? '#005FFF' : '#DDDDDD',
                    // shadowOffset: {
                    //   width: 0,
                    //   height: theme == 'light' ? 6 : 6,
                    // },
                    // shadowOpacity: theme == 'light' ? 0.6 : 0.33,
                    // shadowRadius: 12,
                    // elevation: 5,
                }}
                // style={{backgroundColor: theme == 'light' ? styles.lightContainer : styles.darkContainer}}
                backgroundStyle={theme == 'light' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(32, 32, 32, 0.3)'}
                handleComponent={() => null}
                
            >
                <AddPostScreen navigation={navigation} route={{ params: { showBottomSheet: showBottomSheet, toggleBottomSheet: toggleBottomSheet, forCommentOnComment: false, forCommentOnPost: false} }}/>

            </BottomSheet> */}


        </>
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

  export default React.memo(BottomTabNavigator);