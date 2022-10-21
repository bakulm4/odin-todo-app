import {compareAsc} from 'date-fns';
import * as Elements from './domElements';

export const priorityClassList = {
    'P1': ['priority_1','1'],
    'P2': ['priority_2', '2'],
    'P3': ['priority_3', '3'],
    'P4': ['priority_4', '4']
}
export const toasterActionList = [];

export const todayDate = new Date();
todayDate.setHours(0,0,0,0);

export function getModalTransformVectors(element1,element2){
    const elem1Position =  element1.getBoundingClientRect();
    const elem2Position =  element2.getBoundingClientRect();
    const widthDiff = (elem2Position.width-elem1Position.width)/2;
    const tx = window.innerWidth - elem1Position.right > widthDiff ? (elem1Position.left - widthDiff)+'px': (window.innerWidth - elem2Position.width-20)+'px' ;
    const ty = `${elem1Position.bottom + 5}px`;
    element2.style.transform = `translate3d(${tx},${ty},0px)`;
}

export function compareDates(date1,date2){
    if(date1==='' && date2===''){
        return 0;
    }
    if(date1==='')
        return 1;
    if(date2 ==='')
        return -1;
    return compareAsc(new Date(date1),new Date(date2));
}

export function openToaster(actionDetails){
    let message = `1`;
    Elements.actionCompleteToaster.style.display = 'flex';
    if('taskId' in actionDetails){
        Elements.undoActionCompleteButton.dataset.taskId = actionDetails.taskId;
        message+=' task';
    }
    else if('projectId' in actionDetails){
        Elements.undoActionCompleteButton.dataset.projectId = actionDetails.projectId;
        message+=' project';
    }

    message += actionDetails.type==='complete'? ' completed': ' deleted';
    Elements.undoActionCompleteButton.dataset.actionType=actionDetails.type;

    Elements.actionCompleteText.innerText=message;
}

export function closeToaster(){
    Elements.undoActionCompleteButton.dataset.taskId='';
    Elements.undoActionCompleteButton.dataset.projectId='';
    Elements.actionCompleteToaster.style.display = 'none';
}