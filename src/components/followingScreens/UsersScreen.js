import React, {useContext, useState, useEffect,} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView} from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import {ThemeContext} from '../../../context-store/context';
import firebase from 'firebase/compat/app';
import { db, storage } from '../../config/firebase';
import { collection, query, where, limit, getDocs, getDoc, doc } from "firebase/firestore";
import GlobalStyles from '../../constants/GlobalStyles';
import SimpleTopBar from '../SimpleTopBar';

const UsersScreen = ({ route }) => {
    const navigation = useNavigation();
    const {theme,setTheme} = useContext(ThemeContext);
    const [users, setUsers] = useState([]);
    const {profile} = route.params;
    
    const fetchUsers = () => {
        const q = query(collection(db, "following", profile, "userFollowing"));

        getDocs(q)
        .then((snapshot) => {
            let users = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })

            fetchUserProfiles(users);
        });
    }

    const fetchUserProfiles = async (userIds) => {
        const newUserList = [];
        for (let item of userIds) {
            const docRef = doc(db, "users", item.id);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            data.id = item.id;
            
            if (docSnap.exists()) {
                // console.log("Document data:", docSnap.data());
                newUserList.push(data);
            } else {
                // console.log("No such document!");
            }
        }

        setUsers(newUserList);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Sets the header to the SimpleTopBar component
    useEffect(() => {
        navigation.setOptions({
            header: () => <SimpleTopBar title={"Back"}/>
        });
    }, [navigation]);

    const renderItem = (item) => {

        return (
            <TouchableOpacity
                style={theme == 'light' ? styles.lightListItem : styles.darkListItem}
                onPress={() => navigation.push('Profile', {user: item})}
            >
                <Image source={{uri: item.profilePic}} style={styles.profilePicture}/>
                
                <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
                    {"@"+item.username}
                </Text>

            </TouchableOpacity>
        );

    }
    
    return (
        <View style={{ flex: 1, backgroundColor: theme == 'light' ? '#F4F4F4' : "#282828" }}>

            <View style={{flex: 1, marginTop: 50}}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={users}
                    renderItem={({ item }) => (
                        renderItem(item)
                    )}
                />
            </View>
                
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
    lightListItem: { 
        flex: 1, 
        height: 60, 
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        alignItems: 'center', 
        marginHorizontal: 0, 
        marginVertical: 5, 
        borderRadius: 100, 
        borderWidth: 1,
        borderColor: '#CCCCCC',
    },
    darkListItem: { 
        flex: 1, 
        height: 60, 
        flexDirection: 'row',
        backgroundColor: "#1D1D1D",
        alignItems: 'center', 
        marginHorizontal: 0, 
        marginVertical: 5, 
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#444444',
    },
});

export default UsersScreen;