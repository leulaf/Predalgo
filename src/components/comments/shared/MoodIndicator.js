import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    // withRepeat,
    withSequence
} from 'react-native-reanimated';

import { FlashList } from '@shopify/flash-list';

import LottieView from 'lottie-react-native';

import * as Haptics from 'expo-haptics';

// mood emojis
import Happy from '../../../../assets/happy.svg';
import Sad from '../../../../assets/sad.svg';
import Angry from '../../../../assets/angry.svg';
import Idea from '../../../../assets/idea.svg';


// let laughing, sad, angry, idea;

// laughing = <Happy width={30} height={30} style={{ marginRight: 0 }}/>;
// sad = <Sad width={30} height={30} style={{ marginRight: 0 }}/>;
// angry = <Angry width={30} height={30} style={{ marginRight: 0 }}/>;
// idea = <Idea width={30} height={30} style={{ marginRight: 0 }}/>;







const laughing = require('../../../../assets/emojis/laughing.json');
const angry = require('../../../../assets/emojis/angry.json');
const sad = require('../../../../assets/emojis/sad.json');
const idea = require('../../../../assets/emojis/lightBulb.json');
const eyeRoll = require('../../../../assets/emojis/eyeRoll.json');
const loving = require('../../../../assets/emojis/loving.json');
const shocked = require('../../../../assets/emojis/shocked.json');
const skeptical = require('../../../../assets/emojis/skeptical.json');
const wink = require('../../../../assets/emojis/wink.json');
const confetti = require('../../../../assets/emojis/confetti.json');
const crying = require('../../../../assets/emojis/crying.json');

const emojies = [
    {emoji: laughing, id: "laughing"},
    {emoji: sad, id: "sad"},
    {emoji: angry, id: "angry"},
    {emoji: idea, id: "idea"},
    {emoji: eyeRoll, id: "eyeRoll"},
    {emoji: loving, id: "loving"},
    {emoji: shocked, id: "shocked"},
    {emoji: skeptical, id: "skeptical"},
    {emoji: wink, id: "wink"},
    {emoji: confetti, id: "confetti"},
    {emoji: crying, id: "crying"},
];



const initialOffset = 1;
const finalOffset = 50;

