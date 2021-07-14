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
                        return <p>{member.name}: {member.status} {}</p>
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
                    {/* <input value={user} ref={belongRef} type ="text"/> 
                    <label>Member name</label> 
                    <br></br> */}
                    <input ref={duarationRef} type ="text"/> 
                    <label>Duration</label> 
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
                    <button onClick={()=>{submitClasses()}}>Submit</button>
                    <button onClick={()=>{
                        if(!checkMemberSubmit()){
                            return 
                        }
                        CalculateTimetable()
                    }}>See timetable</button>

                    {/* <p>{user}'s Timetable</p>
                    <TimeCom list = {event.classes}></TimeCom> */}
                    
                    {event.classes.map(classes =>{
                        if(classes !== "test" && classes.belongTo===user){
                        return <div>
                                <h1>{classes.unit}-{classes.classType}</h1>
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

                                }}>Delete class</button>
                                {classes.time.map(time=>{
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