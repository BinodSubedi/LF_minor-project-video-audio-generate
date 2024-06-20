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


    constructor(input:HandInput){

        const {x_start,x_end,y_start,y_end} = input;
        this.x_start = x_start;
        this.x_end = x_end;
        this.y_start = y_start;
        this.y_end = y_end;

    }

}