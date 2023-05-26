import React, {useState, useEffect, useContext} from 'react';
import {TouchableOpacity, ScrollView, Image, View, Text, StyleSheet, TextInput, FlatList, Dimensions} from 'react-native';
import firebase from 'firebase/compat/app';
// require('firebase/firestore');
import { db, storage } from '../../config/firebase';
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import {ThemeContext} from '../../../context-store/context';
import { connect } from 'react-redux';

function SearchUsers(props){
    const navigation = useNavigation();
    const {theme,setTheme} = useContext(ThemeContext);
    const [users, setUsers] = useState([]);

    const fetchUsers = (search) => {
        let q;
        
        if(search.charAt(0) == '@'){
            q = query(collection(db, "users"), where("username", ">=", search.substring(1)), limit(20));
        }else{
            q = query(collection(db, "users"), where("username", ">=", search), limit(20));
        }

        getDocs(q)
        .then((snapshot) => {
            let users = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
            setUsers(users);
            
        });
    }

    useEffect(() => {
        const { searchState } = props;
       
        fetchUsers(searchState);
   
    }, [props.searchState]);

    const renderItem = (item) => {

        // makes sure the current user is not displayed in the search results
        if(firebase.auth().currentUser.uid != item.id){
            // console.log(item);
            return (
                <TouchableOpacity
                    style={theme == 'light' ? styles.lightListItem : styles.darkListItem}
                    onPress={() => navigation.navigate('Profile', {user: item})}
                >
                    <Image source={{uri: item.profilePic}} style={styles.profilePicture}/>
                    
                    <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
                        {"@"+item.username}
                    </Text>

                </TouchableOpacity>
            );
        }

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
        color: '#555555',
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

const mapStateToProps = (store) => ({
    searchState: store.searchState.currentSearch,
})

export default connect(mapStateToProps, null)(SearchUsers);