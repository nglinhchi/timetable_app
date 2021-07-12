
import Events from './Events';
import './App.css';
import { useState,useEffect, useRef } from 'react';
import firebase from './firebase'
import { v1 as uuidv1 } from 'uuid'
import { withRouter } from 'react-router-dom';
import {useHistory} from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
function App() {
  
  // console.log(store)
  // const eventRef = db.ref("events")
  // const eventsss = 
  const history = useHistory()
  const [events, setEvent] = useState([])
  const [roomName, setRoomName] = useState([])
  const [room, setRoom] = useState(false)
  const eventNameRef = useRef()
  const userName = useRef()
  const nameRef = useRef()
  const db = firebase.database()
  const eventRef = db.ref("events")

  // Restore data from firebase
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
 
  function check(name){
    if (events.length ===0){return false}
    for (let i = 0; i < events.length; i++) {
      console.log(i)
    }
    for (let i = 0; i < events.length; i++) {
      console.log(events[i],i)
      console.log(events[i].name === name)
      if(events[i].name === name){
        return true
      }
  }
  return false
}
  // Add new event
  function addEvent(){
    const name = eventNameRef.current.value
    if (name !== "" && !check(name) ){
      setEvent([...events,{id:uuidv1(),name: name,chat: ["test"],member: [nameRef.current.value] }] )
      setRoomName(name)
    }
    eventNameRef.current.value = null
    setRoom(room => {return !room})
  }

  // Delete event function
  function deleteEvent(id){
    let list = events
    for ( let i =0; i < list.length;i++){
        if (list[i].id === id){
            list.splice(i,1)
            console.log(list)
            setEvent([...list])
            break
        }
    }
}
 function Room(){
  const roomName = userName.current.value
  for (let i =0; i < events.length;i++){
    if (events[i].name === roomName){
      for(let j =0; j< events[i].member.length;j++){
        console.log(events[i].member[j], nameRef.current.value)
        if (events[i].member[j] === nameRef.current.value){
          if (check(roomName)){
            setRoomName(roomName)
            const location = {
            pathname: "/room/"+ roomName,
            state: {name: roomName}
          }
          history.push(location)
          return
          }
        }
      }
      alert("You are not included in this group")
      return
    }
  }
  alert("Group not exist")
 }



 function Chat(id,chat){
  let list = events
  for ( let i =0; i < list.length;i++){
      if (list[i].id === id){
          list[i].chat.push(chat)
          console.log(list)
          setEvent([...list])
          break
      }
  }
 }

  // Sent new data to firebase
  useEffect(()=>{
    if (events.length !== 0 ){
      eventRef.set(events);
    }
    if (room){
      const location = {
        pathname: "/room/"+ roomName,
        state: {name: roomName, user: nameRef.current.value}
      }
      history.push(location)
    }
  },[events])

  return (
    <div className="App" >
      <input type="text" ref={nameRef} placeholder= "your name" ></input>
      <input placeholder="new group"  ref={eventNameRef} type="text"/>
      <Button variant="contained" color="secondary" onClick= {addEvent}> Add group</Button>
      <br></br> 
      <input placeholder="group name" ref={userName} type ="text"/>  
      <Button width= {200} variant="contained" color="secondary" onClick= {Room}> Group </Button>
      <Events Chat= {Chat} events = {events} deleteEvent = {deleteEvent} roomName = {roomName} ></Events>
    </div>
  );
}

export default withRouter(App);
