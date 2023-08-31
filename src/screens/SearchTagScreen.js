import React, {useState, useEffect, useContext, useCallback} from 'react';
import {TouchableOpacity, ScrollView, Image, View, Text, StyleSheet, TextInput, FlatList, Dimensions} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {ThemeContext} from '../../context-store/context';
import firebase from 'firebase/compat/app';
import { db, storage } from '../config/firebase';
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { connect } from 'react-redux';
import { Feather, AntDesign } from '@expo/vector-icons';
import GlobalStyles from '../constants/GlobalStyles';

function SearchTagScreen(props){
    const navigation = useNavigation();
    const {theme,setTheme} = useContext(ThemeContext);
    const [correctTag, setCorrectTag] = useState('');
    const [foundTag, setFoundTag] = useState(false);

    const searchForTag = async() => {
        let q = query(
            collection(db, "allPosts"),
            where("tags", "array-contains", correctTag),
            limit(1))
        ;

        await getDocs(q)
        .then((snapshot) => {
            if(snapshot.docs.length > 0){
                setFoundTag(true);
            }else{
                setFoundTag(false);
            }
        });
    }

    // called only when the screen is focused
    useFocusEffect(
        useCallback(() => {
            let isActive = true;
        
            const { searchState } = props;
       
            if(searchState.charAt(0) == '#'){
                setCorrectTag(searchState);
            }else{
                setCorrectTag("#"+searchState);
            }

            searchForTag();
      
            return () => {
                isActive = false;
            };
        }, [props.searchState, correctTag])
    );

    const renderItem = (item) => {
        return (
            <TouchableOpacity
                style={theme == "light" ? styles.lightListItem : styles.darkListItem}
                onPress={() => navigation.navigate("Tag", { tag: item.correctTag })}
            >
                <Feather
                    name="search"
                    style={
                        theme == "light"
                        ? styles.lightSearchIconStyle
                        : styles.darkSearchIconStyle
                    }
                />
        
                <Text style={theme == "light" ? styles.lightTagText : styles.darkTagText}>
                    {item.correctTag}
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
    };

    if(!foundTag){
        return (
            <View style={[theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
                    No tags found
                </Text>
            </View>
        );
    }

    return (
            <View
                style={{ flex: 1, backgroundColor: theme == "light" ? "#F4F4F4" : "#282828" }}
            >
                
                    <View style={{ flexDirection: 'row', flex: 1, marginTop: 50 }}>
                        <FlatList
                            numColumns={1}
                            horizontal={false}
                            data={[{ correctTag: correctTag }]} // Pass an array of items
                            keyExtractor={(item) => item.correctTag}
                            renderItem={({ item }) => renderItem(item)}
                        />
                    </View>
            </View>
    );
}

const styles = StyleSheet.create({
    searchImage: {
        width: 50,
        height: 50,
        marginLeft: 5,
        marginRight: 10,
        borderRadius: 100,
    },
    lightSearchIconStyle: {
        fontSize: 28,
        alignSelf: 'center',
        marginLeft: 10,
        marginRight: 10,
        color: '#666666',
    },
    darkSearchIconStyle: {
        fontSize: 28,
        alignSelf: 'center',
        marginLeft: 10,
        marginRight: 10,
        color: '#DDDDDD',
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
    lightTagText: {
        flex: 1,
        fontSize: 22,
        marginRight: 20,
        fontWeight: 500,
        color: '#555555',
    },
    darkTagText: {
        flex: 1,
        fontSize: 22,
        marginRight: 20,
        fontWeight: 500,
        color: '#EEEEEE',
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

export default connect(mapStateToProps, null)(SearchTagScreen);