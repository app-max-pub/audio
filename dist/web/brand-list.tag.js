import './photo-block.tag.js'
console.log('loaded', import.meta);
const XSL = new DOMParser().parseFromString(`<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">

        <div id='brandList'>
            <xsl:for-each select='//audio/*'>
                <div>
                    <!-- <span><xsl:value-of select='.'/></span> -->
                    <img src='https://raw.githubusercontent.com/max-pub/audio/gh-pages/{.}/logo.png'/>
                </div>
            </xsl:for-each>
        </div>

    </xsl:template>
</xsl:stylesheet>
`, 'text/xml');
//importXSL import XSL from './xsl.js';
// console.log("XSL",XSL);

//[XSLT
const XSLT = new XSLTProcessor();
XSLT.importStylesheet(XSL);
//XSLT]

const CSS = document.createTextNode(`#brandList div{height: 100px; width: 100px;}
#brandList img{object-fit: contain; width:100%; height:100%;}`);
//importCSS import CSS from './css.js';
let STYLE = document.createElement('style');
STYLE.appendChild(CSS);

window.customElements.define('brand-list', class extends HTMLElement {
    constructor() {
        super();
        // console.log('constructor', this.innerHTML);
        this.attachShadow({ mode: 'open', delegatesFocus: true });
        // this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#app-auth').content.cloneNode(true));

        //[XSLT
        this.xmlObserver = new MutationObserver(e => this.applyXSLT())
            .observe(this, { attributes: true, characterData: true, childList: true, subtree: true });
        // window.addEventListener('load', () => this.applyXSLT());
        //XSLT]

        

        

        
		
        

        //[INIT
        this.INIT();
        //INIT]
    }


    connectedCallback() {
        //[XSLT
        this.applyXSLT()
        //XSLT]
        if(this.dataChange) this.dataChange();
        
    }



    


    //[XSLT
    set DATA(XML) {
        this.CLEAR(this);
        this.appendChild(typeof XML == 'string' ? new DOMParser().parseFromString(XML, 'text/xml').firstChild : XML);
    }
    CLEAR(R) {
        while (R.lastChild)
            R.removeChild(R.lastChild);
    }


    applyXSLT() {
        if (this.dataChange) this.dataChange();
        window.requestAnimationFrame(t => {
            let R = this.shadowRoot;
            // console.log('root', R, this);
            // https://jsperf.com/innerhtml-vs-removechild/15
            // while (R.lastChild)
            // R.removeChild(R.lastChild);

            // this.CLEAR(R);
            // R.appendChild(STYLE.cloneNode(true));

            let xml = new DOMParser().parseFromString(new XMLSerializer().serializeToString(this).replace(/xmlns=".*?"/,''), 'text/xml'); // some platforms need to reparse the xml
            // xml.firstChild.removeAttribute('xmlns');
            // let xml = new DOMParser().parseFromString(this.outerHTML, 'text/xml') ; 
            // let xml = navigator.userAgent.includes('Firefox') ? new DOMParser().parseFromString(this.outerHTML, 'text/html') : this; // firefox bug... needs to reparse html
            // console.log('applyXSLT result', xml, XSL, XSLT.transformToFragment(xml, document));
            // R.appendChild(XSLT.transformToFragment(xml, document));

            let output = XSLT.transformToFragment(xml, document);
			this.shadowRoot.innerHTML = `<style>${STYLE.innerText}</style>`+new XMLSerializer().serializeToString(output);
        });
    }
    // R.innerHTML = '';
    // this.shadowRoot.innerHTML = `<link rel="stylesheet" href="${import.meta.url.slice(0, -3)}.css">`/// + new XMLSerializer().serializeToString(output);
    // console.log('output',new XMLSerializer().serializeToString( XSLT.transformToFragment(this, document)));
    //XSLT]

    

    

    __(q){return Array.from(this.querySelectorAll(q))}



    



    




// }); // will be appended later
        async INIT() {
            let data = await fetch(`https://api.github.com/repos/max-pub/audio/contents/`).then(x => x.json());
            data = data.map(x=>x.name)
            console.log(this.json2xml('audio',data))
            this.insertAdjacentHTML('beforeend', this.json2xml('audio', data))
        }

        json2xml(key, value, level = 0) {
            if (key * 1 == key) key = 'a' + key;
            if (typeof value == 'object') return `<${key}>${Object.entries(value).map(([k, v]) => this.json2xml(k, v)).join('\n')}</${key}>`;
            else return `<${key}>${value}</${key}>`;
        }

    });