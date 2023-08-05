import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider } from './context-store/context';
import { AuthenticatedUserProvider } from './context-store/context';
import { ContentProvider } from './context-store/context';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import 'react-native-gesture-handler';

import { AuthStackNavigator } from "./src/navigation/StackNavigator";

import "./src/global";

import { onAuthStateChanged, getAuth } from "firebase/auth";
import { Firebase } from './src/config/firebase';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';
import { MainStackNavigator } from './src/navigation/StackNavigator';

const store = createStore(rootReducer, applyMiddleware(thunk));

const Stack = createStackNavigator();
global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (!user) {
        setLoggedIn(false);
        setLoaded(true);
      } else {
        setLoggedIn(true);
        setLoaded(true);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!loaded) return null;

  if (!loggedIn) {
    return (
      <ThemeProvider>
        <NavigationContainer>

          <AuthStackNavigator />

        </NavigationContainer>
      </ThemeProvider>
    );
  } else {
    return (
      <Provider store={store}>
        <ContentProvider>
          <AuthenticatedUserProvider>
            <ThemeProvider>
              <NavigationContainer>

                <MainStackNavigator />

              </NavigationContainer>
            </ThemeProvider>
          </AuthenticatedUserProvider>
        </ContentProvider>
      </Provider>
    );
  }
};

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

export default App;
