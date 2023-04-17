import React, {useRef, useState} from 'react';
import { View, Text, StyleSheet, Dimensions, Image, } from 'react-native';
import PostContainer from './PostContainer';
import PostBottom from './PostBottom';
import Carousel from 'react-native-reanimated-carousel';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const MultiImagePost = ({ navigation, title, imageUrls, tags }) => {

    return (
        <PostContainer 
            title={title}
            content={
                <View>
                    <Carousel
                        // loop
                        panGestureHandlerProps={{
                            activeOffsetX: [-10, 10],
                        }}
                        width={width}
                        loop={true}
                        height={width}
                        autoPlay={false}
                        mode={'parallax'}
                        modeConfig={{
                            // parallaxScrollingOffset: 50,
                            // parallaxScrollingScale: .93,
                            // parallaxAdjacentItemScale: .97 ,
                            parallaxScrollingScale: 0.95,
                            parallaxScrollingOffset: 28,
                        }}
                        style={{ height: width/1.2, marginBottom: 8}}
                        // vertical
                        pagingEnabled={true}
                        snapEnabled={true}
                        data={imageUrls}
                        scrollAnimationDuration={800}
                        onSnapToItem={(index) => 
                            {
                                // console.log('current index:', index);
                                // setIndex(index);
                                // scrollX.setValue(index);
                            }
                        }
                        renderItem={({ item, index }) => (
                            <View>
                                <Image
                                    source={{uri: item.url}}
                                    style={styles.image}
                                />
                                
                                <View style={styles.indicatorContainer}>
                                    <Text style={styles.indicatorText}>{index+1} / {imageUrls.length}</Text>

                                </View>
                                
                            </View>
                            
                        )}
                    />

                    <PostBottom tags={tags} memeText={false}/>
                </View>
            }
        />
        
    );
}

const styles = StyleSheet.create({
    image: {
        // flex: 1,
        // marginHorizontal: 5,
        minHeight: 350,
        maxHeight: 350,
        borderRadius: 20,
    },
    indicatorContainer: {
        width: 70,
        height: 35,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        position: 'absolute',
        marginLeft: 330,
        marginTop: 10,
    },
    indicatorText: {
        fontSize: 20,
        fontWeight: "500",
        color: '#333333',
        textAlign: "center",
        marginVertical: 5,
    }
});

export default MultiImagePost;
