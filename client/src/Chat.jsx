import { useEffect } from 'react';
import { useState } from 'react'
import css from './CSS/Chat.module.css'
export const Chat = ({socket,name,roomId}) => {
    // State 
    const [input,setinput] = useState('')

    // MSG LIST 
    const [msgList,setmsgList] = useState([])

    // HIDE SVG ICON ON LOAD
    useEffect(()=>{
        if(input.length <= 0) {
            document.getElementById('svgIcon').style.display='none'
        }
    },[input])

    // RECEVIE MSG 
    useEffect(()=>{
        socket.on('receive_msg',(data)=>{
            setmsgList((list)=>[...list,data])
        })
    },[socket])

    // SHOW SEND ICON
    if(input.length > 0) {
        document.getElementById('svgIcon').style.display='block'
    }

    // ON  SUBMIT INPUT 
    const onSubmitInput = async () => {
        
        if(input !== "") {
            const msgData = {
                roomId:roomId,
                name:name,
                msg:input,
                time:
                new Date(Date.now()).getHours() 
                + ":" + 
                new Date(Date.now()).getMinutes()
            };

            // SEND MSG TO SERVER
            socket.emit('send_msg',msgData)
        }
        // CLEAR INPUT FIELD
        setinput('')
    } 

  return (
   <div className={css.chatHold}>

       {/* === CHAT HEADER */}
       <div className={css.chatHeader}>

        <span className={css.liveBlink}>
            <div className={css.blink}>
            </div>
        </span>
        <span>Live Chat</span>
        
       </div>
       {/* Body  */}
       <div className={css.chatBody}>
           {msgList.map((e,i)=>{
               return <span key={i}> {e.msg} </span>
           })}
       </div>

       {/* Footer */}
       <div className={css.chatFooter}>
            <form>

            {/* === INPUT FOR MSG */}
            <input type='text' placeholder='type...'
            value={input}
            onChange={(e)=>setinput(e.target.value)} />

            {/* === SVG SEND ICON  */}
            <svg id='svgIcon' viewBox="0 0 20 20"
            fill="currentColor"
            onClick={onSubmitInput}>

            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 
            1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 
            1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0
            001.17-1.408l-7-14z" />
            </svg>

            </form>
       </div>

   </div>
  )
}