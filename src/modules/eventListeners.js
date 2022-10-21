
import * as Elements from './domElements';
import * as CommonUtils from './commonUtils';
import * as ProjectUtils from './projectUtils';
import * as TaskUtils from './taskUtils'
import * as ModalUtils from './modalOverlayUtils';
import * as Controller from './controller';
import {format} from 'date-fns';

export function addEventListeners(){
    toggleMenuEventListener()
    modalClickEventListener();
    displayInboxTodayEventListener();
    editProjectNameEventListener()
    addNewProjectEventListener();
    addNewTaskEventListener();
    addTaskFormEventListeners();
    confirmationDialogEventListeners();
    taskDetailsCloseEventListener();
    closeToasterEventListener();
    undoActionEventListener();
}

function  addTaskFormEventListeners(){
    addEditTaskTitleEventListener();
    submitAddEditTaskEventListener();
    cancelAddEditTaskEventListener();
    openPriorityPickerEventListener();
    selectPriorityEventListener();
    openProjectPickerEventListener();
    selectProjectEventListener();
    openFormDueDateSelectorEventListener();
}

function confirmationDialogEventListeners(){
    closeDialogEventListener();
    cancelDeleteEventListener();
    submitDeleteEventListener();
};

function toggleMenuEventListener(){
    Elements.toggleMenu.addEventListener('click',()=>{
        Elements.leftMenu.style.display=Elements.leftMenu.style.display !== 'none'?'none':'flex';
        Elements.toggleMenu.dataset.tooltip= Elements.toggleMenu.dataset.tooltip==='Close menu'?'Open menu':'Close menu';
    });
}
 /** Close Priority, Project, Date picker, Task detail modals, if user clicks outside them. */
function modalClickEventListener(){
    window.addEventListener('click',event => {

        //console.log(`[View>modalClickEventListener]: event target: `, event.target);
        if (event.target === Elements.modalOverlay) {
            Array.from(Elements.modalOverlay.children).forEach(child => {
                child.style.display='none'});
            ModalUtils.closeModalOverlay();
        }
        else
            ProjectUtils.resetProjectList();
      });
}

function displayInboxTodayEventListener(){
    const items = [Elements.inboxElement,Elements.todayElement];
    items.forEach((item,index)=>{
        item.addEventListener('click',e=>{
            e.stopPropagation();
            Controller.displayProjectDetails(item.dataset.projectId);
        });
    });
}

function editProjectNameEventListener(){
    Elements.editProjectNameForm.addEventListener('submit',e =>{
        e.preventDefault();
        const projectName = Elements.projectNameEditInput.value;
        const projectId =  Elements.projectNameEditInput.dataset.projectId;
        //console.log(`[View>editProjectNameEventListener], project input value: `, projectName);
        if(projectName !== null && projectName !==''){
            Elements.getLeftMenuItemNames().find(projectLabel=> projectLabel.dataset.projectId === projectId ).innerText = projectName;
            Controller.editProjectName({projectId,projectName});
        }
        Elements.projectNameEditInput.value = null;
        Elements.projectList.lastChild.after(Elements.projectNameEdit);
        Elements.projectNameEditInput.dataset.projectId='';
        Elements.projectNameEdit.style.display='none';
        Elements.getProjectElementById(projectId).style.display='flex';
        Elements.projectDetailsTitle.innerText= projectName;
    });
}

function addNewProjectEventListener(){
    Elements.newProjectForm.addEventListener('submit',e =>{
        e.preventDefault();
        const projectName = Elements.newProjectInput.value;
        //console.log(`[View>addProjectEventListener], project input value: `, projectName);
        if(projectName === null || projectName==='')
            return;
        Elements.newProjectInput.value = null;
        Controller.addNewProject(projectName);
    });
}

function addNewTaskEventListener(){
    Elements.addTask.addEventListener('click', e=>{
        e.stopPropagation();
        Elements.taskEditorManager.style.display='block';
        Elements.addTaskContainer.style.display='none';
        Elements.taskEditorTitle.focus();
        Elements.projectSelectionPillText.innerText = Controller.getCurrentProject().name;
    });
}

function  taskDetailsCloseEventListener(){
    Elements.closeTaskDetails.addEventListener('click',(e)=>{
        e.stopPropagation();
        Elements.taskDetailsModal.style.display='none';
        ModalUtils.closeModalOverlay();
    });
};

