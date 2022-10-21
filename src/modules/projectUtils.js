import * as Elements from './domElements';
import * as TaskUtils from './taskUtils';
import * as CommonUtils from './commonUtils';
import * as ModalUtils from './modalOverlayUtils';
import * as Controller from './controller';

export function populateProjects(projectList){
    Array.from(Elements.projectList.children).forEach(child => child.remove());
    projectList.forEach(project =>{
        addProject(project);
    });
}

export function addProject(project){
    const projectElement = document.createElement('li');
    projectElement.classList.add('project_list_item','menu_item');
    projectElement.dataset.projectId = project.id;

    const projectNameElement = document.createElement('div');
    projectNameElement.classList.add('menu_item_name');

    const menuItemIconElement = document.createElement('span');
    menuItemIconElement.classList.add('menu_item_icon');
    menuItemIconElement.innerHTML=`<svg width="24" height="24" viewBox="0 0 24 24" class="project_icon"><path d="M12 7a5 5 0 110 10 5 5 0 010-10z" fill="currentColor"></path></svg>`;

    const menuItemLabelElement = document.createElement('span');
    menuItemLabelElement.classList.add('menu_item_label');
    menuItemLabelElement.innerText = project.name;
    menuItemLabelElement.dataset.projectId = project.id;
    projectNameElement.append(menuItemIconElement, menuItemLabelElement);

    const menuItemIconEdit = document.createElement('button');
    menuItemIconEdit.classList.add('menu_item_icon');
    menuItemIconEdit.dataset.tooltip = 'Edit project';
    menuItemIconEdit.innerHTML=`<svg width="24" height="24"><g fill="none" fill-rule="evenodd"><path fill="currentColor" d="M9.5 19h10a.5.5 0 110 1h-10a.5.5 0 110-1z"></path><path stroke="currentColor" d="M4.42 16.03a1.5 1.5 0 00-.43.9l-.22 2.02a.5.5 0 00.55.55l2.02-.21a1.5 1.5 0 00.9-.44L18.7 7.4a1.5 1.5 0 000-2.12l-.7-.7a1.5 1.5 0 00-2.13 0L4.42 16.02z"></path></g></svg>`;
    menuItemIconEdit.addEventListener('click',(event)=> editProject(event,projectElement));
    
    const menuItemIconDelete = document.createElement('button');
    menuItemIconDelete.classList.add('menu_item_icon');
    menuItemIconDelete.dataset.tooltip = 'Delete project';
    menuItemIconDelete.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"></path><rect width="14" height="1" x="5" y="6" fill="currentColor" rx=".5"></rect><path fill="currentColor" d="M10 9h1v8h-1V9zm3 0h1v8h-1V9z"></path><path stroke="currentColor" d="M17.5 6.5h-11V18A1.5 1.5 0 0 0 8 19.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5zm-9 0h7V5A1.5 1.5 0 0 0 14 3.5h-4A1.5 1.5 0 0 0 8.5 5v1.5z"></path></g></svg>`;
    menuItemIconDelete.addEventListener('click',e=>{
        e.stopPropagation();
        ModalUtils.handleDeleteProject(projectElement);
    });

    const menuItemCountElement = document.createElement('div');
    menuItemCountElement.classList.add('menu_item_count');
    menuItemCountElement.innerText = project.tasks.filter(task=>!task.complete).length;
    menuItemCountElement.dataset.projectId = project.id;

    projectElement.append(projectNameElement, menuItemIconEdit,  menuItemIconDelete, menuItemCountElement);
    projectElement.addEventListener('click', e=>{
        e.stopPropagation();
        Controller.displayProjectDetails(project.id);
    });

    Elements.projectList.append(projectElement);
}

export function renderProjectContent(project){

    Elements.projectDetailsTitle.innerText= project.name;
    Elements.getTaskListElements().forEach(element => element.remove());
    Elements.addTaskContainer.style.display = 'block';
    Elements.taskEditorManager.style.display = 'none';
    Elements.addTaskContainer.after( Elements.taskEditorManager);

    project.tasks
        .filter(task=>!task.complete)
        .sort((task1,task2)=>CommonUtils.compareDates(task1.dueDate,task2.dueDate))
        .forEach(task=> {
        TaskUtils.renderTask(task);
    });
}

function editProject(event,element){
    event.stopPropagation();
    element.style.display='none';
    element.after(Elements.projectNameEdit);
    Elements.projectNameEdit.style.display='flex';
    Elements.projectNameEditInput.focus();
    Elements.projectNameEditInput.value=Elements.getProjectName(element);
    Elements.projectNameEditInput.dataset.projectId=element.dataset.projectId;
}

export function resetProjectList(){
    Elements.getLeftMenuItems()
        .filter(element=> element.style.display==='none')
        .forEach(element=>element.style.display='flex');
    
    if(Elements.projectNameEdit.style.display!=='none'){
        Elements.projectNameEdit.style.display='none';
        Elements.projectList.lastChild.after(Elements.projectNameEdit);
    }
}

export function updateProjectTaskCount(projectList){
    //console.log(`[View>updateProjectTaskCount], projectList:`, projectList);
    Elements.projectTaskCountList().forEach(taskCount =>{
        //console.log(`[View>updateProjectTaskCount], current task project ID: `,taskCount.dataset.projectId )
        taskCount.innerText = projectList.find(project => project.id === taskCount.dataset.projectId).taskCount;
    });
}