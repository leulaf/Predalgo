import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { DrawerActions, NavigationContainer } from '@react-navigation/native';
import MainScreen from './MainScreen';
import MainContainer from './MainContainer';
import CustomDrawer from './CustomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator();

const DrawerScreen = ({navigation}) => {
    return (
        <Drawer.Navigator
        initialRouteName="Main"
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: false,
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
          options={({navigation}) => ({
            drawerIcon: ({color}) => (
              <Ionicons name="home-outline" size={22} color={color} />
            ),
          })}
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