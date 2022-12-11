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
class Projectstatus {
    constructor() {
        this.listner = [];
        this.project = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new Projectstatus;
        return this.instance;
    }
    addlistener(listnerFn) {
        this.listner.push(listnerFn);
    }
    addProjects(title, descriptor, manday) {
        const newProject = new Project(Math.random.toString(), title, descriptor, manday, projectStatus.Active);
        this.project.push(newProject);
        for (const listenrFn of this.listner) {
            listenrFn(this.project.slice());
        }
    }
}
Projectstatus.instance = new Projectstatus;
const projectstatus = Projectstatus.getInstance();
function validate(validatableInput) {
    let isvalid = true;
    if (validatableInput.required) {
        isvalid = isvalid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minlength != null &&
        typeof validatableInput.value === 'string') {
        isvalid = isvalid && validatableInput.value.length >= validatableInput.minlength;
    }
    if (validatableInput.maxlength != null &&
        typeof validatableInput.value === 'string') {
        isvalid = isvalid && validatableInput.value.length <= validatableInput.maxlength;
    }
    if (validatableInput.min != null &&
        typeof validatableInput.value === 'number') {
        isvalid = isvalid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null &&
        typeof validatableInput.value === 'number') {
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
class ProjectList {
    constructor(type) {
        this.type = type;
        this.templateElement = document.getElementById('project-list');
        this.hostElement = document.getElementById('app');
        this.assinedProjects = [];
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${this.type}-projects`;
        projectstatus.addlistener((projects) => {
            this.assinedProjects = projects;
            this.renderProjects();
        });
        this.attach();
        this.rendercontent();
    }
    attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
    renderProjects() {
        const ListEl = document.getElementById(`${this.type}-projects-list`);
        for (const Prjitem of this.assinedProjects) {
            const Listitem = document.createElement('li');
            Listitem.textContent = Prjitem.title;
            ListEl.appendChild(Listitem);
        }
    }
    rendercontent() {
        const listid = `${this.type}-projects-list`;
        this.element.querySelector('ul').id = listid;
        this.element.querySelector('h2').textContent =
            this.type === "active" ? '実行中のプロジェクト' : '完了プロジェクト';
    }
}
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = 'user-input';
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.mandayInputElement = this.element.querySelector('#manday');
        this.configure();
        this.attach();
    }
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
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
const prjInput = new ProjectInput();
const ac_prjList = new ProjectList('active');
const ed_prjList = new ProjectList('finished');
//# sourceMappingURL=app.js.map