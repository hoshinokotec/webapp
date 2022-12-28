"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var projectStatus;
(function (projectStatus) {
    projectStatus[projectStatus["Finished"] = 0] = "Finished";
    projectStatus[projectStatus["Active"] = 1] = "Active";
})(projectStatus || (projectStatus = {}));
class Project {
    constructor(id, title, description, manday, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.manday = manday;
        this.status = status;
    }
}
class Status {
    constructor() {
        this.listner = [];
    }
    addListener(listnerFn) {
        this.listner.push(listnerFn);
    }
}
class Projectstatus extends Status {
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
const projectstatus = Projectstatus.getInstance();
function validate(validatableInput) {
    let isvalid = true;
    if (validatableInput.required) {
        isvalid = isvalid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minlength != null &&
        typeof validatableInput.value === "string") {
        isvalid =
            isvalid && validatableInput.value.length >= validatableInput.minlength;
    }
    if (validatableInput.maxlength != null &&
        typeof validatableInput.value === "string") {
        isvalid =
            isvalid && validatableInput.value.length <= validatableInput.maxlength;
    }
    if (validatableInput.min != null &&
        typeof validatableInput.value === "number") {
        isvalid = isvalid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null &&
        typeof validatableInput.value === "number") {
        isvalid = isvalid && validatableInput.value <= validatableInput.max;
    }
    return isvalid;
}
function autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}
class Component {
    constructor(templateid, hostElementId, insertAtStart, newElementId) {
        this.templateElement = document.getElementById(templateid);
        this.hostElement = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    attach(insertBeginning) {
        this.hostElement.insertAdjacentElement(insertBeginning ? "afterbegin" : "beforeend", this.element);
    }
}
class ProjectItem extends Component {
    constructor(hostid, project) {
        super("single-project", hostid, true, project.id);
        this.project = project;
        this.configure();
        this.rendercontent();
    }
    get manday() {
        if (this.project.manday < 20) {
            return this.project.manday.toString() + "人日";
        }
        else {
            return (this.project.manday / 20).toString() + "人月";
        }
    }
    drugStartHandler(event) {
        event.dataTransfer.setData('text/plain', this.project.id);
        event.dataTransfer.effectAllowed = 'move';
    }
    drugEndHundler(_) {
        console.log('ドラッグ完了');
    }
    ;
    configure() {
        this.element.addEventListener('dragstart', this.drugStartHandler);
        this.element.addEventListener('dragend', this.drugEndHundler);
    }
    rendercontent() {
        this.element.querySelector("h2").textContent = this.project.title;
        this.element.querySelector("h3").textContent = this.manday;
        this.element.querySelector("p").textContent = this.project.description;
    }
}
__decorate([
    autobind
], ProjectItem.prototype, "drugStartHandler", null);
class ProjectList extends Component {
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
class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", false, "user-input");
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.mandayInputElement = this.element.querySelector("#manday");
        this.configure();
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    rendercontent() { }
    getUserIpunt() {
        const inputtitle = this.titleInputElement.value;
        const inputdescriptor = this.descriptionInputElement.value;
        const inputmanday = this.mandayInputElement.value;
        const titletvalidate = {
            value: inputtitle,
            required: true,
        };
        const descriptvalidate = {
            value: inputdescriptor,
            required: true,
            minlength: 5,
        };
        const mandayvalidate = {
            value: +inputmanday,
            required: true,
            min: 1,
            max: 1000,
        };
        if (!validate(titletvalidate) ||
            !validate(descriptvalidate) ||
            !validate(mandayvalidate)) {
            alert("入力値は正しくありません。再度入力して下さい。");
            return;
        }
        else {
            return [inputtitle, inputdescriptor, +inputmanday];
        }
    }
    inputclear() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.mandayInputElement.value = "";
    }
    submitHandler(event) {
        event.preventDefault();
        const userinput = this.getUserIpunt();
        if (Array.isArray(userinput)) {
            const [titile, desicript, man] = userinput;
            projectstatus.addProjects(titile, desicript, man);
            this.inputclear();
        }
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
const prjInput = new ProjectInput();
const ac_prjList = new ProjectList("active");
const ed_prjList = new ProjectList("finished");
//# sourceMappingURL=app.js.map