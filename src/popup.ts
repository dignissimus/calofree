import browser from "webextension-polyfill"
import { RemovalOption } from "./types"

let selectedOption = RemovalOption.Cover;
const ids = ["option-1", "option-2", "option-3"];


function loadOption(removalOption: RemovalOption){
    const censor = document.getElementById("option-1")!;
    const cover = document.getElementById("option-2")!;
    const remove = document.getElementById("option-3")!;
    selectedOption = removalOption;

    switch(removalOption){
        case RemovalOption.Cover:
            selectOption(cover);
            break;
        case RemovalOption.Censor:
            selectOption(censor);
            break
        case RemovalOption.Delete:
        default:
            selectOption(remove);
    }
}

function setOption(removalOption: RemovalOption) {
    browser.storage.local.set({option: RemovalOption[removalOption]});
}

function loadOptions(){
    browser.storage.local.get("option").then(
      function (result){
          if (result.option !== undefined) {
              loadOption(<RemovalOption>RemovalOption[result.option as keyof typeof RemovalOption]);
          }
          else {
              setOption(RemovalOption.Cover)
              loadOption(RemovalOption.Cover);
          }
      },
      function (result) {
          setOption(RemovalOption.Cover);
          loadOption(RemovalOption.Cover);
      }
    );
}

function selectOption(element: HTMLElement){

    element.classList.add("selected");
    for (let optionId of ids){
       if (optionId !== element.id) {
            document.getElementById(optionId)!.classList.remove("selected");
       }
    }
}

function updateOption(element: HTMLElement) {
    switch(element.id){
        case "option-1":
            setOption(RemovalOption.Censor);
            break;
        case "option-2":
            setOption(RemovalOption.Cover);
            break
        case "option-3":
        default:
            setOption(RemovalOption.Delete);
    }
}

document.addEventListener('DOMContentLoaded', loadOptions);

window.addEventListener("load", function(){
  for (let optionId of ids){
    document.getElementById(optionId)!
      .addEventListener(
        "click",
        (event) => {
            const element = (<HTMLElement> event.target).parentElement!;
            selectOption(element);
            updateOption(element);
        }
    );
  }
});
