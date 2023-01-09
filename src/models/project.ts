namespace App{
  export enum projectStatus {
  Finished,
  Active,
}

export class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public manday: number,
    public status: projectStatus
  ) {}
}
}