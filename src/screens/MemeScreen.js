import React, {useContext, useRef, useState, useEffect,} from 'react';
import {View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions} from 'react-native';

import TextTicker from 'react-native-text-ticker';

import { StackActions } from '@react-navigation/native';

import DisplayMeme from '../shared/functions/DisplayMeme';

import Animated, {FadeIn} from 'react-native-reanimated';

import { MasonryFlashList, FlashList } from '@shopify/flash-list';

import ResizableImage from '../shared/functions/ResizableImage';

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import {ThemeContext} from '../../context-store/context';
import { db, storage } from '../config/firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs, } from "firebase/firestore";
import GlobalStyles from '../constants/GlobalStyles';
import MemeTopBar from '../ScreenTop/MemeTopBar'

import DarkMemeCreate from '../../assets/post_meme_create_dark.svg';
import LightMemeCreate from '../../assets/post_meme_create_light.svg';

const lightBackground = require('../../assets/AddPostBackgroundLight.png');
const darkBackground = require('../../assets/AddPostBackgroundDark.png');


const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;


// const srenderItem = ({item, index}) => {
//     // console.log(
//     //     "-----------------------template---------------",
//     //     item.template,
//     //     "*******************state*******************",
//     //     item.templateState)
//     return (
//         <Animated.View
//             entering={FadeIn}
//             style={
//                 [
//                     index % 2 == 1 ?
//                         {marginLeft: 2, marginRight: 4, marginBottom: 6, } 
//                     :
//                         {marginLeft: 4, marginRight: 2, marginBottom: 6, }
//                 ]
//             }
//         >

//             <DisplayMeme
//                 // navigation={navigation}
//                 item={item}
//                 style={{borderRadius: 10}}
//                 maxHeight={500}
//                 maxWidth={windowWidth/2 - 8}
//                 template={item.template}
//                 templateState={item.templateState}
//             />

//         </Animated.View>
//     );
// }




const navToEdit= (navigation, item, forCommentOnComment, forCommentOnPost) => () => {
    if(forCommentOnComment || forCommentOnPost){
      navigation.dispatch(
          StackActions.replace('EditMeme', {
                uploader: item.uploader,
                replyMemeName: item.name,
                imageUrl: item.template,
                height: item.height,
                width: item.width,
                // useCount: item.useCount,
                templateExists: true,
                forCommentOnComment: forCommentOnComment,
                forCommentOnPost: forCommentOnPost,
                forMemeComment: forCommentOnComment
        })
      )
    }else{
        navigation.navigate('EditMeme', {
            uploader: item.uploader,
            replyMemeName: item.name,
            imageUrl: item.template,
            height: item.height,
            width: item.width,
            // useCount: item.useCount,
            templateExists: true,
            forCommentOnComment: forCommentOnComment,
            forCommentOnPost: forCommentOnPost,
            forMemeComment: forCommentOnComment
        })
    }
}


const keyExtractor = (item, index) => item.id.toString + "-" + index.toString();

