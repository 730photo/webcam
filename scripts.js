const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
        console.log(localMediaStream);
        video.srcObject = localMediaStream;
        // video.src = window.URL.createObjectURL(localMediaStream); //set it to be a live video stream
        video.play();
    })
    .catch(err => {
        console.error(`OH NO!!!`, err);
    });
}

//function takes a frame from the video and paints it onto the actual canvas on the screen

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;  

    // takes an image from the webcam and put it into the canvas
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        // mess with them
        // pixels = redEffect(pixels);
    
        pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.8;
    
        // pixels = greenScreen(pixels);
        // put them back
        ctx.putImageData(pixels, 0, 0);
      }, 16);
    }

//take photo
function takePhoto() {
    // played the sound
    snap.currentTime = 0;
    snap.play();

    //take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a'); //created a link
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
  strip.insertBefore(link, strip.firstChild);
}

//RGB values
function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
      pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
      pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // BLUE
    }
    return pixels;
  }
  

  function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i - 150] = pixels.data[i + 0]; // RED
      pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
      pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    }
    return pixels;
  }

  function greenScreen(pixels) {
    const levels = {}; //holds minimum maximum green

    //every single rgb input
    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
      });
    
      for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];
    
        if (red >= levels.rmin
          && green >= levels.gmin
          && blue >= levels.bmin
          && red <= levels.rmax
          && green <= levels.gmax
          && blue <= levels.bmax) {
          // take it out!
          pixels.data[i + 3] = 0;
        }
      }
    
      return pixels;
    }
    
    getVideo();    


    video.addEventListener('canplay', paintToCanvas); //once the video is playing it's going to emit an event called "canplay"