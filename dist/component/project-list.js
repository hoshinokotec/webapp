var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '../component/component.js';
import { autobind } from '../decorater/autobind.js';
import { projectStatus } from '../models/project.js';
import { projectstatus } from '../state/project-state.js';
import { ProjectItem } from './project-item.js';
export class ProjectList extends Component {
    constructor(type) {
        super("project-list", "app", false, `${type}-projects`);
        this.type = type;
        this.assinedProjects = [];
        this.configure();
        this.rendercontent();
    }
    dragOverHundler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const EventUl = this.element.querySelector('ul');
            EventUl.classList.add('droppable');
        }
    }
    drophundler(event) {
        const PrID = (event.dataTransfer.getData('text/plain'));
        projectstatus.moveProjcts(PrID, this.type === 'active' ? projectStatus.Active : projectStatus.Finished);
    }
    dragLeaveHundler(_evnent) {
        const EventUl = this.element.querySelector('ul');
        EventUl.classList.remove('droppable');
    }
    configure() {
        this.element.addEventListener('dragover', this.dragOverHundler);
        this.element.addEventListener('drop', this.drophundler);
        this.element.addEventListener('dragleave', this.dragLeaveHundler);
        projectstatus.addListener((projects) => {
            const relevantProjects = projects.filter((prj) => {
                if (this.type === "active") {
                    return prj.status === projectStatus.Active;
                }
                return prj.status === projectStatus.Finished;
            });
            this.assinedProjects = relevantProjects;
            this.renderProjects();
        });
    }
    rendercontent() {
        const listid = `${this.type}-projects-list`;
        this.element.querySelector("ul").id = listid;
        this.element.querySelector("h2").textContent =
            this.type === "active" ? "実行中のプロジェクト" : "完了プロジェクト";
    }
    renderProjects() {
        const ListEl = document.getElementById(`${this.type}-projects-list`);
        ListEl.innerHTML = "";
        for (const Prjitem of this.assinedProjects) {
            new ProjectItem(ListEl.id, Prjitem);
        }
    }
}
__decorate([
    autobind
], ProjectList.prototype, "dragOverHundler", null);
__decorate([
    autobind
], ProjectList.prototype, "drophundler", null);
__decorate([
    autobind
], ProjectList.prototype, "dragLeaveHundler", null);
//# sourceMappingURL=project-list.js.map