import { Ball } from "./Ball";
import { DrawingRectState } from "./Constants";
import { ImageDraw } from "./Image";
import { Rectangle, RectangleInput } from "./Rectangle";
// const imageContainer: HTMLDivElement | null = document.querySelector('.image-container');
const imageSelector: HTMLInputElement | null =
  document.querySelector("#imageSelector");
const imageCanvas: HTMLCanvasElement | null = document.querySelector(".canvas");
const startButton: HTMLButtonElement | null =
  document.querySelector("#start-button");
const fallBallButton: HTMLButtonElement | null =
  document.querySelector("#animate-button");

const animationStyleElement: HTMLSelectElement | null = document.querySelector('#animation-style');

const resizeButton: HTMLButtonElement | null = document.querySelector('#resize-button')

const greenFilterButton:HTMLButtonElement | null = document.querySelector('#greenFilter-button')

const ctx = imageCanvas!.getContext("2d", { willReadFrequently: true });

const imageDimensions:{imageNaturalWidth:number, imageNaturalHeight:number} = { imageNaturalWidth: 0, imageNaturalHeight: 0 };

let canvasImageSource: HTMLImageElement | undefined = undefined;

type RectangleArrUnit = {
  main: Rectangle;
  temp: RectangleInput;
};

let rectangleLimit: number = 1;

enum AnimationSelection {
  FallingBall,
  BallStriking,
  MovingHand,
  BobbingHead
}

let animationSelected:AnimationSelection = AnimationSelection.FallingBall;


if(animationStyleElement != null){

  animationStyleElement.addEventListener('change',(e:any)=>{

    // console.log(e.target.value)
  //  rectangleLimit = parseInt(e.target.value);

  switch (parseInt(e.target.value)) {
    case 1:
      animationSelected = AnimationSelection.FallingBall;
      rectangleLimit = 1;
      break;
    case 2:
      animationSelected = AnimationSelection.BallStriking;
      rectangleLimit = 2;
      break;
    case 3:
      animationSelected = AnimationSelection.MovingHand;
      rectangleLimit = 1;
      break;
    case 4:
      animationSelected = AnimationSelection.BobbingHead;
      rectangleLimit = 1;
      break;
  }

   
  })

}

const rectangleArr: RectangleArrUnit[] = [];

imageSelector?.addEventListener("change", (e: any) => {
  //   console.log("selected");
  //   console.log(e.target.files[0])
  const file = e.target.files[0];

  const fileReader = new FileReader();

  fileReader.onload = (e) => {
    const result = e.target?.result;

    if (typeof result == "string") {
      //   imageElement.src = result;
      const image = new Image();
      image.src = result;
      image.onload = () => {
        console.log("image-width::", image.naturalWidth);
        console.log("image-height::", image.naturalHeight);

        canvasImageSource = image;
        console.log("drag end");
        imageDimensions.imageNaturalWidth = image.naturalWidth;
        imageDimensions.imageNaturalHeight = image.naturalHeight;

        if (
          (imageCanvas!.height < imageDimensions.imageNaturalHeight ||
            imageCanvas!.width < imageDimensions.imageNaturalWidth) &&
          imageDimensions.imageNaturalWidth <= 1920 &&
          imageDimensions.imageNaturalHeight <= 1080
        ) {
          imageCanvas!.width = imageDimensions.imageNaturalWidth;
          imageCanvas!.height = imageDimensions.imageNaturalHeight;
        }

        ctx?.drawImage(
          image,
          0,
          0,
          imageDimensions.imageNaturalWidth,
          imageDimensions.imageNaturalHeight
        );

        //getting image data
        // const imageData = ctx?.getImageData(50,50,10,10);
        // const data = imageData!.data;
        // console.log('image-data::',data);
        // console.log(`r: ${data[0]}\n g: ${data[1]}\n b:${data[2]}\n a: ${data[3]}`);
        // ctx?.putImageData(imageData!,273,212);
      };
    }
  };

  fileReader.readAsDataURL(file);
});

imageCanvas?.addEventListener("click", (e) => {
  const rect = imageCanvas.getBoundingClientRect();
  // console.log(rect)
  console.log(e.clientX - rect.x);
  console.log(e.clientY - rect.y);
});

// imageElement.addEventListener('load',(e)=>{
//     console.log('image loaded')
//     console.log(e.target)
// })

// const rect = imageCanvas?.getBoundingClientRect();

let drawingState: DrawingRectState = DrawingRectState.DrawingEnd;

