let serial;          // variable to hold an instance of the serialport library
let portName = '/dev/tty.usbmodem11101';  // fill in your serial port name here
let inData;
 
let scaling, w, h;

function setup() {
    w = 300;
	h = 700;
	scaling = 1;
	//if (h > w) h = w;
	pixelDensity(1);
	createCanvas(w, h);
	background('#f5eed7');
	colorMode(HSB);
	noStroke();
	drawingContext.shadowColor = random(['#ee8959']);
	drawingContext.shadowBlur = 210;
  
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.on('list', printList);  // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing
 
  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port
}

function serverConnected() {
 print("Connected to Server");
}

function gotList(thelist) {
 print("List of Serial Ports:");

 for (let i = 0; i < thelist.length; i++) {
  print(i + " " + thelist[i]);
 }
}

function gotOpen() {
 print("Serial Port is Open");
}

function gotClose(){
 print("Serial Port is Closed");
 latestData = "Serial Port is Closed";
}

function gotError(theerror) {
 print(theerror);
}

function gotData() {
 let currentString = serial.readLine();
  trim(currentString);
 if (!currentString) return;
 console.log(currentString);
 latestData = currentString;
}

function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log(i + portList[i]);
  }
}

function serverConnected() {
  console.log('connected to server.');
}
 
function portOpen() {
  console.log('the serial port opened.')
}
 
function serialEvent() {
  inData = Number(serial.read());
}
 
function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}
 
function portClose() {
  console.log('The serial port closed.');
}

function draw() {
 background(255,255,255);
 fill(0,0,0);
 text(latestData, 10, 10);
 // Polling method
 /*
 if (serial.available() > 0) {
  let data = serial.read();
  ellipse(50,50,data,data);
 }
 */
}

function draw(){
  // Sun
  let xc = constrain(mouseX,w/4,3/4*w)
  let SunY=sin(map(xc,0,w,-3.14,0,true))*300+350
	fill('red');
	circle(xc, SunY,100)
   //console.log(SunY)
    drawMountains();
    addTexture();
}

function drawMountains() {
	randomSeed(9999)
	for (let y = 150*scaling+0.6*mouseY; y <= h+50*scaling; y+= 50*scaling) {
  	    let xnoise = 0;
		let ynoise = random(10);
		let ymin = 0;
		let xstep = 0.005;
		fill(260, y / 20, 50);
		beginShape();
  	    vertex(0, y);
        //console.log(y)
		for (let x = 0; x <= w+1; x+=2) {
			let y2 = ymin + (y - ymin) * noise(x * xstep, ynoise)
			vertex(x, y2);
		}
		vertex(w, y)
		endShape();
  }
	
	// Add some fog at the bottom.
  drawingContext.shadowBlur = 6000 * scaling;
  rect(-200 * scaling, h, w + 400 * scaling, 500 * scaling);
}

function addTexture() {
  loadPixels();
  for (let x = 0; x < w; x += 1) {
    for (let y = 0; y < h; y += 1) {
      const i = 4 * (x + y * w);
      const ns = -0.5 + noise(x*.5,y*1.5);
      for (let n = 0; n < 3; n += 1) {
        pixels[i + n] += ns * 32;
      }
    }
  }
  updatePixels();
}