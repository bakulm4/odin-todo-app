import PubSub from 'pubsub-js';
import {nanoid} from 'nanoid';
import {format} from 'date-fns';
// import { editProjectName } from './controller';

const saveToDoListEvent = 'SAVE PROJECTS';
const loadToDoListEvent = 'PROJECTS LOADED';
const priorityMap = {
    '1': 'P1',
    '2': 'P2',
    '3': 'P3',
    '4': 'P4',
}

let projectList = null ;
let currentProject = null;
const todayDateString = format(new Date(),'MM/dd/yyyy');

function loadProjectsFromStorage(){
    //console.log(`[Model> LoadProjectsFromStorage]: project list before loading from storage`,projectList);
    const data = JSON.parse(localStorage.getItem('todoList'));
    //console.log(`[Model> LoadProjectsFromStorage]: Loaded data from storage:`, data);
    if(!data || data.length===0){
        projectList = [];
        projectList.push({name:'Inbox',id:nanoid(),tasks:[]});
        projectList.push({name:'Today',id:nanoid(),tasks:[]});
    }
    else{
        projectList = data;
        updateTasksDueToday();
    }
    saveProjectsToStorage();
    currentProject = projectList[0];
    PubSub.publish(loadToDoListEvent, data);
    //console.log(`[Model>loadProjectsFromStorage]: todoList:`,projectList );
}

function updateTasksDueToday(){
projectList.find(project=>project.name==='Today').tasks=[];
   projectList.forEach(project=>{
    if(project.name!=='Today'){
        for(let task of project.tasks){
            if(task.dueDate===todayDateString)
                projectList.find(project=>project.name==='Today').tasks.push(task);
        }
    }
   });

}

function saveProjectsToStorage(){
    //console.log(`[Model>SaveProjectsToStorage]: saving todoList:`,projectList );
    localStorage.setItem('todoList',JSON.stringify(projectList));
}

PubSub.subscribe(saveToDoListEvent,saveProjectsToStorage);

function createNewProject(projectName){
    const projectExists = projectList.some(project=> project.name === projectName)
    //console.log(`[Model>createNewProject], does ${projectName} exist? `, projectExists);
    
    if(!projectExists){
        const newProject = {name:projectName,id:nanoid(),tasks:[]};
        projectList.push(newProject);
        //console.log(`[Model>CreateNewProject] Todo List: `, projectList);
        saveProjectsToStorage();
        return newProject.id;
    }
    else{
        //console.log(`[Model>CreateNewProject] ${projectName} already exists`);
        return projectList.find(project=> project.name === projectName).id;
    }
}

function deleteProject(projectId){
    //console.log(`[Model> deleteProject], ${projectId} index is `, projectList.findIndex(project => project.id===projectId) );
    const projectIndex = projectList.findIndex(project => project.id===projectId);
    projectIndex >=0 && projectList.splice(projectIndex,1);
    saveProjectsToStorage();
}

function getProjectList(){
    return projectList;
}

function getProjectById(projectId){
    return projectList.find(project => project.id===projectId);
}

function getProjectByName(projectName){
    return projectList.find(project => project.name===projectName);
}

function getCurrentProject(){
    return currentProject;
}

function getProjectOfTask(taskId){
    return findTaskById(taskId)[1].name;
}

function setCurrentProject(projectId){
    currentProject = projectList.find(project=> project.id === projectId);
}

function findTaskById(taskId){
    if(taskId === null)
        return null;
   for(let project of projectList){
    if(project.name==='Today')
        continue;
    for(let task of project.tasks){
        if(task.id === taskId)
            return [task,project];
    }
   }
   return null
}

function addOrUpdateTaskToProject(taskObject, projectName){
    //console.log(`[Model>addOrUpdateTaskToProject] projectname: ${projectName}, taskObject:`, taskObject);

    taskObject.dueDate = isValidDate(taskObject.dueDate)? taskObject.dueDate : '';

    taskObject.priority = priorityMap[taskObject.priority];
    //console.log(`[Model>addOrUpdateTaskToProject]: taskObject: `, taskObject);

    const project = getProjectByName(projectName);
    if(taskObject.id){
        let [_task,_project] = findTaskById(taskObject.id);
        if(!project|| project.name === _project.name){
            //console.log(`[Model>addOrUpdateTaskToProject], task ${_task.name} remains in same project`);
            Object.assign(_task,taskObject);
        }
        else{
            //console.log(`[Model>addOrUpdateTaskToProject], task ${_task.name} has to be moved from ${_project.name} to ${project.name}`);
            _project.tasks.splice(_project.tasks.findIndex(task=> task.id === taskObject.id),1);
            project.tasks.push(taskObject);
        }
    }
    else{
        //console.log(`[Model>addOrUpdateTaskToProject]. It's a new task. Create one`);
        taskObject.id = nanoid();
        taskObject.complete=false;
        project.tasks.push(taskObject);
    }

    //If task is due today then add it to Today's task list.
    if(taskObject.dueDate===todayDateString)
        projectList.find(project=>project.name==='Today').tasks.push(taskObject);
    
    //console.log(`[Model>addOrUpdateTaskToProject]: updated ProjectList:`, projectList);
    saveProjectsToStorage();
}

function isValidDate(dateString){
    return /^[0-1][0-9]\/[0-3][0-9]\/\d{4}$/.test(dateString);
}

function hasDateYear(dateString){
    return /^[A-Z][a-z]{2} \d{1,2} \d{4}$/.test(dateString);
}

function deleteAllProjects(){
    projectList && console.log(`Model>deleteAllProject]: deleting ${projectList.length} projects`);
    projectList= [];
    //console.log(`[Model>deleteAllProject]: projectList`, projectList);
    saveProjectsToStorage();
}

function deleteTask(taskId){
    const project = projectList.find(project=> project.tasks.some(task => task.id === taskId));
    //console.log(`[Model>deleteTask]: deleting ${findTaskById(taskId)[0].name} from ${project.name}`);
    project.tasks.splice(project.tasks.findIndex(task=>task.id===taskId),1);
    //console.log(`[Model>deleteTask]: updated ProjectList:`, projectList);
    saveProjectsToStorage();
}

function completeTask(taskId){
    findTaskById(taskId)[0].complete=true;
    saveProjectsToStorage();
}

function editProjectName({projectId,projectName}){
    projectList.find(project=> project.id === projectId).name=projectName;
    saveProjectsToStorage();
}

export {
    loadProjectsFromStorage,
    saveProjectsToStorage,
    createNewProject,
    deleteProject,
    getProjectList,
    getProjectByName,
    getProjectById,
    addOrUpdateTaskToProject,
    deleteAllProjects,
    getCurrentProject,
    setCurrentProject,
    deleteTask,
    completeTask,
    getProjectOfTask,
    editProjectName
 };
