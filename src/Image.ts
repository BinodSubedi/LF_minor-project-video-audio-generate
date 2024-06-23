export class ImageDraw {
  imageNaturalHeight: number;
  imageNaturalWidth: number;

  imageRBGADataArr: number[] | undefined;

  imageRGBDataArrBicubic: number[][] | undefined;

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
  averageResize(ctx: CanvasRenderingContext2D,canvas:HTMLCanvasElement) {

    // console.log('height and width::',this.imageNaturalHeight,this.imageNaturalWidth)
    for (let h = 0; h < this.imageNaturalHeight; h += 3) {

      for (let w = 0; w < this.imageNaturalWidth; w += 3) {

        // console.log('i,j::',i,j)
        const firstRowData = ctx.getImageData(w, h, 3, 1).data;
        const secondRowData = ctx.getImageData(w, h+1, 3, 1).data;
        const lastRowData = ctx.getImageData(w, h+2, 3, 1).data;

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


    console.log('width, height::',Math.floor(this.imageNaturalWidth/3),
      Math.floor(this.imageNaturalHeight/3)
)

    const imageData = new ImageData(
      new Uint8ClampedArray(this.imageRBGADataArr!),
      Math.floor(this.imageNaturalWidth/3),
      Math.floor(this.imageNaturalHeight/3)
    );


    canvas.height = Math.floor(this.imageNaturalHeight/3);
    canvas.width = Math.floor(this.imageNaturalWidth/3);


    ctx.clearRect(0,0,this.imageNaturalWidth +20,this.imageNaturalHeight);
    ctx.putImageData(imageData,0,0);

  }

  // Resizing into larger image with upscaling following bicubic interpolation
  
  bicubicInterpolationResize(ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement,times:number = 2){

    // console.log('height and width::',this.imageNaturalHeight,this.imageNaturalWidth)
    for (let h = 0; h < this.imageNaturalHeight; h += 2) {

      for (let w = 0; w < this.imageNaturalWidth; w += 2) {

        // console.log('i,j::',i,j)
        const firstRowData = ctx.getImageData(w, h, 2, 1).data;
        const secondRowData = ctx.getImageData(w, h+1, 2, 1).data;
        // const lastRowData = ctx.getImageData(w, h+2, 3, 1).data;

        //Now average values of [r,g,b,a] and we could finally average too, by again dividing every element by 3

        const rowWiseRGBA: number[][] = [];

        //first row

        let itterativeIndex = 0;

        for (let iter = 0; iter <= 8; iter += 4) {
          // const pixelValue =
          //   (firstRow[iter + 3] / 255) *
          //   ((firstRow[iter] + firstRow[iter + 1] + firstRow[iter + 2]) / 3);

          if (rowWiseRGBA[0] == undefined) {
            rowWiseRGBA[0] = [0, 0, 0, 0];
          }
          
          if (iter > 4){
            itterativeIndex = 1;
          }

          rowWiseRGBA[itterativeIndex][0] = firstRowData[iter];
          rowWiseRGBA[itterativeIndex][1] = firstRowData[iter + 1];
          rowWiseRGBA[itterativeIndex][2] = firstRowData[iter + 2];
          rowWiseRGBA[itterativeIndex][3] = firstRowData[iter + 3];
        }

        //for second-row

        itterativeIndex = 2

        for (let iter = 0; iter <= 8; iter += 4) {
          // const pixelValue =
          //   (secondRow[iter + 3] / 255) *
          //   ((secondRow[iter] + secondRow[iter + 1] + secondRow[iter + 2]) /
          //     3);

          if (rowWiseRGBA[1] == undefined) {
            rowWiseRGBA[1] = [0, 0, 0, 0];
          }

          if(iter > 4){
            itterativeIndex = 3
          }

          rowWiseRGBA[itterativeIndex][0] += secondRowData[iter];
          rowWiseRGBA[itterativeIndex][1] += secondRowData[iter + 1];
          rowWiseRGBA[itterativeIndex][2] += secondRowData[iter + 2];
          rowWiseRGBA[itterativeIndex][3] += secondRowData[iter + 3];
        }

        // Nested Array for new data

        // Here data are stored serially in (R G B A) format rowWise
        let rowWiseRGBANew: number [][] = []

        const incrementalMultiplyer =  1 / (times + 1)


        //Now itterating over the rowWiseRGBA with respect to finally expected grid size

        //But first we also need to fill up the border pixels so that there won't be any problem in
        //iteration

        //filling in clockwise direction
        // for(let iter = 0; iter < 4; iter++){

          // if(iter = 0){

            for(let iterInner=0; iterInner< (2+times); iterInner++){

              if(iterInner == 0){
                rowWiseRGBANew[0].push(...rowWiseRGBA[0]);
              }else if(iterInner == 1+times){
                rowWiseRGBANew[0].push(...rowWiseRGBA[1])
              }else{

                const firstEdge = rowWiseRGBA[0];
                const lastEdge = rowWiseRGBA[1];

                let finalPixelVal = [0,0,0,0];

                finalPixelVal[0] = firstEdge[0]*incrementalMultiplyer*(times-(iterInner-1)) + lastEdge[0]*incrementalMultiplyer*iterInner
                finalPixelVal[1] = firstEdge[1]*incrementalMultiplyer*(times-(iterInner-1)) + lastEdge[1]*incrementalMultiplyer*iterInner
                finalPixelVal[2] = firstEdge[2]*incrementalMultiplyer*(times-(iterInner-1)) + lastEdge[2]*incrementalMultiplyer*iterInner
                finalPixelVal[3] = firstEdge[3]*incrementalMultiplyer*(times-(iterInner-1)) + lastEdge[3]*incrementalMultiplyer*iterInner


                rowWiseRGBANew[0].push(...finalPixelVal);

              }


            }

          // }else if(iter = 1){

            for(let iterInner=1; iterInner < (2+times); iterInner++){

              if (iterInner == 0) {
                rowWiseRGBANew[1+times].push(...rowWiseRGBA[0]);
              } else if (iterInner == 1 + times) {
                rowWiseRGBANew[1+times].push(...rowWiseRGBA[1]);
              } else {
                const firstEdge = rowWiseRGBA[0];
                const lastEdge = rowWiseRGBA[1];

                let finalPixelVal = [0, 0, 0, 0];

                finalPixelVal[0] =
                  firstEdge[0] *
                    incrementalMultiplyer *
                    (times - (iterInner - 1)) +
                  lastEdge[0] * incrementalMultiplyer * iterInner;
                finalPixelVal[1] =
                  firstEdge[1] *
                    incrementalMultiplyer *
                    (times - (iterInner - 1)) +
                  lastEdge[1] * incrementalMultiplyer * iterInner;
                finalPixelVal[2] =
                  firstEdge[2] *
                    incrementalMultiplyer *
                    (times - (iterInner - 1)) +
                  lastEdge[2] * incrementalMultiplyer * iterInner;
                finalPixelVal[3] =
                  firstEdge[3] *
                    incrementalMultiplyer *
                    (times - (iterInner - 1)) +
                  lastEdge[3] * incrementalMultiplyer * iterInner;

                rowWiseRGBANew[1+times].push(...finalPixelVal);
              }




              
            }

          // }
          


        // }

        
        for(let iter = 0; iter < (2+times); iter++){



        }






        ///////////////////////////////
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


    console.log('width, height::',Math.floor(this.imageNaturalWidth/3),
      Math.floor(this.imageNaturalHeight/3)
)

    const imageData = new ImageData(
      new Uint8ClampedArray(this.imageRBGADataArr!),
      Math.floor(this.imageNaturalWidth/3),
      Math.floor(this.imageNaturalHeight/3)
    );


    canvas.height = Math.floor(this.imageNaturalHeight/3);
    canvas.width = Math.floor(this.imageNaturalWidth/3);


    ctx.clearRect(0,0,this.imageNaturalWidth +20,this.imageNaturalHeight);
    ctx.putImageData(imageData,0,0);



  }


  greenFilter(ctx:CanvasRenderingContext2D){

    for(let w=0; w < this.imageNaturalWidth; w++){
        for(let h=0; h< this.imageNaturalHeight; h++){

            const imageDataOriginal = ctx.getImageData(w,h, 1,1).data;
            
            const manipulatedImageData = [imageDataOriginal[0]*0.299, imageDataOriginal[1]*0.587,imageDataOriginal[2]*0.114,imageDataOriginal[3]];

            const imageData = new ImageData(new Uint8ClampedArray(manipulatedImageData), 1,1);

            ctx.putImageData(imageData, w,h);

        }
    }

  }
}