function closeToasterEventListener(){
    Elements.closeActionCompleteToasterButton.addEventListener('click',e=> {
        e.stopPropagation();
        CommonUtils.closeToaster(e);
    });
}

function undoActionEventListener(){
    Elements.undoActionCompleteButton.addEventListener('click',(e)=>{
        e.stopPropagation();
        let actionId=null;
        if(Elements.undoActionCompleteButton.dataset.taskId && Elements.undoActionCompleteButton.dataset.taskId!== ''){
            actionId = Elements.undoActionCompleteButton.dataset.taskId;
            const currentProjecTaskCountElement = Elements.getProjectCount(Controller.getCurrentProject().id);
            currentProjecTaskCountElement.innerText = parseInt(currentProjecTaskCountElement.innerText)+1;
        }
        else if(Elements.undoActionCompleteButton.dataset.projectId && Elements.undoActionCompleteButton.dataset.projectId!== ''){
            actionId = Elements.undoActionCompleteButton.dataset.projectId;
        }
        const element =  CommonUtils.toasterActionList.find(item=>item[0]===actionId)[1];
        //console.log(`[View>undoActionEventListener], undo action for element: `,element);       
        CommonUtils.toasterActionList.splice(CommonUtils.toasterActionList.findIndex(action=> action[0]=== actionId ),1);
        element.style.display='flex';
        CommonUtils.closeToaster();
    });
}

function addEditTaskTitleEventListener(){

    Elements.taskEditorTitle.addEventListener('input',e=>{
        if(e.target.value==='')
            Elements.saveAddEditTaskButton.disabled=true;
        else
            Elements.saveAddEditTaskButton.disabled=false;
    });
}

function submitAddEditTaskEventListener(){
    Elements.taskEditorForm.addEventListener('keydown',e =>{
        const key = e.charCode || e.keyCode || 0;     
        if (key == 13) {
         //console.log(`[View>submitAddEditTaskEventListener], enter key pressed. Don't submit form. Element:`, e.target);
          e.preventDefault();
          e.stopPropagation();
        }
      });

    Elements.taskEditorForm.addEventListener('submit',e =>{
        e.preventDefault();
        e.stopImmediatePropagation();

        //console.log(`[View>submitAddEditTaskEventListener], saveForm button is clicked. event:`, e);

        const formInputs = {
            name: Elements.taskEditorTitle.value,
            description:Elements.taskEditorDescription.value,
            dueDate:Elements.dueDateValue.dataset.dueDate,
            priority:Elements.selectTaskPriorityButton.dataset.priority,
            project:Elements.projectSelectionPillText.innerText,
            id: Elements.taskEditorForm.dataset.taskId
        };

        //console.log(`[View>saveAddEditTaskButton]Form Inputs: `, formInputs);
        Controller.addUpdateTask(formInputs);
        TaskUtils.restoreTaskEditorDefaults();
        Elements.taskEditorManager.style.display='none';
        Elements.getTaskListElements().forEach(element => element.style.display='block');
        Elements.addTaskContainer.style.display='block';
        Elements.addTaskContainer.after(Elements.taskEditorManager);
    });
}

function cancelAddEditTaskEventListener(){

    Elements.taskEditorForm.addEventListener('reset',e=>{
        e.preventDefault();
        e.stopImmediatePropagation();
        //console.log(`[View>submitAddEditTaskEventListener], cancelForm button is clicked`);
        TaskUtils.restoreTaskEditorDefaults();
        Elements.taskEditorManager.style.display='none';
        Elements.getTaskListElements().forEach(element => element.style.display='block');
        Elements.addTaskContainer.style.display='block';
        Elements.addTaskContainer.after(Elements.taskEditorManager);
    });
}

function openPriorityPickerEventListener(){
    Elements.selectTaskPriorityButton.addEventListener('click',e=>{
        e.stopPropagation();
        Elements.modalOverlay.style.display= 'block';
        Elements.priorityDropDown.style.display='block';

        CommonUtils.getModalTransformVectors(Elements.selectTaskPriorityButton, Elements.priorityDropDown);

        Elements.priorityPickerSelectCheckMarkList.forEach((checkmark,index) =>{
            if(index === parseInt(e.target.dataset.priority)-1)
                checkmark.style.display='';
            else
             checkmark.style.display='none';
        });
    });
}

