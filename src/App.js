import React from 'react';
import './App.css';
import Partners from './Partners.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Partners</h1>
          <div class="ag-theme-alpine">
            <Partners/>
          </div>
      </header>
    </div>
  );
}

export default App;
