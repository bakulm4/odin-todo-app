import * as Elements from './domElements';
import * as CommonUtils from './commonUtils';
import * as ModalUtils from './modalOverlayUtils';
import * as Controller from './controller';
import {format} from 'date-fns';

export function renderTask(task){
    if(!task)
        return;
    const listItem = document.createElement('li');
    listItem.classList.add('task_list_item');
    listItem.dataset.taskId = task.id;
    listItem.dataset.taskPriority= CommonUtils.priorityClassList[task.priority][1];

    const listItemBody = document.createElement('div');
    listItemBody.classList.add('task_list_item_body');

    const taskHoverIcon = document.createElement('span');
    taskHoverIcon.classList.add('task_hover_icon');
    taskHoverIcon.innerHTML=`<svg width="24" height="24"><path fill="currentColor" d="M14.5 15.5a1.5 1.5 0 11-.001 3.001A1.5 1.5 0 0114.5 15.5zm-5 0a1.5 1.5 0 11-.001 3.001A1.5 1.5 0 019.5 15.5zm5-5a1.5 1.5 0 11-.001 3.001A1.5 1.5 0 0114.5 10.5zm-5 0a1.5 1.5 0 11-.001 3.001A1.5 1.5 0 019.5 10.5zm5-5a1.5 1.5 0 11-.001 3.001A1.5 1.5 0 0114.5 5.5zm-5 0a1.5 1.5 0 11-.001 3.001A1.5 1.5 0 019.5 5.5z"></path></svg>`;

    const taskCheckbox = document.createElement('button');
    taskCheckbox.classList.add('task_checkbox',CommonUtils.priorityClassList[task.priority][0]);
    taskCheckbox.innerHTML= `<svg width="24" height="24">
    <path fill="currentColor" d="M11.23 13.7l-2.15-2a.55.55 0 0 0-.74-.01l.03-.03a.46.46 0 0 0 0 .68L11.24 15l5.4-5.01a.45.45 0 0 0 0-.68l.02.03a.55.55 0 0 0-.73 0l-4.7 4.35z"></path>
</svg>`;
    taskCheckbox.addEventListener('click',e=>{
        e.stopPropagation();
        handleCompleteTask(task.id, listItem)});

    const taskItemContent = document.createElement('div');
    taskItemContent.classList.add('task_list_item_content');

    const taskItemTitle =  document.createElement('span');
    taskItemTitle.innerText = task.name;
    taskItemTitle.addEventListener('click',e=> {
        e.stopPropagation();
        ModalUtils.openTaskDetailsModal(listItem)});

    const taskItemDescription = document.createElement('span');
    taskItemDescription.classList.add('task_list_item_description');
    taskItemDescription.innerText =  task.description;
 
    const dueDateControls = document.createElement('span');
    dueDateControls.classList.add('due_date_controls');
    dueDateControls.innerHTML= `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="calendar_icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 1h-7A1.5 1.5 0 001 2.5v7A1.5 1.5 0 002.5 11h7A1.5 1.5 0 0011 9.5v-7A1.5 1.5 0 009.5 1zM2 2.5a.5.5 0 01.5-.5h7a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-7zM8.75 8a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM3.5 4a.5.5 0 000 1h5a.5.5 0 000-1h-5z" fill="currentColor"></path></svg>`;
    dueDateControls.dataset.dueDate = task.dueDate;

    const dueDate = document.createElement('span');
    dueDate.classList.add('due_date');
    try{
        const _date = new Date(task.dueDate);
        dueDate.innerText = format(_date, _date.getFullYear()> CommonUtils.todayDate.getFullYear()? 'MMM d yyyy':'MMM d');
        if(_date < CommonUtils.todayDate){
            dueDateControls.classList.add('date_overdue');
        }
           
    }catch(error){
        dueDate.innerText = 'No Due Date';
    }
    dueDate.dataset.dueDate = task.dueDate;
    dueDateControls.append(dueDate);

    taskItemContent.append(taskItemTitle, taskItemDescription,dueDateControls);

    const taskListActionItems = document.createElement('div');
    taskListActionItems.classList.add('task_list_item_actions');

    const taskListItemActionEdit = document.createElement('button');
    taskListItemActionEdit.dataset.tooltip = 'Edit task';
    taskListItemActionEdit.classList.add('task_list_item_actions_edit');
    taskListItemActionEdit.innerHTML=`<svg width="24" height="24"><g fill="none" fill-rule="evenodd"><path fill="currentColor" d="M9.5 19h10a.5.5 0 110 1h-10a.5.5 0 110-1z"></path><path stroke="currentColor" d="M4.42 16.03a1.5 1.5 0 00-.43.9l-.22 2.02a.5.5 0 00.55.55l2.02-.21a1.5 1.5 0 00.9-.44L18.7 7.4a1.5 1.5 0 000-2.12l-.7-.7a1.5 1.5 0 00-2.13 0L4.42 16.02z"></path></g></svg>`;
    taskListItemActionEdit.addEventListener('click',e=>{
        e.stopPropagation();
        handleTaskEdit(listItem)});

    const taskListItemActionDue = document.createElement('button');
    taskListItemActionDue.classList.add('task_list_item_actions_due');
    taskListItemActionDue.dataset.tooltip = 'Set due date';
    taskListItemActionDue.innerHTML=`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2zM5 6a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H6a1 1 0 01-1-1V6zm12 10a1 1 0 11-2 0 1 1 0 012 0zM7 8a.5.5 0 000 1h10a.5.5 0 000-1H7z" fill="currentColor"></path></svg>`;
    taskListItemActionDue.dataset.dueDate = task.dueDate;
    taskListItemActionDue.addEventListener('click',e=> {
        e.stopPropagation();
        ModalUtils.handleDueDateSelection(taskListItemActionDue, updateTaskDueDate);
    });

    function updateTaskDueDate(date){
        const dueDateString = format(date,'MM/dd/yyyy');
        Elements.getTaskElementsWithDueDateDataset(listItem).forEach(child=>{
            child.dataset.dueDate = dueDateString;
        });
        dueDate.innerText = format(date, date.getFullYear()>CommonUtils.todayDate.getFullYear()?'MMM d yyyy': 'MMM d');
        Controller.addUpdateTask(Elements.getTaskDetails(listItem));
    }

    const taskListItemActionDelete = document.createElement('button');
    taskListItemActionDelete.classList.add('task_list_item_actions_delete');
    taskListItemActionDelete.dataset.tooltip = 'Delete task';
    taskListItemActionDelete.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"></path><rect width="14" height="1" x="5" y="6" fill="currentColor" rx=".5"></rect><path fill="currentColor" d="M10 9h1v8h-1V9zm3 0h1v8h-1V9z"></path><path stroke="currentColor" d="M17.5 6.5h-11V18A1.5 1.5 0 0 0 8 19.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5zm-9 0h7V5A1.5 1.5 0 0 0 14 3.5h-4A1.5 1.5 0 0 0 8.5 5v1.5z"></path></g></svg>`;
    taskListItemActionDelete.addEventListener('click',e=> {
        e.stopPropagation();
        ModalUtils.handleTaskDelete(task.id,listItem);
    });

    taskListActionItems.append(taskListItemActionEdit, taskListItemActionDue, taskListItemActionDelete);

    listItemBody.append(taskHoverIcon,taskCheckbox,taskItemContent,taskListActionItems);
    listItem.append(listItemBody);
 
    Elements.addTaskContainer.before(listItem);
}

