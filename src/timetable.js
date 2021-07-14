import './App.css';
import { useState,useEffect, useRef } from 'react';
import firebase from './firebase'
import TimeCom from './timetable-component';
import { v1 as uuidv1 } from 'uuid'
import { withRouter } from 'react-router-dom';
import {useHistory} from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
function Timetable() {
    const history = useHistory()
    console.log(history.location.state)
    const classes = history.location.state
    return(
        <div>
            <h3> Time table</h3>
            <TimeCom list = {classes}></TimeCom>
            {classes.map(cls=>{
                if (cls !== "test"){
                    console.log(cls)
                return <div>
                    <h1>{cls.unit}-{cls.classType}-{cls.belongTo}</h1>
                    <p>{cls.suggestTime.start} -{cls.suggestTime.day} </p>
                </div>
                }                
            })}
        </div>
    )
}
export default withRouter(Timetable);