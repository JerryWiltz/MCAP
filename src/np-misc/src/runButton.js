var editor;

export function callCodemirror (textAreaId) {
	var myTextarea = document.getElementById(textAreaId);
	editor = CodeMirror.fromTextArea(myTextarea, {
		lineNumbers: true
	});
	return editor;

};

function removeNodes (nodeClass) {
	var removed = document.getElementsByClassName(nodeClass);
	var i = 0;
	var nodes = JSON.parse(JSON.stringify(removed.length));
	for (i; i < nodes; i++) {
		removed[0].remove();
	};
};

function doIt () {
	var headID = document.getElementsByTagName("head")[0];
	var newScript = document.createElement("script");
	newScript.setAttribute('id', 'circuit');
	newScript.type = "text/javascript";
	newScript.innerHTML = editor.getValue();
	headID.appendChild(newScript);
};

export function run() {
		removeNodes('remove');	
		setTimeout(doIt, 100);
};

export function runButton (button) {
	document.getElementById(button).addEventListener('click', run);
};




/*export	function run() {
		removeNodes('remove');	
		function doIt () {
			var headID = document.getElementsByTagName("head")[0];
			var newScript = document.createElement("script");
			newScript.setAttribute('id', 'circuit');
			newScript.type = "text/javascript";
			newScript.innerHTML = editor.getValue();
			headID.appendChild(newScript);
		}
		setTimeout(doIt, 100);
	};

export function runButton (editor, button) {

	function removeNodes (nodeClass) {
		var removed = document.getElementsByClassName(nodeClass);
		var i = 0;
		var nodes = JSON.parse(JSON.stringify(removed.length));
		for (i; i < nodes; i++) {
			removed[0].remove();
		};
	};

	function run() {
		removeNodes('remove');	
		function doIt () {
			var headID = document.getElementsByTagName("head")[0];
			var newScript = document.createElement("script");
			newScript.setAttribute('id', 'circuit');
			newScript.type = "text/javascript";
			newScript.innerHTML = editor.getValue();
			headID.appendChild(newScript);
		}
		setTimeout(doIt, 100);
	};

	document.getElementById(button).addEventListener('click', run);

};*/