export default MoodIndicator = ({id, emoji, setEmoji, windowWidth}) => {
    
    // const [emoji, setEmoji] = React.useState({
    //     id: id,
    //     show: false,
    //     chose: ""
    // });



    const laughingOffset = useSharedValue(0);
    const lovingOffset = useSharedValue(0);
    const shockedOffset = useSharedValue(0);
    const lightBulbOffset = useSharedValue(0);
    const confettiOffset = useSharedValue(0);
    const winkOffset = useSharedValue(0);
    const skepticalOffset = useSharedValue(0);
    const eyeRollOffset = useSharedValue(0);
    const cryingOffset = useSharedValue(0);
    const sadOffset = useSharedValue(0);
    const angryOffset = useSharedValue(0);
    const ideaOffset = useSharedValue(0);

    const laughingStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: laughingOffset.value }],
    }));


    const lovingStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: lovingOffset.value }],
    }));

    
    const shockedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: shockedOffset.value }],
    }));


    const lightBulbStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: lightBulbOffset.value }],
    }));


    const confettiStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: confettiOffset.value }],
    }));


    const winkStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: winkOffset.value }],
    }));


    const skepticalStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: skepticalOffset.value }],
    }));


    const eyeRollStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: eyeRollOffset.value }],
    }));


    const cryingStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: cryingOffset.value }],
    }));


    const sadStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: sadOffset.value }],
    }));


    const angryStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: angryOffset.value }],
    }));


    const emojiStyles = [
        laughingStyle,
        lovingStyle,
        shockedStyle,
        lightBulbStyle,
        confettiStyle,
        winkStyle,
        skepticalStyle,
        eyeRollStyle,
        cryingStyle,
        sadStyle,
        angryStyle,
    ]

    React.useEffect(() => {
        console.log(emoji.show, " useEffect ", emoji.chose)
        if(emoji.show == "laughing"){
            // laughingOffset.value = withRepeat(withSpring(-finalOffset, {damping: 10, mass: 0.7}), 2, true);
            laughingOffset.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}), 
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    show: "stop",
                    chose: "laughing"
                }
            );
        }else if(emoji.show == "loving"){
            // lovingOffset.value = withRepeat(withSpring(-finalOffset, {damping: 10}), 2, true);
            lovingOffset.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}),
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    show: "stop",
                    chose: "loving"
                }
            );
        }else if(emoji.show == "shocked"){
            // shockedOffset.value = withRepeat(withSpring(-finalOffset, {damping: 10}), 2, true);
            shockedOffset.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}),
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    show: "stop",
                    chose: "shocked"
                }
            );
        }else if(emoji.show == "lightBulb"){
            // lightBulbOffset.value = withRepeat(withSpring(-finalOffset, {damping: 10}), 2, true);
            lightBulbOffset.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}),
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    show: "stop",
                    chose: "lightBulb"
                }
            );
        }else if(emoji.show == "confetti"){
            // confettiOffset.value = withRepeat(withSpring(-finalOffset, {damping: 10}), 2, true);
            confettiOffset.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}),
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    show: "stop",
                    chose: "confetti"
                }
            );
        }else if(emoji.show == "wink"){
            // winkOffset.value = withRepeat(withSpring(-finalOffset, {damping: 10}), 2, true);
            winkOffset.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}),
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    show: "stop",
                    chose: "wink"
                }
            );
        }else if(emoji.show == "skeptical"){
            // skepticalOffset.value = withRepeat(withSpring(-finalOffset, {damping: 10}), 2, true);
            skepticalOffset.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}),
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    show: "stop",
                    chose: "skeptical"
                }
            );
        }else if(emoji.show == "eyeRoll"){
            // eyeRollOffset.value = withRepeat(withSpring(-finalOffset, {damping: 10}), 2, true);
            eyeRollOffset.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}),
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    show: "stop",
                    chose: "eyeRoll"
                }
            );
        }else if(emoji.show == "crying"){
            // cryingOffset.value = withRepeat(withSpring(-finalOffset, {damping: 10}), 2, true);
            cryingOffset.value = withSequence(
                withSpring(-finalOffset, {damping: 10, overshootClamping: true, mass: 2}),
                withSpring(0, {damping: 15, mass: 0.5})
            )
            setEmoji(
                {
                    show: "stop",
                    chose: "crying"
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

    const renderItem = ({item, index}) => {

        return(
            <Animated.View style={[emojiStyles[index]]}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={(emoji.chose == item.id || emoji.show === false) &&{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == item.id ? 13 : 15, marginLeft: emoji.chose == item.id ? -2 : 0}}
                    onPress={() => {
                        console.log(item.id, "-", emoji.chose, "-", emoji.show);
                        (emoji.chose == item.id || emoji.show === false) && setEmoji(
                            emoji.chose == item.id ?
                                {
                                    show: false,
                                    chose: ""
                                }
                            :
                                {
                                    show: item.id,
                                    chose: ""
                                }
                        )
                        console.log(item.id, " ", emoji.chose, " ", emoji.show);
                        emoji.chose == item.id ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                >
                    
                        <LottieView
                            autoPlay
                            style={{height: (emoji.chose == item.id || emoji.show === false) && 40, width: 40}}
                            source={emojies[index].emoji}
                        />
                    
                </TouchableOpacity>
            </Animated.View>
        )
    }

    return(
        // <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -5, width: 200}}>
        //     <FlashList 
        //         data={emojies}

        //         horizontal

        //         removeClippedSubviews={true}
                

        //         renderItem={renderItem}

        //         showsHorizontalScrollIndicator={false}


        //         estimatedItemSize={50}
        //         estimatedListSize={{height: 60 ,  width: 200}}
        //     />
            
        // </View>

        <View style={{ marginLeft: -7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',  justifyContent: 'space-around'}}>
            
                

            {/* Light Bulb */}
            {
                (emoji.chose == "lightBulb" || emoji.show === false) &&
            <Animated.View style={[lightBulbStyle, {flex: emoji.show === false && 1}]}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "lightBulb" ? 13 : 0, marginLeft: emoji.chose == "lightBulb" ? -2 : 0}}
                    onPress={() => {
                        setEmoji(
                            emoji.chose == "lightBulb" ?
                                {
                                    show: false
                                }
                            :
                                {
                                    show: "lightBulb",
                                    chose: ""
                                }
                        )

                        emoji.chose == "lightBulb" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                    }}

                >

                    <LottieView
                        autoPlay
                        style={{height: 35, width: 35}}
                        source={idea}
                    />

                </TouchableOpacity>
            </Animated.View>

            }


            {/* Confetti */}
            {
                (emoji.chose == "confetti" || emoji.show === false) &&
            <Animated.View style={[confettiStyle, {flex: emoji.show === false && 1}]}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "confetti" ? 13 : 0, marginLeft: emoji.chose == "confetti" ? -2 : -6}}
                    onPress={() => {
                        setEmoji(
                            emoji.chose == "confetti" ?
                                {
                                    show: false
                                }
                            :
                                {
                                    show: "confetti",
                                    chose: ""
                                }
                        )

                        emoji.chose == "confetti" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                    }}

                >

                    <LottieView
                        autoPlay
                        style={{height: 38, width: 38}}
                        source={confetti}
                    />

                </TouchableOpacity>
            </Animated.View>

            }


            


            


            {/* Laughing */}
            {
                (emoji.chose == "laughing" || emoji.show === false) &&
            <Animated.View style={[laughingStyle, {flex: emoji.show === false && 1}]}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "laughing" ? 13 : 0, marginLeft: emoji.chose == "laughing" ? -2 : -12}}
                    onPress={() => {
                        setEmoji(
                            emoji.chose == "laughing" ?
                                {
                                    show: false
                                }
                            :
                                {
                                    show: "laughing",
                                    chose: ""
                                }
                        )

                        emoji.chose == "laughing" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                >
                    
                        <LottieView
                            autoPlay
                            style={{height: 45, width: 45}}
                            source={laughing}
                        />
                    
                </TouchableOpacity>
            </Animated.View>

            }


            {/* Loving */}
            {
                (emoji.chose == "loving" || emoji.show === false) &&
            <Animated.View style={[lovingStyle, {flex: emoji.show === false && 1}]}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "loving" ? 13 : 0, marginLeft: emoji.chose == "loving" ? -2 : -8}}
                    onPress={() => {
                        setEmoji(
                            emoji.chose == "loving" ?
                                {
                                    show: false
                                }
                            :
                                {
                                    show: "loving",
                                    chose: ""
                                }
                        )
                    
                        emoji.chose == "loving" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                    }}

                >

                    <LottieView
                        autoPlay
                        style={{height: 39, width: 39}}
                        source={loving}
                    />

                </TouchableOpacity>
            </Animated.View>

            }


            {/* Wink */}

            {
                (emoji.chose == "wink" || emoji.show === false) &&
            <Animated.View style={[winkStyle, {flex: emoji.show === false && 1}]}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "wink" ? 13 : 0, marginLeft: emoji.chose == "wink" ? -2 : -6}}
                    onPress={() => {
                        setEmoji(
                            emoji.chose == "wink" ?
                                {
                                    show: false
                                }
                            :
                                {
                                    show: "wink",
                                    chose: ""
                                }
                        )

                        emoji.chose == "wink" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                    }}

                >

                    <LottieView
                        autoPlay
                        style={{height: (emoji.chose == "wink" || emoji.show === false) && 39, width: 39}}
                        source={wink}
                    />

                </TouchableOpacity>
            </Animated.View>

            }


            {/* Shocked */}

            {
                (emoji.chose == "shocked" || emoji.show === false) &&
            
            <Animated.View style={[shockedStyle, {flex: emoji.show === false && 1}]}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "shocked" ? 13 : 0, marginLeft: emoji.chose == "shocked" ? -2 : -7}}
                    onPress={() => {
                        setEmoji(
                            emoji.chose == "shocked" ?
                                {
                                    show: false
                                }
                            :
                                {
                                    show: "shocked",
                                    chose: ""
                                }
                        )
                    
                        emoji.chose == "shocked" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                    }}

                >

                    <LottieView
                        autoPlay
                        style={{height: 34, width: 34}}
                        source={shocked}
                    />

                </TouchableOpacity>
            </Animated.View>

                }
                


            {/* Sad */}
            {
                (emoji.chose == "sad" || emoji.show === false) &&
                <Animated.View style={[sadStyle, {flex: emoji.show === false && 1}]}>
                    <TouchableOpacity style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "sad" ? 13 : 0, marginLeft: emoji.chose == "sad" ? -2 : -9}}
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
                        
                        <LottieView
                            autoPlay
                            style={{height: 40.5, width: 40.5}}
                            source={sad}
                        />
                        
                    </TouchableOpacity>
                </Animated.View>
            }


            
            

            {/* Skeptical */}
            {
                (emoji.chose == "skeptical" || emoji.show === false) &&
            <Animated.View style={[skepticalStyle, {flex: emoji.show === false && 1}]}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "skeptical" ? 13 : 0, marginLeft: emoji.chose == "skeptical" ? -2 : -11}}
                    onPress={() => {
                        setEmoji(
                            emoji.chose == "skeptical" ?
                                {
                                    show: false
                                }
                            :
                                {
                                    show: "skeptical",
                                    chose: ""
                                }
                        )

                        emoji.chose == "skeptical" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                    }}

                >

                    <LottieView
                        autoPlay
                        style={{height: 47, width: 47}}
                        source={skeptical}
                    />

                </TouchableOpacity>
            </Animated.View>

            }


            {/* Eye Roll */}

            {
                (emoji.chose == "eyeRoll" || emoji.show === false) &&
            <Animated.View style={[eyeRollStyle, {flex: emoji.show === false && 1}]}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "eyeRoll" ? 13 : 0, marginLeft: emoji.chose == "eyeRoll" ? -2 : -6}}
                    onPress={() => {
                        setEmoji(
                            emoji.chose == "eyeRoll" ?
                                {
                                    show: false
                                }
                            :
                                {
                                    show: "eyeRoll",
                                    chose: ""
                                }
                        )

                        emoji.chose == "eyeRoll" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                    }}

                >

                    <LottieView
                        autoPlay
                        style={{height: 39, width: 39}}
                        source={eyeRoll}
                    />

                </TouchableOpacity>
            </Animated.View>

            }
            
            {/* Angry */}
            {
                (emoji.chose == "angry" || emoji.show === false) &&
                
                <Animated.View style={[angryStyle, {flex: emoji.show === false && 1}]}>
                    <TouchableOpacity style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "angry" ? 12 : 5, marginLeft: emoji.chose == "angry" ? -3 : -21}}
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
                    
                        <LottieView
                            autoPlay
                            style={{height: 41, width: 41}}
                            source={angry}
                        />
                        
                    </TouchableOpacity>
                </Animated.View>
            }
        </View>
    );
};





  const deleteLater =  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -5}}>
            {/* <FlashList 
                data={emojies}

                horizontal

                removeClippedSubviews={true}
                estimatedItemSize={100}
            /> */}
            {/* Laughing */}
            {/* <Animated.View style={[laughingStyle]}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={(emoji.chose == "laughing" || emoji.show === false) &&{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "laughing" ? 13 : 15, marginLeft: emoji.chose == "laughing" ? -2 : 0}}
                    onPress={() => {
                        (emoji.chose == "laughing" || emoji.show === false) && setEmoji(
                            emoji.chose == "laughing" ?
                                {
                                    show: false
                                }
                            :
                                {
                                    show: "laughing",
                                    chose: ""
                                }
                        )

                        emoji.chose == "laughing" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                >
                    
                        <LottieView
                            autoPlay
                            style={{height: (emoji.chose == "laughing" || emoji.show === false) && 40, width: 40}}
                            source={laughing}
                        />
                    
                </TouchableOpacity>
            </Animated.View> */}
                


            {/* Sad */}
            {
                // (emoji.chose == "sad" || emoji.show === false) &&

                // <TouchableOpacity style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "sad" ? 13 : 15, marginLeft: emoji.chose == "sad" ? -2 : 0}}
                //     onPress={() => {
                //         setEmoji(
                //             emoji.chose == "sad" ?
                //                 {
                //                     show: false
                //                 }
                //             :
                //                 {
                //                     show: "sad",
                //                     chose: ""
                //                 }
                //         )

                //         emoji.chose == "sad" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                // }}
                // >
                //     <Animated.View style={[sadStyle]}>
                //         {sad}
                //     </Animated.View>
                // </TouchableOpacity>
            }
                


            {/* Angry */}
            {
                // (emoji.chose == "angry" || emoji.show === false) &&

                // <TouchableOpacity style={{paddingTop: 5, paddingBottom: 8, paddingRight: emoji.chose == "angry" ? 12 : 15, marginLeft: emoji.chose == "angry" ? -3 : 0}}
                //     onPress={() => {
                //         setEmoji(
                //             emoji.chose == "angry" ?
                //                 {
                //                     show: false
                //                 }
                //             :
                //                 {
                //                     show: "angry",
                //                     chose: ""
                //                 }
                //         )

                //         emoji.chose == "angry" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                // }}
                // >
                //     <Animated.View style={[angryStyle]}>
                //         {angry}
                //     </Animated.View>
                // </TouchableOpacity>
            }
                


            {/* Idea */}
            {
                // (emoji.chose == "idea" || emoji.show=== false) &&

                // <TouchableOpacity style={{paddingTop: 0, paddingBottom: 12, paddingRight: emoji.chose == "idea" ? 9 : 15, marginLeft: emoji.chose == "idea" ? -7 : 0}}
                //     onPress={() => {
                //         setEmoji(
                //             emoji.chose == "idea" ?
                //                 {
                //                     show: false
                //                 }
                //             :
                //                 {
                //                     show: "idea",
                //                     chose: ""
                //                 }
                //         )

                //         emoji.chose == "idea" ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                // }}
                // >
                //     <Animated.View style={[ideaStyle]}>
                //         {idea}
                //     </Animated.View>
                // </TouchableOpacity>
            }
            

        </View>