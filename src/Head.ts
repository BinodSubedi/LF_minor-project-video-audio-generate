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

export class Head{

    x_start:number;
    x_end:number;
    y_start:number;
    y_end:number;
    xMean?:number;
    yMean?:number;
    mappedSectionedHead:Map<number, HeadSectionWise> | undefined

    constructor(input:HeadInput){

        const {x_start,x_end,y_start,y_end} = input;
        this.x_start = x_start;
        this.x_end = x_end;
        this.y_start = y_start;
        this.y_end = y_end;

    }

    bobHead(ctx:CanvasRenderingContext2D){

    }

}