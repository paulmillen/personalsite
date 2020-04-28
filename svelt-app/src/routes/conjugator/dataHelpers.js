const getRandomItemFromArray = array => array[Math.floor(Math.random() * array.length)]

const getRandomTense = (availableTenses) => {
	return getRandomItemFromArray(availableTenses);
};

const getRandomVerb = (verbTable) => {
	const verbs = Object.keys(verbTable);
	return getRandomItemFromArray(verbs);
};

const getTenseBlock = (desiredTense, verbBlock) => {
	return verbBlock.find(block => block.tense === desiredTense);
};

const getTranslationDataFromTenseBlock = tenseBlock => {
	const conjugationBlock = tenseBlock.conjugations;
	const conjugations = Object.entries(conjugationBlock);
	const randomEntry = getRandomItemFromArray(conjugations);

	return {
		tense: tenseBlock.tense,
		en: randomEntry[0],
		fr: randomEntry[1]
	};
};

export const getTranslationData = (availableTenses, verbTable) => {
	const tense = getRandomTense(availableTenses);
	const verb = getRandomVerb(verbTable);
	const verbBlock = verbTable[verb];
	const tenseBlock = getTenseBlock(tense, verbBlock);
	return getTranslationDataFromTenseBlock(tenseBlock);
};