window.onload = function() {
	var buttonsArray = document.getElementsByClassName('button');
	var sliderArray = document.getElementsByClassName('sliderBox');

	for(var i=0; i<buttonsArray.length; i++) {
		
	}
	for(var i=0; i<sliderArray.length; i++) {
		
	}
}

function myLoop () {
   setTimeout(function () {
	   	var buttonsArray = document.getElementsByClassName('button');
		var sliderArray = document.getElementsByClassName('sliderBox');
		for(var i=0; i<buttonsArray.length; i++) {
			symconID = buttonsArray[i].getAttribute('statusID');
			if(symconID > 0) {
				symconResponse = symconSet('GetValue', [parseInt(symconID, 10)]);
				responseParsed = JSON.parse(symconResponse);
				value = 'off';
				if(responseParsed.result == true) {
					value = 'on';
				}
				buttonsArray[i].setAttribute('status', value);
			}
		}
		for(var i=0; i<sliderArray.length; i++) {
			symconID = sliderArray[i].getAttribute('statusID');
			if(symconID > 0) {
				symconResponse = symconSet('GetValue', [parseInt(symconID, 10)]);
				responseParsed = JSON.parse(symconResponse);
				percentage = responseParsed.result * 100;
				setSlider(sliderArray[i], percentage);
			}
		}
		myLoop();
   }, 1000)
}
myLoop();

function symconSet(command, parameter) {
	var url = '/api/';
	var username = 'funkyandy1@gmail.com';
	var password = 'symcon';
	
	var HTTP = new XMLHttpRequest();
	HTTP.open('POST', url, false);
	HTTP.onreadystatechange = function () {
		if (HTTP.readyState == 4 && HTTP.status == 200) {
			return HTTP.response;
		}
	}
	
	HTTP.setRequestHeader('Content-type', 'text/plain; charset=utf-8');
	HTTP.setRequestHeader('Access-Control-Allow-Origin', '*');
	HTTP.setRequestHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-token');
	HTTP.setRequestHeader('Authorization', 'Basic ' + btoa(username+':'+password));
	
	data = {
		'jsonrpc' : '2.0',
		'id' : 0,
		'method' : command,
		'params' : parameter,
	}
	var rpc = JSON.stringify(data);
	HTTP.send(rpc);
	return HTTP.onreadystatechange();
}

function buttonClicked(object, event) {
	event.preventDefault();
	
	var audio = new Audio('click2.mp3');
	//audio.play();

	currentStatus = object.getAttribute('status');
	if(currentStatus == 'on') {
		object.setAttribute('status', 'off');
		value = false;
	} else {
		object.setAttribute('status', 'on');
		value = true;
	}
	symconID = object.getAttribute('symconID');
	symconSet('HM_WriteValueBoolean', [parseInt(symconID, 10), 'STATE', value]);
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
	
	var sliderPercentOld = parseInt(object.getAttribute('value'));
	
	if(clickY <= sliderBoxClickTop) {
		relativePercent = sliderPercentOld + 5;
	} else if (clickY >= sliderBoxClickBottom) {
		relativePercent = sliderPercentOld - 5;
	} else  {
		relativePercent = (sliderBoxClickBottom - clickY) * 100 / sliderBoxClickSize;
	}
	
	if((sliderPercentOld <= 0 && relativePercent > 0) || (sliderPercentOld > 0 && relativePercent <= 0)) {
		//audio.play();
	}
	setSlider(object, relativePercent);
}

function sliderSend(object) {
	var sliderPercentOld = parseInt(object.getAttribute('value'));
	symconID = object.getAttribute('symconID');
	symconSet('HM_WriteValueFloat', [parseInt(symconID, 10), 'LEVEL', sliderPercentOld / 100]);
}

function sliderGhost(event, object) {
	
}

function setSlider(object, value) {
	var sliderBar = object.getElementsByClassName('sliderBar')[0];
	var sliderText = object.getElementsByClassName('sliderText')[0];

	var relativePercentRounded = Math.round(value / 5) * 5;
	
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

	sliderBar.style.height =  relativePercentRounded + '%';
	sliderText.innerHTML = relativePercentRounded + '%';
	object.setAttribute('value', relativePercentRounded);
}

function sliderTouched(event, object) {
	mouseX = event.touches[0].clientX;
	mouseY = event.touches[0].clientY;

	sliderClicked(event.touches[0], object);
}