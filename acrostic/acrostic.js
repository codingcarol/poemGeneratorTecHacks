$(document).ready(function(){
  var maxSyllables = 4; //per word 
  var poemSaved = '';
   $("#acrosticForm").submit(function (e) { 
    e.preventDefault();
    var input_values =  $(this).serializeArray();
    var word = input_values[0]['value'];
    var $error = $("<h5>", {
        class : "text-danger"
        });
    word = word.trim()
    $('.poem').empty();
    if (word.length == 0){
      $error.text('*Please input a word*').appendTo($('.poem'));
      console.log("error behavior. input letters");
    } else if (word.length > 14){
      $error.text('*Sorry, too many letters. Please input a word fewer than 14 characters*').appendTo($('.poem'));
      console.log("too many letters");
    } else { //note for later: we should probably check if all of these are letters too
      var poemLines = generateAcrostic(word, maxSyllables);
      poemSaved = poemLines;
      //poem comes back as list, parse through + display now
      $("#copyButton").on('click', function() {
        console.log('copied!');
        $("#copyMessage").text("Copied!");
        var value = "";
        var count = 0;
        while (count < poemLines.length) {
          value += poemLines[count];
          count += 1;
      }
      navigator.clipboard.writeText(value);
      });
      $("#copyMessage").empty();
      addToDom(poemLines);
    }
  });

  $('#saveButton').on('click', function(){
      //console.log('pressed');
      var poemName = $("#poemName").val(); //add control conditions later, like no input and disable save button once saved
      //console.log(poemSaved);
      //poemLineSaved[0] = poemLineSaved[0].trim();
      //poemArray = poemArray.concat(poemLineSaved);
      //console.log(poemName, poemSaved);
      savePoemLocal(poemName, poemSaved);
    });
});

function generateAcrostic(word, maxSyllables){
  //returns an array of strings
  console.log('test');
  console.log(word);
  var poemLines = [];
  for (var i = 0; i < word.length; i++){
    var letter = word[i];
    var line = generateFullLine([letter], maxSyllables, true, ['any'], false);
    console.log("generatefull", line);
    poemLines.push(line);
  }
  console.log("POEM LINES", poemLines);
  var poemLinesJoint = []
  poemLines.forEach(l => {
    var newLine = '';
    l.forEach(word => {
      newLine += word + ' ';
      console.log(word);
    });
    newLine = newLine.trim();
    poemLinesJoint.push(newLine);
  });
  
  var count = 0;
  while (count < poemLinesJoint.length) {
    var thisLine = poemLinesJoint[count];
    var bigLetter = thisLine.charAt(0).toUpperCase();
    thisLine = thisLine.slice(1);
    thisLine = bigLetter + thisLine;
    if (count < (poemLinesJoint.length - 1)) {
      thisLine += ', ';
    }
    poemLinesJoint[count] = thisLine;
    count += 1;
  }

  return poemLinesJoint;
}


