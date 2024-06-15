const imageContainer: HTMLDivElement | null = document.querySelector('.image-container');
const imageSelector : HTMLInputElement | null = document.querySelector('#imageSelector');
const imageCanvas: HTMLCanvasElement | null = document.querySelector('.canvas');


const ctx = imageCanvas!.getContext('2d');

const imageDimensions = {imageNaturalWidth:0,imageNaturalHeight:0}

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

        imageDimensions.imageNaturalWidth = image.naturalWidth
        imageDimensions.imageNaturalHeight = image.naturalHeight;

        if((imageCanvas!.height < imageDimensions.imageNaturalHeight || imageCanvas!.width < imageDimensions.imageNaturalWidth) && (imageDimensions.imageNaturalWidth <= 1920 && imageDimensions.imageNaturalHeight <= 1080)){

            imageCanvas!.width = imageDimensions.imageNaturalWidth
            imageCanvas!.height = imageDimensions.imageNaturalHeight;

        } 

        ctx?.drawImage(
          image,
          0,
          0,
          imageDimensions.imageNaturalWidth,
          imageDimensions.imageNaturalHeight
        );
      };
    }
  };

  fileReader.readAsDataURL(file);
});

// imageElement.addEventListener('load',(e)=>{
//     console.log('image loaded')
//     console.log(e.target)
// })

// imageElement.addEventListener('mousedown',()=>{
//     console.log('drag start')
// })

// imageElement.addEventListener('mousemove',()=>{
//     console.log('drawing rectangle')
// })

// imageElement.addEventListener('mouseup',()=>{
//     console.log('drag end')
// })

