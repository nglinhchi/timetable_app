import './App.css';
import { useState,useEffect, useRef } from 'react';
import firebase from './firebase'
import { v1 as uuidv1 } from 'uuid'
import { withRouter } from 'react-router-dom';
import {useHistory} from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
function Timetable() {
    return(
        <div>
            <h3> Time table</h3>
        </div>
    )
}
export default withRouter(Timetable);