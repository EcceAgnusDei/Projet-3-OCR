let timer = new Timer('#countdown-min','#countdown-sec');
let diapo = new Diaporama(document.querySelector('#diapo'));

//Vérification de l'état de la réservation au rafraichissement de la page
window.addEventListener('load', function(){
		if (sessionStorage.getItem('state') == 'booked')
		{
			let stationAddress = sessionStorage.getItem('station');
			let secondsLeft = parseInt(sessionStorage.getItem('time left'));
			$('#summary').css('visibility','visible');
			$('#summary-address').text(stationAddress);
			timer.setSecondsLeft(secondsLeft);
			timer.launch();
		}
	});

ajaxGet(
	"https://api.jcdecaux.com/vls/v3/stations?contract=Lyon&apiKey=059b2d915baa90c9e9351f259d71d05425d2aa90",
	main);

//On passe dans la fonction main la réponse de la requête ajax
function main(stations)
{
	stations = JSON.parse(stations);
	
	let lat = 45.7655556;
	let lon = 4.83277777;
	let user = {nom: '', prenom: '', signature: null, station: -1};

	let map = new OSMap(lat, lon);
	for (let station of stations)
		{
			if(station.status !== "OPEN" || station.totalStands.availabilities.stands === 0)
			{
				map.setRedMarker(station.position);
			}
			else if(station.totalStands.availabilities.stands <= 2)
			{
				map.setOrangeMarker(station.position);
			}
			else
			{
				map.setGreenMarker(station.position);
			}
		}
	map.setMarkerClusters();

	for (let i = 0, c = stations.length; i < c; i++)
		{
			map.marker[i].addEventListener("click", function(){
				$('#address').text(stations[i].address);
				$('#bikes').text(stations[i].totalStands.availabilities.bikes);
				$('#stands').text(stations[i].totalStands.availabilities.stands);
				user.station = i;
				$('#reservation').css('display','flex');
				if (stations[i].status == "OPEN")
				{
					$('#status').text("La station est ouverte.");
					$('#status').css("color", "green");
				}
				else
				{
					$('#status').text("La station est fermée.");
					$('#status').css("color", "red");
				}
			});
		}

	if(localStorage.getItem('nom', user.nom))
		{
			user.nom = localStorage.getItem('nom', user.nom);
			user.prenom = localStorage.getItem('prenom', user.nom);
			document.getElementById("nom").value = user.nom;
			document.getElementById("prenom").value = user.prenom;
		}

	$('#reserve').click(function (){
		user.nom = document.getElementById("nom").value;
		user.prenom = document.getElementById("prenom").value;

		//On vérifie que le nom et le prénom aient bien été rentrés, et qu'un vélo soit bien disponible
		if(user.nom.length > 0 && user.prenom.length &&
		stations[user.station].totalStands.availabilities.stands &&
		stations[user.station].status == "OPEN")
		{
			$('#sign').css('visibility','visible');
			booking();
		}
		else if(!stations[user.station].totalStands.availabilities.stands)
		{
			$('.modal').css('display', 'flex');
			$('.modal-text').text("Aucun vélo disponible, veuillez choisir une autre station.");
		}
		else if(stations[user.station].status != "OPEN")
		{
			$('.modal').css('display', 'flex');
			$('.modal-text').text("Désolé, la station est fermée");
		}
		else
		{
			$('.modal').css('display', 'flex');
			$('.modal-text').text("Veuillez entrer votre nom et prénom.");
		}	
	});

	$('#cancel2').click(function (){
		sessionStorage.setItem('state', 'unbooked');
		sessionStorage.setItem('time left', '-1');
		sessionStorage.setItem('station', '');
		timer.clear();
		$('#summary').css('visibility', 'hidden');
		//On met à jour la liste des stations
		stations[user.station].totalStands.availabilities.bikes--;
		stations[user.station].totalStands.availabilities.stands++;
	});

	$('.close').click(function () {
		$('.modal').css('display','none');
	});

	$('#redoit').click(clearCanvas);
	$('#cancel').click(function(){
		clearCanvas();
		$('#sign').css('visibility','hidden');
		$('#reservation').css('display','none');
		});
	$('#send').click(function(){
		if(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data.some(channel => channel !== 0))
		{
			user.signature = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
			clearCanvas();

			$('#summary').css('visibility','visible');
			$('#sign').css('visibility','hidden');
			$('#reservation').css('display','none');
			$('#cancel2').css('display','block');
			$('#summary-address').text(stations[user.station].address);
			$('#isBooked').text('validée');

			localStorage.setItem('nom', user.nom);
			localStorage.setItem('prenom', user.prenom);
			sessionStorage.setItem('station', stations[user.station].address);
			sessionStorage.setItem('state', 'booked');
			//On met à jour la liste des stations
			stations[user.station].totalStands.availabilities.bikes++;
			stations[user.station].totalStands.availabilities.stands--;
			timer.clear();
			timer.setSecondsLeft(20 * 60);
			timer.launch();
		}
		else
		{
			$('.modal').css('display', 'flex');
			$('.modal-text').text("Vous devez signer pour réserver.");
		}
	});
}
