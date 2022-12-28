//DrugandDrop
interface {
  
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

class Status<T>{
  protected listner: listner<T>[] = [];

  addListener (listnerFn: listner<T>){
    this.listner.push(listnerFn)
  }
}

class Projectstatus extends Status<Project> {
  private project: Project[] = [];
  private static instance :Projectstatus;

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
abstract class Component< T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateid: string,
    hostElementId: string,
    insertAtStart:boolean,
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
    if (newElementId){
      this.element.id = newElementId;
    }
    this.attach(insertAtStart)
  }

  abstract configure():void;
  abstract rendercontent():void;

  private attach(insertBeginning :boolean ) {
    this.hostElement.insertAdjacentElement(
      insertBeginning ? 'afterbegin': 'beforeend' ,this.element);
  }
}
//ProjectItem

class ProjectItem extends Component <HTMLUListElement, HTMLElement>{
  private project : Project;
  get manday(){
    if (this.project.manday < 20){
      return this.project.manday.toString() + '人日';
    }else{
      return (this.project.manday/20) .toString() + '人月' ; 
    }
  }
constructor(hostid :string ,  project : Project){
super("single-project",hostid,true,project.id);
this.project = project ;
this.configure();
this.rendercontent();
}
configure(): void {
}

rendercontent(): void {
    this.element.querySelector('h2')!.textContent = this.project.title
    this.element.querySelector('h3')!.textContent = this.manday
    this.element.querySelector('p')!.textContent = this.project.description
}
}


//ProjectList Class
class ProjectList extends Component< HTMLDivElement,HTMLElement >{

  assinedProjects: Project[];
  constructor(private type: "active" | "finished") {
    super('project-list','app',false,`${type}-projects`);
    this.assinedProjects = [];
    this.configure();
    this.rendercontent();
  }
  configure(): void {
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
      new ProjectItem (ListEl.id, Prjitem);
    }
  }
}

// ProjectInput Class
class ProjectInput extends Component<HTMLDivElement,HTMLFormElement>{
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  mandayInputElement: HTMLInputElement;

  constructor() {
    super('project-input','app',false,'user-input');

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

  rendercontent():void{}

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
