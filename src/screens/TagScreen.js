import React, {useEffect, useState, useContext} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ThemeContext} from '../../context-store/context';
import firebase from 'firebase/compat/app';
import { db, storage } from '../config/firebase';
import { collection, query, where, orderBy, limit, getDocs, getDoc, doc } from "firebase/firestore";
import GlobalStyles from '../constants/GlobalStyles';
import SimpleTopBar from '../components/SimpleTopBar';
import AllTagPosts from '../components/postTypes/AllTagPosts';

export default function TagScreen({navigation, route}){
    const {theme,setTheme} = useContext(ThemeContext);
    const {tag} = route.params;

    if(tag === "" || tag === null){
        
        return null;
    }

    // Sets the header to the SimpleTopBar component
    useEffect(() => {
        navigation.setOptions({
            header: () => <SimpleTopBar title={tag}/>
        });
    }, [navigation]);

    
    return (
        <AllTagPosts tag={tag}/>
    );
}

const styles = StyleSheet.create({

});