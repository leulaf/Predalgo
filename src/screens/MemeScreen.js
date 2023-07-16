import React, {useContext, useState, useEffect,} from 'react';
import {View, Text, StyleSheet, FlatList, Button, TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import TextTicker from 'react-native-text-ticker'
import { Image } from 'expo-image';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import {ThemeContext} from '../../context-store/context';
import { db, storage } from '../config/firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs, } from "firebase/firestore";
import firebase from 'firebase/compat/app';
import GlobalStyles from '../constants/GlobalStyles';
import MemeTopBar from '../components/MemeTopBar';

import DarkMemeCreate from '../../assets/post_meme_create_light.svg';
import LightMemeCreate from '../../assets/post_meme_create_dark.svg';

import ScalableImage from 'react-native-scalable-image';

const ImageContainer = (props) => {    
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
    const { memeName } = route.params;

    const [imageUrl, setImageUrl] = useState("");
    const [uploader, setUploader] = useState("");
    const [useCount, setUseCount] = useState("");

    const [leftMemeTemplates, setLeftMemeTemplates] = useState([]);
    const [rightMemeTemplates, setRightMemeTemplates] = useState([]);

    useEffect(() => {
        
        const q = query(
            collection(db, "imageTemplates"),
            where("name", "==", memeName),
            limit(1)
        );

        getDocs(q)
        .then((snapshot) => {
            snapshot.docs.map(doc => {
                const data = doc.data();

                setImageUrl(data.url);
                setUploader(data.uploader);
                setUseCount(data.useCount);
            })
        }).then(() => {
            getFirstTenMemes();
        });

    }, []);

    const getFirstTenMemes = async () => {
        const q = query(
            collection(db, "allPosts"),
            where("memeName", "==", memeName),
            orderBy("likesCount", "desc"),
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

    const getbase64AndNav = async (image, memeName) => {
        const manipResult = await manipulateAsync(image, [], {
          // compress: 0.2,
          // format: SaveFormat.PNG,
          base64: true,
        });
    
        await navigation.navigate('EditMeme', {imageUrl: `data:image/jpeg;base64,${manipResult.base64}`, memeName: memeName});
    };

    useEffect(() => {
        navigation.setOptions({
            header: () => <MemeTopBar name={memeName} url={imageUrl}/>,
        });
    }, [navigation, imageUrl, memeName]);

    return (

            <ScrollView style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
                
                {/* template image, meme name, uploader, use count */}
                <View style={theme == 'light' ? styles.lightMemeInfoContainer: styles.darkMemeInfoContainer}>

                    <Image source={{uri: imageUrl}} style={styles.image} cachePolicy='disk'/>

                    <View style={{flexDirection: 'column', marginLeft: 10}}>
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
                            // nestedScrollEnabled={true}
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
                            // nestedScrollEnabled={true}
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
                
                {/* create meme button */}
                <TouchableOpacity
                    style={theme == 'light' ? styles.lightUseTemplateButton : styles.darkUseTemplateButton}
                    onPress={() => getbase64AndNav(imageUrl, memeName)}
                >
                    {theme == "light" ?
                        <LightMemeCreate width={28} height={28} alignSelf={'center'} marginRight={5} marginTop={4}/>
                        :
                        <DarkMemeCreate width={28} height={28} alignSelf={'center'} marginRight={5} marginTop={4}/>
                    }

                    <Text style={theme == 'light' ? styles.lightUseTemplateText : styles.darkUseTemplateText}>
                        Use meme template
                    </Text>
                </TouchableOpacity>
                
            </ScrollView>
            
            

  );
};

const styles = StyleSheet.create({
    lightContainer: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    darkContainer: {
        flex: 1,
        backgroundColor: '#161616',
    },
    lightMemeInfoContainer: {
        flexDirection: 'row',
        borderRadius: 20,
        borderBottomWidth: 1.5,
        borderColor: '#DDDDDD'
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
    lightUseTemplateButton: {
        width: 240,
        height: 55,
        borderRadius: 100,
        flexDirection: 'row',
        marginTop: 700,
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#BBBBBB'
    },
    darkUseTemplateButton: {
        width: 240,
        height: 55,
        borderRadius: 100,
        flexDirection: 'row',
        marginTop: 700,
        position: 'absolute',
        backgroundColor: '#151515',
        alignSelf: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#444444'
    },
    lightUseTemplateText: {
        fontSize: 20,
        color: '#111111',
        fontWeight: '500',
        alignSelf: 'center',
    },
    darkUseTemplateText: {
        fontSize: 20,
        color: '#F0F0F0',
        fontWeight: '500',
        alignSelf: 'center',
    },
});

export default MemeScreen;