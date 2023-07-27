import React, {useEffect, useState, useContext} from 'react';
import {View, ScrollView, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ThemeContext} from '../../context-store/context';
import firebase from 'firebase/compat/app';
import { db, storage } from '../config/firebase';
import { collection, query, where, limit, getDocs, getDoc, doc } from "firebase/firestore";
import GlobalStyles from '../constants/GlobalStyles';
import SimpleTopBar from '../components/SimpleTopBar';
import Image from 'react-native-scalable-image';

const windowWidth = Dimensions.get('window').width;

const ImageContainer = (props) => {    
    return (
        <Image 
            width={windowWidth -15} // this will make image take full width of the device
            source={props.imageSource} // pass the image source via props
            style={{borderRadius: 10, marginHorizontal: 3, marginVertical: 6, alignSelf: 'center'}}
        />
    );
};

const Top_Tab = createMaterialTopTabNavigator();

export default function FavoriteTemplatesScreen({navigation}){
    const {theme,setTheme} = useContext(ThemeContext);
    const [templates, setTemplates] = useState([]);

    
    useEffect(() => {
        getFirstFourTemplates();
    }, []);

    const getFirstFourTemplates = async () => {
        const q = query(
            collection(db, "favoriteImageTemplates", firebase.auth().currentUser.uid, "templates"),
            limit(4)
        );
        
        await getDocs(q)
        .then((snapshot) => {
            let templates = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
            setTemplates(templates);
        });
    };

    

    // Sets the header to the SimpleTopBar component
    useEffect(() => {
        navigation.setOptions({
            header: () => <SimpleTopBar title={"Favorite Templates"}/>
        });
    }, [navigation]);
    
    return (
        <View style={[theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer, { flex: 1 }]}>

            <FlatList
                onTouchStart={e=> this.touchX = e.nativeEvent.pageX}
                onTouchEnd={e => {
                if (e.nativeEvent.pageX - this.touchX > 150)
                    // console.log('Swiped Right')
                    navigation.goBack()
                }}
                numColumns={1}
                data={templates}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    return (
                    <TouchableOpacity
                    style={{marginTop: 15}}
                        onPress={() => navigation.navigate('Meme', {memeName: item.name})}
                    >
                        {/* Meme name */}
                        <Text style={theme == 'light' ? styles.lightName : styles.darkName}>
                            {item.name}
                        </Text>

                        {/* Meme template image */}
                        <ImageContainer
                            imageSource={{ uri: item.url }}
                        />
                    </TouchableOpacity>
                    );
                }}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    lightName: {
        fontSize: 22,
        fontWeight: '600',
        color: '#444444',
        marginLeft: 10,
    },
    darkName: {
        fontSize: 22,
        fontWeight: '600',
        color: '#EEEEEE',
        marginLeft: 10,
    },
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