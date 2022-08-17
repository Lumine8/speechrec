import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState} from 'react';

import * as tf from "@tensorflow/tfjs";
import * as speech from "@tensorflow-models/speech-commands";

const App = ()=> {

  const [model, setModel] = useState(null);
  const [action, setAction] = useState(null);
  const [labels, setLabels] = useState(null);

  const loadModal = async() =>{

    const recognizer = await speech.create("BROWSER_FFT");
    console.log("Model Loaded");
    await recognizer.ensureModelLoaded();
    console.log(recognizer.wordLabels());
    setModel(recognizer);
    setLabels(recognizer.wordLabels());
  }

  useEffect(()=>{loadModal()},[])

  function argMax(arr){
    return arr.map((x,i)=>[x,i]).reduce((r,a)=>(a[0] > r[0]? a:r))[1];
  }

  const recognizeCommands = async() =>{
    console.log('Listening to commands');
    model.listen(result => {
      setAction(labels[argMax(Object.values(result.scores))])
      console.log(action);
      console.log(result)}, {includeSpectrogram: true, probabilityThreshold:0.8})
      setTimeout(()=> model.stopListening(),10e3);
  }




  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        <button onClick={recognizeCommands}>Command</button>
        {action? <div>{action}</div>: <div>No Action Detected</div> }

      </header>
    </div>
  );
}

export default App;
