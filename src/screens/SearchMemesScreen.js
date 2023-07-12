import React, {useEffect, useState, useContext} from 'react';
import {View, ScrollView, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import firebase from 'firebase/compat/app';
import { db, storage } from '../config/firebase';
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { Image } from 'expo-image';
import { manipulateAsync } from 'expo-image-manipulator';
import {ThemeContext} from '../../context-store/context';
import GlobalStyles from '../constants/GlobalStyles';

import MemesSearchBar from '../components/MemesSearchBar';
import { set } from 'react-native-reanimated';

export default function SearchMemesScreen({navigation, route}){
    const {theme,setTheme} = useContext(ThemeContext);
    const [leftMemeTemplates, setLeftMemeTemplates] = useState([]);
    const [rightMemeTemplates, setRightMemeTemplates] = useState([]);
    const [term, setTerm] = useState('');

    useEffect(() => {
        if (term !== '') {
            q = query(
                collection(db, "imageTemplates"),
                where("name", ">=", term),
                where('name', '<=', term + '\uf8ff'),
                limit(2)
            );
    
            getDocs(q)
            .then((snapshot) => {
                let templates = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setLeftAndRightMemeTemplates(templates);
            });
        }
    }, [term]);

    // a function to split the meme templates into two arrays, the left should be odd indexes and the right should be even indexes
    const setLeftAndRightMemeTemplates = async (memeTemplates) => {
        let left = [];
        let right = [];

        for(let i = 0; i < memeTemplates.length; i++){
            if(i % 2 == 0){
                left.push(memeTemplates[i]);
            }else{
                right.push(memeTemplates[i]);
            }
        }

        setLeftMemeTemplates(left);
        setRightMemeTemplates(right);
    };
   
    // Sets the header to the SimpleTopBar component
    useEffect(() => {
        navigation.setOptions({
            header: () => <MemesSearchBar title={"Back"} term={term} setTerm={setTerm}/>
        });
    }, [navigation]);

    const getbase64AndNav = async (image, memeName) => {
      const manipResult = await manipulateAsync(image, [], {
        // compress: 0.2,
        // format: SaveFormat.PNG,
        base64: true,
      });

      console.log(memeName);
      console.log(`data:image/jpeg;base64,${manipResult.base64}`);
  
      await navigation.navigate('EditMeme', {imageUrl: `data:image/jpeg;base64,${manipResult.base64}`, memeName: memeName});
    };
    
    return (
      <View style={[theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer, { alignItems: 'center', justifyContent: 'center', marginTop: 10 }]}>

            
          <View style={{flexDirection: 'row'}}>

            {/* left side of meme templates */}
            <View style={{flex: 1}}>
              <FlatList
                numColumns={1}
                data={leftMemeTemplates}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => getbase64AndNav(item.url, item.name)}
                    >
                      <ImageContainer
                        imageSource={{ uri: item.url }}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            {/* right side of meme templates */}
            <View style={{flex: 1}}>
              <FlatList
                numColumns={1}
                data={rightMemeTemplates}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => getbase64AndNav(item.url, item.name)}
                    >
                      <ImageContainer
                        imageSource={{ uri: item.url }}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>

        <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
            Didn't find the right template?
        </Text>

        <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
            Try changing the captalization for some words and check spelling.
        </Text>
                
        </View>
    );
}

const styles = StyleSheet.create({
    lightText: {
        fontSize: 20,
        marginRight: 20,
        marginTop: 20,
        fontWeight: '500',
        color: '#555555',
        alignSelf: 'center',
    },
    darkText: {
        fontSize: 20,
        marginRight: 20,
        fontWeight: '500',
        color: '#DDDDDD',
        alignSelf: 'center',
    },
});