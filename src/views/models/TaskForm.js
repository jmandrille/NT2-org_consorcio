class TaskForm{
    constructor(){
        this.name=null;
        this.detail=null;
        this.category = null;
        this.state="SOLICITADO";
        this.creationDate = null;
        this.assignedUserID = null;
    }
}

module.exports = TaskForm