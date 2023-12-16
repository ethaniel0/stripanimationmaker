import { useRef, useReducer, useState } from 'react';
import './App.css';
import 'react-reflex/styles.css'
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'

import { system, Block } from './components/instances';
import System from './components/System';
import Sidebar from './components/Sidebar';
import Strips from './components/Strips';

function App() {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  let systemBlock = useRef(new Block(system, () => forceUpdate()));
  const [selected, setSelected] = useState(0);
  const [textPreview, setTextPreview] = useState<string>('');

  function exportString(){
    let s = systemBlock.current.toString();
    // console.log(s);
    // navigator.clipboard.writeText(s);
    setTextPreview(s);
  }
  
  return (
    <div id="app">
      <ReflexContainer orientation="vertical" style={{width: '100%'}}>
        <ReflexElement className="left-pane strips-box">
          <Strips />
        </ReflexElement>

        <ReflexSplitter/>

        <ReflexElement className="middle-pane system-box">
            <System system={systemBlock.current} select={(ind: number) => setSelected(ind)} selected={selected} />

            <hr />
            <button onClick={exportString}>Export</button>
            <br />
            <span id='text-preview'>{textPreview}</span>
        </ReflexElement>
        <ReflexElement size={250}>
          <div id="sidebar">
            <span>Sidebar</span>
            <Sidebar block={systemBlock.current} selected={selected} />
          </div>
        </ReflexElement>

      </ReflexContainer>
    </div>
  );
}

export default App;
