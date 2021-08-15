$(document).ready(function(){
  var maxSyllables = 4; //per word 
  var poemSaved = '';
   $("#generateButton").on('click', function() { 
    $('.poem').empty();
    var poemLines = generateHaiku();
    poemLines = format(poemLines);
    poemSaved = poemLines;
    addToDom(poemLines);
    $("#copyMessage").empty();
    $("#copyButton").on('click', function() {
      console.log('copied!');
      $("#copyMessage").text("Copied!");
      var value = "";
      var count = 0;
      while (count < poem.length) {
        value += poem[count];
        count += 1;
      }
      navigator.clipboard.writeText(value);
    });
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


function makeFiveLine() {
  var fiveLine = generateFullLine([], 5, true, allLineVariations, false);
  console.log("SYLLABLES BEFORE CHANGES:", syllablesInLine);
  if (syllablesInLine > 5) {
    fiveLine = [fiveLine[0]];
    var url = "https://api.datamuse.com/words?sp=" + fiveLine[0] + "*&md=sp";
    var wordList = requestWordList(url);
    syllablesInLine = wordList[0]['numSyllables'];
    console.log("SYLLABLES AFTER SLICING:", syllablesInLine);
  }
  while (syllablesInLine < 5) {
    var extraAdj = findWord([], 'adj', (5 - syllablesInLine), 0, true);
    console.log('EXTRA ADJECTIVE:', extraAdj);
    while (extraAdj == undefined) {
      extraAdj = findWord([], 'adj', (5 - syllablesInLine), 0, true);
      console.log('EXTRA ADJECTIVE:', extraAdj);
    }
    fiveLine.push(extraAdj['word']);
    console.log(fiveLine);
    syllablesInLine += extraAdj['numSyllables'];
  }
  console.log("END SYLLABLES:", syllablesInLine);
  return fiveLine;
}

function makeSevenLine() {
  var sevenLine = generateFullLine([], 7, true, allLineVariations, false);
  console.log("SYLLABLES BEFORE CHANGES:", syllablesInLine);
  if (syllablesInLine > 7) {
    sevenLine = [sevenLine[0]];
    var url = "https://api.datamuse.com/words?sp=" + sevenLine[0] + "*&md=sp";
    var wordList = requestWordList(url);
    syllablesInLine = wordList[0]['numSyllables'];
    console.log("SYLLABLES AFTER SLICING:", syllablesInLine);
  }
  while (syllablesInLine < 7) {
    var extraAdj = findWord([], 'adj', (7 - syllablesInLine), 0, true);
    console.log('EXTRA ADJECTIVE:', extraAdj);
    while (extraAdj == undefined) {
      extraAdj = findWord([], 'adj', (7 - syllablesInLine), 0, true);
      console.log('EXTRA ADJECTIVE:', extraAdj);
    }
    sevenLine.push(extraAdj['word']);
    console.log(sevenLine);
    syllablesInLine += extraAdj['numSyllables'];
  }
  console.log("END SYLLABLES:", syllablesInLine);
  return sevenLine;
}

function generateHaiku() {
  var five1 = makeFiveLine();
  var seven = makeSevenLine();
  var five2 = makeFiveLine();
  poemLines = [five1, seven, five2];
  console.log(poemLines);
  return poemLines;
}