let selection;
let trigger;
let clipBoardSelection;

let hiddenContext, hiddenCanvas;

const isDownloadMode = false;

function init() {
	trigger = document.getElementById('capture');

	trigger.addEventListener('click', grabSelection);
	document.addEventListener('mouseup', checkSelection);

	document.addEventListener('copy', function(e){
		e.clipboardData.setData('image/png', getSelection());
		e.preventDefault();
	});
}

function checkSelection(e) {
	let localSelection = document.getSelection().toString();

	if(localSelection !== '') {
		selection = localSelection;

		let range = document.getSelection().getRangeAt(0);
		let clone = range.cloneRange();
		clone.collapse(false);

		let offset = clone.getBoundingClientRect();
		showCapture(e.pageY + offset.height*.5, offset.left);
	} else {
		trigger.classList.add('hidden');
	}
}

function showCapture(top, left) {
	trigger.style.top = top + 'px';
	trigger.style.left = left + 'px';
	trigger.classList.remove('hidden');
}

function grabSelection(e) {
	e.preventDefault();

	const canvas =  document.createElement('canvas');
	hiddenCanvas =  document.createElement('canvas');
	canvas.width = 500;
	hiddenCanvas.width = 500;
	hiddenCanvas.height = 2000;
	const context = canvas.getContext('2d');
	hiddenContext = hiddenCanvas.getContext('2d');

    hiddenContext.font = '18px Georgia';

	wrapText(canvas, hiddenContext, selection, 10, 30, 480, 30);
	
	hiddenContext.globalCompositeOperation = 'copy';
    context.fillStyle = '#FFF1E5';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(hiddenCanvas, 0, 0);

	let blob = dataURItoBlob(canvas.toDataURL());
	let obj = URL.createObjectURL(blob);
	setSelection(blob);

	const image = document.createElement('a');
	if(isDownloadMode) {
		image.setAttribute('href', blob);
		image.setAttribute('download', 'FT_screengrab');
	} else {
		image.setAttribute('href', canvas.toDataURL());
		image.setAttribute('target', '_blank');
	}

	image.click();
}

function setSelection(imageData) {
	clipBoardSelection = imageData;
}

function getSelection() {
	return clipBoardSelection;
}

function wrapText(canvas, context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; ++n) {
		var testLine = line + words[n] + ' ';
		var metrics = context.measureText(testLine);
		var testWidth = metrics.width;
		if (testWidth > maxWidth && n > 0) {
			hiddenContext.fillText(line, x, y);
			line = words[n] + ' ';
			y += lineHeight;
		}
		else {
			line = testLine;

			if((n === words.length - 1) && (testWidth <= maxWidth)) {
				hiddenContext.fillText(line, x, y);
			}
		}
    }
    canvas.height = y + 20;
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}


//TODO: add ellipsis if text doesn't start at beginning of sentence
//TODO: retain paragraphs.
//TODO: add date/author/link of published article
//TODO: complete the word if cropped?

document.addEventListener("DOMContentLoaded", init);