import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemeContext } from '../../../context-store/context';

import { Shadow } from 'react-native-shadow-2';

const RADIUS = 24;

const SheetShadow = () => {
    const {theme,setTheme} = useContext(ThemeContext);

    return (
        <Shadow
            sides={['top']}
            corners={['topLeft', 'topRight']}
            radius={RADIUS}
            viewStyle={styles.shadowContainer}
        >

            <View style={styles.handleContainer}>

                <View 
                    style={
                        theme == 'light' ? 
                           {...styles.handle, backgroundColor: '#222222'}
                        :
                            {...styles.handle, backgroundColor: '#F4F4F4'}
                    } 
                />
                
            </View>

        </Shadow>
    );
};

const styles = StyleSheet.create({
  shadowContainer: {
    width: '100%',
  },
  handleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
  },
  handle: {
    width: 30,
    height: 4,
    // backgroundColor: 'gray',
    borderRadius: 4,
  },
});

export default SheetShadow;