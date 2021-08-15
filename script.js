//adds the poem lines to the DOM under the poem class, using the specified poem function
function addToDom(poemLines) {
  var counter = 0;
  while (counter < poemLines.length) {
    var poemLine = poemLines[counter];
    $("<p>").text(poemLine).appendTo($('.poem'));
    counter += 1;
  }
}

function savePoemLocal(poemName, poem){
  //takes poem as array of poem lines with a comma at the end of each poem
  index = localStorage.length + 1;
  indexName = 'poem' + index;
  var savedPoemObj = {'poemName': poemName, 'poemContent': poem, 'id': indexName};
  localStorage.setItem(indexName, JSON.stringify(savedPoemObj));
  console.log(localStorage.getItem(indexName));
}

function generateLetters(firstLetters, lineWordCount){
  var letterArray = []
  for (var i = 0; i < lineWordCount; i++){
    if (i < firstLetters.length){
      //console.log("h");
      letterArray.push(firstLetters[i]);
    } else {
      //console.log("n")
      var randomLet = chooseRandomLetter();
      console.log(randomLet);
      letterArray.push(randomLet); 
    }
  }
  //console.log("HEIHOR");
  return letterArray;
}

function generateFullLine(letters, maxSyllables, chosenFirstLet, lineOptions, exactSyllables){
  //each line with an array of words
  //tense filter is ['indexAsNumber': partOfSpeech] and can be -1 to do the last
  var lineVariation = chooseLineVariation(chosenFirstLet, lineOptions);
  var lettersArray = generateLetters(letters, lineVariation['partOfSpeech'].length);
  console.log(lettersArray);
  var lineObj = getPoemLineObj(lettersArray, maxSyllables, lineVariation, exactSyllables); //REMEMBER TO CATCH ERROR HERE
  console.log("generating");
  console.log(lineVariation);
  var line = [];
  if (lineVariation['type'] == 'noInsert'){
    for (var i = 0; i < lineObj.length; i++){
      line.push(lineObj[i]['wordObject']['word']);
      if (lineVariation['name'] == 'NisAdj' && i == 0){
        line.push('is');
        syllablesInLine += 1;
      }
    }
  } else if (lineVariation['type'] == 'insert'){
    if (lineVariation['name'] == 'IamAdj'){
      console.log("made");
      line = ["I am", lineObj[0]['wordObject']['word']];
    } else if (lineVariation['name'] == 'HeV'){
      console.log("made");
      var thirdPersonSing = ["He", "She", "It"];
      var pronoun = thirdPersonSing[Math.floor(Math.random()*thirdPersonSing.length)];
      line = [pronoun, [lineObj[0]['wordObject']['word']]];
    } else if (lineVariation['name'] == 'YouAre'){
      console.log("made");
      var thirdPersonPl = ["You", "They", "We"];
      var pronoun = thirdPersonPl[Math.floor(Math.random()*thirdPersonPl.length)];
      line = [pronoun, "are", lineObj[0]['wordObject']['word']];
    }
  }
  console.log(line);
  return line; 
}

var allLineVariations = ['NVN','NVADV','NisAdj',"AdjNV","ADVV","AdjN",'IamAdj', 'HeV','YouAre'];

function chooseLineVariation(chosenFirstLet, options, exactSyllables){
  //chosenFirstLet = if line starts with certain letter
  //options = an array of names of line variations; if can be any then options must be ['any']
  var lineVarOptions = [
     {'name': 'NVN', 
    'partOfSpeech': ['n', 'v', 'n'], 
    'type': 'noInsert'}, 
    {'name': 'NVADV', 
    'partOfSpeech': ['n', 'v', 'adv'], 
    'type': 'noInsert'}, 
    {'name': 'NisAdj', 
    'partOfSpeech': ['n', 'adj'],
    'type': 'noInsert'},
    {'name':"AdjNV",
    'partOfSpeech': ['adj', 'n', 'v'],
    'type': 'noInsert'},
    {'name':"ADVV",
    'partOfSpeech': ['adv', 'v'],
    'type': 'noInsert'},
    {'name':"AdjN",
    'partOfSpeech': ['adj', 'n'],
    'type': 'noInsert'}
  ];

  var lineVarFirstNotGiven = [
    {'name': 'IamAdj', 
    'partOfSpeech': ['adj'],
    'type': 'insert'}, 
    {'name': 'HeV', 
    'partOfSpeech': ['v'],
    'type': 'insert'}, 
    {'name': 'YouAre', 
    'partOfSpeech': ['adj'],
    'type': 'insert'}];

  if (!chosenFirstLet){//acrostic if need certain letter first cant do chosen pronouns
    lineVarOptions = lineVarOptions.concat(lineVarFirstNotGiven);
  }

  if (!options[0] == 'any'){
    var tempOptions = [];
    lineVarOptions.forEach(opt => {
      if (opt['name'] in options){
        tempOptions.push(opt);
      }
    });
    lineVarOptions = tempOptions;
  }

  var variation = lineVarOptions[Math.floor(Math.random()*lineVarOptions.length)];
  return variation;
}

