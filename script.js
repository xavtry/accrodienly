const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const originalCanvas = document.getElementById('original');
const resultCanvas = document.getElementById('result');
const startBtn = document.getElementById('startBtn');
const progress = document.getElementById('progress');

let userImg = null;
let targetImg = new Image();
targetImg.src = 'assets/target67.png'; // THE SACRED IMAGE

// Load user image
dropZone.onclick = () => fileInput.click();
fileInput.onchange = e => loadImage(e.target.files[0]);

dropZone.ondragover = e => e.preventDefault();
dropZone.ondrop = e => {
  e.preventDefault();
  loadImage(e.dataTransfer.files[0]);
};

function loadImage(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    userImg = new Image();
    userImg.onload = () => {
      drawOriginal();
      startBtn.disabled = false;
    };
    userImg.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function drawOriginal() {
  const ctx = originalCanvas.getContext('2d');
  originalCanvas.width = userImg.width;
  originalCanvas.height = userImg.height;
  ctx.drawImage(userImg, 0, 0);
}

// THE ALGORITHM OF CHAOS
startBtn.onclick = () => {
  if (!userImg || !targetImg.complete) return;

  const ctx = resultCanvas.getContext('2d');
  resultCanvas.width = targetImg.width;
  resultCanvas.height = targetImg.height;

  const targetData = getImageData(targetImg);
  let pixels = getImageData(userImg);

  // Resize user pixels to match target size
  pixels = resizePixels(pixels, targetImg.width, targetImg.height);

  let matches = 0;
  const total = pixels.length;

  // Sort pixels by how close they are to target (EVIL GENIUS)
  const sorted = pixels
    .map((pixel, i) => ({ pixel, target: targetData[i], index: i }))
    .sort((a, b) => colorDistance(a.pixel, a.target) - colorDistance(b.pixel, b.target));

  const interval = setInterval(() => {
    for (let i = 0; i < 500; i++) { // speed of transformation
      if (matches >= total) {
        clearInterval(interval);
        progress.textContent = "YOU ARE 67 NOW";
        return;
      }
      const { pixel, index } = sorted[matches++];
      putPixel(ctx, index, pixel, targetImg.width);
    }
    progress.textContent = Math.round((matches / total) * 100) + "% BECOMING 67";
  }, 16);
};

function getImageData(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height).data;
}

function resizePixels(data, w, h) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;
  const ctx = tempCanvas.getContext('2d');
  ctx.drawImage(userImg, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h).data;
}

function colorDistance(c1, c2) {
  // c1 and c2 are 4-element arrays [r,g,b,a]
  return Math.abs(c1[0]-c2[0]) + Math.abs(c1[1]-c2[1]) + Math.abs(c1[2]-c2[2]);
}

function putPixel(ctx, index, color, width) {
  const x = index % width;
  const y = Math.floor(index / width);
  ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
  ctx.fillRect(x, y, 1, 1);
}
