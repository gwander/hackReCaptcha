function getSynonyms(word, callback) {
	var key = 'GcOPXqhW3XfiYYaZO1yp';
	var url = 'http://thesaurus.altervista.org/thesaurus/v1?word=' + word + '&language=en_US&output=json&key=' + key + '&callback=' + callback;
	$.get(url, function(response) {
		eval(response);
	});
}