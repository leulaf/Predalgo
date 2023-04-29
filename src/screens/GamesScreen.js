import React, {useContext} from 'react';
import {View, Text, StyleSheet, TextInput, Dimensions, FlatList} from 'react-native';
import {ThemeContext} from '../../context-store/context';
import GlobalStyles from '../constants/GlobalStyles';
import AllPosts from '../components/postTypes/AllPosts';

const posts = [
    {
        id: 1,
        title : 'example title',
        memeText: 'meme name text goes here',
        tags: ['#memes', '#memes'],
        url : 'https://source.unsplash.com/random/100x400?sig=1',
        imageUrls: null,
        text: null,
    },
    {
        id: 2,
        title : 'example title',
        memeText: null,
        tags: ['#memes', '#memes'],
        url : null,
        imageUrls : null,
        text: 'In the upcoming lecture, we will be generating our project. This command has changed and no longer requires the expo-cli global module. Now, we simply need to run the following command In the upcoming lecture, we will be generating our project. This command has changed and no longer requires the expo-cli global module.',
    },
    {
        id: 3,
        title : 'example title',
        memeText: null,
        tags: ['#memes', '#memes'],
        url : null,
        imageUrls : [
            {url : 'https://source.unsplash.com/random/100x400?sig=1', id: 1},
            {url : 'https://source.unsplash.com/random/400x400?sig=2', id: 2},
            {url : 'https://source.unsplash.com/random/400x400?sig=3', id: 3},
            {url : 'https://source.unsplash.com/random/400x400?sig=4', id: 4},
            {url : 'https://source.unsplash.com/random/400x400?sig=5', id: 5},],
        text: null,
    },
    {
        id: 4,
        title : 'example title',
        memeText: null,
        tags: ['#memes', '#memes'],
        url : null,
        imageUrls : null,
        text: 'In the upcoming lecture, we will be generating our project. This command has changed and no longer requires the expo-cli global module. Now, we simply need to run the following command In the upcoming lecture, we will be generating our project. This command has changed and no longer requires the expo-cli global module.',
    },
];


const GamesScreen = ({navigation}) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const height = Dimensions.get('window').height;
    const width = Dimensions.get('window').width;
    
    return (
        <View style={theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer}>
            <AllPosts posts={posts}/>
        {/* <SideBar /> */}

        </View>
            

    );
}

const styles = StyleSheet.create({});

export default GamesScreen;