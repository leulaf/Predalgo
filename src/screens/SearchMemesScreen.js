import React, {useEffect, useState, useContext} from 'react';
import {View, Text, Image,StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import firebase from 'firebase/compat/app';
import { db, storage } from '../config/firebase';
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { manipulateAsync } from 'expo-image-manipulator';
import {ThemeContext} from '../../context-store/context';
import GlobalStyles from '../constants/GlobalStyles';

import MemesSearchBar from '../components/MemesSearchBar';


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
    }, []);

    const getbase64AndNav = async (image, memeName) => {
      const manipResult = await manipulateAsync(image, [], {
        // compress: 0.2,
        // format: SaveFormat.PNG,
        base64: true,
      });
  
      await navigation.navigate('EditMeme', {imageUrl: `data:image/jpeg;base64,${manipResult.base64}`, memeName: memeName});
    };
    
    return (
      <ScrollView
        onTouchStart={e=> this.touchX = e.nativeEvent.pageX}
        onTouchEnd={e => {
        if (e.nativeEvent.pageX - this.touchX > 150)
            // console.log('Swiped Right')
            navigation.goBack()
        }}
        style={[theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer, { flex: 1 }]}
      >

            
          <View style={{flexDirection: 'row', marginTop: 10}}>

            {/* left side of meme templates */}
            <View style={{}}>
              <FlatList
                // nestedScrollEnabled={true}
                numColumns={1}
                data={leftMemeTemplates}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Meme', {memeName: item.name})}
                    >
                      <Image
                        imageSource={{ uri: item.url }}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            {/* right side of meme templates */}
            <View style={{}}>
              <FlatList
                // nestedScrollEnabled={true}
                numColumns={1}
                data={rightMemeTemplates}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Meme', {memeName: item.name})}
                    >
                      <Image
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
                
      </ScrollView>
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