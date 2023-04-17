import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { DrawerActions, NavigationContainer } from '@react-navigation/native';
import {ShowSearchContext} from '../../context-store/context';
import MainScreen from './MainScreen';
import MainContainer from './MainContainer';
import CustomDrawer from './CustomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SearchBar from '../components/SearchBar';

const Drawer = createDrawerNavigator();

const DrawerScreen = ({navigation}) => {
    const [term, setTerm] = useState('');
    const {showSearch,setShowSearch} = useContext(ShowSearchContext);
    return (
        <Drawer.Navigator
        initialRouteName="Main"
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: showSearch,
          drawerActiveBackgroundColor: '#aa18ea',
          drawerActiveTintColor: '#fff',
          drawerInactiveTintColor: '#333',

          drawerStyle: {
            backgroundColor: 'white',
            width: 300,
          },
          drawerLabelStyle: {
            marginLeft: -25,
            fontSize: 15,
          },
        }}>
        <Drawer.Screen
          name="Main"
          component={MainContainer}
          // options={{
            
          // }}
          options={({navigation}) => ({
            drawerIcon: ({color}) => (
              <Ionicons name="home-outline" size={22} color={color} />
            ),
            header: () => <SearchBar 
              term={term} 
              onTermChange={(newTerm) => setTerm(newTerm)} // setTerm alone would also work
              // onTermSubmit={() => searchApi(term)} // searchApi alone would also work
              openDrawer={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            />
          })}
          // openDrawers={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
        <Drawer.Screen
          name="Profile"
          component={MainScreen}
          options={{
            drawerIcon: ({color}) => (
              <Ionicons name="person-outline" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Messages"
          component={MainScreen}
          options={{
            drawerIcon: ({color}) => (
              <Ionicons name="chatbox-ellipses-outline" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Moments"
          component={MainScreen}
          options={{
            drawerIcon: ({color}) => (
              <Ionicons name="timer-outline" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={MainScreen}
          options={{
            drawerIcon: ({color}) => (
              <Ionicons name="settings-outline" size={22} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>      
    );
}

const styles = StyleSheet.create({});

export default DrawerScreen;