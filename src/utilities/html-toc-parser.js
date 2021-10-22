import kebabCase from "lodash-es/kebabCase"

const htmlTocParser = (htmlString) => {

    let headers = []

    const div = document.createElement('div')

    div.innerHTML = htmlString

    walk(Array.from(div.childNodes))

    return { 
        html: div.innerHTML, 
        toc: toc() 
    }

    function walk (nodes) {
        nodes.forEach((node) => {
            var sub = Array.from(node.childNodes)
            if (sub.length) {
                walk(sub)
            }
            if (/h[1-6]/i.test(node.tagName)) {

                const id = kebabCase(node.innerText)

                node.insertAdjacentHTML('beforebegin', `<span class="anchor" id="${id}"></span>`);

                headers.push({
                    id,
                    level: parseInt(node.tagName.replace('H', '')),
                    title: node.innerText
                })
            }
        })
    }

    function toc () {
        const link = (header) => '<li><a href="#' + header.id + '">' + header.title + '</a></li>'

        let html = '<ul>'
        
        headers.forEach((header, index) => {
            let prev
            
            if (index) {
                prev = headers[index - 1]
            }
            if (!index || prev.level === header.level) {
                html += link(header)
            }
            else if (prev.level > header.level) {
                html += '</ul>' + link(header)
            }
            else if (prev.level < header.level) {
                html += '<ul>' + link(header)
            }
        })
        
        html += '</ul>'

        return html
    }

}

export default htmlTocParser