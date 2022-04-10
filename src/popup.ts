window.addEventListener("load", function(){
  document.getElementById("option-1")!
    .addEventListener(
      "click",
      function(event){
        (<HTMLElement> event.target).classList.toggle("selected")
      }
  );
});