export function restoreTaskEditorDefaults(){
    Elements.taskEditorTitle.value = '';
    Elements.taskEditorDescription.value = '';
    Elements.selectDueDatebutton.dataset.dueDate='';
    Elements.dueDateValue.innerText = 'Due Date';
    Elements.dueDateValue.dataset.dueDate='';
    Elements.projectSelectionPillText.innerText = Controller.getCurrentProject().name;
    Elements.selectTaskPriorityButton.dataset.priority = '4';
    Elements.taskPriorityIconList.forEach(icon=>{
        if(icon.dataset.priority==='4')
            icon.style.display='block';
        else  
            icon.style.display='none';  
    });
}

export function updateSelectDueDateButton(date){
    Elements.dueDateValue.innerText = format(date, date.getFullYear()>CommonUtils.todayDate.getFullYear()?'MMM d yyyy': 'MMM d');
    Elements.selectDueDatebutton.dataset.dueDate = format(date,'MM/dd/yyyy');
    Elements.dueDateValue.dataset.dueDate = format(date,'MM/dd/yyyy');
}

function handleTaskEdit(containerElement){
    containerElement.after(Elements.taskEditorManager);
    containerElement.style.display='none';
    Elements.taskEditorManager.style.display='block';
    Elements.taskEditorTitle.focus();

    const taskDetails = Elements.getTaskDetails(containerElement);
    taskDetails.project = Controller.getProjectOfTask(taskDetails.id);

    populateTaskEditor( taskDetails); 
}

function populateTaskEditor(taskDetails){
    Elements.taskEditorTitle.value = taskDetails.name;
    Elements.taskEditorDescription.value = taskDetails.description;
    Elements.selectDueDatebutton.dataset.dueDate = taskDetails.dueDate;
    const _date = new Date(taskDetails.dueDate);
    Elements.dueDateValue.innerText = taskDetails.dueDate === ''? 'No Due Date':format(_date, _date.getFullYear()> CommonUtils.todayDate.getFullYear()?'MMM d yyyy': 'MMM d');
    Elements.dueDateValue.dataset.dueDate = taskDetails.dueDate;
    Elements.projectSelectionPillText.innerText = taskDetails.project;
    Elements.selectTaskPriorityButton.dataset.priority = taskDetails.priority;
    Elements.taskEditorForm.dataset.taskId = taskDetails.id;
    Elements.saveAddEditTaskButton.disabled= !taskDetails.name || taskDetails.name===''? true:false;

    Elements.taskPriorityIconList.forEach(icon=>{
        if(icon.dataset.priority===taskDetails.priority)
            icon.style.display='block';
        else  
            icon.style.display='none';  
    }); 
}

function handleCompleteTask(taskId, element){
    CommonUtils.openToaster({
        'type':'complete',
        'taskId':taskId
    });
    element.style.display='none';
    CommonUtils.toasterActionList.push([taskId,element]);
    const currentProjecTaskCountElement = Elements.getProjectCount(Controller.getCurrentProject().id);
    currentProjecTaskCountElement.innerText = parseInt(currentProjecTaskCountElement.innerText)-1;

    setTimeout(()=> {
        if(CommonUtils.toasterActionList.some(action => action[0]=== taskId)){
            CommonUtils.toasterActionList.splice(CommonUtils.toasterActionList.findIndex(action =>action[0]=== taskId),1);
            Controller.completeTask(taskId);
            element.remove();
        }
        CommonUtils.closeToaster();
    },3000);
}