import { useRef, useReducer, useState } from 'react';
import './App.css';
import { system, Block } from './components/instances';
import System from './components/System';

function App() {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  let systemBlock = useRef(new Block(system, () => forceUpdate()));
  const [selected, setSelected] = useState(0);
  
  return (
    <div id="app">
      <div id="system-box">
          <System system={systemBlock.current} select={(ind: number) => setSelected(ind)} />
      </div>
      <div id="sidebar">
        <span>Sidebar</span>
        {systemBlock.current.exportSidebarJSX(selected)}
      </div>
    </div>
  );
}

export default App;
