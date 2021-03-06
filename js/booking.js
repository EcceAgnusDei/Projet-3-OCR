let canvas = document.getElementById("sign-canvas");
let ctx = canvas.getContext("2d");
let md = false;
let brushXPoints = [];
let brushYPoints = [];
let brushDownPos = [];

//Configuration du canvas pour la signature
canvas.style.cursor = "crosshair";
canvas.addEventListener("mousedown", down);
canvas.addEventListener("mouseup", toggledraw);
canvas.addEventListener("touchend", function (){
	brushXPoints = [];
	brushYPoints = [];
	brushDownPos = [];
});
canvas.addEventListener("mousemove", function(evt) {
	let mousePos = getMousePos(canvas, evt);
	let posx = mousePos.x;
	let posy = mousePos.y;
	addBrushPoint(posx, posy, md);
	draw();
});
canvas.addEventListener("touchmove", function(evt) {
	evt.preventDefault();
	let mousePos = getTouchPos(canvas, evt);
	let posx = mousePos.x;
	let posy = mousePos.y;
	addBrushPoint(posx, posy, true);
	draw();
});

/**
 * Définit le bouléan mouse down sur true
 */
function down()
{
	md = true;
}

/**
 * Définit le bouléan mouse down sur false
 */
function toggledraw()
{
	md = false;
}

/**
 * Fonction permettant de calculer la position de la souris dans le canvas
 * @param  {Object} canvas 
 * @param  {Event} evt    
 * @return {Object} Coordonnées x et y sous forme d'objet
 */
function getMousePos(canvas, evt)
{
	let rect = canvas.getBoundingClientRect();
	return { x: (evt.clientX - rect.left) * (canvas.width  / rect.width),
      y: (evt.clientY - rect.top)  * (canvas.height / rect.height)
    };
}

/**
 * Fonction permettant de calculer la position du doigt dans le canvas
 * @param  {Object} canvas 
 * @param  {Event} evt    
 * @return {Object} Coordonnées x et y sous forme d'objet
 */
function getTouchPos(canvas, evt)
{
	let rect = canvas.getBoundingClientRect();
	return { x: (evt.touches[0].clientX - rect.left) * (canvas.width  / rect.width),
      y: (evt.touches[0].clientY - rect.top)  * (canvas.height / rect.height)
    };
}

/**
 * Fonction permettant de dessiner sur un click de souris 
 */
function draw()
{
	for(let i = 1; i < brushXPoints.length; i++)
	{
		ctx.beginPath();

        /* Vérifie si le bouton de la souris est bien clickée et si oui
        continue de dessiner*/
       	if(brushDownPos[i])
      		{
       		ctx.moveTo(brushXPoints[i-1], brushYPoints[i-1]);
       		ctx.lineTo(brushXPoints[i], brushYPoints[i]);
       		ctx.closePath();
       		ctx.stroke();
       	}
   	}
}

/* Stock chaque mouvement de la sourie et si la souris est
clickée ou non */
function addBrushPoint(x, y, md)
{
	brushXPoints.push(x);
	brushYPoints.push(y);
   	// Stock la valeur true si la souris est clickée
   	brushDownPos.push(md);
}

function clearCanvas()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	brushXPoints = [];
	brushYPoints = [];
	brushDownPos = [];
}