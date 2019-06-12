class BrushCanvas
{
	constructor (canvasID)
	{
		this.canvas = document.getElementById(canvasID);
		this.ctx = this.canvas.getContext("2d");
		this.md = false;

		this.brushXPoints = [];
		this.brushYPoints = [];
		this.brushDownPos = [];

		this.canvas.style.cursor = "crosshair";
	}

	down()
	{	
		this.md = true;
	}

	toggledraw()
	{
		this.md = false;
	}

	/**
	 * Fonction permettant de calculer la position de la souris dans le canvas
	 * @param  {Object} canvas 
	 * @param  {Event} evt    
	 * @return {Object} Coordonnées x et y sous forme d'objet
	 */
	getMousePos(canvas, evt)
	{
		let rect = canvas.getBoundingClientRect();
		return { x: (evt.clientX - rect.left) * (canvas.width  / rect.width),
			y: (evt.clientY - rect.top)  * (canvas.height / rect.height)
		};
	}

	/**
	 * Fonction permettant de dessiner sur un click de souris 
	 */
	draw()
	{
		for(let i = 1; i < this.brushXPoints.length; i++)
		{
	 		this.ctx.beginPath();

        	/* Vérifie si le bouton de la souris est bien clickée et si oui
        	continue de dessiner*/
        	if(this.brushDownPos[i])
        	{
        		this.ctx.moveTo(this.brushXPoints[i-1], this.brushYPoints[i-1]);
        		this.ctx.lineTo(this.brushXPoints[i], this.brushYPoints[i]);
        		this.ctx.closePath();
        		this.ctx.stroke();
        	}
    	}
	}

	/* Stock chaque mouvement de la sourie et si la souris est
	clickée ou non */
	addBrushPoint(x, y, md)
	{
		this.brushXPoints.push(x);
		this.brushYPoints.push(y);
   		// Stock la valeur true si la souris est clickée
   		this.brushDownPos.push(md);
   		console.log(this.md);
   	}

   	clearCanvas()
   	{
   		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
   		this.brushXPoints = [];
   		this.brushYPoints = [];
   		this.brushDownPos = [];
   	}

   	addEvents()
   	{
   		this.canvas.addEventListener("mousedown", this.down);
   		this.canvas.addEventListener("mouseup", this.toggledraw);
   		this.canvas.addEventListener("mousemove", function(evt) {
			var mousePos = this.getMousePos(this.canvas, evt);
			var posx = mousePos.x;
			var posy = mousePos.y;
			this.addBrushPoint(posx, posy, this.md);
			this.draw();
		}.bind(this));
   	}	
}

/**
 * Fonction permetant l'initialisation d'un élément canvas ainsi 
 * que le necessaire pour dessiner une signature.
 * @param [Object] Correspond à la signatur de l'utilisateur
 * @param [Object] Correspond à la liste des stations fournie pas JCDecaux
 */
function booking (user, stations)
{
	
	let brushCanvas = new BrushCanvas('sign-canvas');
	brushCanvas.addEvents();

	$('#redoit').click(brushCanvas.clearCanvas);
	$('#cancel').click(function(){
		brushCanvas.clearCanvas();
		$('#sign').css('visibility','hidden');
		});
	$('#send').click(function(){
		user.signature = brushCanvas.canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
		brushCanvas.clearCanvas();

		$('#summary').css('visibility','visible');
		$('#sign').css('visibility','hidden');
		$('#summary-address').text(stations[user.station].address);

		localStorage.setItem('nom', user.nom);
		localStorage.setItem('prenom', user.prenom);
		sessionStorage.setItem('station', stations[user.station].address);
		sessionStorage.setItem('state', 'booked');
		//On met à jour la liste des stations
		stations[user.station].totalStands.availabilities.bikes += 1;
		stations[user.station].totalStands.availabilities.stands -= 1;
		timer.clear();
		timer.setSecondsLeft(20 * 60);
		timer.launch();
	});
}

//if(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data.some(channel => channel !== 0))