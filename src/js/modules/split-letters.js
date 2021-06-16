export const splitLetters = (selector, wrapper = "$", delimeter = " ", joiner = " ") => {
    //let nodeList = document.querySelectorAll(selector);
    let nodeList = selector;
    let ind = 0;

    function parseLetters(node) {
        let htmlNode = node.cloneNode();
        htmlNode.innerHTML = "";

        for (let i = 0; i < node.childNodes.length; i++) {
            let childNode = node.childNodes[i];

            if (childNode.nodeType === Node.TEXT_NODE && childNode.data) {

                const trimData = childNode.data.replace(/\s+/g, ' ').trim();

                if (trimData) {

                    htmlNode.innerHTML += trimData
                        .split(delimeter)
                        .map(function(letter) {
                            if (letter === " ") {
                                return letter;
                            }
                            else {
                                ind++;
                                return wrapper.replace(/\$/g, letter).replace(/#/g, ind);
                            }
                        })
                        .join(joiner) + ' ';
                }
            }
            else {
                htmlNode.appendChild(parseLetters(childNode));
            }
        }

        return htmlNode;
    }

    nodeList.innerHTML = parseLetters(nodeList).innerHTML;
}
