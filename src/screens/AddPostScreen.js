import React, {useContext, useState, useEffect,} from 'react';
import {View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView} from 'react-native';
import {ThemeContext} from '../../context-store/context';
import GlobalStyles from '../constants/GlobalStyles';
import imgflip from '../api/imgflip';
import PostBar from '../components/PostBar';
import SimpleTopBar from '../components/SimpleTopBar';

const AddPostScreen = ({navigation}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [memeTemplates, setMemeTemplates] = useState([]);

    const getTemplates = async () => {
        const response = await imgflip.get(`/get_memes`);
        setMemeTemplates(response.data.data.memes);
    };

    useEffect(() => {
      getTemplates();
    }, []);

    // Sets the header to the AddPostTop component
    useEffect(() => {
        navigation.setOptions({
            header: () => <SimpleTopBar title={"Back"}/>
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

          <FlatList
            numColumns={2}
            data={memeTemplates}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditMeme', {imageUrl: item.url, memeId: item.id, memeName: item.name})}
                >
                  <Image
                    style={styles.image}
                    source={{ uri: item.url }}
                  />
                </TouchableOpacity>
              );
            }}
            />         
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
    borderColor: '#999999'
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
    borderColor: '#888888'
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