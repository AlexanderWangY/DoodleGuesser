import "./App.css";
import { ReactSketchCanvas } from "react-sketch-canvas";
import useWindowsDimensions from "./actions/useWindowsDimensions";
import React, { useState } from "react";
import ReactModal from "react-modal";
import Confetti from "react-confetti";

const App = () => {
  const { height, width } = useWindowsDimensions();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [drawing, setDrawing] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [correct, setCorrect] = useState(null);

  const canvas = React.createRef();

  const handleClear = () => {
    canvas.current.clearCanvas();
  };

  const handleSubmit = async () => {
    const drawing = await canvas.current.exportImage();
    setDrawing(drawing);

    const body = JSON.stringify({
      img: drawing,
    });

    const response = await fetch("http://localhost:8080/guess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    const data = await response.json();

    console.log(data.prediction);
    setPrediction(data.prediction);
    setModalIsOpen(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setLoaded(true);
  };

  const handleRight = () => {
    setCorrect(true);
  };

  const handleTryAgain = () => {
    setCorrect(false);
    setModalIsOpen(false);
    handleClear();
    setLoaded(false);
  };

  return (
    <div className="main-container">
      <div className="header">
        <h1 className="title">Doodle Guesser</h1>
      </div>

      <ReactModal
        isOpen={modalIsOpen}
        style={{
          overlay: {
            backgroundColor: "rgba(40, 44, 52, 0.75",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          content: {
            backgroundColor: "#3b414a",
            border: "none",
            height: height * 0.6,
            width: width * 0.4,
            position: "relative",
            padding: "0",
            overflow: "hidden",
            borderRadius: "30px",
            boxShadow: "0 0 20px 2px #000",
          },
        }}
      >
        {loaded ? (
          <div className="modal">
            <Confetti
              run={correct}
              numberOfPieces={300}
              initialVelocityY={100}
              width={width}
              height={height}
              gravity={0.17}
            />
            <img
              src={drawing}
              alt="drawing"
              style={{
                width: height * 0.3,
                height: height * 0.3,
                borderRadius: "15px",
                boxShadow: "0 0 10px 5px #000",
              }}
            />
            <div className="pred-content">
              <h1 className="pred">
                Is it a <strong className="bold-pred">{prediction}?</strong>
              </h1>
              {correct ? (
                <div className="button-container-modal">
                  <button className="correctButton" onClick={handleTryAgain}>
                    Restart!
                  </button>
                </div>
              ) : (
                <div className="button-container-modal">
                  <button className="correctButton" onClick={handleRight}>
                    You got it!
                  </button>
                  <button className="wrongButton" onClick={handleTryAgain}>
                    Try Again!
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="modal">
            <img src={require("./images/cat_think.gif")} alt="cat thinking" />
            <h1 className="pred">Me is thinking...</h1>
          </div>
        )}
      </ReactModal>

      <div className="content">
        <div className="canvas-container">
          <ReactSketchCanvas
            ref={canvas}
            allowOnlyPointerType="all"
            className="canvas"
            height={height * 0.7}
            width={height * 0.7}
            strokeWidth={20}
            strokeColor="black"
          />
        </div>
        <div className="button-container">
          <button className="button" onClick={handleClear}>
            Clear
          </button>
          <button className="button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
