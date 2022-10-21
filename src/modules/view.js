import * as Elements from './domElements';
import * as ProjectUtils from './projectUtils';
import * as ModalUtils from './modalOverlayUtils';
import * as CommonUtils from './commonUtils';
import * as Controller from './controller';
import * as EventListeners from './eventListeners';
import {format} from 'date-fns';

export function loadPage(projectList){
    Elements.inboxTaskCount.innerText = projectList.find(project=> project.name==='Inbox').tasks.filter(task=>!task.complete).length;
    Elements.todayTaskCount.innerText = projectList.find(project=> project.name==='Today').tasks.filter(task=>!task.complete).length;
    Elements.inboxElement.dataset.projectId = projectList.find(project=> project.name==='Inbox').id;

    Elements.todayElement.dataset.projectId = projectList.find(project=> project.name==='Today').id;
    Elements.inboxTaskCount.dataset.projectId = projectList.find(project=> project.name==='Inbox').id;
    Elements.todayTaskCount.dataset.projectId = projectList.find(project=> project.name==='Today').id;

    Elements.todayDateText.innerHTML = format(CommonUtils.todayDate,'dd');
    ProjectUtils.populateProjects(projectList.slice(2));
    ModalUtils.updateProjectDropdownList(projectList.slice(2));
    ProjectUtils.renderProjectContent(Controller.getCurrentProject());
    EventListeners.addEventListeners();
}