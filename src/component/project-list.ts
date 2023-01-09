/// <reference path="component.ts" />
namespace App {
//ProjectList Class
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements Dragtarget{
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
}
