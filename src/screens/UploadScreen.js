import { Camera, CameraType } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import PinturaCompressImage from '../shared/PinturaCompress';

// Icons
import FlipCameraIcon from '../../assets/flip_camera.svg';
import TakePhotoIcon from '../../assets/take_photo.svg';
import GalleryIcon from '../../assets/gallery.svg';
import BackIcon from '../../assets/back_light.svg';
import DeleteImageIcon from '../../assets/x.svg';
import CorrectIcon from '../../assets/correct.svg';
import FlashOn from '../../assets/flash_on.svg';
import FlashOff from '../../assets/flash_off.svg';
import MakeMeme from '../../assets/make_meme.svg';


export default function UploadScreen({navigation}) {
  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState(null);
  const [base64, setBase64] = useState(null);
  const [cameraPic, setCameraPic] = useState(false);
  const [image, setImage] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [flashOn, setFlashOn] = useState(false);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { textAlign: "center" }]}>We need your permission to show the camera</Text>
        <Button onPress={() => requestPermission()}  title="grant permission" />
      </View>
    );
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
    });

    if (!result.canceled) {
      // const uri = await getUri(result.assets[0].uri);
      
      const base64 = await getbase64(result.assets[0].uri);
      setBase64(base64);
    }
  };

  const takePicture = async () => {
    if (camera) {
      const picture = await camera.takePictureAsync();

      // const uri = await getUri(picture.uri);

      const base64 = await getbase64(picture.uri);
      setBase64(base64);
      setCameraPic(true);
    }
  };

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  async function getUri(imageUrl){
    const compressedImage = await manipulateAsync(
      imageUrl,
      [],
      { compress: 1, format: SaveFormat.JPEG }
    );

    return compressedImage.uri;
  }

  const getbase64 = async (image) => {
    const manipResult = await manipulateAsync(image, [], {
      // compress: 0.2,
      // format: SaveFormat.PNG,
      base64: true,
    });

    return `data:image/jpeg;base64,${manipResult.base64}`;
  };

  const getbase64AndNav = async (image) => {
    const manipResult = await manipulateAsync(image, [], {
      // compress: 0.2,
      // format: SaveFormat.PNG,
      base64: true,
    });

    await navigation.navigate('EditMeme', {imageUrl: `data:image/jpeg;base64,${manipResult.base64}`});
  };

  return (
    <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>

          {/* back button */}
          <TouchableOpacity style={styles.backButton} 
              onPress={() => navigation.goBack(null)}
          >
              <BackIcon height={25} width={25}/>
              <Text style={styles.text}>Back</Text>
          </TouchableOpacity>

          {/* Flash On/Off button */}
          <TouchableOpacity style={styles.flashButton} onPress={() => setFlashOn(!flashOn)}>                
              {flashOn ?
                <FlashOn height={25} width={25} marginLeft={5}/>
              :
                <FlashOff height={25} width={25} marginLeft={5}/>
              }
          </TouchableOpacity>

        </View>
          

        <Camera style={styles.camera} type={type}
            ref={ref => setCamera(ref)}
            flashMode={flashOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        >
            {image &&
                <View style={{flexDirection: 'row'}}>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('CreatePost', {imageUrl: image})}
                  >
                    <Image 
                          source={{ uri: image }} 
                          style={{
                              margin: 5,
                              borderRadius: 20
                          }}  
                          width={200} 
                          height={300}
                      />
                  </TouchableOpacity>
                      

                    <View style={{flexDirection: 'column'}}>

                        {/* Delete Image and retake */}
                        <TouchableOpacity style={{ marginRight: 10, marginTop: 10, }} onPress={() => setImage(null)}>
                            <DeleteImageIcon height={30} width={30}/>
                        </TouchableOpacity>

                        {/* Make meme */}
                        <TouchableOpacity 
                            style={{ marginRight: 10, marginTop: 120, flexDirection: 'row'}} 
                            onPress={() => getbase64AndNav(image)}
                        >
                            <MakeMeme height={35} width={35}/>
                            <Text style={styles.text} alignSelf={'center'}>
                              Meme-it
                            </Text>
                        </TouchableOpacity>
                        
                        {/* Use image */}
                        <TouchableOpacity 
                            style={{ marginRight: 10, marginTop: 70, flexDirection: 'row'}} 
                            onPress={() => navigation.navigate('CreatePost', {imageUrl: image})}
                        >
                            <CorrectIcon height={30} width={30}/>
                            <Text style={styles.text} alignSelf={'center'}>
                              Use Image
                            </Text>
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
            
            {/* For image compression */}
            {base64 && (
              <PinturaCompressImage
                image={base64}
                setImage={setImage}
                setBase64={setBase64}
                cameraPic={cameraPic}
                setCameraPic={setCameraPic}
              />
            )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 60,
    backgroundColor: '#000',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  camera: {
    marginTop: 15,
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
  flashButton: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'flex-start',
    marginLeft: '65%',
    marginTop: 50,

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
