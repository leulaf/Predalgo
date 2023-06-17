import React, {Component, useContext, useState, useEffect} from 'react';
import { View, Text } from 'react-native';
import {ThemeProvider} from './context-store/context';
import {AuthenticatedUserProvider} from './context-store/context';
import {AuthenticatedUserContext} from './context-store/context';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import 'react-native-gesture-handler';

import {Firebase, auth} from './src/config/firebase';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';

import AuthScreen from './src/screens/AuthScreen';
import DrawerScreen from './src/screens/DrawerScreen';
import UploadScreen from './src/screens/UploadScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditMemeScreen from './src/screens/EditMemeScreen';

import ProfileTop from './src/components/ProfileTop';

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
    auth.onAuthStateChanged((user) => {
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
        <Provider store={store}>
          <AuthenticatedUserProvider>
              <ThemeProvider>
                <NavigationContainer>
                  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="LogIn">
                    <Stack.Screen name="Drawer" component={DrawerScreen} />
                    <Stack.Screen name="LogIn" component={AuthScreen} />
                    <Stack.Screen name="Upload" component={UploadScreen} />
                    <Stack.Screen name="CreatePost" component={CreatePostScreen} />
                    <Stack.Screen name="Search" component={SearchScreen} />
                  </Stack.Navigator>
                </NavigationContainer>
              </ThemeProvider>
          </AuthenticatedUserProvider>
        </Provider>
          
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