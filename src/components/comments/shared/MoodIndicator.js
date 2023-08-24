import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    // withRepeat,
    withSequence
} from 'react-native-reanimated';

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
const finalOffset = 200;
export default MoodIndicator = ({}) => {
    
    const [show, setShow] = React.useState({
        show: false,
        chose: ""
    });

    const happyOffset = useSharedValue(0);
    const sadOffset = useSharedValue(0);
    const angryOffset = useSharedValue(0);
    const ideaOffset = useSharedValue(0);

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
        if(show.show == "happy"){
            // happyOffset.value = withRepeat(withSpring(-finalOffset, {damping: 10, mass: 0.7}), 2, true);
            happyOffset.value = withSequence(withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 3}), withSpring(0, {damping: 15}))
            setShow(
                {
                    show: "stop",
                    chose: "happy"
                }
            );
        }else if(show.show == "sad"){
            // sadOffset.value = withRepeat(withSpring(-finalOffset, {damping: 10}), 2, true);
            sadOffset.value =  withSequence(withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 3}), withSpring(0, {damping: 15}))
            setShow(
                {
                    show: "stop",
                    chose: "sad"
                }
            );
        }else if(show.show == "angry"){
            // angryOffset.value = withRepeat(withSpring(-finalOffset, {damping: 10}), 2, true);
            angryOffset.value = withSequence(withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 3}), withSpring(0, {damping: 15}))
            setShow(
                {
                    show: "stop",
                    chose: "angry"
                }
            );
        }else if(show.show== "idea"){
            // ideaOffset.value = withRepeat(withSpring(-finalOffset, {damping: 10}), 2, true);
            ideaOffset.value = withSequence(withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 3}), withSpring(0, {damping: 15}))
            setShow(
                {
                    show: "stop",
                    chose: "idea"
                }
            );
        }
        
    }, [show]);

    return(
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

            {/* Happy */}
            {
                (show.chose == "happy" || show.show === false) &&

                <TouchableOpacity style={{paddingTop: 5, paddingBottom: 5, paddingRight: show.chose == "happy" ? 20 : 15, marginLeft: show.chose == "happy" ? -5 : 0}}
                    onPress={() => {
                        setShow(
                            show.chose == "happy" ?
                                {
                                    show: false
                                }
                            :
                                {
                                    show: "happy",
                                    chose: ""
                                }
                        )

                        show.chose == "happy" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                >
                    <Animated.View style={[happyStyle]}>
                        {happy}
                    </Animated.View>
                    
                </TouchableOpacity>
            }
                


            {/* Sad */}
            {
                (show.chose == "sad" || show.show === false) &&

                <TouchableOpacity style={{paddingTop: 5, paddingBottom: 5, paddingRight: show.chose == "happy" ? 20 : 15, marginLeft: show.chose == "happy" ? -5 : 0}}
                    onPress={() => {
                        setShow(
                            show.chose == "sad" ?
                                {
                                    show: false
                                }
                            :
                                {
                                    show: "sad",
                                    chose: ""
                                }
                        )

                        show.chose == "sad" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                >
                    <Animated.View style={[sadStyle]}>
                        {sad}
                    </Animated.View>
                </TouchableOpacity>
            }
                


            {/* Angry */}
            {
                (show.chose == "angry" || show.show === false) &&

                <TouchableOpacity style={{paddingTop: 5, paddingBottom: 5, paddingRight: show.chose == "happy" ? 20 : 15, marginLeft: show.chose == "happy" ? -5 : 0}}
                    onPress={() => {
                        setShow(
                            show.chose == "angry" ?
                                {
                                    show: false
                                }
                            :
                                {
                                    show: "angry",
                                    chose: ""
                                }
                        )

                        show.chose == "angry" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                >
                    <Animated.View style={[angryStyle]}>
                        {angry}
                    </Animated.View>
                </TouchableOpacity>
            }
                


            {/* Idea */}
            {
                (show.chose == "idea" || show.show=== false) &&

                <TouchableOpacity style={{paddingTop: 5, paddingBottom: 5, paddingRight: show.chose == "happy" ? 20 : 15, marginLeft: show.chose == "happy" ? -5 : 0}}
                    onPress={() => {
                        setShow(
                            show.chose == "idea" ?
                                {
                                    show: false
                                }
                            :
                                {
                                    show: "idea",
                                    chose: ""
                                }
                        )

                        show.chose == "idea" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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