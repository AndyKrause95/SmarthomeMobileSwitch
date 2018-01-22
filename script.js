window.onload = function() {
	var buttonsArray = document.getElementsByClassName('button');
	var sliderArray = document.getElementsByClassName('sliderBox');

	for(var i=0; i<buttonsArray.length; i++) {
		
	}
	for(var i=0; i<sliderArray.length; i++) {
		
	}
}

function buttonClicked(object) {
	var audio = new Audio('click2.mp3');
	audio.play();

	currentStatus = object.getAttribute('status');
	if(currentStatus == 'on') {
		object.setAttribute('status', 'off');
	} else {
		object.setAttribute('status', 'on');
	}
}

function sliderClicked(event, object) {
	var audio = new Audio('click2.mp3');
	
	var clickX = event.clientX;
	var clickY = event.clientY;
	
	var sliderBoxBound = object.getBoundingClientRect();
	var sliderBoxBorder =  parseInt(getComputedStyle(object,null).getPropertyValue('border-top-width'), 10);
	var sliderBoxPadding = parseInt(getComputedStyle(object,null).getPropertyValue('padding'), 10);
	
	var sliderBoxClickTop = sliderBoxBound.top + sliderBoxBorder + sliderBoxPadding;
	var sliderBoxClickBottom = sliderBoxBound.bottom - sliderBoxBorder - sliderBoxPadding;
	var sliderBoxClickSize = sliderBoxClickBottom - sliderBoxClickTop;
	
	var sliderBar = object.getElementsByClassName('sliderBar')[0];
	var sliderText = object.getElementsByClassName('sliderText')[0];
	var sliderPercentOld = parseInt(object.getAttribute('value'));
	
	if(clickY <= sliderBoxClickTop) {
		//relativePercent = 100;
		relativePercent = sliderPercentOld + 5;
	} else if (clickY >= sliderBoxClickBottom) {
		//relativePercent = 0;
		relativePercent = sliderPercentOld - 5;
	} else  {
		relativePercent = (sliderBoxClickBottom - clickY) * 100 / sliderBoxClickSize;
	}
	
	var relativePercentRounded = Math.round(relativePercent / 5) * 5;
	
	if(relativePercentRounded > 0 ){
		object.setAttribute('status', 'on');
	} else {
		object.setAttribute('status', 'off');		
	}
	
	if(relativePercentRounded <= 0) {
		relativePercentRounded = 0;
	} else if (relativePercentRounded >= 100) {
		relativePercentRounded = 100;
	}
	
	if((sliderPercentOld <= 0 && relativePercentRounded > 0) || (sliderPercentOld > 0 && relativePercentRounded <= 0)) {
		audio.play();
	}
	sliderBar.style.height =  relativePercentRounded + '%';
	sliderText.innerHTML = relativePercentRounded + '%';
	object.setAttribute('value', relativePercentRounded);
}

function sliderGhost(event, object) {
	
}

function sliderMouseDown(event, object) {
	alert('Mouse Down!');
}

function sliderTouched(event, object) {
	mouseX = event.touches[0].clientX;
	mouseY = event.touches[0].clientY;

	sliderClicked(event.touches[0], object);
}