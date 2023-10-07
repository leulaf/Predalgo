import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { DrawerActions, NavigationContainer } from '@react-navigation/native';
import CustomDrawer from '../screens/CustomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import BottomTabNavigator from './BottomTabNavigator';

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({}) => {

    return (
        <Drawer.Navigator
        initialRouteName="BottomBar"
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
            name="BottomBar"
            component={BottomTabNavigator}
            options={({navigation}) => ({
              drawerIcon: ({color}) => (
                <Ionicons name="home-outline" size={22} color={color} />
              ),
            })}
        />


      </Drawer.Navigator>      
    );
}

const styles = StyleSheet.create({});
export default React.memo(DrawerNavigator);