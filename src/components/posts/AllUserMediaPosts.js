import React, {useState, useEffect, useContext} from 'react';
import {TouchableOpacity, View, Text, StyleSheet, FlatList, Dimensions} from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';
import {ThemeContext} from '../../../context-store/context';
import GlobalStyles from '../../constants/GlobalStyles';
import ResizableImage from  '../../shared/functions/ResizableImage';
import DisplayMedia from '../../shared/post/DisplayMedia';

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;


const renderItem = ({ item, index }) => {
  // If the item is the last item in the list, add some extra bottom padding

  return (
    <DisplayMedia 
      item={item}
      index={index}
    />
  );
};


const keyExtractor = (item, index) => item.id;

export default function AllUserMediaPosts({ userId, postList }){
    const {theme,setTheme} = useContext(ThemeContext);
    const [imagePostList, setImagePostList] = useState(postList.filter(obj => obj.imageUrl || obj.template));


    return (
      <View
        style={[theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer, { flex: 1, marginTop: 15 }]}
      >

        <Tabs.MasonryFlashList
          data={imagePostList}
          numColumns={2}

          // optimizeItemArrangement={true} // check if this rearranges previously displayed item onEndReached

          // onEndReached={commentsList[commentsList.length-1].snap && getNextTenPopularComments }
          // onEndReachedThreshold={1} //need to implement infinite scroll
          
          renderItem={renderItem}
          // extraData={[]}

          removeClippedSubviews={true}

          showsVerticalScrollIndicator={false}

          estimatedItemSize={200}
          estimatedListSize={{height: windowHeight, width: windowWidth}}

          ListFooterComponent={
              <View style={{height: 100}}/>
          }

          // overrideItemLayout={(layout, item) =>{
          //   layout.span = windowWidth/2 - 8;
          //   // layout.size = item.imageHeight * (layout.span/item.imageWidth);
          // }}

          keyExtractor={keyExtractor}
        />

      </View>
    );
}

const styles = StyleSheet.create({
    darkContainer: {
        backgroundColor: "#282828",
        marginTop: 15,
    },
    lightContainer: {
        backgroundColor: "#F6F6F6",
        marginTop: 15,
    },
    // Popular button
    lightPopularButtonActive: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        width: 95,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1.5,
        borderColor: '#BBBBBB'
    },
    darkPopularButtonActive: {
        flexDirection: 'column',
        backgroundColor: '#161616',
        borderRadius: 20,
        width: 95,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1.5,
        borderColor: '#4b4b4b'
    },
    lightPopularButtonInactive: {
        flexDirection: 'column',
        backgroundColor: '#F6F6F6',
        borderRadius: 20,
        width: 95,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1.5,
        borderColor: '#CCCCCC'
    },
    darkPopularButtonInactive: {
        flexDirection: 'column',
        backgroundColor: '#282828',
        borderRadius: 20,
        width: 95,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1.5,
        borderColor: '#3f3f3f'
    },
    // New button
    lightNewButtonActive: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        width: 70,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1.5,
        borderColor: '#BBBBBB'
    },
    darkNewButtonActive: {
        flexDirection: 'column',
        backgroundColor: '#161616',
        borderRadius: 20,
        width: 70,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1.5,
        borderColor: '#4b4b4b'
    },
    lightNewButtonInactive: {
        flexDirection: 'column',
        backgroundColor: '#F6F6F6',
        borderRadius: 20,
        width: 70,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1.5,
        borderColor: '#BBBBBB'
    },
    darkNewButtonInactive: {
        flexDirection: 'column',
        backgroundColor: '#282828',
        borderRadius: 20,
        width: 70,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1.5,
        borderColor: '#3f3f3f'
    },
    lightPopularText: {
        fontSize: 18,
        color: '#555555',
        fontWeight: "600",
        alignSelf: 'center',
        marginTop: 4
    },
    darkPopularText: {
        fontSize: 18,
        color: '#EEEEEE',
        fontWeight: "600",
        alignSelf: 'center',
        marginTop: 4
    },
});
