type SectionYPos = {
    yPosition: number
}

export type HandSectionWise = {
  min: SectionYPos;
  max: SectionYPos;
  xStart:number;
  xEnd:number;
};


export type HandInput = {
    x_start:number;
    x_end:number;
    y_start:number;
    y_end:number;
}

export class Hand{

    x_start:number;
    x_end:number;
    y_start:number;
    y_end:number;
    xMean?:number;
    yMean?:number;
    sectionedMappedHand:Map<number,HandSectionWise> | undefined;


    constructor(input:HandInput){

        const {x_start,x_end,y_start,y_end} = input;
        this.x_start = x_start;
        this.x_end = x_end;
        this.y_start = y_start;
        this.y_end = y_end;

    }

    moveHand(ctx:CanvasRenderingContext2D){

        //last to first as we will move hand in the clock-wise direction first
        // and we don not want any pixel override problem

        for(let i=10; i> 0; i--){
          const focusedSection = this.sectionedMappedHand?.get(i);

          //Again even in the small sections we are going from prefered edge direction[Now being closest to clock-wise direction]

          for (let w = focusedSection!.xEnd; w > focusedSection!.xStart; w--) {
            // Could have gone from any direction but just for the sake of consistency
            // heigh also traverse from top to bottom

            for (
              let h = focusedSection!.max.yPosition;
              h > focusedSection!.min.yPosition;
              h--
            ) {
              const currentImageData = ctx.getImageData(w, h, 1, 1);
              const replacingImageData = ctx.getImageData(
                this.sectionedMappedHand!.get(1)!.xStart,
                this.sectionedMappedHand!.get(1)!.min.yPosition - 5,
                1,
                1
              );

              // we need to move the pixel in both x and y direction as to make it look like waving so,
              // might need to check in later for improvements
              ctx.putImageData(currentImageData, w + 10, h);
              ctx.putImageData(replacingImageData,w,h)
            }
          }

          const { min, max, xStart, xEnd } = focusedSection!;

          this.sectionedMappedHand!.set(i, {
            min: {yPosition: min.yPosition},
            max:{yPosition: max.yPosition},
            xStart: xStart + 10,
            xEnd: xEnd + 10,
          });
        }

    }

}