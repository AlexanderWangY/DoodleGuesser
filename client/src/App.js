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
          <button className="button">Submit</button>
        </div>
      </div>
    </div>
  );
}

export default App;
