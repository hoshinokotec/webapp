export var projectStatus;
(function (projectStatus) {
    projectStatus[projectStatus["Finished"] = 0] = "Finished";
    projectStatus[projectStatus["Active"] = 1] = "Active";
})(projectStatus || (projectStatus = {}));
export class Project {
    constructor(id, title, description, manday, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.manday = manday;
        this.status = status;
    }
}
//# sourceMappingURL=project.js.map