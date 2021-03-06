import browser from "webextension-polyfill"
import { RemovalOption } from "./types"

let selectedOption = RemovalOption.Cover;
const ids = ["option-censor", "option-cover", "option-delete", "option-disable"];


function loadOption(removalOption: RemovalOption){
    const censor = document.getElementById("option-censor")!;
    const cover = document.getElementById("option-cover")!;
    const remove = document.getElementById("option-delete")!;
    const disable = document.getElementById("option-disable")!;
    selectedOption = removalOption;

    switch(removalOption){
        case RemovalOption.Cover:
            selectOption(cover);
            break;
        case RemovalOption.Censor:
            selectOption(censor);
            break
        case RemovalOption.Disable:
            selectOption(disable);
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
        case "option-censor":
            setOption(RemovalOption.Censor);
            break;
        case "option-cover":
            setOption(RemovalOption.Cover);
            break
        case "option-disable":
            setOption(RemovalOption.Disable);
            break
        case "option-delete":
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
            browser.tabs.reload();
        }
    );
  }
});