/*

function generateFullLine(firstLetter, maxSyllables){
  //returns a string
  var lineObj = getPoemLineObj(firstLetter, maxSyllables); //REMEMBER TO CATCH ERROR HERE
 // var lineVariation = chooseLineVariation();
  var line = `${lineObj['noun']} ${getRandomVerb()} ${lineObj['adj']}`;
  return line; 
}

function generateFullLine(firstLetter, maxSyllables){
  //returns a string
  var lineObj = getPoemLineObj(firstLetter, maxSyllables); //REMEMBER TO CATCH ERROR HERE
  var lineVariation = chooseLineVariation();
  var line = `${lineObj['noun']} ${getRandomVerb()} ${lineObj['adj']}`;
  return line; 
}

function chooseLineVariation(){
  var lineVariations = [['noun', ]]
}

function getPoemLineObj(firstLetter, maxSyllables){
  //RETURNS A NEW POEM LINE
  var lineCreated = false;
  var count = 0;
  var minScore = 1500;
  while (!lineCreated && count < 500){
    /*have to do this in case of occasional errors...
    count += 1;
    try {
      var nounObj = findWord(firstLetter, 'n', maxSyllables, minScore);
      console.log("NOUN OBJECT", nounObj);
      
      var vObj = findWord(chooseRandomLetter(), 'v', maxSyllables, minScore);
      console.log("VERB OBJECT", vObj);
      //return nounObj['word'] + ' is ' + adjObj['word']; 
      var thirdSpeech = nounOrAdj();
      var adjObj = null;
      if (thirdSpeech == 'n'){
        adjObj = findWord(chooseRandomLetter(), 'n', maxSyllables, minScore);
      } else {
        adjObj = findWord(chooseRandomLetter(), 'adv', maxSyllables + 2, 200);
      }
      //console.log("ADJ OBJECT", adjObj);
      if (typeof nounObj == 'undefined' || typeof vObj == 'undefined' || typeof adjObj == 'undefined'){
        continue; 
      }
      return {'noun': nounObj['word'], 'verb': vObj['word'], 'adj': adjObj['word']}
      //return  + ' ' +   + 's ' + ; //with selected verb, need better algorthm for verb choice / agreement
    } catch(err){
      //pass
      console.log(err)
    }
    return "ERROR";
  }
}*/
/*
function getPoemLineObj(firstLetter, maxSyllables){
  //RETURNS A NEW POEM LINE
  var lineCreated = false;
  var count = 0;
  var minScore = 1000;
  try {
      var nounObj = findWord(firstLetter, 'n', maxSyllables, minScore);
      console.log("NOUN OBJECT", nounObj);
      
      var vObj = findWord(chooseRandomLetter(), 'v', maxSyllables, minScore);
      console.log("VERB OBJECT", vObj);
      //return nounObj['word'] + ' is ' + adjObj['word']; 
      var thirdSpeech = nounOrAdj();
      var adjObj = null;
      if (thirdSpeech == 'n'){
        adjObj = findWord(chooseRandomLetter(), 'n', maxSyllables, minScore);
      } else {
        adjObj = findWord(chooseRandomLetter(), 'adv', maxSyllables + 2, 200);
      }
      //console.log("ADJ OBJECT", adjObj);

      return {'noun': nounObj['word'], 'verb': vObj['word'], 'adj': adjObj['word']}
      //return  + ' ' +   + 's ' + ; //with selected verb, need better algorthm for verb choice / agreement
    } catch(err){
      //pass
      console.log(err)
    }
    return "ERROR";
  }


function getPoemLineObj(firstLetter, maxSyllables){
  //RETURNS A NEW POEM LINE
  var lineCreated = false;
  var count = 0;
  var minScore = 2000;
  while (!lineCreated && count < 500){
    /*have to do this in case of occasional errors...
    count += 1;
    try {
      var nounObj = findWord(firstLetter, 'n', maxSyllables, minScore);
      console.log("NOUN OBJECT", nounObj);
      
      var vObj = findWord(chooseRandomLetter(), 'v', maxSyllables, minScore);
      console.log("VERB OBJECT", vObj);
      //return nounObj['word'] + ' is ' + adjObj['word']; 
      var thirdSpeech = nounOrAdj();
      var adjObj = null;
      if (thirdSpeech == 'n'){
        adjObj = findWord(chooseRandomLetter(), 'n', maxSyllables, minScore);
      } else {
        adjObj = findWord(chooseRandomLetter(), 'adv', maxSyllables + 2, 200);
      }
      //console.log("ADJ OBJECT", adjObj);

      return {'noun': nounObj['word'], 'verb': vObj['word'], 'adj': adjObj['word']}
      //return  + ' ' +   + 's ' + ; //with selected verb, need better algorthm for verb choice / agreement
    } catch(err){
      //pass
    }
  }
  return "ERROR";
}

function nounOrAdj(){
  //returns string
  var options = ['n', 'adv'];
  var chosen = options[Math.floor(Math.random()*options.length)];
  return chosen;
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
    console.log(testWord);
    try {
      if (testWord['numSyllables'] <= maxSyllables && testWord['tags'].includes(partSpeech) && testWord['score'] >= minScore){
          wordChosen = true; //don't need but just in case
          console.log('VALID WORD', testWord);
          return testWord;
      }
    } catch(err){
      continue;
    }
  }
}
*/