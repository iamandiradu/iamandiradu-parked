$(document).ready(() => { 
	let highlight = (searchFor) => {
		let startTimer = performance.now(); 																	// momentul de start pentru counter
		if (searchFor) { 																						// verifica daca exista search input
			console.log(`RegExp searching for ${searchFor}`);
			let searchRegExp = new RegExp(searchFor, `ig`); //i - case insensitive, g - global					// transforma search input in regexp
			let matches = $(`#findMeInHere`).text().match(searchRegExp);										// creaza un array cu toate string-urile gasite in urma testului cu regexp-ul generat
			console.log(matches);
			if (matches) {																						// conditie pentru a gestiona textul
				$(`#findMeInHere`).html($(`#findMeInHere`).text().replace(searchRegExp, (match) => {			// incapsuleaza string-ul cautat intr-un span (underline/highlight)
					return `<span class="highlight">${match}</span>`;
				}));
				$(`#find`).addClass(`found`).removeClass(`notFound`);											// adauga un outline verde input-ului in cazul gasirii unui match
			} else {
				$(`.highlight`).removeClass(`highlight`);														// sterge toate highlight-urile din text in cazul in care nu s-a putut gasi un match)
				$(`#find`).addClass(`notFound`).removeClass(`found`);											// de asemenea, adauga un outline rosu input-ului
			}
		} else {
			$(`.highlight`).removeClass(`highlight`);															// daca input-ul e gol, sterge toate highlight-urile
			$(`#find`).removeClass(`found`);																	// de asemenea, sterge outline-ul input-ului
		}
		let endTimer = performance.now();																		// momentul de stop pentru counter
		let processTime = parseFloat((endTimer - startTimer)).toFixed(2);										// calculeaza (rotunjit) durata procesului
		console.log(`Real time is ${(endTimer - startTimer)}ms.`);
		$(`.counter-time`).html(processTime);																	// adauga durata procesului in tag-ul "p" 
	}
	$(`#find`).keyup(() => {																					// trigger pentru functia de highlight (trigger pe event=ul de keyUp)
		highlight($(`#find`).val());																		
	});
});