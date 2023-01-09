import { Project, projectStatus } from '../models/project.js';
class Status {
    constructor() {
        this.listner = [];
    }
    addListener(listnerFn) {
        this.listner.push(listnerFn);
    }
}
export class Projectstatus extends Status {
    constructor() {
        super();
        this.project = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new Projectstatus();
        return this.instance;
    }
    addProjects(title, descriptor, manday) {
        const newProject = new Project(Math.random.toString(), title, descriptor, manday, projectStatus.Active);
        this.project.push(newProject);
        this.UpdateListenrs();
    }
    moveProjcts(projectid, newstatus) {
        const project = this.project.find(prj => prj.id === projectid);
        if (project && project.status !== newstatus) {
            project.status = newstatus;
            this.UpdateListenrs();
        }
    }
    UpdateListenrs() {
        for (const listenrFn of this.listner) {
            listenrFn(this.project.slice());
        }
    }
}
export const projectstatus = Projectstatus.getInstance();
//# sourceMappingURL=project-state.js.map