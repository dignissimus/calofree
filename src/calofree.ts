const NUMERICAL_INFORMATION_REGEX: RegExp = /\d([,.]?\d)*\s*(k?cal(ories?)?|kj)/ig

function hideCalorieInformation(element: ChildNode) {
    for (let node of element.childNodes) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                hideCalorieInformation(node);
                break;
            case Node.TEXT_NODE:
                node.textContent = node.textContent?.replace(NUMERICAL_INFORMATION_REGEX, "[hidden]") || null;
                break;
            case Node.DOCUMENT_NODE:
                hideCalorieInformation(node);
        }
    }
}

function calofree(){
    if (true) {
        hideCalorieInformation(document.body);
    }
}

calofree()
