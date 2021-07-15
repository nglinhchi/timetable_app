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
    const classes = history.location.state
    const style = {
        color:'white',
        size: '50'
    }
    return(
        <div className="App">
            {/* <h3 style="position: absolute top: 50px "> Time table</h3> */}
            <TimeCom list = {classes}></TimeCom>
            {/* {classes.map(cls=>{
                if (cls !== "test"){
                return <div>
                    <h1  >{cls.unit}-{cls.classType}-{cls.belongTo}</h1>
                    <p style={style}>{cls.suggestTime.start} -{cls.suggestTime.day} </p>
                </div>
                }                
            })} */}
        </div>
    )
}
export default withRouter(Timetable);