import React, {useEffect, useState, useContext} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ThemeContext} from '../../context-store/context';
import firebase from 'firebase/compat/app';
import { db, storage } from '../config/firebase';
import { collection, query, where, orderBy, limit, getDocs, getDoc, doc } from "firebase/firestore";
import GlobalStyles from '../constants/GlobalStyles';
import SimpleTopBar from '../components/SimpleTopBar';

export default function FollowersScreen({navigation, route}){
    const {theme,setTheme} = useContext(ThemeContext);
    const [postList, setPostList] = useState([]);
    const {tag} = route.params;
    
    // Get users posts by most recent
    const fetchPostsByRecent = () => {
        const q = query(collection(db, "allPosts"), 
            where("tags", "array-contains", tag), 
            orderBy("creationDate", "desc")
        );

        getDocs(q)
        .then((snapshot) => {
            let posts = snapshot.docs
            .map(doc => {
                const data = doc.data();
                const id = doc.id;
                
                return { id, ...data }
            })

            setPostList(posts);
        })
    }

    // useEffect(() => {
    //     console.log("postList: ", postList);
    // }, [postList]);

    useEffect(() => {
        fetchPostsByRecent();
    }, []);

    // Sets the header to the SimpleTopBar component
    useEffect(() => {
        navigation.setOptions({
            header: () => <SimpleTopBar title={tag}/>
        });
    }, [navigation]);

    
    return (
        <View style={theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer}>

            
                
        </View>
    );
}

const styles = StyleSheet.create({
    profilePicture: {
        width: 50,
        height: 50,
        marginLeft: 5,
        marginRight: 10,
        borderRadius: 100,
    },
    lightText: {
        fontSize: 20,
        marginRight: 20,
        fontWeight: '500',
        color: '#444444',
    },
    darkText: {
        fontSize: 20,
        marginRight: 20,
        fontWeight: '500',
        color: '#EEEEEE',
    },
});