import * as Elements from './domElements';
import * as CommonUtils from './commonUtils';
// import * as ProjectUtils from './projectUtils';
// import * as TaskUtils from './taskUtils';
import * as Controller from './controller';
import {format} from 'date-fns';

export function closeModalOverlay(){
    Elements.modalOverlay.style.backgroundColor= '';
    Elements.modalOverlay.style.display= 'none';
}

export function updateProjectDropdownList(projectList){

    projectList.forEach(project=> {
        const projectPickerItem = document.createElement('li');
        projectPickerItem.classList.add('project_picker_item');

        projectPickerItem.innerHTML=`
        <svg width="24" height="24" viewBox="0 0 24 24" class="project_icon" style="color: rgb(184, 184, 184);"><path d="M12 7a5 5 0 110 10 5 5 0 010-10z" fill="currentColor"></path></svg>
        <span class="project_picker_projectname">${project.name}</span>
        <svg  style="display:none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12" class="dropdown_select_checkmark"><path fill="currentColor" fill-rule="evenodd" d="M4.902 6.975l4.182-4.244a.74.74 0 0 1 1.06 0 .775.775 0 0 1 0 1.081L5.432 8.597a.74.74 0 0 1-1.06 0L1.78 5.975a.775.775 0 0 1 0-1.081.74.74 0 0 1 1.061 0l2.06 2.081z"></path></svg>
        `;

        projectPickerItem.addEventListener('click',e=>{
            e.stopPropagation();
            handleProjectSelection(projectPickerItem)});
        Elements.projectDropDownListContainer.append(projectPickerItem);        
    });
}

export function handleProjectSelection(target){

    //console.log(`[View>handleProjectSelection], clicked on `, target);   
   
    const selectedProject = target.querySelector('.project_picker_projectname').innerText;
    Elements.projectPickerNameList().forEach((name,index) =>{
        if(name.innerText === selectedProject)
            Elements.projectPickerCheckMarkList()[index].style.display='';
        else
            Elements.projectPickerCheckMarkList()[index].style.display='none';
    });
    Elements.projectSelectionPillText.innerText = selectedProject;

    Elements.projectDropDown.style.display='none';
    closeModalOverlay();
}

export function handleDueDateSelection(element,callbackFn){

    Elements.modalOverlay.style.display= 'block';
    Elements.datePicker.style.display='flex';

    CommonUtils.getModalTransformVectors(element, Elements.datePicker);

    //console.log(`[View>handleDueDateSelection], currently selected due date: `,element.dataset.dueDate );
  
    let month = null;
    let year = null;
    let day = null;
    let _date = null;
    if(!element.dataset.dueDate||element.dataset.dueDate === ''){
        _date = CommonUtils.todayDate;
        month = _date.getMonth();
        year = _date.getFullYear();
    } 
    else{
        _date =  new Date(element.dataset.dueDate);
        day = _date.getDate();
        month = _date.getMonth();
        year = _date.getFullYear();
    } 

    populateDatePicker({day,month,year},callbackFn);

    function populateDatePicker({day,month,year}={}, callback){
        const firstDayOftodayMonth = new Date (CommonUtils.todayDate.getFullYear(), CommonUtils.todayDate.getMonth(),1);
        const startingDate = new Date(year,month,1);
        const startingDateDayOfWeek = startingDate.getDay();
        const daysInMonth = new Date(year, month+1, 0).getDate();
        const endingDate = new Date(year,month,daysInMonth);
        const numberOfWeeks = Math.ceil((daysInMonth + startingDateDayOfWeek -1)/7);

        Elements.datePickerHeaderActions.children && Array.from(Elements.datePickerHeaderActions.children).forEach(child=> child.remove());
        Array.from(Elements.calendarWeeks.children).forEach(week=> week.remove());

        const prevMonthButton = document.createElement('button');
        prevMonthButton.classList.add('prev-mth','date-picker-header-action');
        prevMonthButton.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                    <g fill="none" fill-rule="evenodd">
                                        <path d="M24 0v24H0V0z"></path>
                                        <path fill="currentColor" fill-rule="nonzero" d="M10.707 12l3.647 3.646a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708.708L10.707 12z"></path>
                                    </g>
                                   </svg>`;
        prevMonthButton.addEventListener('click', e=>{
            e.stopPropagation();
            previousMonthClickHandler();
        });
        if(startingDate <=  firstDayOftodayMonth)
            prevMonthButton.disabled=true;
        else
            prevMonthButton.disabled=false;

        const nextMonthButton = document.createElement('button');
        nextMonthButton.classList.add('next-mth','date-picker-header-action');
        nextMonthButton.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                    <g fill="none" fill-rule="evenodd">
                                        <path d="M0 24V0h24v24z"></path>
                                        <path fill="currentColor" fill-rule="nonzero" d="M13.293 12L9.646 8.354a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 12z"></path>
                                    </g>
                                </svg>`;
        nextMonthButton.addEventListener('click', e=>{
            e.stopPropagation();
            nextMonthClickHandler();
        });

        Elements.datePickerHeaderActions.append(prevMonthButton,nextMonthButton);

        Elements.datePickerHeaderMonth.innerText = format(startingDate,'MMM yyyy');

        let _date = startingDate;
        for(let week = 0 ; week <numberOfWeeks;week+=1){
           
            const weekElement = document.createElement('div');
            weekElement.classList.add('calendar_week');

            for(let j = 0;j<7;j+=1){
                     if(_date<CommonUtils.todayDate || _date > endingDate || (week ===0 && j<startingDateDayOfWeek)){
                    const spacerElement = document.createElement('div');
                    spacerElement.classList.add('calendar_day_date','calendar_spacer');
                    weekElement.append(spacerElement);
                    if((week ===0 && j< startingDateDayOfWeek)||_date>endingDate ){
                        spacerElement.innerText = '';
                        continue;
                    }
                    else
                        spacerElement.innerText = _date.getDate();
                }else{
                    const dateButton = document.createElement('button');
                    dateButton.classList.add('calendar_day');
                    dateButton.dataset.date=format(_date,'MM-dd-yyyy');
                    const dayElement = document.createElement('span');
                    dayElement.innerText=_date.getDate();
                    dayElement.classList.add('calendar_day_date');
                    const selectedDate = day ?  new Date(year,month,day):null;
                  
                    if(selectedDate && _date.toDateString() === selectedDate.toDateString())
                        dayElement.classList.add('selected');
                    else if(_date.toDateString() === CommonUtils.todayDate.toDateString())
                        dayElement.classList.add('current');
                    
                    if(j=== 0 || j=== 6)
                    dayElement.classList.add('greyed');
    
                    dateButton.addEventListener('click',(e)=>{
                        e.stopPropagation();
                        const setDueDate = new Date(dateButton.dataset.date);
                        callbackFn(setDueDate);
                         Elements.datePicker.style.display='none';
                        closeModalOverlay();
                    });
                    dateButton.append(dayElement);
                    weekElement.append(dateButton);
                }
                _date.setDate(_date.getDate()+1);
            }
            Elements.calendarWeeks.append(weekElement);
        }
    }

    function previousMonthClickHandler(callback){
        const {currentMonth,currentYear} =  getCurrentDatePickerDate();
        //console.log(`[View> previousMonthClickHandler], starting date of previous month: `,new Date(currentMonth===0?currentYear-1:currentYear,currentMonth===0? 11:currentMonth-1,1).toDateString() );
        populateDatePicker({month:currentMonth===0? 11:currentMonth-1, year:currentMonth===0?currentYear-1:currentYear},callback);
    }

    function nextMonthClickHandler(callback){
        const {currentMonth,currentYear} =  getCurrentDatePickerDate();
        //console.log(`[View> nextMonthClickHandler], starting date of next month: `,new Date(currentMonth===11?currentYear+1:currentYear,currentMonth===1? 0:currentMonth+1,1).toDateString());
        populateDatePicker({month:currentMonth===11? 0:currentMonth+1, year:currentMonth===11?currentYear+1:currentYear},callback);
    }
}