var syllablesInLine = 0;

function getPoemLineObj(lettersList, maxSyllables, lineVariation, exactSyllables){
  //RETURNS A NEW POEM LINE
  //letters list = an array of letters each word should start with
  //line variation is the line variation object
  syllablesInLine = 0;
  var lineCreated = false;
  var count = 0;
  var minScore = 1500;
  var letterIndex = 0;
  var partsOfSpeechInfo = {
    'n': {
      'minScore': 1000,
      'maxSyllables': maxSyllables,
    },
    'adj': {
      'minScore': 1000, //before- 1000
      'maxSyllables': maxSyllables,
    },
    'adv': {
      'minScore': 200,
      'maxSyllables': maxSyllables + 2,
    },
    'v': {
      'minScore': 1000,
      'maxSyllables': maxSyllables,
    }
  };

  while (!lineCreated && count < 500){
    
    try {
      var objectSet = [];
      
      lineVariation['partOfSpeech'].forEach(partOfSpeech => {
        var letter = lettersList[letterIndex];
        count += 1;
        console.log("current letter", letter);
        if (partOfSpeech == "v"){  
          //added this code to keep track of the syllables in the verbs
          var verb = getRandomVerb();
          var url = "https://api.datamuse.com/words?sp=" + verb + "*&md=sp";
          console.log(url);
          console.log('verb here', verb);
          var wordList = requestWordList(url);
          while (wordList[0]['word'] != verb) {
            verb = getRandomVerb();
            url = "https://api.datamuse.com/words?sp=" + verb + "*&md=sp";
            wordList = requestWordList(url);
            console.log('verb here', verb);
          }
          syllablesInLine += wordList[0]['numSyllables'];
          console.log('verb syllables here', wordList[0]['numSyllables']);
          // ^ keep track of verb syllables
          objectSet.push({
          'partOfSpeech': partOfSpeech,
          'wordObject': {'word': verb}});
        } else {
          var foundWord = findWord(letter, partOfSpeech, partsOfSpeechInfo[partOfSpeech]['maxSyllables'], partsOfSpeechInfo[partOfSpeech]['minScore'], exactSyllables);
          var loopCount = 0;
          while (typeof foundWord == 'undefined' && loopCount < 100){
            foundWord = findWord(letter, partOfSpeech, partsOfSpeechInfo[partOfSpeech]['maxSyllables'], partsOfSpeechInfo[partOfSpeech]['minScore'], exactSyllables);
            loopCount += 1;
          }
          objectSet.push({
            'partOfSpeech': partOfSpeech,
            'wordObject': foundWord
          });
          syllablesInLine += foundWord['numSyllables'];
          console.log('SYLLABLES IN THIS LINE:' + syllablesInLine);
          console.log("WORD OBJECT", foundWord);
          console.log('CURRENT OBJECTS', objectSet);
        }
        letterIndex += 1; 
      });
      return objectSet;
    } catch(err){
      //pass
      console.log(err);
    }
    return "ERROR";
  }
}

function requestWordList(theURL){
  //RETURNS A LIST OF WORD OBJECTS
  var wordList = null;
  $.ajax({
    type: "GET",
    url: theURL,
    dataType: "json",
    async: false,
    success: function (result) {
      wordList = result;
      //console.log(wordList)
    },
    error: function (error) {
      console.log(error);
    }
  });
  //console.log(wordList);
  return wordList;
}

function findWord(letter, partSpeech, maxSyllables, minScore, exactSyllables){
  //RETURNS WORD OBJECT BASED ON CRITERA
  var url = "https://api.datamuse.com/words?sp=" + letter + "*&md=sp&max=10000";
  console.log(url);
  var wordList = requestWordList(url);
  //console.log("WORD LIST", wordList);
  var wordChosen = false;
  var count = 0;
  while (!wordChosen && count <= 1000){
    count += 1;
    var testWord = wordList[Math.floor(Math.random()*wordList.length)];
    //console.log(partSpeech, testWord);
    if (testWord.hasOwnProperty('tags') && testWord['numSyllables'] <= maxSyllables && testWord['tags'].includes(partSpeech)&& testWord['score'] >= minScore){
      if (exactSyllables && testWord['numSyllables'] != maxSyllables){
        continue;
      }
        wordChosen = true; //don't need but just in case
        //console.log('VALID WORD', testWord);
        return testWord;
    }
  }
}

