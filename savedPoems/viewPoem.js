$(document).ready(function(){
  var queries = window.location.search;
  console.log(Object.entries(localStorage));
  console.log(queries);
  var queryObj = parseQueries(queries);
  var poemObj = localStorage.getItem(queryObj['id']);
  poemObj = JSON.parse(poemObj);
  console.log(poemObj);
  showContent(poemObj);
});

function parseQueries(queries){
  var q = queries.split("?")[1].split("&");
  var queryObj = {};
  q.forEach(query => {
    queryObj[query.split("=")[0]] = query.split("=")[1];
  });
  return queryObj;
};

function showContent(poemObj){
  console.log("showing content");
  $('#title').text(poemObj['poemName']);
  var poemLines = poemObj['poemContent'];
  for (var i = 0; i < poemLines.length; i++){
    $('#poemContent').append(`<p>${poemLines[i]}</p>`);
  }
}