import React, {useContext} from 'react';
import {View, Text, StyleSheet, TextInput, Dimensions} from 'react-native';
import {ThemeContext} from '../../context-store/context';
import GlobalStyles from '../constants/GlobalStyles';
import Carousel from 'react-native-reanimated-carousel';
import TextPost from '../components/postTypes/TextPost';

const posts = [
    {url : 'https://source.unsplash.com/random/100x400?sig=1', height: 400, id: 1},
    {url : 'https://source.unsplash.com/random/400x400?sig=2', height: 400, id: 2},
    {url : 'https://source.unsplash.com/random/400x400?sig=3', height: 400, id: 3},
    {url : 'https://source.unsplash.com/random/400x400?sig=4', height: 400, id: 4},
    {url : 'https://source.unsplash.com/random/400x400?sig=5', height: 400, id: 5},
    {url : 'https://source.unsplash.com/random/300x300?sig=6', height: 300, id: 6},
    {url : 'https://source.unsplash.com/random/300x500?sig=7', height: 500, id: 7},
    {url : 'https://source.unsplash.com/random/200x100?sig=8', height: 100, id: 8},
    {url : 'https://source.unsplash.com/random/400x400?sig=9', height: 400, id: 9},
    {url : 'https://source.unsplash.com/random/400x400?sig=10', height: 400, id: 10},
];

const TvMoviesScreen = ({navigation}) => {
    const height = Dimensions.get('window').height;
    const width = Dimensions.get('window').width;
    const {theme,setTheme} = useContext(ThemeContext);

    return (
        <View style={theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer}>
            <Carousel
                // loop
                panGestureHandlerProps={{
                    activeOffsetY: [-10, 10],
                }}
                width={width}
                height={height/2}
                autoPlay={false}
                mode={'parallax'}
                modeConfig={{
                    parallaxScrollingOffset: 10,
                    parallaxScrollingScale: 1,
                    parallaxAdjacentItemScale: .97 ,
                }}
                style={{ marginTop: 130, height: height }}
                vertical
                pagingEnabled={true}
                snapEnabled={true}
                data={posts}
                scrollAnimationDuration={800}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ item, index }) => (
                    <TextPost title={"srgwer werg wergwe"} text={"Below is an example where there are two View elements contained inside of a parent View with a blue border. The two View elements each contain a View wrapped around a Text element. In the case of the first View with default styling, the yellow child View expands horizontally to fill the entire width. In the second View whereBelow is an example where there are two View elements contained inside of a parent View with a blue border. The two View elements each contain a View wrapped around a Text element. In the case of the first View with default styling, the yellow child View expands horizontally to fill the entire width. In the second View where"} />
                )}
            />

            {/* <SideBar /> */}

        </View>
    );
}

const styles = StyleSheet.create({});

export default TvMoviesScreen;