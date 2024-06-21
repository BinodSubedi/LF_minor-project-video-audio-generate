export class ImageDraw {
  imageNaturalHeight: number;
  imageNaturalWidth: number;

  imageRBGADataArr: number[] | undefined;

  constructor(input: {
    imageNaturalHeight: number;
    imageNaturalWidth: number;
  }) {
    this.imageNaturalHeight = input.imageNaturalHeight;
    this.imageNaturalWidth = input.imageNaturalWidth;

    //making the pixel size perfectly divisible by 3, both height and width;

    this.imageNaturalHeight -= this.imageNaturalHeight % 3;
    this.imageNaturalWidth -= this.imageNaturalWidth % 3;
  }

  // This is a 3*3 grid array matrix comparison, where all pixel values are averaged, and these grids are non-overlapping
  averageResize(ctx: CanvasRenderingContext2D) {

    console.log('height and width::',this.imageNaturalHeight,this.imageNaturalWidth)
    for (let i = 0; i <= this.imageNaturalWidth; i += 3) {
      for (let j = 0; j <= this.imageNaturalHeight; j += 3) {

        console.log('i,j::',i,j)
        const firstRowData = ctx.getImageData(i, j, 3, 1).data;
        const secondRowData = ctx.getImageData(i + 1, j, 3, 1).data;
        const lastRowData = ctx.getImageData(i + 2, j, 3, 1).data;

        //Now average values of [r,g,b,a] and we could finally average too, by again dividing every element by 3

        const rowWiseRGBA: number[][] = [];

        //first row

        for (let iter = 0; iter < 12; iter += 4) {
          // const pixelValue =
          //   (firstRow[iter + 3] / 255) *
          //   ((firstRow[iter] + firstRow[iter + 1] + firstRow[iter + 2]) / 3);

          if (rowWiseRGBA[0] == undefined) {
            rowWiseRGBA[0] = [0, 0, 0, 0];
          }

          rowWiseRGBA[0][0] += firstRowData[iter];
          rowWiseRGBA[0][1] += firstRowData[iter + 1];
          rowWiseRGBA[0][2] += firstRowData[iter + 2];
          rowWiseRGBA[0][3] += firstRowData[iter + 3];
        }

        //for second-row
        for (let iter = 0; iter < 12; iter += 4) {
          // const pixelValue =
          //   (secondRow[iter + 3] / 255) *
          //   ((secondRow[iter] + secondRow[iter + 1] + secondRow[iter + 2]) /
          //     3);

          if (rowWiseRGBA[1] == undefined) {
            rowWiseRGBA[1] = [0, 0, 0, 0];
          }

          rowWiseRGBA[1][0] += secondRowData[iter];
          rowWiseRGBA[1][1] += secondRowData[iter + 1];
          rowWiseRGBA[1][2] += secondRowData[iter + 2];
          rowWiseRGBA[1][3] += secondRowData[iter + 3];
        }

        //for final-row
        for (let iter = 0; iter < 12; iter += 4) {
          if (rowWiseRGBA[2] == undefined) {
            rowWiseRGBA[2] = [0, 0, 0, 0];
          }

          rowWiseRGBA[2][0] += lastRowData[iter];
          rowWiseRGBA[2][1] += lastRowData[iter + 1];
          rowWiseRGBA[2][2] += lastRowData[iter + 2];
          rowWiseRGBA[2][3] += lastRowData[iter + 3];
        }

        //Now aggregating the whole value

        const finalAggregatedValue: number[] = [0, 0, 0, 0];

        //   for(let i=0; i< 4; i++){

        //     finalAggregatedValue[i]+=

        //   }

        finalAggregatedValue[0] +=
          (rowWiseRGBA[0][0] + rowWiseRGBA[1][0] + rowWiseRGBA[2][0])/9;
        finalAggregatedValue[1] +=
          (rowWiseRGBA[0][1] + rowWiseRGBA[1][1] + rowWiseRGBA[2][1])/9;
        finalAggregatedValue[2] +=
          (rowWiseRGBA[0][2] + rowWiseRGBA[1][2] + rowWiseRGBA[2][2])/9;
        finalAggregatedValue[3] +=
          (rowWiseRGBA[0][3] + rowWiseRGBA[1][3] + rowWiseRGBA[2][3])/9;

        //   if(i<3){
        //   console.log(finalAggregatedValue)
        //   }

        if (this.imageRBGADataArr == undefined) {
          this.imageRBGADataArr = [];
        }

        // this.imageRBGADataArr = [
        //   ...this.imageRBGADataArr,
        //   ...finalAggregatedValue,
        // ];



        this.imageRBGADataArr.push(...finalAggregatedValue)
      }
    }

    console.log(this.imageRBGADataArr);

  }
}