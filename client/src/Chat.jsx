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
    const onSubmitInput = async (e) => {
        e.preventDefault()
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

            // SAVE OWN MSG IN THE SAME STATE THAT RECEIVE MSG FORM OTEHR 
            setmsgList((list)=>[...list,msgData])
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

           <div className={css.msgShow}>
           {msgList.map((e,i)=>{
               return (
                   <div id={name === e.name ? css.yourMsg:css.othersMsg}>
                       <p key={i}> {e.msg} </p>
                   </div>
               )
           })}
           </div>


       </div>


       {/* Footer */}
       <div className={css.chatFooter}>
            <div>

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

            </div>
       </div>

   </div>
  )
}