const MemeScreen = ({ navigation, route }) => {
    const { theme, setTheme } = useContext(ThemeContext);

    const [memeTemplates, setMemeTemplates] = useState([{id : "fir"}, {id: "sec"}]);

    const { memeName, template, height, width, uploader, useCount, forCommentOnComment, forCommentOnPost, fromSavedTemplates } = route.params;

    const flashListRef = useRef(null);

    var templateUri;

    useEffect(() => {
        (useCount > 0 || fromSavedTemplates || !(useCount))&& getFirstTenMemes();
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', template, true);
        xhr.onload = function(e) {
            if (this.status == 200) {
                templateUri = new File([this.response],'fileName');
            }
        };
    }, []);

    // console.log(template)

    const getFirstTenMemes = React.useCallback(async () => {
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
                // console.log(data)
                const id = doc.id;
                return { id, ...data }
            })

            setMemeTemplates(templates);
        });
    }, []);

    const renderItem = ({ item, index }) => {
        if(item.id == "fir" || item.id == "sec"){
            return null;
        }

        return (
            <Animated.View
                entering={FadeIn}
                style={
                    [
                        index % 2 == 1 ?
                            {marginLeft: 2, marginRight: 4, marginBottom: 6, } 
                        :
                            {marginLeft: 4, marginRight: 2, marginBottom: 6, }
                    ]
                }
            >

                <DisplayMeme
                    // navigation={navigation}
                    theme={theme}
                    item={item}
                    style={{borderRadius: 10}}
                    maxHeight={500}
                    maxWidth={windowWidth - 4}
                    template={templateUri}
                    templateState={item.templateState}
                    templateUploader={uploader}
                />

            </Animated.View>
        );

    };

    return (
        <Animated.View
            entering={FadeIn}
            style={theme == 'light' ? styles.lightContainer : styles.darkContainer}
        >


            <ImageBackground 
                source={theme == 'light' ? lightBackground : darkBackground} 
                resizeMode="cover"
                // height={windowHeight}
                // width={windowWidth}
                style={theme == 'light' ? styles.lightBackground : styles.darkBackground}
            >


                {/* Memes */}
                <FlashList
                    ref={flashListRef}
                    data={memeTemplates}

                    // extraData={[]}

                    renderItem={renderItem}

                    // onEndReached={commentsList[commentsList.length-1].snap && getNextTenComments }
                    // onEndReachedThreshold={1} //need to implement infinite scroll

                    removeClippedSubviews={true}

                    estimatedItemSize={400}
                    estimatedListSize={{height: windowHeight, width: windowWidth}}

                    keyExtractor={keyExtractor}

                    ListHeaderComponent={
                        // template image, meme name, uploader, use count
                        <View style={theme == 'light' ? styles.lightMemeInfoContainer: styles.darkMemeInfoContainer}>

                            <ResizableImage
                                image={template}
                                height={height}
                                width={width}
                                maxHeight={300}
                                maxWidth={windowWidth/2 - 8}
                                style={styles.image}
                            />

                            <View style={{flexDirection: 'column', marginLeft: 10, marginTop: 90}}>
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
                                {useCount &&
                                    <Text style={theme == 'light' ? styles.lightUseCountText : styles.darkUseCountText}>
                                        {useCount} memes
                                    </Text>
                                }
                            </View>

                            
                        </View>
                    }

                    ListFooterComponent={
                        <View style={{height: 200}}/>
                    }

                    showsVerticalScrollIndicator={false}

                    getItemType={getItemType}
                />


                

            </ImageBackground>


            <MemeTopBar navigation={navigation} theme={theme} name={memeName} url={template} height={height} width={width} fromSavedTemplates={fromSavedTemplates}/>


            {/* create meme button */}
            <TouchableOpacity
                style={theme == 'light' ? styles.lightUseTemplateButton : styles.darkUseTemplateButton}
                onPress={
                    navToEdit(navigation, {
                        uploader: uploader,
                        name: memeName,
                        template: template,
                        height: height,
                        width: width,
                        forCommentOnComment: forCommentOnComment,
                        forCommentOnPost: forCommentOnPost,
                    }, forCommentOnComment, forCommentOnPost)
                }
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
            
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    lightContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    darkContainer: {
        flex: 1,
        backgroundColor: 'rgba(20, 20, 20, 1)',
    },
    darkBackground: {
        flex: 1,
        height: windowHeight*1.7,
        // justifyContent: 'center',
    },
    lightBackground: {
        flex: 1,
        height: windowHeight*1.6,
        // justifyContent: 'center',
    },
    lightMemeInfoContainer: {
        flexDirection: 'row',
        // marginTop: 100,
        marginBottom: 15,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        // borderBottomWidth: 1.5,
        // borderColor: '#DDDDDD'
    },
    darkMemeInfoContainer: {
        flexDirection: 'row',
        // marginTop: 100,
        marginBottom: 15,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        // borderBottomWidth: 1,
        // borderBottomWidth: 1.5,
        // borderColor: '#2f2f2f'
    },
    image: {
        marginLeft: 7,
        marginTop: 100,
        marginBottom: 25,
        borderRadius: 20,
    },
    memeName: {
        width: 225,
        marginTop: 23,
        flexDirection: 'row',
    },
    lightMemeName: {
        fontSize: 18,
        color: '#111111',
        fontWeight: "500",
        // alignSelf: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
    },
    darkMemeName: {
        fontSize: 18,
        color: '#f2f2f2',
        fontWeight: "500",
        // alignSelf: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
    },
    lightUploaderText: {
        fontSize: 18,
        color: '#222222',
        fontWeight: "500",
        marginLeft: 7,
        marginTop: 10,
        // alignSelf: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
    },
    darkUploaderText: {
        fontSize: 18,
        color: '#f2f2f2',
        fontWeight: "500",
        marginLeft: 7,
        marginTop: 10,
        // alignSelf: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
    },
    lightUseCountText: {
        fontSize: 16,
        color: '#222222',
        fontWeight: "500",
        marginLeft: 7,
        marginTop: 10,
        // alignSelf: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
    },
    darkUseCountText: {
        fontSize: 17,
        color: '#f2f2f2',
        fontWeight: "500",
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
        position: 'absolute',
        bottom: 70,
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
        position: 'absolute',
        bottom: 70,
        backgroundColor: '#151515',
        alignSelf: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#444444'
    },
    lightUseTemplateText: {
        fontSize: 20,
        color: '#111111',
        fontWeight: "500",
        alignSelf: 'center',
    },
    darkUseTemplateText: {
        fontSize: 20,
        color: '#F0F0F0',
        fontWeight: "500",
        alignSelf: 'center',
    },
});

