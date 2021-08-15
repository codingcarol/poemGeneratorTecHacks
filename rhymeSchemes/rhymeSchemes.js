$(document).ready(function(){
  var maxSyllables = 4; //per word 
  var poemSaved = "";
  var poemType = ''
  var rhymeSchemeInfo = {
    'tripletForm': {
      'rhyme-scheme': 'aaa'
    },
    'alternateForm': {
      'rhyme-scheme': 'abab'
    },
    'enclosedForm': {
      'rhyme-scheme': 'abba'
    },
    'limerickForm': {
      'rhyme-scheme': 'aabba'
    }
  };
   $(".rhymeForm").submit(function (e) { 
    e.preventDefault();
    $(`#${rhymeScheme}CopyMessage`).empty();
    var input_values =  $(this).serializeArray();
    var id = $(this).prop('id');
    poemType = id;
    console.log(input_values);
    console.log(id);
    //sanitize inputs 
    var rhymingWords = {};
    input_values.forEach(inputVal => {
      var rhyme = inputVal['value'].trim();
      var rhymeName = inputVal['name'];
      rhymingWords[rhymeName.charAt(rhymeName.length - 1).toLowerCase()] = rhyme;
    });
    console.log("RHYME", rhymingWords);
    //send to function
    var rhymeScheme = rhymeSchemeInfo[id]['rhyme-scheme'];
    $(`#${rhymeScheme}Result`).empty();
    var poem = createRhymePoem(rhymeScheme, rhymingWords);
    poemSaved = poem;
    console.log(poem, 'MESSAGE');
    console.log(typeof(poem));
    if (poem['length'] <= 0 || poem === 'undefined'){
      $(`#${rhymeScheme}Result`).append(`<p>No rhymes found.</p>`);
      console.log("hererw");
      return
    }
    poem.forEach(poemLine =>{
      $(`#${rhymeScheme}Result`).append(`<p>${poemLine}</p>`);
    });

    $(`#${rhymeScheme}CopyButton`).on('click', function() {
      console.log('copied!');
      $(`#${rhymeScheme}CopyMessage`).text("Copied!");
      var value = "";
      var count = 0;
      while (count < poem.length) {
        value += poem[count];
        count += 1;
      }
      navigator.clipboard.writeText(value);
    });
    console.log("FULL POEM", poem);
  });

  /*
  $('#saveButton').on('click', function(){
      console.log('testinggg');
      var poemName = $(`#${poemType}PoemName`).val(); //add control conditions later, like no input and disable save button once saved
      console.log('pressed');
      console.log(poemName);
      savePoemLocal(poemName, poemSaved);
  });

  $('#saveButton2').on('click', function(){
      console.log('testinggg');
      var poemName = $(`#${poemType}PoemName`).val(); //add control conditions later, like no input and disable save button once saved
      console.log('pressed');
      console.log(poemName);
      savePoemLocal(poemName, poemSaved);
  });*/

  $('.saveButtons').on('click', function(){
      console.log('testinggg');
      var poemName = $(`#${poemType}PoemName`).val(); //add control conditions later, like no input and disable save button once saved
      console.log('pressed');
      console.log(poemName);
      savePoemLocal(poemName, poemSaved);
  });
});

function createRhymePoem(rhymeScheme, rhymingWord){
  console.log(rhymeScheme, rhymingWord);
  var poemLines = [];
  rhymeScheme.split('').forEach(rhymeLetter => {
    var wordToRhyme = rhymingWord[rhymeLetter];
    console.log(wordToRhyme);
    var newRhyme = getRandomRhymeWord(wordToRhyme, 6);
    if (!newRhyme.hasOwnProperty("tags")){
      console.log("mesfeagaewg");
      return 'try again';
    }
    var rhymePOS = newRhyme['tags'][0];
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

    var line = generateFullLine([], 15, true, lineVarOptions, false);
    line.pop();
    console.log(line, 'IS LINE');
    if (line == 'undefined'){
      return "try again";
    }
    line.push(newRhyme['word']);
    console.log('POEM LINE HERE', line);
    poemLines.push(line);
  });
  //console.log("FULL POEM", poemLines);
  //console.log(format(poemLines), "FORMATTED");
  return format(poemLines);
};