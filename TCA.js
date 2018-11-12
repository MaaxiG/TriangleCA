var canvas;
var drawCanvas;
var triangleHeight;
var triangleBase;

var defaultRule1 = [2,0,2,0,1,1,2,2,2,1,2,2,0,1,0,0,0,2,2,0,0,0,0,0,0,2,0,1,2,0,1,2,1,1,0,2,0,1,0,1,0,2,0,1,2,2,0,2,2,0,2,0,2,0,2,1,0,0,0,2,1,2,0,2,0,0,2,1,1,2,2,0,0,2,1,0,1,1,0,2,2];
var defaultRule2 = [0,0,0,1,1,2,2,2,1,0,0,1,1,0,0,0,1,0,2,1,0,0,2,2,1,1,1,1,2,0,2,0,1,2,0,0,1,0,1,2,2,1,1,0,0,1,2,2,1,0,2,1,0,1,2,2,2,1,1,2,2,0,1,0,0,2,1,1,0,0,2,0,0,1,0,2,2,0,0,0,0];
var defaultRule3 = [2,1,0,1,2,2,0,0,1,2,0,1,1,2,2,1,1,1,0,1,1,1,0,1,2,1,2,1,2,2,0,1,2,1,2,0,1,2,0,2,2,0,0,2,2,2,1,0,1,0,0,1,1,2,1,2,1,0,1,0,1,0,0,0,1,1,2,2,0,2,0,1,2,2,1,0,1,2,2,1,2];
var defaultRule4 = [1,0,0,1,0,0,0,0,1,2,2,1,2,1,2,1,1,0,1,1,0,0,1,1,2,2,0,1,0,1,2,0,1,2,1,2,2,0,2,0,2,2,2,0,2,0,2,2,0,0,1,2,1,0,0,1,2,1,0,1,2,1,2,0,1,0,2,1,2,1,2,1,0,1,1,2,0,1,1,0,1];
var defaultRule5 = [0,0,2,1,0,2,1,2,0,2,1,0,2,2,2,1,2,1,1,0,0,2,2,1,1,1,0,0,1,2,2,1,1,0,0,0,0,0,0,2,1,1,2,2,0,0,1,0,0,2,1,0,2,2,0,2,2,2,0,1,0,0,0,0,0,0,2,2,2,2,1,2,2,1,0,1,2,2,1,0,1];

var cells = [];
var tempArray = [];
var flagCell = [];


//------------- RULES -----------------//

var interval;
let ruleArray;

function startSim()
{
  interval = setInterval(loop, $("timeIntervalSim").value);
}

function stopSim()
{
  clearInterval(interval);
}

function loop()
{
  for(let y = 0; y < cells.length; y++)
  {
    for(let x = 0; x < cells[y].length; x++)
    {
      setCell(x, y, Number(getNewValue(x, y, cells)), tempArray);
    }
  }

  for(let y = 0; y < cells.length; y++)
  {
    for(let x = 0; x < cells[y].length; x++)
    {
      setCell(x, y, Number(getCell(x, y, tempArray)), cells);
    }
  }
  
  baseCanvas();
}

//Return the state of the neighbourhood in an array
//[Left;Middle;Right;Up/Down]
function getNeighbourhood(x, y, varArray)
{
  function testAsEven()
  {
    if(x % 2 == 0)
    {
      neighbourhood.push(getCell(x, y-1, varArray));
    }
    else {
      neighbourhood.push(getCell(x, y+1, varArray));
    }
  }

  function testAsOdd()
  {

    if(x % 2 == 0)
    {
      neighbourhood.push(getCell(x, y+1, varArray));
    }
    else {
      neighbourhood.push(getCell(x, y-1, varArray));
    }
  }

  let neighbourhood = [];
  neighbourhood.push(getCell(x-1, y, varArray));
  neighbourhood.push(getCell(x, y, varArray));
  neighbourhood.push(getCell(x+1, y, varArray));
  if(y % 2 == 0)
  {
    testAsEven();
  }
  else {
    testAsOdd();
  }
  //console.log(neighbourhood);
  return neighbourhood;
}

function getNewValue(x, y, varArray)
{
  let newValue = getNewValueFromRule(getNeighbourhood(x, y, varArray));

  if(newValue != getCell(x, y, varArray))
  {
    flagCell[y][x] = true;
  }
  
  return newValue;
}

 //neighbourhood : values of the cells in ternary
function getNewValueFromRule(neighbourhood)
{
  let ruleNumber = toDecimal(neighbourhood); // = cellPlacement in decimal
  let newValue = ruleArray[ruleNumber];

  return newValue;
}

//----------- CELLS ------------------//

function initCells()
{
  //cells is a 2D array carrying the cells.
  //Cell[y][x]

  let sizeX = Number($("sizeInputX").value);
  let sizeY = Number($("sizeInputY").value);
  triangleBase = 2*(window.innerWidth / (sizeX+1));
  triangleHeight = window.innerHeight / sizeY;

  for (let i = 0; i < sizeY; i++)
  {
    cells[i] = [];
    tempArray[i] = [];
    flagCell[i] = [];

    for (let j = 0; j < sizeX; j++)
    {
      cells[i][j] = Number(0);
      tempArray[i][j] = Number(0);
      flagCell[i][j] = true;
    }
  }
}