export default MemeScreen;

// "<MasonryFlashList
// ref={flashListRef}
// data={memeTemplates}
// numColumns={2}

// optimizeItemArrangement={true} // check if this rearranges previously displayed item onEndReached

// // onEndReached={commentsList[commentsList.length-1].snap && getNextTenPopularComments }
// // onEndReachedThreshold={1} //need to implement infinite scroll

// renderItem={renderItem}
// // extraData={[]}

// removeClippedSubviews={true}

// estimatedItemSize={200}
// estimatedListSize={{height: windowHeight, width: windowWidth}}

// showsVerticalScrollIndicator={false}

// overrideItemLayout={(layout, item) =>{
//     layout.span = windowWidth/2 - 8;
//     // layout.size = item.imageHeight * (layout.span/item.imageWidth);
// }}

// ListHeaderComponent={
//     // template image, meme name, uploader, use count
//     // <View style={theme == 'light' ? styles.lightMemeInfoContainer: styles.darkMemeInfoContainer}>

//     //     <ResizableImage
//     //         image={template}
//     //         height={height}
//     //         width={width}
//     //         maxHeight={300}
//     //         maxWidth={windowWidth/2 - 8}
//     //         style={styles.image}
//     //     />

//     //     <View style={{flexDirection: 'column', marginLeft: 10, marginTop: 90}}>
//     //         {/* meme name */}
//     //         <View style={styles.memeName}>
//     //             {theme == "light" ?
//     //                 <LightMemeCreate width={25} height={25} marginHorizontal={7} marginTop={1}/>
//     //                 :
//     //                 <DarkMemeCreate width={25} height={25} marginHorizontal={7} marginTop={1}/>
//     //             }

//     //             <TextTicker
//     //                 style={theme == 'light' ? styles.lightMemeName: styles.darkMemeName}
//     //                 duration={12000}
//     //                 loop
//     //                 // bounce
//     //                 repeatSpacer={50}
//     //                 marqueeDelay={1000}
//     //             >
//     //                 {memeName}
//     //             </TextTicker>
//     //         </View>
            
//     //         {/* @Uploader */}
//     //         <Text style={theme == 'light' ? styles.lightUploaderText : styles.darkUploaderText}>
//     //             By @{uploader}
//     //         </Text>

//     //         {/* use count */}
//     //         <Text style={theme == 'light' ? styles.lightUseCountText : styles.darkUseCountText}>
//     //             {useCount} memes
//     //         </Text>
//     //     </View>

        
//     // </View>
// }

// ListFooterComponent={
//     // <View style={{height: 100}}/>
// }

// keyExtractor={keyExtractor}
// />"