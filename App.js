import React, {Component, useContext, useState, useEffect} from 'react';
import { View, Text } from 'react-native';
import {ThemeProvider} from './context-store/context';
import {AuthenticatedUserProvider} from './context-store/context';
import {AuthenticatedUserContext} from './context-store/context';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import 'react-native-gesture-handler';

import "./src/global"

import { onAuthStateChanged, getAuth } from "firebase/auth";
import {Firebase} from './src/config/firebase';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';

import AuthScreen from './src/screens/AuthScreen';
import DrawerScreen from './src/screens/DrawerScreen';
import UploadScreen from './src/screens/UploadScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';
import SearchScreen from './src/screens/SearchScreen';
import MainProfileScreen from './src/screens/MainProfileScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditMemeScreen from './src/screens/EditMemeScreen';
import FollowingScreen from './src/screens/FollowingScreen';
import FollowersScreen from './src/screens/FollowersScreen';
import TagScreen from './src/screens/TagScreen';
import SearchTagScreen from './src/screens/SearchTagScreen';
import MemeScreen from './src/screens/MemeScreen';
import SearchMemesScreen from './src/screens/SearchMemesScreen';
import FavoriteTemplatesScreen from './src/screens/FavoriteTemplatesScreen';
import PostScreen from './src/screens/PostScreen';

const store = createStore(rootReducer, applyMiddleware(thunk));

const Stack = createStackNavigator();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    onAuthStateChanged(getAuth(), (user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
      }
    });
  }

  render () {
    const { loggedIn, loaded } = this.state;
    if (!loaded) return null;

    if(!loggedIn) {
      return(
        
        <ThemeProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="LogIn">
              {/* <Stack.Screen name="Drawer" component={DrawerScreen} /> */}
              <Stack.Screen name="LogIn" component={AuthScreen} />
              {/* <Stack.Screen name="Search" component={SearchScreen} /> */}
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
          
      );
    } else {
      return(
        <Provider store={store}>
          <AuthenticatedUserProvider>
              <ThemeProvider>
                <NavigationContainer>
                  <Stack.Navigator screenOptions={{ headerShown: true }} initialRouteName="Drawer">
                    <Stack.Screen name="Drawer" component={DrawerScreen}
                      options={{
                          headerShown: false,
                      }} 
                    />
                    <Stack.Screen name="Upload" component={UploadScreen}
                      options={{
                          headerShown: false,
                      }} 
                    />
                    <Stack.Screen name="CreatePost" component={CreatePostScreen}
                      options={{
                          headerShown: false,
                      }} 
                    />
                    <Stack.Screen name="Search" component={SearchScreen}
                      options={{
                          headerShown: false,
                      }} 
                    />
                    <Stack.Screen name="MainProfile" component={MainProfileScreen}
                      options={{
                          // headerShown: false,
                      }}
                    />
                    <Stack.Screen name="Profile" component={ProfileScreen} 
                       options={{
                        // header: () => <ProfileTop/>,
                      }}
                    />
                    <Stack.Screen name="EditMeme" component={EditMemeScreen}
                      options={{
                          // headerShown: false,
                      }}
                    />
                    <Stack.Screen name="Following" component={FollowingScreen}
                      options={{
                          // headerShown: false,
                      }}
                    />
                    <Stack.Screen name="Followers" component={FollowersScreen}
                      options={{
                          // headerShown: false,
                      }}
                    />
                    <Stack.Screen name="Tag" component={TagScreen}
                      options={{
                          // headerShown: false,
                      }}
                    />
                    <Stack.Screen name="SearchTag" component={SearchTagScreen}
                      options={{
                          // headerShown: false,
                      }}
                    />
                    <Stack.Screen name="Meme" component={MemeScreen}
                      options={{
                          // headerShown: false,
                      }}
                    />
                    <Stack.Screen name="SearchMemes" component={SearchMemesScreen}
                      options={{
                          // headerShown: false,
                      }}
                    />
                    <Stack.Screen name="FavoriteTemplates" component={FavoriteTemplatesScreen}
                      options={{
                          // headerShown: false,
                      }}
                    />
                    <Stack.Screen name="Post" component={PostScreen}
                      options={{
                          // headerShown: false,
                      }}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </ThemeProvider>
          </AuthenticatedUserProvider>
        </Provider>
          
      );
    }

    
  }
}

export default App;