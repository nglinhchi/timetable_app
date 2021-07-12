import React  from "react"
import { useState,useEffect,useRef } from "react"
import {Link} from 'react-router-dom'
import { useHistory } from "react-router-dom";
import firebase from './firebase'
export default function Room(){
    const style = {
        color:'black'
    };
    const [events, setEvent] = useState([])
    const typeRef= useRef()
    const memberRef= useRef()
    const unitRef= useRef()
    const belongRef= useRef()
    const startTimeRef= useRef()
    const dayRef = useRef()
    const duarationRef = useRef()
    const history = useHistory()
    const roomName = history.location.state.name
    const db = firebase.database()
    const eventRef = db.ref("events")
    const user = history.location.state.user
    console.log(user)
    function Chat(id){
        let list = events
        if (
            typeRef.current.value === "" ||
            unitRef.current.value ==="" ||
            duarationRef.current.value ==="" ||
            belongRef.current.value ==="" ||
            startTimeRef.current.value ==="" ||
            dayRef.current.value ===""
        ){
            alert("Missing infomation")
            return null
        }
        for ( let i =0; i < events.length;i++){
            if( events[i].name === roomName){
                for( let j= 1; j < events[i].chat.length;j++){
                    if (events[i].chat[j].unit ===unitRef.current.value && events[i].chat[j].classType ===typeRef.current.value && events[i].chat[j].belongTo ===belongRef.current.value ){
                        list[i].chat[j].time.push({day: dayRef.current.value,start: startTimeRef.current.value})
                        setEvent([...list])
                        return
                    }
                }
            }
        }
        for ( let i =0; i < list.length;i++){
            if (list[i].id === id){
                list[i].chat.push({
                    classType: typeRef.current.value,
                    unit: unitRef.current.value,
                    duaration: duarationRef.current.value,
                    belongTo: belongRef.current.value,
                    time: [{
                        start: startTimeRef.current.value,
                        day: dayRef.current.value
                    }]             
                
                
                })

                startTimeRef.current.value=""
                dayRef.current.value=""
                setEvent([...list])
                break
            }
        }
       }
    function deleteEvent(id){
        let list = events
        for ( let i =0; i < list.length;i++){
            if (list[i].id === id){
                list.splice(i,1)
                setEvent([...list])
                eventRef.set(events)
                break
            }
        }
        const location = {
            pathname: "/",
          }
          history.push(location)
    }
    function addMember(id,member){
        let list = events
        if (!checkMember(member)){
            return null
        }
        for ( let i =0; i < list.length;i++){
            if (list[i].id === id){
                list[i].member.push(member)
                setEvent([...list])
                break
            }
        }
    }
    function checkMember(member){
        for ( let i =0; i < events.length;i++){
            console.log(events[i].name, roomName)
            if(events[i].name === roomName){
                console.log("inn")
                for (let j =0; j< events[i].member.length; j ++){
                    if  (events[i].member[j] === member){
                        return false
                    }
                }
            }
        }
        return true
    }
    useEffect(()=>{
        if (events.length !== 0 ){
            console.log("updated")
            console.log(events)
          eventRef.set(events);
        }
    },[events])

    useEffect(()=>{
        eventRef.on('value',(snapshot)=>{
          const data = snapshot.val();
    
          if (data !== null){
          setEvent(data)
          }
          else{
            setEvent([])
          }
        })
      },[])

    return(
        <div>
        <Link style ={style} to="..">
            Home page
        </Link>
        {
            events.map(event => {
                if (event.name === roomName){
                    return <div>
                    <p>Current user:{user}</p>
                    <h1>{roomName}</h1>
                    {event.member.map(member => {
                        return <p>{member}</p>
                    })}
                    <input ref={memberRef} type="text" ></input>
                    <button onClick= {()=>{
                        const member = memberRef.current.value
                        addMember(event.id,member)
                        memberRef.current.value = null
                    }}> Add member </button>
                    <br></br>

                    <input ref={typeRef} type ="text"/> 
                    <label>Class type</label> 
                    <br></br>
                    <input ref={unitRef} type ="text"/> 
                    <label>Unit</label> 
                    <br></br>
                    <input value={user} ref={belongRef} type ="text"/> 
                    <label>Member name</label> 
                    <br></br>
                    <input ref={duarationRef} type ="text"/> 
                    <label>Duaration</label> 
                    <br></br>
                    <input ref={startTimeRef} type ="text"/>  
                    <label>Start time</label> 
                    <br></br>
                    <input ref={dayRef} type ="text"/> 
                    <label>Day</label> 
                    <br></br>
                    <button onClick= {()=>{
                        Chat(event.id)
                        // typeRef.current.value = null
                    }}> Add class </button>
    
                    <button onClick= {()=>{
                         if((!window.confirm("Delete this group?"))){
                            return
                        }
                        deleteEvent(event.id)
                    }} >Delete group</button>

    
                    {event.chat.map(chat =>{
                        if(chat !== "test" && chat.belongTo===user){
                        return <div>
                                <h1>{chat.unit}-{chat.classType}</h1>
                                <button onClick={()=>{
                                    if((!window.confirm("Delete this class?"))){
                                        return
                                    }
                                    
                                    const list = events
                                    for ( let i =0; i < events.length;i++){
                                        if( events[i].name === roomName){
                                            for( let j= 1; j < events[i].chat.length;j++){
                                                if (events[i].chat[j].unit ===unitRef.current.value && events[i].chat[j].classType ===typeRef.current.value && events[i].chat[j].belongTo ===belongRef.current.value ){
                                                    list[i].chat.splice(j,1)
                                                    setEvent([...list])
                                                    return
                                                }
                                            }
                                        }
                                    }

                                }}>Delete class</button>
                                {chat.time.map(time=>{
                                    return <p>{time.start}-{time.day}</p>
                                })}
                            </div>
                        }
                    })}
                </div>
                }
            })
        }
        </div>
        
    )
}