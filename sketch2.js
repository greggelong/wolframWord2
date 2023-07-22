// simple wolfram ca non opp 
// adapted from Shiffman's Nature of Code
// display cells
// copying one array to the other creates problems if you just assign it you need to deep copy i am useing p5.js arrayCopy(sorce,destination) built in pred

const wordMapping = {
  "111": ["Nature", "自", "Zì"],
  "110": ["Technology", "技", "Jì"],
  "101": ["Art", "艺", "Yì"],
  "100": ["Science", "科", "Kē"],
  "011": ["Peace", "和", "Hé"],
  "010": ["War", "战", "Zhàn"],
  "001": ["Dream", "梦", "Mèng"],
  "000": ["Reality", "实", "Shí"],
};
const wordMapping2 = [
  "NATURE",  // Nature (Zì)
  "TECH",  // Technology (Jì)
  "ART",  // Art (Yì)
  "SCI",  // Science (Kē)
  "PEACE",  // Peace (Hé)
  "WAR",  // War (Zhàn)
  "DREAM",  // Dream (Mèng)
  "REAL",  // Reality (Shí)
];
let cells = [];


let newCells = []; // new array to put the new state in. but in need zero index and 19 index so i just copied it over

let generation = 1; // oh damn this is global too !!!!

//let ruleset = [0, 0, 0, 1, 1, 1, 1, 0]; 
//let ruleset = [0,1,1,0,1,1,1,0];
//let ruleset = [0, 0, 0, 1, 1, 1, 1, 0,0, 1, 0, 1, 1, 0, 1, 0]
//let ruleset = [0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0]
//let ruleset = [1,0,1,0,0,0,0,1,0,0,0,1,1,1,1,0]
let ruleset;
let cellw; // cell size
let para; // for output
let myinput;
let box;
let inbutton;
let clrButton;



// makes a big difference if the cells length is even or odd
function setup() {
  
  noStroke();
  //para = createP(ruleset);
  myinput = select('#input');
  myinput.changed(setBinRule);
  inbutton = select('#btn')
  inbutton.mouseClicked(rndBinRule)
  clrButton = select('#rst')
  clrButton.mouseClicked(resetIt)
  //box = createCheckbox("multi rnd seeds", true)
  box = select('#rndbox')
  print("bing",box.checked())
  setBinRule()
  createCanvas(windowWidth, windowHeight);
  textAlign(LEFT,CENTER);
  textStyle(BOLD);
  cellw = (windowWidth/29)  // if you don't floor it it gits some nice collisions
  background(0,51,0);
  print(ruleset)
  resetIt();
}

function setBinRule(){
  
 let a = int(myinput.value());
 ruleset = binConvert(a,8);
 print(ruleset)

}

function rndBinRule(){
  let randDec = floor(random(1,255))
  print("Decimal: ", randDec)
  myinput.value(randDec)
  ruleset= binConvert(randDec,8)

}

function resetIt(){
  // resets the screen with random seeds and generation
  generation = 0;
  let cl = floor(width/cellw)
  background(240);
  for (let i=0; i < cl; i++){
    if(box.checked()){
    cells[i] = {a:floor(random(2)),b:random(wordMapping2)}; // or random
    } else{
      cells[i] = {a:0,b:wordMapping2[7]}; // set all to zero except the middle
    }
    }
    console.log(cells.length);
    cells[int(cells.length/2)] = {a:1,b:wordMapping2[5]};;  // you have to use int here or it wont give an int with some screen sizes and you will not have a 1 
    arrayCopy(cells,newCells);  // so the arrarys have a first and last element index as they are skiped when creating next generation

}


function draw() {
  displayCells(generation);
  if (mouseIsPressed) {
    getNextGen();
    generation++;
    //console.log(generation);
    displayCells(generation);
    if (generation*cellw > height){
      //background(255);
      generation=0;
      //background(127)
    }
    
  }

}


function displayCells(generation) {


  for (let i = 0; i < cells.length; i++) {
    fill(240)
    let clr;
    rect(i * cellw, generation * cellw, width, cellw);
    if (cells[i].a === 0) {
      //console.log("white");
      clr =color(51, 153, 255);
      clrb= color(255, 102, 153,100);
      stroke(51, 153, 255)
    } else {
       clr = color(255, 102, 153);
       clrb = color(51, 153, 255,100);
      stroke(51, 153, 255)
      //console.log("black");
    }
    //noStroke()//strokeWeight(0.5);
    //stroke(200);
    //noStroke();
   //
    fill(clrb)
    stroke(clrb)
    rect(i*cellw,generation*cellw,cellw,cellw)
    noStroke()
    fill(clr) 
    textSize(cellw/(cells[i].b.length/1.3))
    text(cells[i].b,(i) * cellw,generation * cellw+(cellw/2 ))
  }

}


function getNextGen() {
  for (let i = 0; i < cells.length ; i++) { // handel edges on a torus
    
    let a = cells[(i - 1 + cells.length)%cells.length].a;
    let b = cells[i].a;
    let c = cells[(i + 1 + cells.length)%cells.length].a;
    
    let newState = ruleset[rules(a, b, c)];
    let neighState =wordMapping2[rules(a,b,c)]
    newCells[i] = {a:newState,b:neighState};
  }
  //arrayCopy(newCells,cells);  //  source then destination this 
  for (let i = 0; i < cells.length ; i++){
    cells[i] = newCells[i]
    
  }
}


function rules(a, b, c) {

  if (a == 1 && b == 1 && c == 1) return 0;
  else if (a == 1 && b == 1 && c == 0 ) return 1;
  else if (a == 1 && b == 0 && c == 1) return 2;
  else if (a == 1 && b == 0 && c == 0) return 3;
  else if (a == 0&& b == 1&& c == 1) return 4;
  else if (a == 0 && b == 1 && c == 0) return 5;
  else if (a == 0 && b == 0 && c == 1) return 6;
  else if (a == 0 && b == 0 && c == 0) return 7;
  else if (a == 0 && b == 1 && c == 1 && d==1) return 8;


}



function binConvert(a, bitLen) {
  // takes in a decimal and a bit length and returns a list of ones and zeros binary for that number

  let b = a.toString(2); // converts it to binary but leading zeros, not 8 bits eg. 3 = "11"
  let mask = "0".repeat(bitLen); // a mask to get the extra zeros
  let c = mask.slice(0, bitLen - b.length); // slice to get the right number of zeros
  // eg. if b = "11" then c = "000000"
  let binstring = c + b; // binary string so 3 will give 00000011 8 bits

  let binArray = int(binstring.split("")); // is an aray of ints so [0,0,0,0,0,0,1,1]
  return binArray;
}