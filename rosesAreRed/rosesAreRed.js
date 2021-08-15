$(document).ready(function(){
  var poemLineSaved = "";
  var maxSyllables = 4; //per word 
   $("#generateButton").on('click', function() { 
    $('.poem').empty();
    var $roses = $("<p>").text("Roses are red,");
    var $violets = $("<p>").text("Violets are blue,");
    var poemLines = generateRoses();
    //poem comes back as list, parse through + display now
    $('.poem').append($roses);
    $('.poem').append($violets);
    $("#copyButton").on('click', function() {
      console.log('copied!');
      $("#copyMessage").text("Copied!");
      var value = "Roses are red, Violets are blue, ";
      var count = 0;
      while (count < poemLines.length) {
        value += poemLines[count];
        count += 1;
      }
      navigator.clipboard.writeText(value);
    });
    poemLineSaved = poemLines;
    /*
    $("#saveButton").attr("disabled", false);
    $('#saveButton').on('click', function(){
      //console.log('pressed');
      var poemArray = ["Roses are red,", "Violets are blue,"];
      var poemName = $("#poemName").val(); //add control conditions later, like no input and disable save button once saved
      poemLines[0] = poemLines[0].trim();
      poemArray = poemArray.concat(poemLines);
      console.log(poemArray, poemLines);
      savePoemLocal(poemName, poemArray);
      $("#saveButton").attr("disabled", true);
    });*/
    addToDom(poemLines);
    $("#copyMessage").empty();
  });

  //$("#saveButton").attr("disabled", false);
  $('#saveButton').on('click', function(){
      //console.log('pressed');
      var poemArray = ["Roses are red,", "Violets are blue,"];
      var poemName = $("#poemName").val(); //add control conditions later, like no input and disable save button once saved
      poemLineSaved[0] = poemLineSaved[0].trim();
      poemArray = poemArray.concat(poemLineSaved);
      console.log(poemArray, poemLineSaved);
      savePoemLocal(poemName, poemArray);
      //$("#saveButton").attr("disabled", true);
    });
});


function generateRoses() {
  var rhymeWord = getRandomRhymeWord('blue', 4);
  rhymePOS = rhymeWord['tags'][0];
  if (rhymePOS == 'n') {
    var lineVarOptions = [
    {'name': 'NVN'}, 
    {'name':"AdjN"}
    ];
  }
  if (rhymePOS == 'v') {
    var lineVarOptions = [
    {'name':"AdjNV"},
    {'name':"ADVV"},
    {'name': 'HeV'}
    ];
  }
  if (rhymePOS == 'adj') {
    var lineVarOptions = [
    {'name': 'NisAdj'},
    {'name': 'IamAdj'},
    {'name': 'YouAre'}
    ];
  }
  if (rhymePOS == 'adv') {
    var lineVarOptions = [
    {'name': 'NVADV'}
    ];
  }

  var variation = lineVarOptions[Math.floor(Math.random()*lineVarOptions.length)];
  
  var line4 = generateFullLine([], 6, false, lineVarOptions, false);
  line4.pop();
  var rhymeWord = getRandomRhymeWord('blue', 4);
  line4.push(rhymeWord['word']);
  var line3 = generateFullLine([], 6, false, allLineVariations, false);
  console.log(line3);
  console.log(line4);
  return format([line3, line4]);
}


/*

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


/*
function getRandomRhymeWord(rhymingWord, maxSyllables) {
  var rhymeList = getRhymeData(rhymingWord);
  var isGoodRhyme = false;
  var maxIndex = 99;
  //loops through the words (up to the maxIndex) until we get something that does not have a space, is less than 5 syllables, and has a tag for part of speech
  while (isGoodRhyme == false) {
    var randomIndex = Math.floor(Math.random() * (maxIndex));
    var randomWordObj = globalRhymeList[randomIndex];
    console.log(randomWordObj);
    var randomWord = randomWordObj['word'];
    if (!(randomWord.includes(' '))) {
      if (randomWordObj['numSyllables'] < maxSyllables) {
        var rhymeWord = randomWord;
        var numSyllables = randomWordObj['numSyllables'];
        isGoodRhyme = true;
      }
    }
  }
  return randomWordObj;
}


//getRandomRhymeWord();

/*
templates: noun is adjective, and noun is adjective;
nouns are adjective + nouns is adjective
*/


/*
function getResult(result) {
  rhymeList = result;
  console.log('is this rhymeList' + rhymeList);
}

//console.log('is this rhymeList' + rhymeList);
*/

/*
$(document).ready(function() {
  var line3obj = getPoemLineObj(); 
  var line3 = `${line3obj['noun']} ${getRandomVerb()} ${line3obj['adj']}`;
  var randomWordObj = getRandomRhymeWord();
  var line4obj = getPoemLineObj();
  var line4 = `${line4obj['noun']} ${getRandomVerb()} ${randomWordObj['word']}`;
  console.log('LINE 3', line3);
  console.log('LINE 4', line4);
});

function getPoemLineObj(){
  //RETURNS A NEW POEM LINE
  var lineCreated = false;
  var count = 0;
  var minScore = 2000;
  while (!lineCreated && count < 500){
    //have to do this in case of occasional errors...
    count += 1;
    try {
      var nounObj = findWord(chooseRandomLetter(), 'n', 2, minScore);
      //console.log("NOUN OBJECT", nounObj);
      var adjObj = findWord(chooseRandomLetter(), 'n', 3 - nounObj['numSyllables'], minScore);
      //console.log("ADJ OBJECT", adjObj);
      var vObj = findWord(chooseRandomLetter(), 'v', 2, minScore);
      console.log("VERB OBJECT", vObj);
      //return nounObj['word'] + ' is ' + adjObj['word']; 
      return {'noun': nounObj['word'], 'verb': vObj['word'], 'adj': adjObj['word']}
      //return  + ' ' +   + 's ' + ; //with selected verb, need better algorthm for verb choice / agreement
    } catch(err){
      //pass
    }
  }
  return "ERROR";
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

function chooseRandomLetter(){
  var alphabet = "qwertyuiopasdfghjklzxcvbnm";
  var randomLetter = alphabet[Math.floor(Math.random()*alphabet.length)];
  console.log(randomLetter);
  return randomLetter;
}

function findWord(letter, partSpeech, maxSyllables, minScore){
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
    if (testWord['numSyllables'] <= maxSyllables && testWord['tags'].includes(partSpeech)&& testWord['score'] >= minScore){
        wordChosen = true; //don't need but just in case
        console.log('VALID WORD', testWord);
        return testWord;
    }
  }
}

function sortPartOfSpeech(partOfSpeech) {
  var sortedList = [];
  var letter = chooseRandomLetter();
  var url = "https://api.datamuse.com/words?sp=" + letter + "*&md=sp&max=10000";
  var wordList = requestWordList(url);
  var count = 0;
  while (count < wordList.length){
    var wordObj = wordList[count];
    if (wordObj['tags'] != undefined) {
      if (wordObj['tags'].includes(partOfSpeech)) {
        var gottenWord = wordObj['word'];
        sortedList.push(gottenWord);
      }
    }
    count += 1;
  }
  console.log('sorted list here' + sortedList);
  return sortedList;
}

sortPartOfSpeech('v');

*/