import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Platform
} from 'react-native';
import ImagePicker from "react-native-image-picker";

const createFormData = (pickedImage, body) => {
  const data = new FormData();

  data.append("pickedImage", {
    name: "abc.jpg",
    type: pickedImage.type,
    uri:
      Platform.OS === "android" ? pickedImage.uri : pickedImage.uri.replace("file://", "")
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });
  console.log(data);
  return data;
};

export default class App extends Component {

  state = {
    pickedImage: null
  }

  reset = () => {
    this.setState({
      pickedImage: null
    });
  }

  /**
 * The first arg is the options object for customization (it can also be null or omitted for default options),
 * The second arg is the callback which sends object: response (more info below in README)
 */

  pickImageHandler = () => {
    ImagePicker.showImagePicker({title: "Pick an Image", maxWidth: 800, maxHeight: 600}, res => {
      console.log(res);
      if (res.didCancel) {
        console.log("User cancelled!");
      } else if (res.error) {
        console.log("Error", res.error);
      } else {
        this.setState({
          pickedImage: { uri: res.uri, name: res.name, type: res.type }
        });

      }
    });
  }

  resetHandler = () =>{
    this.reset();
  }

  handleUploadPhoto = () => {
    fetch("http://192.168.0.20:3000/api/upload", {
      method: "POST",
      body: createFormData(this.state.pickedImage, { userID: "123" })
    })
    .then(response => response.json())
    .then(response => {
      console.log("upload success", response);
      alert("Upload success!");
      this.setState({ pickedImage: null })
    })
    .catch(error => {
      console.log("upload error", error);
      alert("Upload failed!");
    })
  }

  render() {
    const { pickedImage } = this.state;
    return (
      <View style={styles.container}>
      <Text style={styles.textStyle}>Pick Image From Camera and Gallery </Text>
        <View style={styles.placeholder}>
          <Image source={pickedImage} style={styles.previewImage} />
        </View>
        <View style={styles.button}>

          <Button title="Pick Image" onPress={this.pickImageHandler} />

          {pickedImage && (
            <Button title="Upload" onPress={this.handleUploadPhoto} />
          )}

          <Button title="Reset" onPress={this.resetHandler} />

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems:"center"
  },
  textStyle: {
    fontWeight:"bold",
    fontSize:30,
    textAlign:"center",
    color:"red",
    marginTop:10
  },
  placeholder: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#eee",
    width: "70%",
    height: 280,
    marginTop:50,
  },
  button: {
    width: "80%",
    marginTop:20,
    flexDirection:"row",
    justifyContent: "space-around"
  },
  previewImage: {
      width: "100%",
      height: "100%"
  }
});