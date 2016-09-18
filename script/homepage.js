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
	
	$('#btn_hack').click(function (evt) {
		evt.preventDefault();
		
		console.log('click #btn_hack');
		var imageUrl = $('#imageUrl').val();
		console.log(imageUrl);
		$.post('saveimage.php', {
			imageUrl: imageUrl
		}).done(function (response) {
			var url = JSON.parse(response).url;
			var width = parseInt($('#dimension_x').val());
			var height = parseInt($('#dimension_y').val());
			
			renderTiles(url, width, height);
		});
		
//		var canvases = $('.canvas-tile');
//		var tag = $('#txt_tag').val();
//		canvases.each(function(index, value) {
//			var wrapper = value.closest('.div-tile-wrapper');
//			console.log(wrapper);
//			$(wrapper).css({ 'opacity' : 0.5 });
//			
//			var dataUrl = getBase64Canvas(value);
//			Clarifai.getTagsByImageBytes(dataUrl).then(function (data) {				
//				if (data.status_code == 'OK') {
//					var tags = data.results[0].result.tag.classes;
//					console.log(tags);
//					
//					for (var i = 0; i < tags.length; i++) {
//						if (tags[i] == tag) {
//							$(wrapper).css({ 'opacity' : 1.0 });
//							return;
//						}
//					}
//				}
//				$(wrapper).css({ 'opacity' : 0.0 });
//			}, null);
//		});
	});
	
	$('#btn_hack2').click(function (evt) {
		evt.preventDefault();
		
		console.log('click #btn_hack2');
		
		var canvases = $('.canvas-tile');
		var tag = $('#txt_tag').val();
		console.log(tag);
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

//window.onload = function() {
//	renderTiles("https://www.google.com/recaptcha/api2/payload?c=03AHJ_Vuuas62ZHrrYfUjG6z0X2VU-pWuJ7J8Xg9W5q8AlpP7V7KTrroWzTBwTi9vNqA8zzZNgP2Tx-ZJtZZ7SG8bJ_oymh54LeqinPUU4Ohmb-O5Wplayn3OnztCDMQmaPjBPtmauLQfw3-Z7hnC7YidB3EI_YRvKFpnm12TCXxeDULj4M9tIH7E-pLVEE6OaNavFSMhxY-7aAwW9eXnmgt27BBPva7iOi_G21vXniITAsbm6wWwAf0sKKezF80-oJgLHfIw6pL-nKDpE-Y8uNyzb9iPdC8i0tx-ZsKxPyhEnjKO4T3LD9jqrYuL0Okd6juAv7JfcxfjcBSVCi8K0qlR8V5RVgv-lZmuqbNp0ASbRP7ssufCnZQdYM1i0RwJLzPuBxIm3AptIFpnuj7yB1GS_r1LFYfy56_ll03hXDjGTvd-_FHlnfTCQaJ0j0TktkGce-bLDlxqGlbXkbdE3VSsBeGf5824lc79id0FoJbJwgoywuZjA5AZVos90zlwLKeBvWbIVz6XoDZp5vR1bNIzdxrWC-pei1ihT58zEIhEldJy8dab6TwZtsu3zqddC9D2U9Mh0Dcw9XDhclUeKVPF9ABFfTM-SzJ9yY9xr7_SE2VcwukJ6wx75Va2OHbzga4Z8drhijaSp_yE-TH1YI3itIhcKNQXY98vGza93c4GaWBZGIMngw3MX4gKQRs756gchVrVLnLZTh82pHigf8dDGdzCTaeTGSk0Lak3I1D9nvoeUlvVWuWLg5ZqAh0zefACAJYvypFVmnVOOboLAx6TDe5Si0RU0KnZPh98g-SlVjBk8pjzx-Q6SYHhvn6VyvvH81lwsUh2yIZLMZPEV_DCrJUJVwOuOOAQkuGHJy5v7wbVlyEUqDzzn8-r3FylZf8lc1BNWyCKWhmDMRvFgJoXQFFgrE0hKn9nrQvpTqjV4_qztiOyRGQ5zf_Zmc70sczRbVktnfNpog3hc8eIE-SdWVS5xuFoAay1OoyTPBa8dqiInQIGzY-Ud1IhPYcbucLWzN86pGnXmFaLJLp-NAtYIH83_YhRnH4QHn1jkXNXqTU8T9ATPpDwcgOMMey-vcFdsW1fpEW8FpOjMcu9TVnXlcjP6dX4VMCbzsJQBQaBO8R14oSwGyZq7gbX4q5foRS4k-f_TRt_mz3bLaTqN-Mu11oR4Bx2nkWO9tNx0CgyTgAvFIhzuR95jmgrQ9LjWWYcE9sFr2-fFsPS4WCJWAVYICmbGFmCtoq4FEGSnvipGu75GpI4xuL6zniM1y6ApQDAOUeP7L9GlK1O2Z30566ls3RWyjQ-_4f0nXxJbJ-NuAg-uaTcv59w_3fHOhb8b1VXhB4TX53PyDCgfCEa1_q_R954TYdkO7x6qr2uHeA03sKquocfQNp7jX-adfESe0pKXGyc3dPqNWRTZxxfwQpPGbWRKR0qo3OLsSRLuMZct41Lwfi0OdhGSBjCk0ZRXytDPiJQHJPLeEZ0dwD53N-EQlZovipzsa1f4fry-0LbBO1nzEpvDOvchB2LmPd2v1G6DgMNmdcpUAMZNEz-tDrIfYo2KFEqqjReup_PF6fQe0prAcFIXGNucTBlWnJpuUYAzd_IUuqPZ3uMpn7J8Jb8D2nHEHdkZH6iYW15F0Kegq7r9erydrQuRN8JRyuuitPlvL8U3o6YKfrE7stJSUzuGARtk-XoVABHi7foEDj4J_XWciwdeVq71F3zttNp8arSttcX0sIcEnJC9eQEvdlU1dcmCIcf8lE5OoIhfUepjLS7Nfjx8tFkBM2Jkgz9gTbom46lhBTSDucMQeZnKDbpwzVMuCw_pn9MqfGWkWBsxq_ixIESBn2E&k=6LdkAAcUAAAAAGckXXPHhPeRfBHYVpccOhJ7U_5Q", 3, 3);
//};
