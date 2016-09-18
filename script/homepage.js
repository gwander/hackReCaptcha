function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    return getBase64Canvas(canvas);
}

function getBase64Canvas(canvas) {
    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to guess the
    // original format, but be aware the using "image/jpg" will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function printSynonyms(data) {
	console.log(data.response);
	
	$.each(data.response, function (index, value) {
		var list = value.list;
		if (list.category == '(noun)') {
			console.log(list.synonyms);
		}
	});
}

function renderTiles(imageUrl, width, height)
{
	var img = document.getElementById('image_check');
	console.log(img);
	img.onload = function() {
		var tileWidth = img.width / width;
		var tileHeight = img.height / height;
		console.log(tileWidth);
		console.log(tileHeight);
		
		var tbody = $('#table_tiles tbody');
		tbody.empty();
		for (var i = 0; i < height; i++) {
			var tr = $('<tr></tr>');
			for (var j = 0; j < width; j++) {
				var td = $('<td></td>');
				
				var div = $('<div></div');
				div.addClass('div-tile-wrapper');
				
				var canvas = document.createElement('canvas');
				canvas.className = 'canvas-tile';
				canvas.width = tileWidth;
				canvas.height = tileHeight;
				var ctx = canvas.getContext('2d');
				ctx.drawImage(img, -j * tileWidth, -i * tileHeight);
				
				div.append(canvas);
				
				td.append(div);
				tr.append(td);
			}
			tbody.append(tr);
		}
	};
	img.src = imageUrl;
}

$(document).ready(function () {
	Clarifai.initialize({
		'clientId': 'Ylzb2946yWK8dLNKCL-48zLPpaElqYbfUoN7hQmJ',
		'clientSecret': 'vLcr3884zxofreH3W5wDuTMG0Pw8-t0PqIbT8616'
	});
	
	$('#btn_hack').click(function () {
		var canvases = $('.canvas-tile');
		var tag = $('#txt_tag').val();
		canvases.each(function(index, value) {
			var wrapper = value.closest('.div-tile-wrapper');
			console.log(wrapper);
			$(wrapper).css({ 'opacity' : 0.5 });
			
			var dataUrl = getBase64Canvas(value);
			Clarifai.getTagsByImageBytes(dataUrl).then(function (data) {				
				if (data.status_code == 'OK') {
					var tags = data.results[0].result.tag.classes;
					console.log(tags);
					
					for (var i = 0; i < tags.length; i++) {
						if (tags[i] == tag) {
							$(wrapper).css({ 'opacity' : 1.0 });
							return;
						}
					}
				}
				$(wrapper).css({ 'opacity' : 0.0 });
			}, null);
		});
	});
});

window.onload = function() {
	renderTiles('payload.jpg', 4, 3);
};
