const NUMERICAL_INFORMATION_REGEX: RegExp = /\d([,.]?\d)*\s*(k?cal(ories?)?|kj)/ig
const DELETE_ENTIRELY_REGEX: RegExp = /:?\s*\(\d([,.]?\d)*\s*(k?cal(ories?)?|kj)\)/ig

interface TextBreak {
    node: Node;
    start: number;
    end: number;
}

function hideCalorieInformation(element: ChildNode) {
    for (let node of Array.from(element.childNodes)) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                hideCalorieInformation(node);
                break;
            case Node.TEXT_NODE:
                let originalTextContent = node.textContent!;
                const breaks: TextBreak[] = [];
                let previousOffset = 0;
                let previousNode = node;
                originalTextContent.replace(
                    NUMERICAL_INFORMATION_REGEX,
                    function(match, _p1, _p2, _p3, offset, string){
                        breaks.push(
                            {
                                node: previousNode,
                                start: previousOffset,
                                end: offset
                            }
                        );

                        previousOffset = offset + match.length;

                        const newNode = document.createElement("a");
                        newNode.addEventListener(
                            "mouseover",
                            function(event){
                                (<HTMLElement> event.target).textContent = match;
                            }
                        );
                        newNode.addEventListener(
                            "mouseout",
                            function(event){
                                (<HTMLElement> event.target).textContent = "[hidden]";
                            }
                        );
                        newNode.textContent = "[hidden]";
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
