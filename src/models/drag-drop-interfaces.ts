
  export interface Dragable {
    drugStartHandler(event: DragEvent): void;
    drugEndHundler(event: DragEvent): void;
  }

  export interface Dragtarget {
    dragOverHundler(event: DragEvent): void;
    drophundler(event: DragEvent): void;
    dragLeaveHundler(event: DragEvent): void;
  }
