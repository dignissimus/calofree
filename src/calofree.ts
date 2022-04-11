import browser from "webextension-polyfill"
import { RemovalOption, TextBreak } from "./types"
import { SELECTORS } from "./selectors"

const NUMERICAL_INFORMATION_REGEX: RegExp = /\d([,.]?\d)*\s*(k?cal(ories?)?|kj)/ig
const DELETE_ENTIRELY_REGEX: RegExp = /:?=?\s*\(?\d([,.]?\d)*\s*(k?cal(ories?)?|kj)\)?/ig
const REMOVE_ALL_REGEX: RegExp = /.*/ig

function getCalofreeRegex(removalOption: RemovalOption): RegExp {
    switch(removalOption) {
        case RemovalOption.Cover:
        case RemovalOption.Censor:
            return NUMERICAL_INFORMATION_REGEX;
        case RemovalOption.Delete:
        default:
            return DELETE_ENTIRELY_REGEX;
    }
}

function createHiddenNode(match: string, removalOption: RemovalOption) {
    switch(removalOption){
        case RemovalOption.Cover:
            const hiddenNode = document.createElement("a");
            hiddenNode.textContent = "[hidden]";
            hiddenNode.addEventListener(
                "mouseover",
                function(event){
                    (<HTMLElement> event.target).textContent = match;
                }
            );
            hiddenNode.addEventListener(
                "mouseout",
                function(event){
                    (<HTMLElement> event.target).textContent = "[hidden]";
                }
            );
            return hiddenNode;
        case RemovalOption.Censor:
            return document.createTextNode("[hidden]");
        case RemovalOption.Delete:
            return document.createTextNode("");
        default:
            return document.createTextNode("");
    }
}

function hideCalorieInformation(element: ChildNode, removalOption: RemovalOption,  regexOverride?: RegExp) {
    if (removalOption === RemovalOption.Disable)
        return;
    for (let node of Array.from(element.childNodes)) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                hideCalorieInformation(node, removalOption);
                break;
            case Node.TEXT_NODE:
                let originalTextContent = node.textContent!;
                const breaks: TextBreak[] = [];
                let previousOffset = 0;
                let previousNode = node;
                originalTextContent.replace(
                    regexOverride || getCalofreeRegex(removalOption),
                    function(match, _p1, _p2, _p3, offset, string){
                        breaks.push(
                            {
                                node: previousNode,
                                start: previousOffset,
                                end: offset
                            }
                        );

                        previousOffset = offset + match.length;

                        const newNode = createHiddenNode(match, removalOption);

                        previousNode.after(newNode);

                        const followingNode = document.createTextNode(
                            originalTextContent.substring(previousOffset)
                        );
                        newNode.after(followingNode);

                        previousNode = followingNode;
                        return "";
                    }
            ) || null;
                for (let textBreak of breaks)
                    textBreak.node.textContent = originalTextContent.substring(textBreak.start, textBreak.end);
                break;
            case Node.DOCUMENT_NODE:
                hideCalorieInformation(node, removalOption);
        }
    }
}

function hideSelector(selector: string, removalOption: RemovalOption) {
    for (let element of Array.from(document.querySelectorAll(selector))) {
        hideCalorieInformation(
            element,
            removalOption,
            REMOVE_ALL_REGEX
        );
    }
}

function calofree(){
    if (true) {
        browser.storage.local.get("option").then(
            function (result) {
                let removalOption = <RemovalOption> RemovalOption[result.option as keyof typeof RemovalOption]
                hideCalorieInformation(
                    document.body,
                    removalOption
                );
                for (let selector of SELECTORS) {
                    hideSelector(
                        selector,
                        removalOption
                    );
                }
            },
            function (result) {
                hideCalorieInformation(document.body, RemovalOption.Cover);
            }
        );
    }
}

calofree()