let rectangleNowIndex = 0;

imageCanvas!.addEventListener("mousedown", (e) => {
  if (drawingState == DrawingRectState.DrawingEnd) {
    drawingState = DrawingRectState.DrawingStart;
  const rect = imageCanvas?.getBoundingClientRect();

    if (rectangleArr.length < rectangleLimit && rectangleArr[rectangleArr.length] == undefined) {
      console.log('here')
      const temp = { start_x: 0, start_y: 0, end_x: 0, end_y: 0 };
      rectangleNowIndex = rectangleArr.length;
      rectangleArr[rectangleArr.length] = { temp, main: new Rectangle(temp) };
    }
    // else{
    //   const temp = { start_x: 0, start_y: 0, end_x: 0, end_y: 0 };
    //   rectangleArr[rectangleLimit - 2] = { temp, main: new Rectangle(temp) };

    // }
    rectangleArr[rectangleNowIndex].temp.start_x = e.clientX - rect!.x;
    rectangleArr[rectangleNowIndex].temp.start_y = e.clientY - rect!.y;
  }
  // console.log('drag start')
});

imageCanvas!.addEventListener("mousemove", (e) => {
  if (drawingState == DrawingRectState.DrawingStart) {
    // console.log('drawing rectangle')
const rect = imageCanvas?.getBoundingClientRect();

    rectangleArr[rectangleNowIndex].temp.end_x = e.clientX - rect!.x;
    rectangleArr[rectangleNowIndex].temp.end_y = e.clientY - rect!.y;
  }
});

imageCanvas!.addEventListener("mouseup", () => {
  if (drawingState == DrawingRectState.DrawingStart) {
    drawingState = DrawingRectState.DrawingEnd;
    // console.log("drag end");
  }
});

const ballArr: Ball[] = [];

fallBallButton?.addEventListener("click", () => {
  for(let i=0;i<rectangleLimit;i++){
  const ball = rectangleArr[i].main.getBall();
  ballArr.push(ball);
  // ball.fall(ctx!,{yPositionLimit: imageDimensions.imageNaturalHeight});
  }
});

let ballFallingBackRerenderer = 0;

// let ballFallPoint:BallFallEnd = {yPositionLimit: imageDimensions.imageNaturalHeight,met:false};

const updateRectangleRenderer = () => {
  if (canvasImageSource != undefined) {
    if (ballArr.length != 0) {
      if (ballFallingBackRerenderer == 0) {
        ctx?.clearRect(
          0,
          0,
          imageDimensions.imageNaturalWidth,
          imageDimensions.imageNaturalHeight
        );

        ctx?.drawImage(
          canvasImageSource,
          0,
          0,
          imageDimensions.imageNaturalWidth,
          imageDimensions.imageNaturalHeight
        );

        ballFallingBackRerenderer = 1;
      }
      // for (const ball of ballArr) {
        if(animationSelected == AnimationSelection.FallingBall){
        ballArr[0].fall(ctx!, { yPositionLimit: imageDimensions.imageNaturalHeight });
        }else if(animationSelected == AnimationSelection.BallStriking){
          ballArr[0].strikeBall(ctx!,ballArr[1],{yPositionLimit:imageDimensions.imageNaturalHeight});
        }
      // }
    } else {
      ctx?.clearRect(
        0,
        0,
        imageDimensions.imageNaturalWidth,
        imageDimensions.imageNaturalHeight
      );

      ctx?.drawImage(
        canvasImageSource,
        0,
        0,
        imageDimensions.imageNaturalWidth,
        imageDimensions.imageNaturalHeight
      );

      if (rectangleLimit != 0) {
        for (const el of rectangleArr) {
          el.main.updateRect(ctx!, el.temp);
        }
      }
    }
  }
};

startButton?.addEventListener("click", () => {
  console.log("clicked");
  // console.log(rectangleArr[0])
  for(let i=0;i<rectangleLimit;i++){
  rectangleArr[i].main.detectObject(ctx!);
  }
});


resizeButton?.addEventListener('click',()=>{
  new ImageDraw(imageDimensions).averageResize(ctx!,imageCanvas!);
})


greenFilterButton?.addEventListener('click',()=>{
  console.log('checking')
  new ImageDraw(imageDimensions).greenFilter(ctx!);
})

// const updateFrames = () => {
//   updateRectangleRenderer();
//   requestAnimationFrame(updateFrames);
// };

// updateFrames();
