import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const socket = socketIOClient('http://localhost:3005', {
  transports: ['websocket'],
  autoConnect: false,
});

const App = () => {
  const [num, setNum] = useState(1);

  useEffect(() => {
    socket.open();
    socket.on('connect', () => {
      console.log('connected');
    });
  }, []);

  const handleSend = (event) => {
    event.preventDefault();
    socket.emit('set number', num, (response) => {
      console.log(response.msg);
    });
  }

  const handleInput = (event) => {
    setNum(event.target.value);
  }

  return (
    <div>
      <form>
        <input type="text" 
               value={num}
               onChange={handleInput}
               placeholder="Enter number"
               className="form-field"/>
        <button type="submit" 
                onClick={handleSend}
                className="form-btn">
          {'Send'}
        </button>
      </form>
    </div>
  );
}

export default App;