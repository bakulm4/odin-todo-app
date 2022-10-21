import * as View from './view';
import * as Model from './model' ;
import * as ProjectUtils from './projectUtils';

function initialize(){
    Model.loadProjectsFromStorage();
    View.loadPage(Model.getProjectList());
}

function addNewProject(projectName){
    const id =  Model.createNewProject(projectName);
    ProjectUtils.addProject(Model.getProjectById(id));
}

function displayProjectDetails(projectId){
    //console.log(`[Controller]>displayProjectDetails, details of ${projectId}: `,Model.getProjectById(projectId) );
    Model.setCurrentProject(projectId);
    ProjectUtils.renderProjectContent(Model.getProjectById(projectId));
}

function addUpdateTask(taskDetails){
    //console.log(`[Controller>addUpdateTask ], task Details: `, taskDetails);
    Model.addOrUpdateTaskToProject({
        name:taskDetails.name,
        description:taskDetails.description,
        dueDate:taskDetails.dueDate,
        priority:taskDetails.priority,
        id:taskDetails.id
    }, taskDetails.project);
    updateProjectTaskCount();
    ProjectUtils.renderProjectContent(Model.getCurrentProject());
};

function getCurrentProject(){
    return Model.getCurrentProject();
}

function getProjectOfTask(taskId){
    return Model.getProjectOfTask(taskId);
}

function deleteTask(taskId){
    Model.deleteTask(taskId);
}

function updateProjectTaskCount(){
    const projectList = Model.getProjectList().map(project => ({id:project.id, taskCount:project.tasks.filter(task=>!task.complete).length}));
    ProjectUtils.updateProjectTaskCount(projectList);
}

function completeTask(taskId){
    Model.completeTask(taskId);
    updateProjectTaskCount();
}

function editProjectName({projectId,projectName}){
    Model.editProjectName({projectId,projectName});
}

function deleteProject(projectId){
    Model.deleteProject(projectId);
}

export {
    initialize,
    addNewProject,
    displayProjectDetails, 
    addUpdateTask, 
    getCurrentProject, 
    getProjectOfTask, 
    deleteTask,
    completeTask,
    editProjectName, 
    deleteProject
};


