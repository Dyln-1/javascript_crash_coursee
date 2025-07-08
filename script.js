// Global variables for audio and visualization
let audio;           // p5.Sound object
let fft;             // FFT analyzer
let baseHue = 0;     // Base color hue (changes on each click)
let rotationSpeed = 0.06;  // Rotation speed of the bars
let fileInput;       // File input DOM element
let playing = false; // Flag to track if audio is playing

function setup() {
  // Create full-window canvas
  createCanvas(windowWidth, windowHeight);

  // Use radians for rotation
  angleMode(RADIANS);

  // Use HSL color mode for easy color control
  colorMode(HSL);

  // Initialize FFT analyzer
  fft = new p5.FFT();

  // Get file input element
  fileInput = select('#fileupload');

  // Set event listener on file upload
  fileInput.changed(handleFile);

  // Change colors on canvas click
  canvas.addEventListener('click', changeColorOnClick);
}

function draw() {
  // Clear the background black every frame
  background(0);

  // If theres no audio loaded or not playing, skip the drawing
  if (!audio || !playing) return;

  // Analyze frequency spectrum 
  let spectrum = fft.analyze();

  // Move origin to center for circle visualizer
  translate(width / 2, height / 2);

  let bars = spectrum.length;           // Number of bars
  let angleStep = TWO_PI / bars;        // Angle between bars

  // Draw each bar in a circular pattern
  for (let i = 0; i < bars; i++) {
    let amp = spectrum[i];                              // Amplitude 
    let len = map(amp, 0, 255, 5, height / 2);         // Bar length mapped to amplitude
    let hue = (baseHue + i * 0.5) % 360;               // Hue cycles through spectrum

    push();                    // Save state
    rotate(i * angleStep + frameCount * rotationSpeed); // Rotate bar by position and animation
    fill(hue, 100, len / 3);   // Set fill color using HSL
    noStroke();                // No stroke for clean look
    rect(0, 0, 2, len);        // Draw rectangle bar
    pop();                     // Restore state
  }
}

// Change baseHue randomly on click to shift colors
function changeColorOnClick() {
  baseHue = floor(random(360));
}

// Load and play audio when file uploaded
function handleFile() {
  if (audio && playing) {
    audio.stop();
    playing = false;
  }

  let file = fileInput.elt.files[0];

  if (file) {
    audio = loadSound(URL.createObjectURL(file), () => {
      audio.play();
      fft.setInput(audio);
      playing = true;
    });
  }
}

// Adjust rotation speed based on mouse horizontal position
function mouseMoved() {
  let pct = mouseX / width;
  rotationSpeed = 0.001 + pct * 0.05;
}

// Resize canvas on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