function selectPriorityEventListener(){
    Elements.priorityPickerItemList.forEach(element=>{
        element.addEventListener('click',e=>{
            e.stopPropagation();
            const selectedPriority = element.firstElementChild.dataset.priority;
            Elements.selectTaskPriorityButton.dataset.priority=selectedPriority;
            Elements.taskPriorityIconList.forEach(icon=>{
                if(icon.dataset.priority===selectedPriority)
                    icon.style.display='block';
                else  
                    icon.style.display='none';  
            });
            Elements.priorityDropDown.style.display='none';
            ModalUtils.closeModalOverlay();
        });

    })
}

function openProjectPickerEventListener(){

    Elements.selectTaskProjectButton.addEventListener('click',e=>{
        e.stopPropagation();
        Elements.modalOverlay.style.display= 'block';
        Elements.projectDropDown.style.display='block';
        
        CommonUtils.getModalTransformVectors(Elements.selectTaskProjectButton, Elements.projectDropDown);
        
        Elements.projectPickerNameList().forEach((name,index) =>{
            if(name.innerText === Elements.projectSelectionPillText.innerText)
                Elements.projectPickerCheckMarkList()[index].style.display='';
            else
                Elements.projectPickerCheckMarkList()[index].style.display='none';
        });
    });
}

function selectProjectEventListener(){
    Elements.projectPickerItemList.forEach(element=>{
        element.addEventListener('click',e=> {
            e.stopPropagation();
            ModalUtils.handleProjectSelection(element);
        });
    })
}

function  openFormDueDateSelectorEventListener(){
    Elements.selectDueDatebutton.addEventListener('click',e=>{
        e.stopPropagation();
        ModalUtils.handleDueDateSelection(Elements.selectDueDatebutton,updateSelectDueDateButton);
    });
}


function cancelDeleteEventListener(){
    Elements.cancelDeleteButton.addEventListener('click',(e)=>{
        e.stopPropagation(); 
        ModalUtils.closeConfirmationDialog() 
    } );
};

function submitDeleteEventListener(){
    Elements.submitDeleteButton.addEventListener('click',(e)=>{
        e.stopPropagation();
        const actionDetails={
            'type':'delete',
        };
        let element = null;
        let actionId=null;
        let callback = null;
        if(Elements.submitDeleteButton.dataset.taskId && Elements.submitDeleteButton.dataset.taskId!== '' ){
            actionId = Elements.submitDeleteButton.dataset.taskId;
            actionDetails.taskId = Elements.submitDeleteButton.dataset.taskId;
            element = Elements.getTaskElement(actionId);
            const currentProjecTaskCountElement = Elements.getProjectCount(Controller.getCurrentProject().id);
            currentProjecTaskCountElement.innerText = parseInt(currentProjecTaskCountElement.innerText)-1;
            callback= toasterCallBackFunction(Controller.deleteTask);
        }
        else {
            if(Elements.submitDeleteButton.dataset.projectId && Elements.submitDeleteButton.dataset.projectId!== '' ){
                actionId =  Elements.submitDeleteButton.dataset.projectId;
                actionDetails.projectId = Elements.submitDeleteButton.dataset.projectId;
                element = Elements.getProjectElementById(actionId);
                callback= toasterCallBackFunction(Controller.deleteProject);
            }
        }
        //console.log(`[View>submitDeleteEventListener], element to be deleted:`, element);
        CommonUtils.openToaster(actionDetails);
        //console.log(`[View>submitDeleteEventListener],element's display value: `, element.style.display);
        element.style.display='none';
        CommonUtils.toasterActionList.push([actionId,element]);

        setTimeout(()=>callback(actionId,element),3000);
        
        ModalUtils.closeConfirmationDialog();
    });
};

function toasterCallBackFunction(callback){
    return (id,element)=>{
        if(CommonUtils.toasterActionList.some(action => action[0]=== id)){
            CommonUtils.toasterActionList.splice(CommonUtils.toasterActionList.findIndex(action =>action[0]=== id),1);
            callback(id);
            element.remove();
        }
        CommonUtils.closeToaster();
    }
}

function closeDialogEventListener(){
    Elements.closeDialogButton.addEventListener('click',(e)=>{
        e.stopPropagation();
        ModalUtils.closeConfirmationDialog()
    } );
};

function updateSelectDueDateButton(date){
    Elements.dueDateValue.innerText = format(date, date.getFullYear()>CommonUtils.todayDate.getFullYear()?'MMM d yyyy': 'MMM d');
    Elements.selectDueDatebutton.dataset.dueDate = format(date,'MM/dd/yyyy');
    Elements.dueDateValue.dataset.dueDate = format(date,'MM/dd/yyyy');
}