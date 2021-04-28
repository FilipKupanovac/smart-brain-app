import React, {Component}  from 'react';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import './App.css'
import Particles from 'react-particles-js'
import { render } from 'react-dom';
import Clarifai from 'clarifai';


//TestCase: https://i.pinimg.com/originals/d1/dc/97/d1dc979c4664242c74b144a9b115de9c.jpg
const app = new Clarifai.App({
  apiKey: '867b86d2bf1e4a80aa43916335e627d3'
 });

const particlesOptions = {
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        value_area: 700
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box:{},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    console.log(data);
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;

    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height -(clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }
  onRouteChange = (route) => {
    if(route==='signout'){this.setState({isSignedIn: false})}
    else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render() {
    const {isSignedIn, imageUrl, route, box} = this.state;
    return(
      <div className="App">
        <Particles  className='particles'
                params={particlesOptions}
              />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' ?
          <div>
            <Logo/>
            <Rank/>
            <ImageLinkForm  onInputChange={this.onInputChange} 
                            onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition 
              box={box}
              imageUrl={imageUrl}/>
          </div>
          : (
            this.state.route === 'signin' ?
            <Signin onRouteChange = {this.onRouteChange}/> :
            <Register onRouteChange = {this.onRouteChange}/>
            )

        }
      </div>
    );
  }
}

export default App;