function getCurrentDatePickerDate(){
    const date = new Date(Elements.datePickerHeaderMonth.innerText);
    return{
       currentMonth:date.getMonth(),
       currentYear:date.getFullYear()
    }
}

export function openTaskDetailsModal(taskElement){
    Elements.modalOverlay.style.display='flex';
    Elements.taskDetailsModal.style.display='flex';
    Elements.modalOverlay.style.backgroundColor= 'rgba(0,0,0,0.5)';

    const taskDetails = Elements.getTaskDetails(taskElement);
    taskDetails.project = Controller.getProjectOfTask(taskDetails.id)

    Elements.taskDetailsTitle.innerText = taskDetails.name;
    Elements.taskDetailsDescription.innerText = taskDetails.description;
    Elements.taskDetailsProjectName.innerText = taskDetails.project;
    const _date = new Date(taskDetails.dueDate);
    Elements.taskDetailsDueDate.innerText = taskDetails.dueDate === ''? 'No Due Date': format(_date, _date.getFullYear()>CommonUtils.todayDate.getFullYear()?'MMM d yyyy': 'MMM d');
    if(_date < CommonUtils.todayDate){
        if(!Elements.taskDetailsDueDate.classList.contains('date_overdue'))
          Elements.taskDetailsDueDate.classList.add('date_overdue');
    }else {
        if(Elements.taskDetailsDueDate.classList.contains('date_overdue'))
            Elements.taskDetailsDueDate.classList.remove('date_overdue');
    }

    Elements.taskDetailsPriority.innerText = Object.entries(CommonUtils.priorityClassList).find(entry=>entry[1][1]=== taskDetails.priority)[0];
 
    Elements.taskDetailsPriorityIconList.forEach(icon=>{
        if(icon.dataset.priority===taskDetails.priority)
            icon.style.display='block';
        else  
            icon.style.display='none';  
    }); 
}     

function openConfirmationDialog(){
    Elements.modalOverlay.style.display= 'flex';
    Elements.modalOverlay.style.backgroundColor= 'rgba(0,0,0,0.5)';
    Elements.confirmationDialog.style.display='block';
}

export function closeConfirmationDialog(){
    Elements.confirmationDialogMessage.innerText='';
    Elements.submitDeleteButton.dataset.taskId = '';
    Elements.submitDeleteButton.dataset.projectId = '';
    Elements.confirmationDialog.style.display='none';

    closeModalOverlay();
} 

export function handleDeleteProject(element){
    //console.log(`[View>handleDeleteProject], clicked on delete icon of `, element);
    openConfirmationDialog();
    Elements.confirmationDialogMessage.innerText= Elements.getProjectName(element);
    Elements.submitDeleteButton.dataset.projectId = element.dataset.projectId;
}

export function handleTaskDelete(taskId, containerElement){
    openConfirmationDialog();
    Elements.confirmationDialogMessage.innerText= Elements.getTaskDetails(containerElement).name;
    Elements.submitDeleteButton.dataset.taskId = taskId;
}
