export type BallFallEnd = {
  // xPositionCurr: number;
  // xpositionNew: number;
  yPositionLimit: number;
  // yPosition:number;
};

export type BallInputRectExtra = {
  rectMax_x: number;
  rectMax_y: number;
  rectMin_x: number;
  rectMin_y: number;
};

export type BallInput = {
  radius: number;
  max_x: number;
  max_y: number;
  min_x: number;
  min_y: number;
  center: number[];
};

export class Ball {
  radius: number;
  max_x: number;
  max_y: number;
  min_x: number;
  min_y: number;
  dx: number = 1;
  dy: number = 1;
  center: number[];
  extra: BallInputRectExtra;

  constructor(input: BallInput, extra: BallInputRectExtra) {
    const { radius, max_x, min_x, max_y, min_y,center } = input;
    this.radius = radius;
    this.max_x = max_x;
    this.max_y = max_y;
    this.min_y = min_y;
    this.min_x = min_x;
    this.center = center;
    this.extra = extra;
  }

  fall(ctx: CanvasRenderingContext2D, fallpoint: BallFallEnd) {
    if (this.max_y >= fallpoint.yPositionLimit) {
      return;
    }

    // console.log('falling')
    // Rendering the movement of the circle/ball
    //through the image
    // Since we don't want previous pixel overiding
    //the existing ball pixel we move pixel from bottom to top
    for(let i=this.max_x; i >=this.min_x; i--){
      for(let j=this.max_y; j >= this.min_y; j--){
        const distance = Math.sqrt((this.center[0] - i)**2 + (this.center[1] - j)**2)
        if(distance <= this.radius){

          //we need to transfer the upper pixel value
          //to lower but we also need to replace the upper pixel
          //with background color
          const imageDataBack = ctx.getImageData(this.min_x,this.min_y, 1,1);
          const imageData = ctx.getImageData(i,j,1,1);
          ctx.putImageData(imageData, i, j+10);
          //now replacing the upper pixel with background pixel
          ctx.putImageData(imageDataBack,i,j);

        }
      }
    }

    //we also need to update the center point as circle also moves
    //for testing we are only going to change the y axis by 1 [increasing by one so it appears as falling]
    
    this.center[1] += 10;
    this.min_y += 10;
    this.max_y +=10;

  }
}
