import{Project , projectStatus} from  '../models/project.js'

type listner<T> = (item: T[]) => void;

class Status<T> {
  protected listner: listner<T>[] = [];

  addListener(listnerFn: listner<T>) {
    this.listner.push(listnerFn);
  }
}

export class Projectstatus extends Status<Project> {
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

export const projectstatus = Projectstatus.getInstance();

