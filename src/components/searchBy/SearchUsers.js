import React, {useState, useEffect, useContext} from 'react';
import {TouchableOpacity, ScrollView, Image, View, Text, StyleSheet, TextInput, FlatList, Dimensions} from 'react-native';
import firebase from 'firebase/compat/app';
import { db, storage } from '../../config/firebase';
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import {ThemeContext} from '../../../context-store/context';
import GlobalStyles from '../../constants/GlobalStyles';
import { connect } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';

function SearchUsers(props){
    const navigation = useNavigation();
    const {theme,setTheme} = useContext(ThemeContext);
    const [users, setUsers] = useState([]);

    const fetchUsers = (search) => {
        let q;
        if(search != ""){
            if(search.charAt(0) == '@'){
                q = query(
                    collection(db, "users"),
                    where("username", ">=", search.substring(1)),
                    where('username', '<=', search.substring(1) + '\uf8ff'),
                    limit(4)
                );
            }else{
                q = query(collection(db, "users"),
                    where("username", ">=", search),
                    where('username', '<=', search + '\uf8ff'),
                    limit(4)
                );
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
                    onPress={() => navigation.navigate('Profile', {user: item.id})}
                >
                    <Image source={{uri: item.profilePic}} style={styles.profilePicture}/>
                    
                    <Text style={theme == 'light' ? styles.lightUsernameText : styles.darkUsernameText}>
                        {"@"+item.username}
                    </Text>

                    <AntDesign
                        name="right"
                        style={
                            theme == "light"
                            ? styles.lightRightIconStyle
                            : styles.darkRightIconStyle
                        }
                    />

                </TouchableOpacity>
            );
        }

    }

    if(users.length == 0){
        return (
            <View
                style={[theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}
            >
                <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
                    No users found
                </Text>
            </View>
        );
    }
    
    return (
        <View
            style={[theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer, { flex: 1 }]}
        >

            <View
                style={{flex: 1, marginTop: 50}}
            >
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
    lightUsernameText: {
        flex: 1,
        fontSize: 20,
        marginRight: 20,
        fontWeight: 500,
        color: '#444444',
    },
    darkUsernameText: {
        flex: 1,
        fontSize: 20,
        marginRight: 20,
        fontWeight: 500,
        color: '#EFEFEF',
    },
    lightRightIconStyle: {
        fontSize: 30,
        alignSelf: 'center',
        marginLeft: 10,
        marginRight: 10,
        color: '#777777',
    },
    darkRightIconStyle: {
        fontSize: 28,
        alignSelf: 'center',
        marginRight: 10,
        color: '#CCCCCC',
    },
    // lightListItem: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     height: 60, 
    //     flexDirection: 'row',
    //     backgroundColor: '#FFFFFF',
    //     alignItems: 'center', 
    //     marginHorizontal: 0, 
    //     marginVertical: 5, 
    //     borderRadius: 100, 
    //     borderWidth: 1,
    //     borderColor: '#CCCCCC',
    // },
    lightListItem: {
        flex: 1,
        flexDirection: 'row',
        height: 60, 
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        alignItems: 'center', 
        marginHorizontal: 0, 
        marginVertical: 5, 
        borderRadius: 0, 
        borderWidth: 1,
        borderColor: '#CCCCCC',
    },
    darkListItem: {
        flex: 1, 
        flexDirection: 'row',
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
    lightContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#F4F4F4"
    },
    darkContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#282828"
    },
    lightText: {
        fontSize: 22,
        marginRight: 20,
        fontWeight: 500,
        color: '#555555',
    },
    darkText: {
        fontSize: 22,
        marginRight: 20,
        fontWeight: 500,
        color: '#DDDDDD',
    },
});

const mapStateToProps = (store) => ({
    searchState: store.searchState.currentSearch,
})

export default connect(mapStateToProps, null)(SearchUsers);