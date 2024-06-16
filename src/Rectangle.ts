export type RectangleInput = {
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
  color?:string;
};

export class Rectangle {
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
  color: string = "green";

  constructor(input: RectangleInput) {
    this.start_x = input.start_x;
    this.start_y = input.start_y;
    this.end_x = input.end_x;
    this.end_y = input.end_y;
    this.color = input.color || this.color;
  }

  minMax_x_and_y(): {
    min_x: number;
    max_x: number;
    min_y: number;
    max_y: number;
  } {
    const min_x = Math.min(this.start_x, this.end_x);
    const max_x = Math.max(this.start_x, this.end_x);
    const min_y = Math.min(this.end_y, this.end_y);
    const max_y = Math.max(this.start_y, this.end_y);

    return { min_x, max_x, min_y, max_y };
  }

  createRect(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    const { min_x, max_x, min_y, max_y } = this.minMax_x_and_y();
    // console.log('drawing nowwww')
    ctx.strokeRect(min_x, min_y, max_x - min_x, max_y - min_y);
  }

  hasBeenUpdated(input: RectangleInput): boolean {
    const { start_x, start_y, end_x, end_y } = input;

    if (
      start_x != this.start_x ||
      start_y != this.start_y ||
      end_x != this.end_x ||
      end_y != this.end_y
    ) {
      return true;
    }

    return false;
  }

  updateRect(ctx: CanvasRenderingContext2D, input:RectangleInput) {
    const { start_x, start_y, end_x, end_y } = input;

    this.start_x = start_x;
    this.start_y = start_y;
    this.end_x = end_x;
    this.end_y = end_y;

    this.createRect(ctx);


  }
}
