/// <reference path="component.ts" />
namespace App{
//ProjectItem

export class ProjectItem
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
}