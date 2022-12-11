enum projectStatus {
  Finished , Active
}


class Project {
  constructor (
    public id : string ,
    public title :string ,
    public description : string ,
    public manday : number ,
    public status : projectStatus
  ){}
}

type listner = (item:Project[]) => void ;

class Projectstatus {
  private listner :  listner []  = [];
  private project : Project [] = [];
  private static instance = new Projectstatus;

  private constructor (){
  }
  static getInstance (){
    if (this.instance){
      return this.instance
    }
    this.instance = new Projectstatus;
    return this.instance;
  }

  addlistener (listnerFn : listner ){
    this.listner.push(listnerFn);
  }


  addProjects(title : string , descriptor : string , manday : number ){
    const newProject = new Project (
      Math.random.toString(),
      title,
      descriptor,
      manday,
      projectStatus.Active
    );
    this.project.push(newProject);
    for(const listenrFn of this.listner ){
      listenrFn(this.project.slice())
    }
  }
}

const projectstatus  = Projectstatus.getInstance();

// validate interface
interface validate {
  value : string | number;
  required? : boolean;
  minlength? : number;
  maxlength? : number;
  min? : number;
  max? : number
}

function validate(validatableInput : validate){

  let isvalid = true;
  if (validatableInput.required){
    isvalid = isvalid && validatableInput.value.toString().trim().length !== 0;
   }
  if (
    validatableInput.minlength != null  &&
    typeof validatableInput.value === 'string'
  ){
    isvalid = isvalid && validatableInput.value.length >= validatableInput.minlength; 
  }
  if (
    validatableInput.maxlength != null  &&
    typeof validatableInput.value === 'string'
  ){
    isvalid = isvalid && validatableInput.value.length <= validatableInput.maxlength; 
  }
  if (
    validatableInput.min != null  &&
    typeof validatableInput.value === 'number'
  ){
    isvalid = isvalid && validatableInput.value >= validatableInput.min; 
  }
  if (
    validatableInput.max != null  &&
    typeof validatableInput.value === 'number'
  ){
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

//ProjectList Class
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assinedProjects : Project[] ;
  constructor(private type : 'active' | 'finished') {
    this.templateElement = document.getElementById(
      'project-list',
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    this.assinedProjects = [];
    const importedNode = document.importNode(
      this.templateElement.content,
      true,
    );
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`
    projectstatus.addlistener((projects : Project[]) => {
      this.assinedProjects = projects ;
      this.renderProjects();
    })
    this.attach()
    this.rendercontent()
}

private attach() {
  this.hostElement.insertAdjacentElement('beforeend', this.element);

}

private renderProjects(){
  const ListEl = document.getElementById( `${this.type}-projects-list`)! as HTMLUListElement
  for (const Prjitem of this.assinedProjects){
  const Listitem =document.createElement('li');
  Listitem.textContent = Prjitem.title;
  ListEl.appendChild(Listitem);
  }
}

private rendercontent(){
  const listid = `${this.type}-projects-list`
  this.element.querySelector('ul')!.id=listid
  this.element.querySelector('h2')!.textContent=
   this.type === "active"  ? '実行中のプロジェクト' : '完了プロジェクト';
 }
}

// ProjectInput Class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  mandayInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      'project-input',
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true,
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';

    this.titleInputElement = this.element.querySelector(
      '#title',
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      '#description',
    ) as HTMLInputElement;
    this.mandayInputElement = this.element.querySelector(
      '#manday',
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private getUserIpunt ():[string ,string ,number] | void {
  const inputtitle = this.titleInputElement.value;
  const inputdescriptor = this.descriptionInputElement.value;
  const inputmanday = this.mandayInputElement.value;
  const titletvalidate :validate = {
    value : inputtitle ,
    required : true ,
  }
  const descriptvalidate :validate = {
    value : inputdescriptor ,
    required : true ,
    minlength : 5 ,
  }
  const mandayvalidate :validate = {
    value : +inputmanday ,
    required : true ,
    min : 1 ,
    max : 1000 ,
  }
  if (
    !validate(titletvalidate) ||
    !validate(descriptvalidate)||
    !validate(mandayvalidate)
    ){
        alert("入力値は正しくありません。再度入力して下さい。")
        return;
    }else{
      return [inputtitle,inputdescriptor,+inputmanday];
    }
  }

  private inputclear(){
    this.titleInputElement.value = ""
    this.descriptionInputElement.value = ""
    this.mandayInputElement.value = ""
  }


  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userinput =this.getUserIpunt();
    if (Array.isArray(userinput)){
      const [titile,desicript ,man] = userinput;
      projectstatus.addProjects(titile,desicript,man);
      this.inputclear()
    }
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const prjInput = new ProjectInput();
const ac_prjList = new ProjectList('active');
const ed_prjList = new ProjectList('finished');
