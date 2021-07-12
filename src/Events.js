import React  from "react"
import { useState,useEffect,useRef } from "react"
export default function Events({Chat,events, deleteEvent,roomName}){
    const chatRef= useRef()
    return (
        
        // events.map(event =>{
            // return <div>
            //     <h1>{event.name}</h1>
            //     <button onClick= {()=>{
            //         deleteEvent(event.id)
            //     }} >Delete</button>
            // </div>
        // })
        events.map(event => {
            if (event.name === roomName){
                console.log(event.chat)
                return <div>
                <h1>{event.id}</h1>
                <input ref={chatRef} type ="text"/>  

                <button onClick= {()=>{
                    const chat = chatRef.current.value
                    Chat(event.id,chat)
                }}> Room </button>

                <button onClick= {()=>{
                    deleteEvent(event.id)
                }} >Delete</button>

                {event.chat.map(chat =>{
                    return <p>{chat}</p>
                })}
            </div>
            }
        })
    )
}