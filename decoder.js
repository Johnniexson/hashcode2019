// @ts-ignore
const fs = require('fs');
// @ts-ignore
const readline = require('readline');
	
const rl = readline.createInterface({
	input: fs.createReadStream('b_lovely_landscapes.txt'),
	crlfDelay: Infinity
});
var x = -1;
var loop = 0;
var loopBack = 0;
var lineCounter = 0;
var sorting = 0;
var collections;
var horizontalImages = [];
var verticalImages = [];
var discarded = [];
var slides = [];
rl.on('line', (line) => {
	lineCounter++;
	if(lineCounter === 1) {
		collections = parseInt(line);
	} else {
		let image;
		let photo;
		x++;
		image = line.split(" ");
		photo = {
			index: `${x}`,
			view: image[0],
			tagLength: image[1],
			tags: image.slice(2)
		}
		if(photo.view === 'H') {
			horizontalImages.push(photo);
		} else {
			verticalImages.push(photo);
		}
	}
});
rl.on('close', ()=> {
	for(var i = 0; i < verticalImages.length; i+=2) {
		if(i >= verticalImages.length) {
			return;
		} else {
			var vImage1;
			var vImage2;
			var newTags;
			var newHorImage;
			vImage1 = verticalImages[i];
			vImage2 = verticalImages[i + 1];
			newTags = Array.from(new Set(vImage1.tags.concat(vImage2.tags)));
			newHorImage = {
				index: `${vImage1.index} ${vImage2.index}`,
				view: '2V',
				tagLength: newTags.length,
				tags: newTags
			}
			horizontalImages.push(newHorImage);
		}
	}

	// process slides photos by sorting
	// 	function sortPhotos(photo1, photo2) {
	// 		sorting++;
	// 		console.log(sorting);
	// 		// let rand = Math.floor(photo2.tags.length * Math.random());
	// 		if (photo1.tags.some((elem) => photo2.tags.indexOf(elem) === -1)) {
	// 			return 1;
	// 		} else if (photo1.tags.some((elem) => photo2.tags.indexOf(elem) !== -1)) {
	// 			return -1;
	// 		}else {
	// 			return 0;
	// 		}
	// 	}
	// 	horizontalImages.sort(sortPhotos);
	// 	console.log(`line 1: ${horizontalImages.length}\n`);
	// var logger = fs.createWriteStream('output/output.txt', {
	// 	flags: 'a'
	// })
	// 	logger.write(`${horizontalImages.length}\n`);
	// 	for(var i = 0; i < horizontalImages.length; i++) {
	// 		logger.write(`${horizontalImages[i].index}\n`);
	// 	}
	// 	logger.end();
	// 	console.log('Write completed');
		
		// special sorting for horizontal images
		// let val = Math.floor(horizontalImages.length * Math.random());
		slides.push(horizontalImages[0]);
		horizontalImages.splice(0, 1);
		do {
			loop++;
			horizontalImages.forEach((photo, index)=> {
				var aval, aval1;
				function check(elem, _index) {
					if (slides[slides.length - 1].tags.indexOf(elem) !== -1) {
						aval = elem;
						return true;
					} else {
						return false;
					}
				};
				function nextCheck1(elem, _index) {
					if (elem === aval) {
						return false;
					} else if (slides[slides.length - 1].tags.indexOf(elem) !== -1) {
						aval1 = elem;
						return true;
					} else {
						return false;
					}
				};
				if(photo.tags.some(check)) {
					if(photo.tags.some(nextCheck1)) {
						slides.push(photo);
						horizontalImages.splice(index, 1);
					} else if(loop === 79) {
						discarded.push(photo);
					} else {
						return;
					}
				} else if(loop === 79) {
					discarded.push(photo);
				} else {
					return;
				}
			})
		} while (loop !== 80);

		// check discarded
		do {
			loopBack++;
			discarded.forEach((photo, index)=> {
				if(photo.tags.some((elem) => slides[slides.length - 1].tags.indexOf(elem) !== -1)) {
					slides.push(photo);
					discarded.splice(index, 1);
				} else {
					return;
				}
			})
		} while (loopBack !== 50);
		// output display
		console.log(slides[0], slides[1]);
		console.log(`line 1: ${slides.length}\n`);
		var logger = fs.createWriteStream('output/output.txt', {
			flags: 'a'
		})
		logger.write(`${slides.length}\n`);
		for(var i = 0; i < slides.length; i++) {
			logger.write(`${slides[i].index}\n`);
		}
		logger.end();
		console.log('Write completed');
})
