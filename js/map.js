/**
 * Initialise une carte openstreetmap.
 * La carte est centrée sur lat et lon.
 */
class OSMap
{
	constructor (lat, lon)
	{
		this.redIcon = L.icon({
			iconUrl: "http://mondoloni-dev.fr/velov/css/img/red-marker.png",
			iconSize: [50, 50],
			iconAnchor: [25, 50],
			popupAnchor: [-3, -76]
		});
		this.greenIcon = L.icon({
			iconUrl: "http://mondoloni-dev.fr/velov/css/img/green-marker.png",
			iconSize: [50, 50],
			iconAnchor: [25, 50],
			popupAnchor: [-3, -76]
		});
		this.orangeIcon = L.icon({
			iconUrl: "http://mondoloni-dev.fr/velov/css/img/orange-marker.png",
			iconSize: [50, 50],
			iconAnchor: [25, 50],
			popupAnchor: [-3, -76]
		});

		this.maCarte = L.map('map').setView([lat, lon], 11);
		L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
			attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
			minZoom: 10,
			maxZoom: 20
		}).addTo(this.maCarte);
		this.markerClusters = L.markerClusterGroup();
		this.marker = [];
	}

	/**
	 * Ajoute un marker de couleur vert.
	 * @param {Object} coord Objet littérale contenant les attributs latitude et longitude du marker
	 */
	setGreenMarker(coord)
	{
		this.marker.push(L.marker([coord.latitude, coord.longitude], { icon: this.greenIcon }));
	}

	/**
	 * Ajoute un marker de couleur orange.
	 * @param {Object} coord Objet littérale contenant les attributs latitude et longitude du marker
	 */
	setOrangeMarker(coord)
	{
		this.marker.push(L.marker([coord.latitude, coord.longitude], { icon: this.orangeIcon }));
	}
	
	/**
	 * Ajoute un marker de couleur rouge.
	 * @param {Object} coord Objet littérale contenant les attributs latitude et longitude du marker
	 */
	setRedMarker(coord)
	{
		this.marker.push(L.marker([coord.latitude, coord.longitude], { icon: this.redIcon }));
	}

	/**
	 * Initialise les groupes de marker
	 */
	setMarkerClusters()
	{
		for (let marker of this.marker)
		{
			this.markerClusters.addLayer(marker);
		}
		this.maCarte.addLayer(this.markerClusters);
	}
}