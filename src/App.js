import React, {useRef, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

// Import dependencies
import * as tf from '@tensorflow/tfjs';
import * as qna from '@tensorflow-models/qna';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import {Fragment} from 'react';

function App() {
  // Setup references and state hooks
  const passageRef = useRef(null);
  const questionRef = useRef(null);
  const [answer, setAnswer] = useState();
  const [model, setModel] = useState(null);

  // Load Tensorflow Model
  const loadModel = async () => {
    const loadedModel = await qna.load();
    setModel(loadedModel);
    console.log('Model Loaded');
  }

  useEffect(() => {loadModel()}, []);

  // Handle question
  const answerQuestion = async (e) => {
    if(e.which === 13 && model !== null){
      console.log('Question submitted');
      const passage = passageRef.current.value;
      const question = questionRef.current.value;

      const answer = await model.findAnswers(question, passage);
      setAnswer(answer);
      console.log(answer);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {model == null?
          <div>
            <div>Model Loading</div>
            <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}/>
          </div>
          :
          <Fragment>
            Passage
            <textarea ref={passageRef} rows="30" cols="100"></textarea>
            Ask a Question
            <input ref={questionRef} onKeyPress={answerQuestion} size="80"></input>
            Answers
            {
              answer ? answer.map((ans, idx) => <div><b>Answer {idx + 1}</b>{ans.text} {ans.score}</div>) : ""
            }
          </Fragment>
        }
      </header>
    </div>
  );
}

export default App;
