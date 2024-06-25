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
    handMoveIter=0;


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

        if(this.handMoveIter == 20){
          return;
        }

        this.handMoveIter++;

        for(let i=1; i< 11; i++){
          const focusedSection = this.sectionedMappedHand?.get(i);

          //Again even in the small sections we are going from prefered edge direction[Now being closest to clock-wise direction]

          for (let w = focusedSection!.xStart; w < focusedSection!.xEnd; w++) {
            // Could have gone from any direction but just for the sake of consistency
            // heigh also traverse from top to bottom

            for (
              let h = focusedSection!.min.yPosition;
              h < focusedSection!.max.yPosition;
              h++
            ) {
              const currentImageData = ctx.getImageData(w, h, 1, 1);
              const replacingImageData = ctx.getImageData(
                w,
                h+1,
                1,
                1
              );

              // we need to move the pixel in both x and y direction as to make it look like waving so,
              // might need to check in later for improvements

              ctx.putImageData(currentImageData, w, h-2);
              ctx.putImageData(replacingImageData,w,h)

            }
          }

          const { min, max, xStart, xEnd } = focusedSection!;

          this.sectionedMappedHand!.set(i, {
            min: {yPosition: min.yPosition - 2},
            max:{yPosition: max.yPosition - 2},
            xStart: xStart,
            xEnd: xEnd,
          });
        }

    }

}