class Diaporama
{
	/**
	 * @param {HTMLElement} element dans lequel sera implémenté le panorama
	 * 
	 */
	 constructor (element)
	 {
	 	/*on veut que les enfant element html, cette instruction permet de ne récupérer
	 	que les enfants de element au mement de la construction*/
	 	this.children = [].slice.call(element.children);
	 	this.element = element;
	 	this.root = this.createDivWithClass("carousel");
	 	this.container = this.createDivWithClass("container");
	 	this.element.appendChild(this.root);
	 	this.root.appendChild(this.container);
	 	this.children.forEach(function (child) {
	 		this.container.appendChild(child);
	 	}.bind(this));

	 	this.createNaviagtion();
	 	this.setStyle();

	 	this.currentSlide = 0;

	 	this.interval = null;

	 	this.isPlaying = true;
	 	this.play();
	 }
	 

	 /**
	  * Défini le styles des éléments du diapo
	  */
	 setStyle()
	 {
	 	this.root.style.height = '100%';
	 	this.root.style.overflow = 'hidden';
	 	this.root.style.position = "relative";
	 	/*Permet de focaliser sur le caroussel avec tab
	 	si on veut que la commande next et prev ne réponde qu'en
	 	focus sur le caroussel 
	 	this.root.setAttribute("tabindex", "0");*/

	 	this.container.style.height = '100%';
	 	this.container.style.width = "100%";
	 	this.container.style.position = "relative";
	 	
	 	this.children.forEach(function(child){
	 		child.style.width = "100%";
	 		child.style.height = "100%";
	 		child.style.position = "absolute";
	 		child.style.top = "0";
	 		child.style.left = "0";
	 		child.style.display = "none";
	 	});
	 	this.children[0].style.display = "block";

	 	let nextButton = document.querySelector(".carousel-next");
	 	let prevButton = document.querySelector(".carousel-prev");
	 	let pauseButton = document.querySelector(".carousel-pause");

	 	nextButton.style.top = "45%";
	 	nextButton.style.right = "30px";
	 	nextButton.style.padding = "15px 6px 0 8px";
	 	nextButton.innerHTML = "<i class='fas fa-chevron-right'></i>";

	 	prevButton.style.top = "45%";
	 	prevButton.style.left = "30px";
	 	prevButton.style.padding = "15px 8px 0 6px";
	 	prevButton.innerHTML = "<i class='fas fa-chevron-left'></i>";

	 	pauseButton.style.top = "80%";
	 	pauseButton.style.right = "46%";
	 	pauseButton.style.padding = "15px 6px 0 8px";
	 } 


	 /**
	  * Paramètre la navigation du slider
	  * 
	  */
	 createNaviagtion () {
	 	let nextButton = this.createDivWithClass('carousel-next navigation');
	 	let prevButton = this.createDivWithClass('carousel-prev navigation');
	 	let pauseButton = this.createDivWithClass('carousel-pause navigation');
	 	this.root.appendChild(nextButton);
	 	this.root.appendChild(prevButton);
	 	this.root.appendChild(pauseButton);

	 	nextButton.addEventListener("click", this.next.bind(this));
	 	nextButton.addEventListener("click", this.pause.bind(this));
	 	prevButton.addEventListener("click", this.prev.bind(this));
	 	prevButton.addEventListener("click", this.pause.bind(this));
	 	pauseButton.addEventListener("click", function(e){
	 		if(this.isPlaying)
	 		{
	 			this.pause();
	 		}
	 		else
	 		{
	 			this.play();
	 		}
	 	}.bind(this));

	 	window.addEventListener("keyup", function(e){
	 		if (e.key === "ArrowRight")
	 		{
	 			this.next();
	 		}
	 		else if (e.key === "ArrowLeft")
	 		{
	 			this.prev();
	 		}
	 	}.bind(this));
	 }


	 /**
	  * @param {string} [className] [nom de la classe]
	  */
	 createDivWithClass (className)
	 {
	 	let div = document.createElement('div');
	 	div.setAttribute('class', className);
	 	return div;	
	 }


	 /**
	  * Fonction permetant de passer au diapo suivant
	  */
	 next ()
	 {
	 	if(this.currentSlide<this.children.length-1)
	 	{
	 		this.children[this.currentSlide].style.display = "none";
	 		this.currentSlide++;
	 		this.children[this.currentSlide].style.display = "block";
	 	}
	 	else
	 	{
	 		this.children[this.currentSlide].style.display = "none";
	 		this.currentSlide = 0;
	 		this.children[this.currentSlide].style.display = "block";
	 	}
	 }


	 /**
	  * Fonction permettant de passer au diapo précédent
	  */
	 prev ()
	 {
	 	if(this.currentSlide>0)
	 	{
	 		this.children[this.currentSlide].style.display = "none";
	 		this.currentSlide--;
	 		this.children[this.currentSlide].style.display = "block";
	 	}
	 	else
	 	{
	 		this.children[this.currentSlide].style.display = "none";
	 		this.currentSlide = this.children.length - 1;
	 		this.children[this.currentSlide].style.display = "block";
	 	}
	 }


	 /**
	  * Met en marche le diapo
	  */
	 play ()
	 {
	 	this.isPlaying = true;
	 	this.interval = setInterval(this.next.bind(this), 2000);
	 	let pauseIcon = document.querySelector(".carousel-pause");
	 	pauseIcon.innerHTML = "<i class='fas fa-pause'></i>";
	 }


	 /**
	  * Met en pause le diapo
	  */
	 pause ()
	 {
	 	this.isPlaying = false;
	 	clearInterval(this.interval);
	 	let pauseIcon = document.querySelector(".carousel-pause");
	 	pauseIcon.innerHTML = "<i class='fas fa-play'></i>";	
	 } 
}
