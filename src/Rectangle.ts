type GradKey = {
  xPosition: number;
  yPosition: number;
};

type GradUnit = {
  xGrad: number;
  yGrad: number;
  combinedGrad: number;
};

export type RectangleInput = {
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
  color?: string;
};

export class Rectangle {
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
  color: string = "green";
  private combinedGrad: Map<GradKey,GradUnit> | undefined;

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
    const min_y = Math.min(this.start_y, this.end_y);
    const max_y = Math.max(this.start_y, this.end_y);

    return { min_x, max_x, min_y, max_y };
  }

  createRect(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    const { min_x, max_x, min_y, max_y } = this.minMax_x_and_y();
    ctx.strokeRect(min_x, min_y, max_x - min_x, max_y - min_y);


 const imageData = new ImageData(
      new Uint8ClampedArray([
        0, 255, 0, 255
      ]),
      1,
      1
    );
    if(this.combinedGrad != undefined){
    this.combinedGrad.forEach((val, key) => {
      // console.log('Key::',key);
      // console.log('value::',val)

      if (val.combinedGrad >= 20) {
        // console.log('CobinedGrad::',val.combinedGrad);
        ctx.putImageData(imageData, key.xPosition, key.yPosition);
      }
    });

  }

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

  updateRect(ctx: CanvasRenderingContext2D, input: RectangleInput) {
    const { start_x, start_y, end_x, end_y } = input;

    this.start_x = Math.floor(start_x);
    this.start_y = Math.floor(start_y);
    this.end_x = Math.floor(end_x);
    this.end_y = Math.floor(end_y);

    this.createRect(ctx);
  }

  detectBall(ctx: CanvasRenderingContext2D) {
    console.log("running detectball");
    // Trying to create a perfect rectangle
    // As I am trying to use sobel operator for both
    // x and y axis, so both height and width needs to be
    // perfectly divided by 3

    let { min_x, max_x, min_y, max_y } = this.minMax_x_and_y();

    min_x += 10;
    max_x -= 10;
    min_y += 10;
    max_y -= 10;
    const diffX = max_x - min_x;
    const diffY = max_y - min_y;

    const remainderX = diffX % 3;
    const remainderY = diffY % 3;

    if (remainderX != 0) {
      if (remainderX % 2 == 0) {
        min_x -= remainderX / 2;
        max_x -= remainderX / 2;
      } else {
        min_x -= remainderX;
      }
    }

    if (remainderY != 0) {
      if (remainderY % 2 == 0) {
        min_y -= remainderY / 2;
        max_y -= remainderY / 2;
      } else {
        min_y -= remainderY;
      }
    }

    // Centered the area by creating a sort of padding

    //Now lopping through the x-axis and for each x-asis
    //lopping through all possible down-ward y-axis elements

    let maxDiff = 0;
    // let yGrad = 0;
    // let xGrad=0;

    let gradLedger = new Map<GradKey, GradUnit>();

    console.log("min_x,max_x, min_y, max_y", min_x, max_x, min_y, max_y);

    for (let i = min_x; i < max_x; i += 1) {
      for (let j = min_y; j < max_y; j += 1) {
        const firstRow = ctx.getImageData(i, j, 3, 1).data;
        const secondRow = ctx.getImageData(i, j + 1, 3, 1).data;
        const lastRow = ctx.getImageData(i, j + 2, 3, 1).data;

        // const xGrad = (-1 *((firstRow[4]/255)*(firstRow[0]+firstRow[1]+firstRow[2])))

        let xGrad = 0;
        let yGrad = 0;

        let xMultiplyer = 0;
        let yMultiplyer = 0;

        //for first row specifically
        for (let iter = 0; iter < 12; iter += 4) {
          if (iter < 4) {
            xMultiplyer = -1;
            yMultiplyer = -1;
          } else if (iter < 8) {
            xMultiplyer = 0;
            yMultiplyer = -2;
          } else {
            xMultiplyer = 1;
            yMultiplyer = -1;
          }

          const pixelValue =
            (firstRow[iter + 3] / 255) *
            ((firstRow[iter] + firstRow[iter + 1] + firstRow[iter + 2]) / 3);

          xGrad += xMultiplyer * pixelValue;
          yGrad += yMultiplyer * pixelValue;
        }

        //for second-row
        for (let iter = 0; iter < 12; iter += 4) {
          if (iter < 4) {
            xMultiplyer = -2;
            yMultiplyer = 0;
          } else if (iter < 8) {
            xMultiplyer = 0;
            yMultiplyer = 0;
          } else {
            xMultiplyer = 2;
            yMultiplyer = 0;
          }

          const pixelValue =
            (secondRow[iter + 3] / 255) *
            ((secondRow[iter] + secondRow[iter + 1] + secondRow[iter + 2]) / 3);

          xGrad += xMultiplyer * pixelValue;
          yGrad += yMultiplyer * pixelValue;
        }

        //for final-row
        for (let iter = 0; iter < 12; iter += 4) {
          if (iter < 4) {
            xMultiplyer = -1;
            yMultiplyer = 1;
          } else if (iter < 8) {
            xMultiplyer = 0;
            yMultiplyer = 2;
          } else {
            xMultiplyer = 1;
            yMultiplyer = 1;
          }

          const pixelValue =
            (lastRow[iter + 3] / 255) *
            ((lastRow[iter] + lastRow[iter + 1] + lastRow[iter + 2]) / 3);

          xGrad += xMultiplyer * pixelValue;
          yGrad += yMultiplyer * pixelValue;
        }

        const combinedGrad = Math.sqrt(xGrad ** 2 + yGrad ** 2);
        // console.log(combinedGrad)
        gradLedger.set(
          { xPosition: i + 1, yPosition: j + 1 },
          { xGrad, yGrad, combinedGrad }
        );

        // console.log('xGrad::', xGrad);
        // console.log('yGrad::', yGrad);

        if (maxDiff < combinedGrad) {
          maxDiff = combinedGrad;
        }
      }
    }

    console.log("maxDiff::", maxDiff);
    // console.log('gradients::',gradLedger)
    this.combinedGrad = gradLedger;

   
  }
}
