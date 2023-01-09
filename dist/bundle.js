"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    let projectStatus;
    (function (projectStatus) {
        projectStatus[projectStatus["Finished"] = 0] = "Finished";
        projectStatus[projectStatus["Active"] = 1] = "Active";
    })(projectStatus = App.projectStatus || (App.projectStatus = {}));
    class Project {
        constructor(id, title, description, manday, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.manday = manday;
            this.status = status;
        }
    }
    App.Project = Project;
})(App || (App = {}));
var App;
(function (App) {
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
            const newProject = new App.Project(Math.random.toString(), title, descriptor, manday, App.projectStatus.Active);
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
    App.Projectstatus = Projectstatus;
    App.projectstatus = Projectstatus.getInstance();
})(App || (App = {}));
var App;
(function (App) {
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
    App.validate = validate;
})(App || (App = {}));
var App;
(function (App) {
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
    App.autobind = autobind;
})(App || (App = {}));
var App;
(function (App) {
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
    App.Component = Component;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectItem extends App.Component {
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
        App.autobind
    ], ProjectItem.prototype, "drugStartHandler", null);
    App.ProjectItem = ProjectItem;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectInput extends App.Component {
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
            if (!App.validate(titletvalidate) ||
                !App.validate(descriptvalidate) ||
                !App.validate(mandayvalidate)) {
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
                App.projectstatus.addProjects(titile, desicript, man);
                this.inputclear();
            }
        }
    }
    __decorate([
        App.autobind
    ], ProjectInput.prototype, "submitHandler", null);
    App.ProjectInput = ProjectInput;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectList extends App.Component {
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
            App.projectstatus.moveProjcts(PrID, this.type === 'active' ? App.projectStatus.Active : App.projectStatus.Finished);
        }
        dragLeaveHundler(_evnent) {
            const EventUl = this.element.querySelector('ul');
            EventUl.classList.remove('droppable');
        }
        configure() {
            this.element.addEventListener('dragover', this.dragOverHundler);
            this.element.addEventListener('drop', this.drophundler);
            this.element.addEventListener('dragleave', this.dragLeaveHundler);
            App.projectstatus.addListener((projects) => {
                const relevantProjects = projects.filter((prj) => {
                    if (this.type === "active") {
                        return prj.status === App.projectStatus.Active;
                    }
                    return prj.status === App.projectStatus.Finished;
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
                new App.ProjectItem(ListEl.id, Prjitem);
            }
        }
    }
    __decorate([
        App.autobind
    ], ProjectList.prototype, "dragOverHundler", null);
    __decorate([
        App.autobind
    ], ProjectList.prototype, "drophundler", null);
    __decorate([
        App.autobind
    ], ProjectList.prototype, "dragLeaveHundler", null);
    App.ProjectList = ProjectList;
})(App || (App = {}));
var App;
(function (App) {
    new App.ProjectInput();
    new App.ProjectList("active");
    new App.ProjectList("finished");
})(App || (App = {}));
//# sourceMappingURL=bundle.js.map