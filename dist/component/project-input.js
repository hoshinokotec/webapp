var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '../component/component.js';
import { autobind } from '../decorater/autobind.js';
import * as Validate from '../util/validater.js';
import { projectstatus } from '../state/project-state.js';
export class ProjectInput extends Component {
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
        if (!Validate.validate(titletvalidate) ||
            !Validate.validate(descriptvalidate) ||
            !Validate.validate(mandayvalidate)) {
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
//# sourceMappingURL=project-input.js.map