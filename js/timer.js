/**
* Classe permetant le décompte et son affichage
* @param {Number} secondsLeft Nombre de secondes avant fin du décompte
*/
class Timer
{
	constructor (countdownMin, countdownSec)
	{
		this.secondesLeft = 20 * 60;
		this.countdown = setInterval(function() {}, 999999999);
		this.countdownMin = countdownMin;
		this.countdownSec = countdownSec;
	}
	
	displayTimeLeft(seconds)
	{
		let minutes = Math.floor(seconds / 60);
		let remainderSeconds = seconds % 60;

		$(this.countdownMin).text(minutes);
		if(remainderSeconds < 10)
		{
			$(this.countdownSec).text('0' + remainderSeconds);
		}
		else
		{
			$(this.countdownSec).text(remainderSeconds);
		}
	}

	launch()
	{
		this.countdown = setInterval(function(){
			this.secondsLeft-- ;
			sessionStorage.setItem('time left', this.secondsLeft);
			if(this.secondsLeft < 0)
			{
				clearInterval(this.countdown);
				sessionStorage.setItem('station', -1);
				sessionStorage.setItem('state', 'unbooked');
				$('#isBooked').text('expirée');
				$('#timeleft').css('visibility', 'hidden');
				$('#cancel2').css('display', 'none');
				return;
			}
			this.displayTimeLeft(this.secondsLeft);
		}.bind(this), 1000);
	}

	setSecondsLeft(secondsLeft)
	{
		this.secondsLeft = secondsLeft;
	}

	clear()
	{
		clearInterval(this.countdown);
	}
}