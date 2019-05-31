/**
 * Fonction permetant l'initialisation d'un élément canvas ainsi 
 * que le necessaire pour dessiner une signature.
 * @param [Object] Correspond à la signatur de l'utilisateur
 * @param [Object] Correspond à la liste des stations fournie pas JCDecaux
 */
function booking (user, stations)
{
	let canvas = document.getElementById("sign-canvas");
	let ctx = canvas.getContext("2d");
	let md = false;
	let brushXPoints = [];
	let brushYPoints = [];
	let brushDownPos = [];

	canvas.style.cursor = "crosshair"
	canvas.addEventListener("mousedown", down);
	canvas.addEventListener("mouseup", toggledraw);
	canvas.addEventListener("mousemove", function(evt) {
		var mousePos = getMousePos(canvas, evt);
		var posx = mousePos.x;
		var posy = mousePos.y;
		addBrushPoint(posx, posy, md);
		draw();
	});

	$('#redoit').click(clearCanvas);
	$('#cancel').click(function(){
		clearCanvas();
		});
	$('#send').click(function(){
		user.signature = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
		clearCanvas();

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
		//On réinitialise le timer en cas de 2eme réservation
		clearInterval(countdown);
		timer(20*60);
	});

	function down()
	{
		md = true;
	}

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
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
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
}

//if(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data.some(channel => channel !== 0))