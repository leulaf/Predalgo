import React, {useContext, useState, useEffect,} from 'react';
import {View, Text, StyleSheet, FlatList, Button, TouchableOpacity, ScrollView} from 'react-native';
import TextTicker from 'react-native-text-ticker'
import { Image } from 'expo-image';
import {ThemeContext} from '../../context-store/context';
import { db, storage } from '../config/firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import firebase from 'firebase/compat/app';
import GlobalStyles from '../constants/GlobalStyles';
import SimpleTopBar from '../components/SimpleTopBar';

import DarkMemeCreate from '../../assets/post_meme_create_light.svg';
import LightMemeCreate from '../../assets/post_meme_create_dark.svg';

import ScalableImage from 'react-native-scalable-image';

ImageContainer = (props) => {    
    return (
        <ScalableImage 
            width={200} // this will make image take full width of the device
            source={props.imageSource} // pass the image source via props
            style={{borderRadius: 10, marginHorizontal: 3, marginVertical: 6}}
        />
    );
};

const MemeScreen = ({ navigation, route }) => {
    const { theme, setTheme } = useContext(ThemeContext);
    const { imageUrl, memeName, uploader, useCount } = route.params;
    const [leftMemeTemplates, setLeftMemeTemplates] = useState([]);
    const [rightMemeTemplates, setRightMemeTemplates] = useState([]);

    useEffect(() => {
        getFirstTenMemes();
    }, []);

    const getFirstTenMemes = async () => {
        const q = query(
            collection(db, "allPosts"),
            where("memeName", "==", memeName),
            orderBy("likesCount", "desc"),
            limit(10)
        );
        console.log(memeName);
        
        await getDocs(q)
        .then((snapshot) => {
            let templates = snapshot.docs.map(doc => {
                const data = doc.data();
                console.log(data);
                const id = doc.id;
                return { id, ...data }
            })

            setLeftAndRightMemeTemplates(templates);
        });

        // await setLeftAndRightMemeTemplates(memeTemplates);
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

    useEffect(() => {
        navigation.setOptions({
        header: () => <SimpleTopBar title={"Back"}/>,
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <ScrollView style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
                
                {/* template image, meme name, uploader, use count */}
                <View style={theme == 'light' ? styles.lightMemeInfoContainer: styles.darkMemeInfoContainer}>

                    <Image source={{uri: imageUrl}} style={styles.image} cachePolicy='disk'/>

                    <View style={{flexDirection: 'column'}}>
                        {/* meme name */}
                        <View style={styles.memeName}>
                            {theme == "light" ?
                                <LightMemeCreate width={25} height={25} marginHorizontal={7} marginTop={1}/>
                                :
                                <DarkMemeCreate width={25} height={25} marginHorizontal={7} marginTop={1}/>
                            }

                            <TextTicker
                                style={theme == 'light' ? styles.lightMemeName: styles.darkMemeName}
                                duration={12000}
                                loop
                                // bounce
                                repeatSpacer={50}
                                marqueeDelay={1000}
                            >
                                {memeName}
                            </TextTicker>
                        </View>
                        
                        {/* @Uploader */}
                        <Text style={theme == 'light' ? styles.lightUploaderText : styles.darkUploaderText}>
                            By @{uploader}
                        </Text>

                        {/* use count */}
                        <Text style={theme == 'light' ? styles.lightUseCountText : styles.darkUseCountText}>
                            {useCount} memes
                        </Text>
                    </View>
                </View>

                {/* Memes */}

                
                <View style={{flexDirection: 'row', marginTop: 10}}>
                    {/* left side of meme templates */}
                    <View style={{flex: 1}}>
                        <FlatList
                            numColumns={1}
                            data={leftMemeTemplates}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                            return (
                                <TouchableOpacity
                                    // onPress={() => navigation.navigate('Meme', {imageUrl: item.url, memeName: item.name, uploader: item.uploader, useCount: item.useCount})}
                                >
                                    <ImageContainer
                                        imageSource={{ uri: item.imageUrl }}
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
                                    // onPress={() => navigation.navigate('Meme', {imageUrl: item.url, memeName: item.name, uploader: item.uploader, useCount: item.useCount})}
                                >
                                    <ImageContainer
                                        imageSource={{ uri: item.imageUrl }}
                                    />
                                </TouchableOpacity>
                            );
                            }}
                        />
                    </View>
                </View>

                
            </ScrollView>
            
            {/* create meme button */}
            <TouchableOpacity
                style={styles.useTemplateButton}
                onPress={() => navigation.navigate('EditMeme', {imageUrl: imageUrl, memeName: memeName, uploader: uploader, useCount: useCount})}
            >
                <DarkMemeCreate width={26} height={26} alignSelf={'center'} marginRight={5} marginTop={4}/>

                <Text style={styles.useTemplateButtonText}>
                    Use meme template
                </Text>
            </TouchableOpacity>
        </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    lightContainer: {
        backgroundColor: '#FFFFFF',
    },
    darkContainer: {
        backgroundColor: '#1A1A1A',
    },
    lightMemeInfoContainer: {
        flexDirection: 'row',
        borderRadius: 20,
        borderBottomWidth: 1.5,
        borderColor: '#efefef'
    },
    darkMemeInfoContainer: {
        flexDirection: 'row',
        borderRadius: 20,
        borderBottomWidth: 1,
        borderBottomWidth: 1.5,
        borderColor: '#2f2f2f'
    },
    image: {
        marginLeft: 7,
        marginTop: 15,
        marginBottom: 25,
        borderRadius: 20,
        width: 150,
        height: 150,
    },
    memeName: {
        width: 225,
        marginTop: 23,
        flexDirection: 'row',
    },
    lightMemeName: {
        fontSize: 18,
        color: '#111111',
        fontWeight: '500',
        // alignSelf: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
    },
    darkMemeName: {
        fontSize: 18,
        color: '#f2f2f2',
        fontWeight: '500',
        // alignSelf: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
    },
    lightUploaderText: {
        fontSize: 18,
        color: '#222222',
        fontWeight: '500',
        marginLeft: 7,
        marginTop: 10,
        // alignSelf: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
    },
    darkUploaderText: {
        fontSize: 18,
        color: '#f2f2f2',
        fontWeight: '500',
        marginLeft: 7,
        marginTop: 10,
        // alignSelf: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
    },
    lightUseCountText: {
        fontSize: 16,
        color: '#222222',
        fontWeight: '500',
        marginLeft: 7,
        marginTop: 10,
        // alignSelf: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
    },
    darkUseCountText: {
        fontSize: 17,
        color: '#f2f2f2',
        fontWeight: '500',
        marginLeft: 7,
        marginTop: 10,
        // alignSelf: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
    },
    useTemplateButton: {
        width: 225,
        height: 55,
        borderRadius: 100,
        flexDirection: 'row',
        marginTop: 700,
        position: 'absolute',
        backgroundColor: '#005FFF',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    useTemplateButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '500',
        alignSelf: 'center',
    }
});

export default MemeScreen;