let searchInput = document.getElementById('Search'),
resultsDiv = document.getElementById('Results'),
resultList = document.getElementById('ResultList'),
currentItem = -1,
timeout = null;
searchInput.onkeyup = function (e) {
	let key = e.which;
	// Check if the last key was not "Arrow up", "Arrow Down", "Enter" or "Escape"
	if(key !== 13 && key !== 38 && key !== 40 && key !== 27) {
		clearTimeout(timeout);
		currentItem = -1;
	    const searchValue = searchInput.value;
	    timeout = setTimeout(function () {
	    	if(searchValue.length) {
	    		// If the textbox has a value
	        	search(searchValue);
	    	} else {
	    		// If textbox is empty
	    		resultsDiv.classList.add('hidden');
	    	}
	    }, 300);
	} else {
		e.preventDefault();
	}
};
searchInput.onkeydown = function(e) {
	// If user navigates the result list with arrow keys, "Enter" or "Escape"
	const children = resultList.childNodes;
	switch (e.which) {
		// If key was "Arrow Down", move selection one step down
		case 40:
			e.preventDefault();
			if(children.length > (currentItem + 1)) {
				if(currentItem > -1) {
					children[currentItem].classList.remove('selected');
				}
				currentItem++;
				children[currentItem].classList.add('selected');
			}
			break;
		// If key was "Arrow Up", move selector one step up
		case 38:
		  	e.preventDefault();
			if(currentItem > 0){
				children[currentItem].classList.remove('selected');
				currentItem--;
				children[currentItem].classList.add('selected');
			}
		 	break;
		 // If key was "Enter", select current item
		 case 13:
			e.preventDefault();
			if(children.length) {
				let name = children[currentItem].innerHTML;
				addToSaveList(name);
			}			
			break;
		// If key was "Escape", hide result list
		case 27:
			e.preventDefault();
			resultList.innerHTML = '';
			resultsDiv.classList.add('hidden');
			currentItem = -1;
			break;
	}
};
function addToSaveList(name) {
	// Add name and DateTime to list
	let ul = document.getElementById('SaveList');
	
	// Create list item
	let li = document.createElement('li');
	
	// Create container div
	let saveListDiv = document.createElement('div');
	saveListDiv.className = 'save-list-item';
	// Create container div for Name and Date
	let nameDateDiv = document.createElement('div');
	nameDateDiv.className = 'name-date';
	// Create div for Name
	let nameDiv = document.createElement('div');
	nameDiv.className = 'name';
	nameDiv.appendChild(document.createTextNode(name));
	nameDateDiv.appendChild(nameDiv);
	// Create div for Date
	let dateTime = getDateTime();
	let dateDiv = document.createElement('div');
	dateDiv.className = 'date';
	dateDiv.appendChild(document.createTextNode(dateTime));
	nameDateDiv.appendChild(dateDiv);
	saveListDiv.appendChild(nameDateDiv);
	// Create div for Remove
	let div = document.createElement('div');
	div.className = 'remove';
	div.setAttribute('onclick','removeItem(this);');
	saveListDiv.appendChild(div);
	// Append container div
	li.appendChild(saveListDiv);
	ul.appendChild(li);
	// Reset search results
	resultsDiv.classList.add('hidden');
	searchInput.value = '';
	currentItem = -1;
	resultList.innerHTML = '';
}
function getDateTime() {
	// Get formatted DateTime
	let now = new Date();
	let year = now.getFullYear();
	let month = addZero(now.getMonth() + 1);
	let day = addZero(now.getDate());
	let hour = addZero(now.getHours());
	let minute = addZero(now.getMinutes());
	return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
}
function addZero(i) {
	// Add '0' to string when needed
	if (i < 10) {
		i = '0' + i;
	}
	return i;
}
function search(searchString) {
	// Reset list
	resultList.innerHTML = '';
	resultsDiv.classList.add('hidden');
    
    // Make search
    const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       let json = JSON.parse(xhttp.responseText);
	       if(json.length) {
	       		// If any results from search, add to list of results on page
				json.forEach(function (item, index) {
					const li = document.createElement('li');
					li.setAttribute('onclick','addItem(this);');
					li.appendChild(document.createTextNode(item.name));
					resultList.appendChild(li);
				});
	       } else {
	       		// If no results from search
	       		const li = document.createElement('li');
				li.appendChild(document.createTextNode('No results'));
				resultList.appendChild(li);
	       }
	       resultsDiv.classList.remove('hidden');
	    }
	};
    xhttp.open('GET', 'https://api.punkapi.com/v2/beers?page=1&per_page=10&beer_name=' + searchString, true);
    xhttp.send();
}
function addItem(e) {
	// Add item to list
	console.log(e);
	addToSaveList(e.innerText);
}