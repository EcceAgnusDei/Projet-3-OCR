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
	let maCarte = null;
	let marker = [];
	let markerClusters; //Groupe de markers
	let user = {nom: '', prenom: '', signature: null, station: -1};

	initMap(stations);

	for (let i = 0, c = stations.length; i < c; i++)
		{
			marker[i].addEventListener("click", function(){
				$('#address').text(stations[i].address);
				$('#bikes').text(stations[i].totalStands.availabilities.bikes);
				$('#stands').text(stations[i].totalStands.availabilities.stands);
				user.station = i;
				$('#reservation').css('visibility','visible');
				if (stations[i].status == "OPEN")
				{
					$('#status').text("La stations est ouverte.");
					$('#status').css("color", "green");
				}
				else
				{
					$('#status').text("La stations est fermée.");
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
			alert("Veuiller entrez votre nom est prénom.");
		}	
	});

	/**
	 * Unitialise la carte openstreetmap
	 * @param  {Object} stations Object contenant toutes les informations des stations
	 */
	function initMap(stations)
	{
		maCarte = L.map('map').setView([lat, lon], 11);
		markerClusters = L.markerClusterGroup();
		L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
			attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 10,
            maxZoom: 20
		}).addTo(maCarte);

		for (let i = 0, c = stations.length; i < c; i++)
		{
			marker[i] = L.marker([stations[i].position.latitude, stations[i].position.longitude]);
			markerClusters.addLayer(marker[i]);
		}
		maCarte.addLayer(markerClusters);
	}
}