function increaseCell(x, y)
{
  let i = getCell(x, y, cells);
  console.log(typeof i);
  let newValue = (i==2) ? 0 : (i+1);
  console.log("newValue : " + newValue);
  setCell(x, y, Number(newValue), cells);
}

function getCellColor(x, y)
{
  let newColor = "";
  let val = getCell(x, y, cells);

  switch (val) {
    case 0:
      newColor = "white";
      break;
    case 1:
      newColor = "lightgrey";
      break;
    case 2:
      newColor = "grey";
      break;
  }

  return newColor
}

function getCell(x, y, varArray)
{
  let indexes = checkCellsIndex(x, y, varArray);
  try {
    //console.log(varArray[indexes[1]][indexes[0]]);
    return varArray[indexes[1]][indexes[0]];
  } catch (e)
  {
    console.log("--------------");
    console.log(indexes[1]);
    console.log(indexes[0]);
    console.log(cells.length);
    console.log(cells[0].length);
  } finally {

  }

  return [0, 0];

}

function setCell(x, y, val, varArray)
{
  let indexes = checkCellsIndex(x, y, varArray);
  varArray[indexes[1]][indexes[0]] = val;
}

function checkCellsIndex(x, y, varArray)
{
  // if($("connectBordersBox").checked)
  // {
    if(x >= varArray[0].length)
      x -= varArray[0].length;

    if(x < 0)
      x = varArray[0].length - Math.abs(x);

    if(y < 0)
      y = varArray.length - Math.abs(y);

    if(y >= varArray.length)
      y -= varArray.length;
  // }
  let res = [x, y];

  return res;
}



// ----------- DRAWING ----------------//

function baseCanvas()
{
  for(let y = 0; y < cells.length; y++)
  {
    for(let x = 0; x < cells[y].length; x++)
    {
      if(flagCell[y][x] == true)
      {
        drawTriangle(x, y, "");
        flagCell[y][x] = false;
      }
    }
  }
}

function drawTriangle(x, y, color)
{
  if(y % 2 == 0)
  {
    if(x % 2 == 0)
    {
      drawDownTriangle(x, y, color);
    }else {
      drawUpTriangle(x, y, color);
    }
  }
  else {
    if(x % 2 == 0)
    {
      drawUpTriangle(x, y, color);
    }else {
      drawDownTriangle(x, y, color);
    }
  }
}

function drawUpTriangle(positionX, positionY, color)
{
  if(color == ""){
    drawCanvas.fillStyle = getCellColor(positionX, positionY); //Blue
  } else {
    drawCanvas.fillStyle = color;
  }

  let pointAx = (positionX)/2 *triangleBase;
  let pointAy = positionY*triangleHeight + triangleHeight;

  let pointBx = pointAx + triangleBase;
  let pointBy = pointAy;

  let pointCx = pointAx + triangleBase/2;
  let pointCy = pointAy - triangleHeight;

  drawCanvas.beginPath();
  drawCanvas.moveTo(pointAx, pointAy);
  drawCanvas.lineTo(pointBx, pointBy);
  drawCanvas.lineTo(pointCx, pointCy);
  drawCanvas.closePath();
  drawCanvas.fill();
  drawCanvas.stroke();
}

function drawDownTriangle(positionX, positionY, color)
{
  if(color == ""){
    drawCanvas.fillStyle = getCellColor(positionX, positionY); //Pink
  } else {
    drawCanvas.fillStyle = color;
  }

  let pointAx = positionX/2 * triangleBase;
  let pointAy = positionY * triangleHeight;

  let pointBx = pointAx + triangleBase;
  let pointBy = pointAy;

  let pointCx = pointAx + triangleBase/2;
  let pointCy = pointAy + triangleHeight;

  drawCanvas.beginPath();
  drawCanvas.moveTo(pointAx, pointAy);
  drawCanvas.lineTo(pointBx, pointBy);
  drawCanvas.lineTo(pointCx, pointCy);
  drawCanvas.closePath();
  drawCanvas.fill();
  drawCanvas.stroke();
}


//---------------- HELPERS ------------//

function $(id)
{
  return document.getElementById(id);
}

function getRule()
{
	ruleArray = Array();
	
	for(i = 0 ; i < 81; i++)
	{
		ruleArray[i] = $(i).value;
	}
}

function randomizeRule()
{
	for(i = 0; i < 81; i++)
	{
	   $(i).value = Math.floor(Math.random() * 3);
	}
}

function drawRuleAsString()
{
	let stringRule = "";
	for(i = 0; i < 81; i++)
	{
		stringRule += $(i).value;
	}
	
	$("ruleOutput").innerHTML = stringRule;
}

function readStringAsRule()
{
	let stringRule = $("ruleInputString").value;
	if(stringRule.length != 81)
		return;
	
	for(i = 0; i < 81; i++)
	{
		$(i).value = stringRule[i];
	}
}

