type SectionXPos ={
    xPosition:number
}

export type HeadInput = {
    x_start:number;
    x_end:number;
    y_start:number;
    y_end:number;
}

export type HeadSectionWise = {
  min: SectionXPos;
  max: SectionXPos;
  yStart:number;
  yEnd:number;
};

export class Head {
  x_start: number;
  x_end: number;
  y_start: number;
  y_end: number;
  xMean?: number;
  yMean?: number;
  mappedSectionedHead: Map<number, HeadSectionWise> | undefined;
  bobHeadIter: number = 0;
  mediaRecorder?: any;
  streamArr: Blob[] | undefined;
  exported: boolean = false;

  constructor(input: HeadInput) {
    const { x_start, x_end, y_start, y_end } = input;
    this.x_start = x_start;
    this.x_end = x_end;
    this.y_start = y_start;
    this.y_end = y_end;
  }

  bobHead(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    //last to first as we will move hand in the clock-wise direction first
    // and we don not want any pixel override problem

    if (this.streamArr == undefined) {
      this.streamArr = [];

      const stream = canvas.captureStream();
      this.mediaRecorder = new MediaRecorder(stream);
    }

    this.mediaRecorder.ondataavailable = (e: any) => {
      if (e.data.size > 0) {
        this.streamArr?.push(e.data);

        // console.log(this.streamArr)

        const recordedBlob = new Blob(this.streamArr, { type: "video/webm" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(recordedBlob);
        link.download = "bob-head.webm";
        link.click();
        URL.revokeObjectURL(link.href);
      }
    };

    if (this.mediaRecorder.state == "inactive") {
      this.mediaRecorder?.start();
    }

    // console.log(this.mappedSectionedHead);

    if (this.bobHeadIter < 25 || this.bobHeadIter > 50) {
      for (let i = 10; i > 0; i--) {
        const focusedSection = this.mappedSectionedHead!.get(i);

        //   let xDisplacementFactor;

        //   if(i == 10){
        //     xDisplacementFactor = 0;
        //   }else{

        let xDisplacementFactor = Math.ceil(5 / i);
        let yDisplacementFactor = 0.5;

        if (this.bobHeadIter > 80) {
          if (!this.exported) {
            this.exported = true;
            this.mediaRecorder!.stop();
          }

          return;
        }

        this.bobHeadIter++;

        //   }

        // const median = (focusedSection!.max.xPosition + focusedSection!.min.xPosition)/2

        //Again even in the small sections we are going from prefered edge direction[Now being closest to clock-wise direction]

        for (let h = focusedSection!.yEnd; h > focusedSection!.yStart; h--) {
          for (
            let w = focusedSection!.max.xPosition;
            w > focusedSection!.min.xPosition;
            w--
          ) {
            const currentImageData = ctx.getImageData(w, h, 1, 1);
            const replacingImageData = ctx.getImageData(0, 0, 1, 1);

            ctx.putImageData(
              currentImageData,
              w + xDisplacementFactor,
              h + yDisplacementFactor
            );
            ctx.putImageData(replacingImageData, w, h);

            if (i == 10) {
              ctx.putImageData(
                currentImageData,
                w + xDisplacementFactor,
                h + 2 * yDisplacementFactor
              );
            }
          }
        }

        const { min, max, yStart, yEnd } = focusedSection!;

        this.mappedSectionedHead!.set(i, {
          min: { xPosition: min.xPosition + xDisplacementFactor },
          max: { xPosition: max.xPosition + xDisplacementFactor },
          yStart: yStart + yDisplacementFactor,
          yEnd: yEnd + yDisplacementFactor,
        });
      }
    } else {
      console.log("checking");

      for (let i = 1; i < 11; i++) {
        const focusedSection = this.mappedSectionedHead!.get(i);

        //   let xDisplacementFactor;

        //   if(i == 10){
        //     xDisplacementFactor = 0;
        //   }else{

        let xDisplacementFactor = -Math.ceil(5 / i);
        let yDisplacementFactor = -0.5;

        // if(this.bobHeadIter == 50){
        //     this.bobHeadIter = 0;
        // }

        //   if (this.bobHeadIter > 25) {

        //     xDisplacementFactor *= -1;
        //     yDisplacementFactor *= -1;
        //     return;

        //   }

        this.bobHeadIter++;

        //   }

        // const median = (focusedSection!.max.xPosition + focusedSection!.min.xPosition)/2

        //Again even in the small sections we are going from prefered edge direction[Now being closest to clock-wise direction]

        for (let h = focusedSection!.yStart; h < focusedSection!.yEnd; h++) {
          for (
            let w = focusedSection!.min.xPosition;
            w < focusedSection!.max.xPosition;
            w++
          ) {
            const currentImageData = ctx.getImageData(w, h, 1, 1);
            const replacingImageData = ctx.getImageData(0, 0, 1, 1);

            // we need to move the pixel in both x and y direction as to make it look like waving so,
            // might need to check in later for improvements

            //  if(w < median){

            //     if(i <= 5){
            //     ctx.putImageData(currentImageData, w - xDisplacementFactor, h- yDisplacementFactor);
            //     }else{
            //     ctx.putImageData(currentImageData, w + xDisplacementFactor, h+ yDisplacementFactor);
            //     }
            //  }else{

            //     if(i<=5){
            //     ctx.putImageData(currentImageData, w - xDisplacementFactor, h- yDisplacementFactor);
            //     }else{
            //     ctx.putImageData(currentImageData, w + xDisplacementFactor, h+ yDisplacementFactor);
            //     }

            //  }

            ctx.putImageData(
              currentImageData,
              w + xDisplacementFactor,
              h + yDisplacementFactor
            );
            ctx.putImageData(replacingImageData, w, h);
          }
        }

        const { min, max, yStart, yEnd } = focusedSection!;

        this.mappedSectionedHead!.set(i, {
          min: { xPosition: min.xPosition + xDisplacementFactor },
          max: { xPosition: max.xPosition + xDisplacementFactor },
          yStart: yStart + yDisplacementFactor,
          yEnd: yEnd + yDisplacementFactor,
        });
      }
    }
  }
}