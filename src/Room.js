import './Room.css';
import React  from "react"
import { useState,useEffect,useRef } from "react"
import {Link} from 'react-router-dom'
import { useHistory } from "react-router-dom";
import firebase from './firebase'
import TimeCom from './timetable-component';

export default function Room(){
    const style = {
        color:'black'
    }
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

    const classes = history.location.state

    function Chat(id){
        let list = events
        for ( let i =0; i < list.length;i++){
            if(list[i].name === roomName){
                for (let j =0; j< list[i].member.length; j ++){
                    if  (list[i].member[j].name === user){
                        if (list[i].member[j].status === true){
                            return
                        }
                        
                }
            } 
         }
        }
        if (
            typeRef.current.value === "" ||
            unitRef.current.value ==="" ||
            duarationRef.current.value ==="" ||
            startTimeRef.current.value ==="" ||
            dayRef.current.value ===""
        ){
            alert("Missing infomation")
            return null
        }
        if (checkDayTime(typeRef.current.value,unitRef.current.value,user,startTimeRef.current.value, dayRef.current.value)){
            alert("Repeated session")
            return 
        }
        for ( let i =0; i < events.length;i++){
            if( events[i].name === roomName){
                for( let j= 1; j < events[i].classes.length;j++){
                    if (events[i].classes[j].unit ===unitRef.current.value && events[i].classes[j].classType ===typeRef.current.value && events[i].classes[j].belongTo ===user ){
                        list[i].classes[j].time.push({day: dayRef.current.value,start: startTimeRef.current.value})
                        setEvent([...list])
                        startTimeRef.current.value=""
                        dayRef.current.value=""
                        return
                    }
                }
            }
        }
        for ( let i =0; i < list.length;i++){
            if (list[i].id === id){
                list[i].classes.push({
                    suggestClass: ["test"],
                    classType: typeRef.current.value,
                    unit: unitRef.current.value,
                    duaration: duarationRef.current.value,
                    belongTo: user,
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
                list[i].member.push({name: member, status: "not submitted"})
                setEvent([...list])
                break
            }
        }
    }
    function checkMember(member){
        for ( let i =0; i < events.length;i++){
            if(events[i].name === roomName){
                for (let j =0; j< events[i].member.length; j ++){
                    if  (events[i].member[j].name === member){
                        return false
                    }
                }
            }
        }
        return true
    }
    function submitClasses(){
        const list =events
        for ( let i =0; i < list.length;i++){
            if(list[i].name === roomName){
                for (let j =0; j< list[i].member.length; j ++){
                    if  (list[i].member[j].name === user){
                        list[i].member[j].status = "submitted"
                        setEvent([...list])
                }
            } 
         }
        }
    }
    function checkDayTime(type,unit, user,start,day){
        for (let i=0; i< events.length;i++){
            if (events[i].name=== roomName){
                for (let j =1; j < events[i].classes.length; j++ ){
                    if (type === events[i].classes[j].classType && unit ===events[i].classes[j].unit && user ===events[i].classes[j].belongTo) {
                        for ( let z = 0; z < events[i].classes[j].time.length;z++){
                            if (start ===events[i].classes[j].time[z].start && day === events[i].classes[j].time[z].day )
                            return true
                        }
                        
                    }
                }
            }
        }
    }
    function checkMemberSubmit(){
        for (let i=0; i< events.length;i++){
            if (events[i].name=== roomName){
                for (let j =0; j< events[i].member.length; j ++){
                    if (events[i].member[j].status== "not submitted"){
                        return false
                    } 
                }
                return true
            }
        } 
    }
    function CalculateTimetable(){
        var classes = 0
        var member = 0
        var list = events
        var decidedClass = []
        for( let i =0; i< events.length;i++){
            if (events[i].name=== roomName){
                classes = events[i].classes
                member = events[i].member
            }
        }

        for (let i =1; i < classes.length;i++){
            if(decidedClass.length === 0){
                decidedClass.push({unit: classes[i].unit, type: classes[i].classType, time: classes[i].time[0]})
            }
            else{
            var collide = false
            console.log(classes[i])
            for( let j =0; j< classes[i].time.length;j++){
                collide = false
                for (let z=0; z < decidedClass.length;z++){
                    if (classes[i].time[j].start === decidedClass[z].time.start && classes[i].time[j].day === decidedClass[z].time.day  ){
                        collide =true
                    }
                    
                }
                for (let z=0; z < decidedClass.length;z++){
                    if(classes[i].unit === decidedClass[z].unit&& classes[i].classType===decidedClass[z].type){
                    collide = true
                    }
                }
                
                if(!collide){
                    console.log("innn")
                    decidedClass.push({unit: classes[i].unit, type: classes[i].classType, time: classes[i].time[j]})
                    break
                }
            }
        }
        }
        console.log(decidedClass)
        var classesFinal=0
        for (let i=0; i < events.length; i++){
            if (events[i].name=== roomName){
                for(let j=1; j<events[i].classes.length;j++){
                    for (let z=0; z<decidedClass.length;z++){
                        if(events[i].classes[j].unit === decidedClass[z].unit && events[i].classes[j].classType === decidedClass[z].type){
                            const time = decidedClass[z].time
                            list[i].classes[j] = {...list[i].classes[j],suggestTime: time}
                            break
                        }
                    }
                }
                classesFinal = list[i].classes
            }
        }
        const location = {
            pathname: "/timetable",
            state: classesFinal
        }
        history.push(location)
    }

    useEffect(()=>{
        if (events.length !== 0 ){
          
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

        <div class="body">
        
            <div id="bar">
                <div id="home"><Link to="..">LOG OUT</Link></div>
                <div class="lgo"><img scr="logo.png"></img></div>
            </div>

            
        {
            events.map(event => {
                if (event.name === roomName){

                    
                    return <div id="content">

                        {/* <nav> */}
                        <div class="nav">

                            <div class="first_col">
                    
                                <div class="bubble">
                                    <h3>Username</h3>
                                    <h1>{user}</h1>
                                </div>

                                <div class="bubble">
                                    <h3>Group ID</h3>
                                    <h1>{roomName}</h1>
                                    
                                    {/* MEMBERS - DISPLAY */}
                                    <ul>
                                        {event.member.map(member => {
                                        return <li>{member.name} <span class="status">({member.status})</span> {}</li>
                                        })}
                                    </ul>

                                    {/* DELETE GROUP - BUTTON */}
                                    <button class="btn_normal" onClick= {()=>{
                                        if((!window.confirm("Delete this group?"))){
                                            return
                                        }
                                        deleteEvent(event.id)
                                    }} >delete group</button>

                                    {/* GENERATE - BUTTON */}
                                    <button class="btn_normal" onClick={()=>{
                                        if(!checkMemberSubmit()){
                                            return 
                                        }
                                        CalculateTimetable()
                                    }}>generate timetable</button>
                                </div>

                                <div class="add bubble">
                                    <input ref={memberRef} type="text"placeholder="New member"></input>
                                    <button class="btn_normal"  onClick= {()=>{
                                        const member = memberRef.current.value
                                        addMember(event.id,member)
                                        memberRef.current.value = null
                                    }}>add</button>
                                </div>

                            </div>

                            <div class="second_col">

                                <div class="form bubble">
                                    <h1>New Class</h1>
                                    <input ref={unitRef} type ="text" placeholder="Unit (e.g. FIT1008)"></input>
                                    <input ref={typeRef} type ="text" placeholder="Type (e.g. workshop)"></input>
                                    <input ref={duarationRef} type ="text" placeholder="Duration (e.g. 2)"></input>
                                    <input ref={dayRef} type ="text" placeholder="Day (e.g. Monday)"></input>
                                    <input ref={startTimeRef} type ="text" placeholder="Time (e.g. 1400)"></input>
                                    <button id="btn_addclass" class="btn_important" onClick= {()=>{
                                        Chat(event.id)
                                    }}>add</button>
                                </div>
    
                            </div>

                        </div>
                        {/* </nav> */}


                        <div class="timetable">
                    
                            {/* TIMETABLE ALLOCATION LIST - DISPLAY */}
                            {event.classes.map(classes =>{
                                if(classes !== "test" && classes.belongTo===user){
                                return <div class="class">

                                    <div class="header">
                                        <h4>{classes.unit}</h4>
                                        <h5>{classes.classType}</h5>
                                    </div>
                                    <ul>
                                        {classes.time.map(time=>{
                                            return <li>{time.day}, {time.start}</li>
                                        })}
                                    </ul>
                                    <button onClick={()=>{
                                            const list =events
                                            for ( let i =0; i < list.length;i++){
                                                if(list[i].name === roomName){
                                                    for (let j =0; j< list[i].member.length; j ++){
                                                        if  (list[i].member[j].name === user){
                                                            if (list[i].member[j].status === true){
                                                                return
                                                            }
                                                        }
                                                    } 
                                                }
                                            }
                                            if((!window.confirm("Delete this class?"))){
                                                return
                                            }
                                            for ( let i =0; i < events.length;i++){
                                                if( events[i].name === roomName){
                                                    for( let j= 1; j < events[i].classes.length;j++){
                                                        if (events[i].classes[j].unit ===unitRef.current.value && events[i].classes[j].classType ===typeRef.current.value ){
                                                            list[i].classes.splice(j,1)
                                                            setEvent([...list])
                                                            return
                                                        }
                                                    }
                                                }
                                            }
                                        }}>delete</button>
                                    </div> 
                                }
                            })}

                             <button id="btn_submit" class="btn_important" onClick={()=>{submitClasses()}}>Submit all</button>


                        </div>
                    </div>
                }
            })
        }
            
        </div>
        
    )
}