function inputDefaultRule()
{
	let rule = Array();
	switch(Number($("selectRule").value))
	{
		case 1: rule = defaultRule1;
		break;
		
		case 2: rule = defaultRule2;
		break;
		
		case 3: rule = defaultRule3;
		break;
		
		case 4: rule = defaultRule4;
		break;
		
		case 5: rule = defaultRule5;
		break;
	}
	
	console.log($("selectRule").value);
	
	for(i = 0; i < 81; i++)
   {
	   $(i).value = rule[i];
   }
}

//Receive click and draw new triangle
function handleClick(event)
{
  /* FINDING THE X INDEX OF THE TRIANGLE WE CLICKED

  1. Find if the line index is odd or even. It will change the kind of triangle we will draw.

  2. Find the triangle index.
  1. Find the length of an horizontal line passing on the point we click. This line represents the "thickness" of the triangle at a specific height.
  2. Deduction of the reversed triangle line. It's done by substracting the length of the previous line to the size of the triangle's base
  3. Find the position of the point on the line composed of ALL the lines. As it's drawn, we have one "up" line and one "down" line.
  1. We loop and increase index, while the point is greater than the total length of all the lines.
  2. When it stops, we substract one second line length to the total length, and decrease the index.
  3. If the point is greater than the total line, then it's index is found. Else, it means that it's still in the line. Then, we just decrease
  once more.
  4. We found the index and we can return it.

  */

  function findIndex(x, y)
  {
    let lengthLineDownTriangle, lengthLineUpTriangle, startOffset;
    let lineLengthA, lineLengthB;

    y = y / triangleHeight;
    y2 = Math.floor(y);

    if(y2 % 2 == 0)
    {
      lineLengthA = triangleBase * (1 - (y%1));
    }else{
      lineLengthA = triangleBase * (y%1);
    }
    lineLengthB = triangleBase - lineLengthA;

    //Find position of the point
    let totalLength = lineLengthB/2;
    let index = 0;

    // drawCanvas.lineWidth = 2;

    while(x > totalLength)
    {
      // drawCanvas.beginPath();
      // drawCanvas.strokeStyle = "red";
      // drawCanvas.moveTo(totalLength, y*triangleHeight);
      // drawCanvas.lineTo(totalLength+lineLengthA,y*triangleHeight);
      // drawCanvas.stroke();
      //
      // drawCanvas.beginPath();
      // drawCanvas.strokeStyle = "blue";
      // drawCanvas.moveTo(totalLength+lineLengthA, y*triangleHeight);
      // drawCanvas.lineTo(totalLength+lineLengthA + lineLengthB,y*triangleHeight);
      // drawCanvas.stroke();
      //
      // drawCanvas.strokeStyle = "black";

      totalLength += lineLengthA + lineLengthB;
      index += 2;
    }

    totalLength -= lineLengthB;
    index--;

    if(x < totalLength)
    {
      index--;
    }

    return index;
  }

  let y = Math.floor(event.clientY/triangleHeight);
  let x = findIndex(event.clientX, event.clientY);

  increaseCell(x, y);
  drawTriangle(x, y, getCellColor(x, y));
  console.log(x + " " + y);
}

function initApp()
{
  canvas = $("canva");
  drawCanvas = canvas.getContext("2d");
  drawCanvas.canvas.width  = window.innerWidth;
  drawCanvas.canvas.height = window.innerHeight;

   for(i = 0; i < 81; i++)
   {
     let checkbox=document.createElement('input');
     checkbox.setAttribute("type","number");
     checkbox.setAttribute("min","0");
     checkbox.setAttribute("max","2");
	 checkbox.setAttribute("id",i);
	 checkbox.setAttribute("autocomplete", "off");
	 checkbox.value = defaultRule1[i];
     ruleSelect.appendChild(checkbox);
   }

  initCanvas();
}

function changeView()
{
	let canva = $("canva");	
	let menu = $("menu");	
	let icon = $("simMenu");
    
    if (menu.style.display == "none")
    {
	  clearInterval(interval);
      menu.style.display = "block";
	  icon.style.display = "none";
      canva.style.display = "none";
    }
    else
    {
      menu.style.display = "none";
      canva.style.display = "block";
	  icon.style.display = "block";
	  getRule();
	  initCanvas();
    }

}

function initCanvas()
{
  drawCanvas.fillStyle = "#fcf5e3";
  drawCanvas.fillRect(0, 0, canvas.width, canvas.height);

  initCells();
  baseCanvas();
}

// In: ternary (Array) ; Out: decimal (number)
function toDecimal(ternaryNumberArray)
{
  ternaryNumberArray = ternaryNumberArray.reverse();
  //console.log(ternaryNumberArray);
  let decimalNumber = 0;

  for(let i = 0; i < ternaryNumberArray.length; i++)
  {
    decimalNumber += (ternaryNumberArray[i] * Math.pow(3, i));
  }
  //console.log(decimalNumber);
  return decimalNumber;
}
