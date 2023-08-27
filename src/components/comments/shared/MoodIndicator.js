import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    // withRepeat,
    withSequence
} from 'react-native-reanimated';

import LottieView from 'lottie-react-native';

import * as Haptics from 'expo-haptics';

// mood emojis
import Happy from '../../../../assets/happy.svg';
import Sad from '../../../../assets/sad.svg';
import Angry from '../../../../assets/angry.svg';
import Idea from '../../../../assets/idea.svg';


let happy, sad, angry, idea;

happy = <Happy width={30} height={30} style={{ marginRight: 0 }}/>;
sad = <Sad width={30} height={30} style={{ marginRight: 0 }}/>;
angry = <Angry width={30} height={30} style={{ marginRight: 0 }}/>;
idea = <Idea width={30} height={30} style={{ marginRight: 0 }}/>;


const initialOffset = 1;
const finalOffset = 50;




const laughing = require('../../../../assets/emojis/blownAway.json');


export default MoodIndicator = ({id, emoji, setEmoji}) => {
    
    // const [emoji, setEmoji] = React.useState({
    //     id: id,
    //     show: false,
    //     chose: ""
    // });

    const happyOffset = useSharedValue(0);
    const sadOffset = useSharedValue(0);
    const angryOffset = useSharedValue(0);
    const ideaOffset = useSharedValue(0);

    const laughingStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: happyOffset.value }],
    }));

    const happyStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: happyOffset.value }],
    }));


    const sadStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: sadOffset.value }],
    }));


    const angryStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: angryOffset.value }],
    }));


    const ideaStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: ideaOffset.value }],
    }));

    React.useEffect(() => {
        if(emoji.show == "happy"){
            // happyOffset.value = withRepeat(withSpring(-finalOffset, {damping: 10, mass: 0.7}), 2, true);
            happyOffset.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    show: "stop",
                    chose: "happy"
                }
            );
        }else if(emoji.show == "sad"){
            // sadOffset.value = withRepeat(withSpring(-finalOffset, {damping: 10}), 2, true);
            sadOffset.value =  withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    show: "stop",
                    chose: "sad"
                }
            );
        }else if(emoji.show == "angry"){
            // angryOffset.value = withRepeat(withSpring(-finalOffset, {damping: 10}), 2, true);
            angryOffset.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    show: "stop",
                    chose: "angry"
                }
            );
        }else if(emoji.show== "idea"){
            // ideaOffset.value = withRepeat(withSpring(-finalOffset, {damping: 10}), 2, true);
            ideaOffset.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    show: "stop",
                    chose: "idea"
                }
            );
        }
        
    }, [emoji]);

    return(
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -5}}>

            {/* Laughing */}
            <Animated.View style={[happyStyle]}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={(emoji.chose == "happy" || emoji.show === false) &&{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "happy" ? 13 : 15, marginLeft: emoji.chose == "happy" ? -2 : 0}}
                    onPress={() => {
                        (emoji.chose == "happy" || emoji.show === false) && setEmoji(
                            emoji.chose == "happy" ?
                                {
                                    show: false
                                }
                            :
                                {
                                    show: "happy",
                                    chose: ""
                                }
                        )

                        emoji.chose == "happy" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                >
                    
                        <LottieView
                            autoPlay
                            style={{height: (emoji.chose == "happy" || emoji.show === false) && 60, width: 60, marginRight: 0, marginLeft: 0}}
                            source={laughing}
                        />
                    
                </TouchableOpacity>
            </Animated.View>
                


            {/* Sad */}
            {
                (emoji.chose == "sad" || emoji.show === false) &&

                <TouchableOpacity style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "sad" ? 13 : 15, marginLeft: emoji.chose == "sad" ? -2 : 0}}
                    onPress={() => {
                        setEmoji(
                            emoji.chose == "sad" ?
                                {
                                    show: false
                                }
                            :
                                {
                                    show: "sad",
                                    chose: ""
                                }
                        )

                        emoji.chose == "sad" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                >
                    <Animated.View style={[sadStyle]}>
                        {sad}
                    </Animated.View>
                </TouchableOpacity>
            }
                


            {/* Angry */}
            {
                (emoji.chose == "angry" || emoji.show === false) &&

                <TouchableOpacity style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "angry" ? 12 : 15, marginLeft: emoji.chose == "angry" ? -3 : 0}}
                    onPress={() => {
                        setEmoji(
                            emoji.chose == "angry" ?
                                {
                                    show: false
                                }
                            :
                                {
                                    show: "angry",
                                    chose: ""
                                }
                        )

                        emoji.chose == "angry" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                >
                    <Animated.View style={[angryStyle]}>
                        {angry}
                    </Animated.View>
                </TouchableOpacity>
            }
                


            {/* Idea */}
            {
                (emoji.chose == "idea" || emoji.show=== false) &&

                <TouchableOpacity style={{paddingTop: 0, paddingBottom: 12, paddingRight: emoji.chose == "idea" ? 9 : 15, marginLeft: emoji.chose == "idea" ? -7 : 0}}
                    onPress={() => {
                        setEmoji(
                            emoji.chose == "idea" ?
                                {
                                    show: false
                                }
                            :
                                {
                                    show: "idea",
                                    chose: ""
                                }
                        )

                        emoji.chose == "idea" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                >
                    <Animated.View style={[ideaStyle]}>
                        {idea}
                    </Animated.View>
                </TouchableOpacity>
            }
            

        </View>
    );
};