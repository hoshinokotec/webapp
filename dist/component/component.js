export class Component {
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
//# sourceMappingURL=component.js.map