import React, {useContext, useState, useEffect,} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView} from 'react-native';
import { db, storage } from '../config/firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import firebase from 'firebase/compat/app';

import {ThemeContext} from '../../context-store/context';
import GlobalStyles from '../constants/GlobalStyles';
import imgflip from '../api/imgflip';
import PostBar from '../components/PostBar';
import AddPostTopBar from '../components/AddPostTopBar';
import Image from 'react-native-scalable-image';

const ImageContainer = (props) => {    
    return (
        <Image 
            width={200} // this will make image take full width of the device
            source={props.imageSource} // pass the image source via props
            style={{borderRadius: 10, marginHorizontal: 3, marginVertical: 6}}
        />
    );
};

// const docRef = await addDoc(collection(db, "imageTemplates"), {
//   name: response.data.data.memes[i].name,
//   uploader: "imgflip",
//   url: response.data.data.memes[i].url,
//   useCount: 1000-i,
//   creationDate: firebase.firestore.FieldValue.serverTimestamp(),
// });

const AddPostScreen = ({navigation}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [leftMemeTemplates, setLeftMemeTemplates] = useState([]);
    const [rightMemeTemplates, setRightMemeTemplates] = useState([]);

    useEffect(() => {
      getFirstTenTemplates();
    }, []);

    const getFirstTenTemplates = async () => {
        const q = query(
            collection(db, "imageTemplates"),
            orderBy("useCount", "desc"),
            limit(10)
        );
        
        await getDocs(q)
        .then((snapshot) => {
            let templates = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })

            setLeftAndRightMemeTemplates(templates);
        });
    };

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

    // Sets the header to the AddPostTop component
    useEffect(() => {
        navigation.setOptions({
            header: () => <AddPostTopBar />
        });
    }, [navigation]);
    
    // Removes the bottom navigation
    useEffect(() => {
      navigation.setOptions({
        tabBarStyle: {
          display: "none"
        }
      });
      return () => navigation.getParent()?.setOptions({
        tabBarStyle: undefined
      });
    }, [navigation]);

    return (
        <ScrollView style={theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer}>
          
          <PostBar/>

          <View style={{width: '100%', flexDirection: 'row', alignContent: 'center', justifyContent: 'center'}}>
              <View style={theme == 'light' ? styles.lightPickTemplateContainer : styles.darkPickTemplateContainer}>
                  <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
                      Meme Templates
                  </Text>
              </View>
          </View> 

          {/* left side of meme templates */}
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <FlatList
                numColumns={1}
                data={leftMemeTemplates}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('EditMeme', {imageUrl: item.url, memeName: item.name})}
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
                      onPress={() => navigation.navigate('EditMeme', {imageUrl: item.url, memeName: item.name})}
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
       
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 250,
    marginHorizontal: 3,
    marginVertical: 5,
    borderRadius: 10,
  },
  lightPickTemplateContainer: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    // width: 110,
    height: 40,
    marginLeft: 5,
    marginTop: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#BBBBBB'
  },
  darkPickTemplateContainer: {
    flexDirection: 'column',
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    // width: 110,
    height: 40,
    marginLeft: 5,
    marginTop: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#5D5D5D'
  },
  lightText: {
    fontSize: 22,
    color: '#444444',
    fontWeight: '600',
    alignSelf: 'center',
    marginHorizontal: 10,
    marginTop: 5,
  },
  darkText: {
    fontSize: 22,
    color: '#f2f2f2',
    fontWeight: '600',
    alignSelf: 'center',
    marginHorizontal: 10,
    marginTop: 5,
  },
});

export default AddPostScreen;