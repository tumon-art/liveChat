import './App.css';
import io from 'socket.io-client'
import { useState } from 'react'
import { Chat } from './Chat';


const socket = io.connect('http://192.168.0.12:5000')

function App() {
  const [name,setname] = useState('')
  const [roomId,setroomId] = useState('')
  const [showChat,setshowChat] = useState(false)

  // ON FORM SUBMIT 
  const onFormSubmit = (e) => {
    e.preventDefault()

    if(name && roomId !== ''){
      // JOIN ROOM 
      socket.emit('join_room',roomId)
      setshowChat(true)
    }
  }
  return (
  <div className="App">

    <div className="heading">
      <span> Home Server </span>
    </div>


    {/* <div className="noticeBoard">
      <span>  Notice Board </span>
    </div> */}

    {showChat ? (
    <Chat socket={socket} name={name}
    roomId={roomId} />
    ) : (
      <div className="chatRoom">
      <form onSubmit={onFormSubmit}>

        <h4> Chat Room </h4>

        <input type="text" placeholder="name..." 
        onChange={(e)=> setname(e.target.value)}
        value={name}/>

        <input type="text" placeholder="room ID..."
        onChange={(e)=> setroomId(e.target.value)}
        value={roomId}/>

        <button type='submit'> Submit </button>

      </form>

    </div>
    )}

  </div>
  );
}

export default App;
