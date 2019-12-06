import ImageRecognition from './ImageRecognition.js';
import translate from 'translate'; // New wave
import { hideElement, showElement } from './utils/utils.js';
import find from 'lodash/find';
import { yellowBinItems } from './data/yellowBinList';
import { greenBinItems } from './data/greenBinList';
import { blueBinItems } from './data/blueBinList';
import { cyanBinItems } from './data/cyanBinList';
import { blackBinItems } from './data/blackBinList';

import './App.css';

translate.engine = 'google';
translate.key = 'AIzaSyDXSsvQYM4ue0uFpwIcUf7X4awOM_a9K5w';

export default class App {
	constructor() {
		this.confirmationButtons = document.getElementById('confirmation-buttons');
		this.classificationDiv = document.getElementById('recycling-classification');
		this.doneButton = document.getElementById('next');
		this.resultDiv = document.getElementById('result');
		this.guessButton = document.getElementById('guess-button');
		this.startButton = document.getElementsByClassName('start-button')[0];
		this.introBlock = document.getElementsByClassName('intro')[0];
		this.feedSection = document.getElementsByClassName('feed')[0];
		this.recognitionFeature = new ImageRecognition();

		/* Physical button (through Arduino as keyboard) press detection listeners */
		document.addEventListener('keydown', event => this.keyHandler(event));
		document.addEventListener('keyup', function(event) {
			this.onkeydown = this.keyHandler;
		});
	}

	/* Physica buttons handler */
	keyHandler = event => {
		this.onkeydown = null;
		if (event.defaultPrevented) {
			return;
		}
		if (!event.repeat) {
			switch (event.key) {
				case '0':
					if (
						window.getComputedStyle(document.getElementsByClassName('intro')[0])
							.display !== 'none'
					) {
						document.getElementsByClassName('start-button')[0].click();
						console.log('START BUTTON');
					} else if (
						window.getComputedStyle(document.getElementById('guess-button')).display !==
						'none'
					) {
						document.getElementById('guess-button').click();
						console.log('GUESS BUTTON');
					} else if (
						window.getComputedStyle(document.getElementById('next')).display !== 'none'
					) {
						document.getElementById('next').click();
						console.log('RETRY/NEXT BUTTON');
					} else {
						console.log('YES');
						document.getElementById('yes').click();
					}
					break;
				case '1':
					if (
						window.getComputedStyle(document.getElementsByClassName('intro')[0])
							.display === 'none' ||
						window.getComputedStyle(document.getElementById('guess-button')).display ===
							'none' ||
						window.getComputedStyle(document.getElementById('next')).display === 'none'
					) {
						console.log('NO');
						document.getElementById('no').click();
						break;
					}
				default:
					console.log("A button pressed - dunno which, don't care");
			}
		}
	};

	init = () => {
		this.recognitionFeature.loadModel().then(() => {
			this.startButton.classList.remove('blinking');
			this.startButton.innerText = 'Apasă DA pentru a începe';
			this.startButton.onclick = () => this.start();
		});
	};

	start() {
		hideElement(this.introBlock);
		showElement(this.feedSection);

		this.recognitionFeature
			.initiateWebcam()
			.then(() => {
				this.guessButton.classList.remove('blinking');
				this.guessButton.innerText = 'Apasă DA pentru a detecta obiectul';
				this.guessButton.onclick = () => {
					this.predict();
				};
			})
			.catch(() => {
				hideElement(this.guessButton);
				this.resultDiv.innerHTML = `Camera indisponibilă.\nAcest demo are nevoie de acces la cameră.`;
			});
	}

