$(document).ready(function(){
  var poemList = {};
  //console.log(Object.entries(localStorage));
  for (var i = 0; i < localStorage.length + 1; i++){
    try {
      var poemObj = localStorage.getItem('poem' + i);
      poemObj = JSON.parse(poemObj);
      //console.log("jfoidjaf");
      //console.log(poemObj['id'],poemObj )
      poemList[poemObj['id']] = poemObj;
      //console.log("test");
      if (!poemObj.hasOwnProperty('poemName')){
        continue;
      }
      $('#savedPoemsDiv').prepend(`<div id="${poemObj['id']}" class="poemItem"><h3>${poemObj['poemName']}</h3></div>`);
    } catch(err){
      //pass
    }
  }
  $(".poemItem").bind('click', function(){
    console.log("pressing");
     var url = "https://techacks-hackathon.michelletu3.repl.co/savedPoems/viewPoem.html?id=" + encodeURIComponent(this.id)+"&name=" + encodeURIComponent(poemList[this.id]['poemName']);
        window.location.href = url;
      });
  console.log(poemList);
});

/*
 $("#header").on('click', function(){
    console.log("press2");
  });
  console.log(poemList);
  
  && typeof(poemObj) === 'object' && JSON.parse(poemObj).hasOwnProperty('poemName')
*/