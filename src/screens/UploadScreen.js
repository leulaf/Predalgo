import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Icons
import FlipCameraIcon from '../../assets/flip_camera.svg';
import TakePhotoIcon from '../../assets/take_photo.svg';
import GalleryIcon from '../../assets/gallery.svg';
import BackIcon from '../../assets/back_light.svg';
import DeleteImageIcon from '../../assets/x.svg';
import CorrectIcon from '../../assets/correct.svg';


export default function UploadScreen({navigation}) {
  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    if (camera) {
      const picture = await camera.takePictureAsync();
      setImage(picture.uri);
      console.log(picture.uri);
    }
  };

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>

        {/* back button */}
        <TouchableOpacity style={styles.backButton} 
            onPress={() => navigation.goBack(null)}
        >
            <BackIcon height={25} width={25}/>
            <Text style={styles.text}>Back</Text>
        </TouchableOpacity>
        
        <Camera style={styles.camera} type={type}
            ref={ref => setCamera(ref)}
        >
            {image && 
                <View style={{flexDirection: 'row'}}>
                    <Image 
                        source={{ uri: image }} 
                        style={{
                            margin: 5,
                            borderRadius: 20
                        }}  
                        width={200} 
                        height={300}
                    />

                    <View style={{flexDirection: 'column'}}>

                        {/* Delete Image and retake */}
                        <TouchableOpacity style={{ marginRight: 10, marginTop: 10}} onPress={() => setImage(null)}>
                            <DeleteImageIcon height={30} width={30}/>
                        </TouchableOpacity>
                        
                        {/* Use image */}
                        <TouchableOpacity 
                            style={{ marginRight: 10, marginTop: 230, flexDirection: 'row'}} 
                            onPress={() => navigation.navigate('SaveImage', {imageUrl: image})}
                        >
                            <CorrectIcon height={30} width={30}/>
                            <Text style={styles.text} alignSelf={'center'}>Use Image</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                
            }

            <View style={styles.buttonsContainer}>

                {/* Pick picture from device gallery button */}
                <TouchableOpacity style={styles.galleryButton}  onPress={() => pickImage()}>
                    <GalleryIcon height={30} width={30} marginLeft={5}/>
                    <Text style={styles.text}>Gallery</Text>
                </TouchableOpacity>

                {/* Take photo button */}
                <TouchableOpacity style={styles.takePhotoButton} onPress={() => takePicture()}>
                    <TakePhotoIcon height={65} width={65}/>
                </TouchableOpacity>

                {/* Flip camera button */}
                <TouchableOpacity style={styles.flipButton} onPress={() => toggleCameraType()}>
                    <FlipCameraIcon height={35} width={35} />
                    <Text style={styles.text}>Flip</Text>
                </TouchableOpacity>

            
            </View>
            
            </Camera>

            {/* {image && <Image source={{ uri: image }} style={{alignSelf: "center"}}  width={200} height={200}/>} */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 60,
    backgroundColor: '#000',
    // justifyContent: 'center',
  },
  camera: {
    marginTop: 20,
    height: "85%",
  },
  backButton: {
    flexDirection: 'row',
    marginTop: 50,
    marginLeft: 5
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
    marginBottom: 25,
  },
  flipButton: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  takePhotoButton: {
    flex: 1,
    alignItems: 'center',
    marginRight: 70,
    marginLeft: 75
  },
  galleryButton: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 22,
    marginHorizontal: 5,
    fontWeight: 'bold',
    color: 'white',
  },
  displayImage: {
    flex: 1,
    width: 100,
    height: 100,
    position: 'absolute',
    marginTop: 50
  }
});
