/**
 * Fonction permetant l'initialisation d'un élément canvas ainsi 
 * que le necessaire pour dessiner une signature. Il gère également les boutons
 * d'envoie et d'annulation.
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

	canvas.style.cursor = "crosshair";
	//canvas.addEventListener("mousedown", down);
	//canvas.addEventListener("mouseup", toggledraw);
	canvas.addEventListener("touchend", function (){
		brushXPoints = [];
   		brushYPoints = [];
   		brushDownPos = [];
	});
	/*canvas.addEventListener("mousemove", function(evt) {
		var mousePos = getMousePos(canvas, evt);
		var posx = mousePos.x;
		var posy = mousePos.y;
		addBrushPoint(posx, posy, md);
		draw();
	});*/
	canvas.addEventListener("touchmove", function(evt) {
		evt.preventDefault();
		var mousePos = getTouchPos(canvas, evt);
		var posx = mousePos.x;
		var posy = mousePos.y;
		addBrushPoint(posx, posy, true);
		draw();
		console.log(evt.touches[0].clientX);
		console.log(evt.touches[0].clientY);
	});

	$('#redoit').click(clearCanvas);
	$('#cancel').click(function(){
		clearCanvas();
		$('#sign').css('visibility','hidden');
		$('#reservation').css('visibility','hidden');
		});

	$('#send').click(function(){
			user.signature = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
			clearCanvas();

			$('#summary').css('visibility','visible');
			$('#sign').css('visibility','hidden');
			$('#reservation').css('visibility','hidden');
			$('#cancel2').css('display','block');
			$('#summary-address').text(stations[user.station].address);
			$('#isBooked').text('validée');

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
		return { x: (evt.clientX - rect.left) * (canvas.width  / rect.width),
        y: (evt.clientY - rect.top)  * (canvas.height / rect.height)
      };
	}
	
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
}