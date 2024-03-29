import React, {useEffect, useState, useContext} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ThemeContext} from '../../context-store/context';
import firebase from 'firebase/compat/app';
import { db, storage } from '../config/firebase';
import { collection, query, where, orderBy, limit, getDocs, getDoc, doc } from "firebase/firestore";
import GlobalStyles from '../constants/GlobalStyles';
import TagScreenTopBar from '../ScreenTop/TagScreenTopBar';
import AllTagPosts from '../components/posts/AllTagPosts';

const TagScreen = ({navigation, route}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const {tag} = route.params;

    if(tag === "" || tag === null){
        
        return null;
    }

    // Sets the header to the SimpleTopBar component
    useEffect(() => {
        navigation.setOptions({
            // header: () => <TagScreenTopBar tag={tag} theme={theme}/>
        });
    }, []);

    
    return (
        <AllTagPosts tag={tag}/>
    );
}

const styles = StyleSheet.create({

});

export default React.memo(TagScreen);