const fs = require('fs');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const getRandomDelay = (min, max) => delay(Math.floor(Math.random() * (max - min + 1)) + min)

const sortByLVAndName = (arr) => {
  return arr.sort((a, b) => {
    const [nameA, levelA] = a.name.split(' LV');
    const [nameB, levelB] = b.name.split(' LV');
    if (levelA !== levelB) {
      return parseInt(levelA) - parseInt(levelB);
    } else {
      return nameA.localeCompare(nameB);
    }
  });
}

const writeToFile = (filepath, object) => {
  fs.writeFileSync(filepath, JSON.stringify(object));
}

module.exports = { delay, getRandomDelay, sortByLVAndName, writeToFile }