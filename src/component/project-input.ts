/// <reference path="component.ts" />
namespace App{
// ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
}