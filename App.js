import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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

import { useFonts, NotoSans_300Light, NotoSans_400Regular, NotoSans_500Medium, NotoSans_600SemiBold, NotoSans_700Bold, NotoSans_800ExtraBold} from '@expo-google-fonts/noto-sans';


const store = createStore(rootReducer, applyMiddleware(thunk));

const Stack = createStackNavigator();
// "extra": {
//   "eas": {
//     "projectId": "758f7ef7-14d1-49ea-8306-e527c93c1f17"
//   }
// },
// "plugins": [
//   "expo-build-properties"
// ]
const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  let [fontsLoaded, fontError] = useFonts({
    NotoSans_300Light,
    NotoSans_400Regular,
    NotoSans_500Medium,
    NotoSans_600SemiBold,
    NotoSans_700Bold,
    NotoSans_800ExtraBold
  });


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


  if (!fontsLoaded && !fontError) {
    return null;
  }


  if (!loggedIn) {
    return (
      <ThemeProvider>
        <NavigationContainer>

          <AuthStackNavigator />

        </NavigationContainer>
      </ThemeProvider>
    );
  }
  else {
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
