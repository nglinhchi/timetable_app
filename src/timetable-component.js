
import { useState,useEffect, useRef } from 'react';
import firebase from './firebase'
import { v1 as uuidv1 } from 'uuid'
import { withRouter } from 'react-router-dom';
import {useHistory} from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import './timetable_comp.css';
function TimeCom({list}){
const calendar = document.querySelector("#app-calendar");
const daysOfWeek = ["hi", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const days = [0,1,2,3,4,5]
const time = [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
console.log(list)
return(
    <div id="app-calendar">
        
    {days.map(day=>{
        return (
            time.map(t=>{
                    let dayName = daysOfWeek[day]
                    if (day==0){
                        let hour_name = "";
                        if (t>6){
                            hour_name = t +":00";
                        }
                        return(<div class="info">{hour_name}</div>);
                    
                    } else if (t==6) {
                        return(<div class="info">{dayName}</div>);
                    } else {
                        for (let i =1; i < list.length;i++){
                            if(list[i].start == t && list[i].day == dayName){
                                
                                return(<div class="day selected">{list[i].unit}-{list[i].classType}</div>)
                            }
                            
                        }
                        return(<div class="day"></div>);
                    }
                
                
            })
        )
    })}
    </div>
)
// for (let i=0; i<=5; i++){
//     for (let day=6; day <= 23; day++){
//         const dayName = daysOfWeek[i];
//         if (i==0){
//             var time = "";
//             if (day>6){
//                 time = day +":00";
//             }
//             calendar.insertAdjacentHTML("beforeend", '<div class="info">'+time+'</div>');
        
//         } else if (day == 6) {
//             calendar.insertAdjacentHTML("beforeend", '<div class="info">'+dayName+'</div>');
//         } else {
//             calendar.insertAdjacentHTML("beforeend", '<div id='+dayName+'_'+day+' class="day"></div>');
//         }

        
//     }
// }





}
export default TimeCom;