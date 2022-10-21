
export const toggleMenu = document.querySelector('.left_menu_toggle');
export const leftMenu = document.querySelector('#left_menu');
export const inboxElement = document.querySelector('#filter_inbox');
export const inboxLabel = inboxElement.querySelector('.menu_item_label')
export const inboxTaskCount = inboxElement.querySelector('.menu_item_count');
export const todayElement = document.querySelector('#filter_today');
export const todayLabel = todayElement.querySelector('.menu_item_label')
export const todayTaskCount = todayElement.querySelector('.menu_item_count');
export const projectList = document.querySelector('.project_list'); 
// export const projectItemList = projectList.querySelectorAll('project_list_item');
// export const projectNameList = projectList.querySelectorAll('.menu_item_label');
export const editProjectNameForm = projectList.querySelector('.edit_project_name_form');
export const projectNameEdit = projectList.querySelector('.edit_project_name');
export const projectNameEditInput = projectNameEdit.querySelector('input');
export const todayDateText = document.querySelector('#filter_today tspan');
export const newProjectForm = document.querySelector('[data-new-project-form]');
export const newProjectInput = document.querySelector('[data-new-project-input]');
export const projectDetailsTitle = document.querySelector('#content .view_header_content');
export const taskList = document.querySelector('.items');

export const addTaskContainer = document.querySelector('.add_task_container');
export const addTask = document.querySelector('.add_task_button');
export const taskEditorManager = document.querySelector('#content .manager');
export const taskEditorForm = taskEditorManager.querySelector('.task_editor');
export const taskEditorTitle = taskEditorForm.querySelector('.task_editor_title_field');
export const taskEditorDescription = taskEditorForm.querySelector('.task_editor_description_field');
export const cancelAddEditTaskButton = taskEditorForm.querySelector('.task_area_action_buttons .cancel_edit');
export const saveAddEditTaskButton = taskEditorForm.querySelector('.task_area_action_buttons .save_edit');
export const selectTaskPriorityButton = taskEditorForm.querySelector('button.item_action');
export const taskPriorityIconList = selectTaskPriorityButton.querySelectorAll('[data-icon-name]');
export const priorityDropDown = document.querySelector('.priority_dropdown');
export const priorityPickerItemList = document.querySelectorAll('.priority_picker_item');
export const priorityPickerSelectCheckMarkList = priorityDropDown.querySelectorAll('.dropdown_select_checkmark');
export const selectTaskProjectButton =  taskEditorForm.querySelector('button.item_project_selector');
export const projectSelectionPillText = selectTaskProjectButton.querySelector('.projectSectionPill-text');
export const projectDropDown = document.querySelector('.project_dropdown');
export const projectDropDownListContainer = projectDropDown.querySelector('ul');
export const projectPickerItemList = projectDropDown.querySelectorAll('.project_picker_item');
export const selectDueDatebutton = taskEditorForm.querySelector('button.item_due_selector');
export const dueDateValue = selectDueDatebutton.querySelector('span.date');
export const modalOverlay = document.querySelector('.modal_overlay');
export const datePicker = modalOverlay.querySelector('.date_picker');
export const datePickerHeaderMonth = datePicker.querySelector('.date-picker-header-month');
export const datePickerHeaderActions =  datePicker.querySelector('.date-picker-header-actions');
export const previousMonthButton = datePicker.querySelector('.prev-mth');
export const nextMonthButton = datePicker.querySelector('.next-mth');
export const calendarWeeks = datePicker.querySelector('.calendar_weeks');
export const confirmationDialog = modalOverlay.querySelector('.confirmation-dialog');
export const deleteTaskOrProjectForm = confirmationDialog.querySelector('form');
export const closeDialogButton = deleteTaskOrProjectForm.querySelector('.close');
export const confirmationDialogMessage = deleteTaskOrProjectForm.querySelector('.message>strong');
export const cancelDeleteButton = deleteTaskOrProjectForm.querySelector('footer>button[type="reset"]');
export const submitDeleteButton = deleteTaskOrProjectForm.querySelector('footer>button[type="submit"]');
export const taskDetailsModal = modalOverlay.querySelector('.task_details_modal');
export const closeTaskDetails = taskDetailsModal.querySelector('.task_details_modal_close');
export const taskDetailsTitle = taskDetailsModal.querySelector('.task_details_title');
export const taskDetailsDescription = taskDetailsModal.querySelector('.task_details_description');
export const taskDetailsProjectName = taskDetailsModal.querySelector('.task_details_sidebar_projectname span');
export const taskDetailsDueDate = taskDetailsModal.querySelector('.task_details_sidebar_duedate span');
export const taskDetailsPriorityWrapper = taskDetailsModal.querySelector('.task_details_sidebar_priority');
export const taskDetailsPriority = taskDetailsPriorityWrapper.querySelector('.task_details_sidebar_priority span');
export const taskDetailsPriorityIconList = taskDetailsPriorityWrapper.querySelectorAll('[data-icon-name]');
export const actionCompleteToaster = document.querySelector('#content .toaster');
export const actionCompleteText = actionCompleteToaster.querySelector('.toaster-text');
export const undoActionCompleteButton = actionCompleteToaster.querySelector('.undo-action');
export const closeActionCompleteToasterButton = actionCompleteToaster.querySelector('.close-alert');

export function projectTaskCountList(){
    return Array.from(document.querySelectorAll('.menu_item_count'));
} 

export function getTaskListElements(){
    return Array.from(taskList.querySelectorAll('.task_list_item'));
}

export function getTaskElement(taskId){
    return getTaskListElements().find(taskElement=> taskElement.dataset.taskId === taskId);
}

export function  getLeftMenuItems(){
    return Array.from(document.querySelectorAll('.menu_item'));
} 

export function getLeftMenuItemNames(){
    return Array.from(document.querySelectorAll('.menu_item_label'));
} 

export function getTaskDetails(taskElement){
    return {
        name:taskElement.querySelector('.task_list_item_content span').innerText,
        description: taskElement.querySelector('.task_list_item_content .task_list_item_description ').innerText,
        dueDate:taskElement.querySelector('.task_list_item_content .due_date_controls').dataset.dueDate,
        priority:taskElement.dataset.taskPriority,
        // complete:taskElement.dataset.complete,
        id:taskElement.dataset.taskId
    }
}

export function getTaskElementsWithDueDateDataset(taskElement){
    return Array.from(taskElement.querySelectorAll('[data-due-date]'));
}

export function projectPickerNameList(){
    return Array.from(projectDropDown.querySelectorAll('.project_picker_projectname'));
} 

export function projectPickerCheckMarkList(){
    return Array.from(projectDropDown.querySelectorAll('.dropdown_select_checkmark'));
} 

export function getTaskDueDateTextElement(taskElement){
    return taskElement.querySelector('.due_date_controls .due_date');
}

export function getProjectElementById(projectId){
    return Array.from(document.querySelectorAll('.menu_item')).find(projectElement => projectElement.dataset.projectId === projectId );
}

export function getProjectName(projectElement){
    return projectElement.querySelector('.menu_item_label').innerText;
}

export function getProjectCount(projectId){
    return getProjectElementById(projectId).querySelector('.menu_item_count');
}