	predict = async () => {
		this.recognitionFeature.runPredictions().then(predictionsResult => {
			if (predictionsResult.length) {
				/* Human filter */
				predictionsResult.forEach(result => {
					const predictedObject = result.class.split(',')[0];
					if (predictedObject === 'person') {
						console.log('Human factor filtered ');
						hideElement([
							this.classificationDiv,
							this.doneButton,
							this.resultDiv,
							this.confirmationButtons,
						]);
						showElement(this.guessButton);
						this.guessButton.innerText =
							'Nu am putut detecta un obiect\nApasă DA pentru a reîncerca.';
						this.guessButton.onclick = () => {
							this.predict();
						};
						return;
					} else {
						const predictedObjectTranslated = async predictedObject => {
							if (predictedObject === 'cell phone') {
								predictedObject = 'mobile phone';
							}
							if (
								predictedObject === 'bottle' ||
								predictedObject === 'bottle' ||
								predictedObject === 'beer bottle' ||
								predictedObject === 'jar' ||
								predictedObject === 'beer glass'
							) {
								predictedObject = 'plastic bottle';
							}
							const translation = await translate(
								`Is it a ${predictedObject}?`,
								'ro'
							);

							hideElement([this.classificationDiv, this.guessButton]);
							this.resultDiv.innerText = '';
							this.resultDiv.innerText = translation;
							this.classifyItem(predictedObject);
						};

						predictedObjectTranslated(predictedObject);
					}
				});
			}
		});
	};

	classifyItem = item => {
		const yellowItemFound = find(yellowBinItems, yellowBinItem => item === yellowBinItem);
		const greenItemFound = find(greenBinItems, greenBinItem => item === greenBinItem);
		const blueItemFound = find(blueBinItems, blueBinItem => item === blueBinItem);
		const cyanItemFound = find(cyanBinItems, cyanBinItem => item === cyanBinItem);
		const blackItemFound = find(blackBinItems, blackBinItem => item === blackBinItem);

		if (yellowItemFound) {
			this.displayButtons('yellow');
		} else if (greenItemFound) {
			this.displayButtons('green');
		} else if (blueItemFound) {
			this.displayButtons('blue');
		} else if (cyanItemFound) {
			this.displayButtons('cyan');
		} else if (blackItemFound) {
			this.displayButtons('black');
		} else {
			this.displayButtons('none');
		}
	};

	displayButtons = color => {
		showElement([this.confirmationButtons, this.resultDiv]);

		const yesButton = document.getElementById('yes');
		const noButton = document.getElementById('no');

		yesButton.onclick = () => this.displayClassification(color);
		noButton.onclick = () => this.predict();
	};

	displayClassification = color => {
		this.showClassification();
		let content;

		switch (color) {
			case 'yellow':
				content = `Este reciclabil! Aruncă obiectul în recipientul galben! 🎉`;
				this.showFinalMessage(content);
				break;
			case 'green':
				content = `Este reciclabil! Aruncă obiectul în recipientul verde! 🎉`;
				this.showFinalMessage(content);
				break;
			case 'blue':
				content = `Este reciclabil! Aruncă obiectul în recipientul albastru! 🎉`;
				this.showFinalMessage(content);
				break;
			case 'cyan':
				content = `Fiind un dispozitiv electronic, acesta trebuie predat organizațiilor corespunzatoare (ex: RoRec).`;
				this.showFinalMessage(content);
				break;
			case 'black':
				content = `Nu este reciclabil, dar este biodegradabil. Aruncă obiectul în recipientul maro! 🎉`;
				this.showFinalMessage(content);
				break;
			case 'none':
				content = `Obiectul nu a putut fi încadrat într-o categorie.\nEste din plastic, aluminium, hârtie sau sticlă?`;
				this.displayLastButtons();
				break;
			default:
				break;
		}

		this.resultDiv.innerHTML = content;
	};

	displayLastButtons = () => {
		showElement([this.confirmationButtons, this.resultDiv]);

		const yesButton = document.getElementById('yes');
		const noButton = document.getElementById('no');

		yesButton.onclick = () =>
			this.showFinalMessage(
				'Îl poți arunca, după caz, într-unul din recipientele aferente! 🎉'
			);
		noButton.onclick = () => this.showFinalMessage('Aruncă obiectul în recipientul negru. 😢');
	};

	showFinalMessage = content => {
		this.resultDiv.innerHTML = content;
		hideElement(this.confirmationButtons);
		showElement(this.doneButton);

		this.doneButton.onclick = () => {
			showElement(this.guessButton);
			hideElement([this.classificationDiv, this.doneButton, this.resultDiv]);
		};
	};

	showClassification = () => {
		showElement(this.classificationDiv);
	};
}
