import { LightningElement, wire, track} from 'lwc';
import getTasks from '@salesforce/apex/ProjectTaskController.getTasks';
import updateTaskStage from '@salesforce/apex/ProjectTaskController.updateTaskStage';

export default class KanbanBoard extends LightningElement {

    @track stagesWithTasks = [];
    draggedTaskId;
    stages = ['To Do', 'In Progress', 'Done'];

    wiredTasksResult; // store wire response for refresh
    @wire(getTasks)
    wiredTasks({ error, data }) {
        if (data) {
            this.groupTasks(data);
        } else if (error) {
           console.error(error);
        }
    }

    groupTasks(tasks) {
        this.stagesWithTasks = this.stages.map(stage => {
            return {
                stage,
                tasks: tasks.filter(task => task.Stage__c === stage)
            };
        });
    }

    handleDragStart(event) {
        this.draggedTaskId = event.currentTarget.dataset.id;
    }

    handleDragOver(event) {
        event.preventDefault(); // allow drop
    }

    handleDrop(event) {
        event.preventDefault();
        const newStage = event.currentTarget.dataset.stage;

        if (this.draggedTaskId && newStage) {
            updateTaskStage({ taskId: this.draggedTaskId, newStage })
                .then(() => {
                    // refresh data after update
                    return refreshApex(this.wiredTasksResult);
                })
                .then(() => {
                    console.log(`Task moved to ${newStage}`);
                })
                .catch(error => {
                    console.error('Error updating task:', error);
                });
        }
    }
}