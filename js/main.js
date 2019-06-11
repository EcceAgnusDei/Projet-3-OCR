let timer = new Timer('#countdown-min','#countdown-sec');
let diapo = new Diaporama(document.querySelector('#diapo'));

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
				$('#reservation').css('visibility','visible');
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
			booking(user, stations);
		}
		else if(!stations[user.station].totalStands.availabilities.stands)
		{
			alert("Aucun vélo disponible, veuillez chosir une autre station.");
		}
		else if(stations[user.station].status != "OPEN")
		{
			alert("Désolé, la station est fermée");
		}
		else
		{
			alert("Veuiller entrer votre nom et prénom.");
		}	
	});

	$('#cancel2').click(function (){
		sessionStorage.setItem('state', 'unbooked');
		sessionStorage.setItem('time left', '-1');
		sessionStorage.setItem('station', '');
		timer.clear();
		$('#summary').css('visibility', 'hidden');
	});
}
