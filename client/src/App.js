import logo from './logo.svg';
import './App.css';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import useWindowsDimensions from './actions/useWindowsDimensions';
import React, { createRef } from 'react';

function App() {
  const { height, width } = useWindowsDimensions();

  const canvas = React.createRef();

  const handleClear = () => {
    canvas.current.clearCanvas()
  }

  const handleSubmit = async () => {
    const drawing = await canvas.current.exportImage();
    console.log(drawing)

    const body = JSON.stringify({
      'img': drawing
    })

    const response = await fetch("http://localhost:8080/guess", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    })
    const data = await response.json()

    console.log(data.prediction)
  }

  return (
    <div className="main-container">
      <div className="header">
        <h1 className='title'>
          Doodle Decoder
        </h1>
      </div>
      <div className="content">
        <div className='canvas-container'>
          <ReactSketchCanvas
            ref={canvas}
            allowOnlyPointerType='all'
            className='canvas'
            height={height * 0.7}
            width={height * 0.7}
            strokeWidth={20}
            strokeColor='black'
          />
        </div>
        <div className="button-container">
          <button className="button" onClick={handleClear}>Clear</button>
          <button className="button" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default App;