function chooseRandomLetter(){
  var alphabet = "qwertyuiopasdfghjklzxcvbnm";
  var randomLetter = alphabet[Math.floor(Math.random()*alphabet.length)];
  //console.log(randomLetter);
  return randomLetter;
}

//Rhyming functions
//gets a list of rhyme word objects based on a given rhyming word
function getRhymeData(rhymingWord){
  var rhymeList = 'beep';
  $.ajax({
    type: "GET",
    url: "https://api.datamuse.com/words?rel_rhy=" + rhymingWord + "&md=sp&max=2000",
    dataType: "json",
    async: false,
    success: function (result) {
      rhymeList = result;
    },
    error: function (error) {
      console.log(error);
    }
  });
  console.log(rhymeList);
  return rhymeList;
}

//gets a random rhyme word, given a rhyme word and a max number of syllables
function getRandomRhymeWord(rhymingWord, maxSyllables) {
  var rhymeList = getRhymeData(rhymingWord);
  if (rhymeList == []) {
    return "no rhymes";
  }
  var isGoodRhyme = false;
  var maxIndex = 99;
  if (!(rhymingWord == 'blue')){
    console.log("Here");
    maxIndex = rhymeList.length - 1;
  }
  console.log('INDEX HERE', maxIndex);
  console.log(!(rhymingWord == 'blue'));
  //loops through the words (up to the maxIndex) until we get something that does not have a space, is less than the given number of syllables, and has a tag for part of speech
  var iterCount = 0;
  while (isGoodRhyme == false && iterCount <= 100) {
    var randomIndex = Math.floor(Math.random() * (maxIndex));
    var randomWordObj = rhymeList[randomIndex];
    console.log(randomWordObj);
    if (!randomWordObj.hasOwnProperty('word')){
      continue;
    } //delete if mess thinged up
    var randomWord = randomWordObj['word'];
    if (!(randomWord.includes(' '))) {
      if (randomWordObj.hasOwnProperty('tags')) {
        if (randomWordObj['numSyllables'] < maxSyllables) {
          var rhymeWord = randomWord;
          var numSyllables = randomWordObj['numSyllables'];
          isGoodRhyme = true;
        }
      }
    }
    iterCount += 1;
  }
  console.log("RANDOMWORD",randomWordObj);
  return randomWordObj;
}

//takes the poem array (array of lines, which are arrays of words) and makes the first letter capital and makes each line end with a comma
//returns an array of nice formatted line strings
function format(poemLines) {
  var lineList = [];
  var count = 0;
  var count2 = 0;
  while (count < poemLines.length) {
    count2 = 0;
    var lineString = "";
    var thisLine = poemLines[count];
    while (count2 < thisLine.length) {
      var theWord = thisLine[count2];
      if (count2 == 0) {
        var bigLetter = theWord.charAt(0).toUpperCase();
        theWord = theWord.slice(1);
        theWord = bigLetter + theWord;
      }
      lineString += theWord;
      if (count2 < (thisLine.length -1)) {
        lineString += " ";
      }
      else {
        if (count != (poemLines.length - 1)) {
          lineString += ", ";
        }
      }
      count2 += 1;
    }
    lineList.push(lineString);
    count += 1;
  }
  return lineList;
}


  /*
  dead code part of line var options
  if (tenseFilter != None){ //pick based on tense filter
    lineVarOptions.forEach(variation => {
      for (var i = 0; i < variation['partOfSpeech']; i++){
        var forwardsNum = i;
        var backwardsNum = -1 * (variation['partsOfSpeech'].length - i + 1 );
        var tenseSearch = '';
        if (tenseFilter.hasOwnProperty(String(forwardsNum))) {
          //checks if tense filter is looking for something specific at that word position
          tenseSearch = tenseFilter[String(forwardsNum)];
        } else if (tenseFilter.hasOwnProperty(String(backwardsNum))) {
          tenseSearch = tenseFilter[String(backwardsNum)];
        } else {
          continue;
        }
        if (tenseSearch != variation['partOfSpeech'][i]){
          break;
        }
      } 
    }); 
    //if all 
  }
*/