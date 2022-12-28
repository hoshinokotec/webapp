//DrugandDrop
interface Dragable {
  drugStartHandler(event: DragEvent): void;
  drugEndHundler(event: DragEvent): void;
}

interface Dragtarget {
  dragOverHundler(event: DragEvent): void;
  drophundler(event: DragEvent): void;
  dragLeaveHundler(event: DragEvent): void;
}

enum projectStatus {
  Finished,
  Active,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public manday: number,
    public status: projectStatus
  ) {}
}

type listner<T> = (item: T[]) => void;

class Status<T> {
  protected listner: listner<T>[] = [];

  addListener(listnerFn: listner<T>) {
    this.listner.push(listnerFn);
  }
}

class Projectstatus extends Status<Project> {
  private project: Project[] = [];
  private static instance: Projectstatus;

  private constructor() {
    super();
  }
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Projectstatus();
    return this.instance;
  }

  addProjects(title: string, descriptor: string, manday: number) {
    const newProject = new Project(
      Math.random.toString(),
      title,
      descriptor,
      manday,
      projectStatus.Active
    );
    this.project.push(newProject);
    this.UpdateListenrs();
  }
  moveProjcts(projectid : string , newstatus :projectStatus){
    const project = this.project.find(prj => prj.id === projectid);
    if(project && project.status !== newstatus){
      project.status = newstatus;
      this.UpdateListenrs();
    }
  }
  private UpdateListenrs(){
    for (const listenrFn of this.listner) {
      listenrFn(this.project.slice());
    }
  }
}

const projectstatus = Projectstatus.getInstance();

// validate interface
interface validate {
  value: string | number;
  required?: boolean;
  minlength?: number;
  maxlength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: validate) {
  let isvalid = true;
  if (validatableInput.required) {
    isvalid = isvalid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minlength != null &&
    typeof validatableInput.value === "string"
  ) {
    isvalid =
      isvalid && validatableInput.value.length >= validatableInput.minlength;
  }
  if (
    validatableInput.maxlength != null &&
    typeof validatableInput.value === "string"
  ) {
    isvalid =
      isvalid && validatableInput.value.length <= validatableInput.maxlength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isvalid = isvalid && validatableInput.value >= validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isvalid = isvalid && validatableInput.value <= validatableInput.max;
  }
  return isvalid;
}

// autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

//Project Component Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateid: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateid
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attach(insertAtStart);
  }

  abstract configure(): void;
  abstract rendercontent(): void;

  private attach(insertBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertBeginning ? "afterbegin" : "beforeend",
      this.element
    );
  }
}
//ProjectItem

class ProjectItem
  extends Component<HTMLUListElement, HTMLElement>
  implements Dragable
{
  private project: Project;
  get manday() {
    if (this.project.manday < 20) {
      return this.project.manday.toString() + "人日";
    } else {
      return (this.project.manday / 20).toString() + "人月";
    }
  }
  constructor(hostid: string, project: Project) {
    super("single-project", hostid, true, project.id);
    this.project = project;
    this.configure();
    this.rendercontent();
  }
  @autobind
  drugStartHandler(event: DragEvent){
    event.dataTransfer!.setData('text/plain',this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }
  drugEndHundler(_: DragEvent){
    console.log('ドラッグ完了');
  };


  configure(): void {
    this.element.addEventListener('dragstart',this.drugStartHandler);
    this.element.addEventListener('dragend',this.drugEndHundler)
  }

  rendercontent(): void {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.manday;
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

//ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements Dragtarget{
  assinedProjects: Project[];
  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assinedProjects = [];
    this.configure();
    this.rendercontent();
  }

  @autobind
  dragOverHundler(event : DragEvent):void{
    if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
      event.preventDefault()
      const EventUl = this.element.querySelector('ul')!;
      EventUl.classList.add('droppable')
    }
  }
  @autobind
  drophundler(event : DragEvent):void{
    const PrID = (event.dataTransfer!.getData('text/plain'));
    projectstatus.moveProjcts(
      PrID,
      this.type === 'active' ? projectStatus.Active : projectStatus.Finished,
    )
  }

  @autobind
  dragLeaveHundler(_evnent : DragEvent):void{
    const EventUl = this.element.querySelector('ul')!;
    EventUl.classList.remove('droppable')
  }



  configure(): void {
    this.element.addEventListener('dragover',this.dragOverHundler);
    this.element.addEventListener('drop',this.drophundler);
    this.element.addEventListener('dragleave',this.dragLeaveHundler);


    projectstatus.addListener((projects: Project[]) => {
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
    this.element.querySelector("ul")!.id = listid;
    this.element.querySelector("h2")!.textContent =
      this.type === "active" ? "実行中のプロジェクト" : "完了プロジェクト";
  }

  private renderProjects() {
    const ListEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    ListEl.innerHTML = "";
    for (const Prjitem of this.assinedProjects) {
      new ProjectItem(ListEl.id, Prjitem);
    }
  }
}

// ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  mandayInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", false, "user-input");

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.mandayInputElement = this.element.querySelector(
      "#manday"
    ) as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  rendercontent(): void {}

  private getUserIpunt(): [string, string, number] | void {
    const inputtitle = this.titleInputElement.value;
    const inputdescriptor = this.descriptionInputElement.value;
    const inputmanday = this.mandayInputElement.value;
    const titletvalidate: validate = {
      value: inputtitle,
      required: true,
    };
    const descriptvalidate: validate = {
      value: inputdescriptor,
      required: true,
      minlength: 5,
    };
    const mandayvalidate: validate = {
      value: +inputmanday,
      required: true,
      min: 1,
      max: 1000,
    };
    if (
      !validate(titletvalidate) ||
      !validate(descriptvalidate) ||
      !validate(mandayvalidate)
    ) {
      alert("入力値は正しくありません。再度入力して下さい。");
      return;
    } else {
      return [inputtitle, inputdescriptor, +inputmanday];
    }
  }

  private inputclear() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.mandayInputElement.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userinput = this.getUserIpunt();
    if (Array.isArray(userinput)) {
      const [titile, desicript, man] = userinput;
      projectstatus.addProjects(titile, desicript, man);
      this.inputclear();
    }
  }
}

const prjInput = new ProjectInput();
const ac_prjList = new ProjectList("active");
const ed_prjList = new ProjectList("finished");
