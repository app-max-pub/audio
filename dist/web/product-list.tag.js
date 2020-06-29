import './photo-block.tag.js'
console.log('loaded', import.meta);
const XSL = new DOMParser().parseFromString(`<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">

        <div id='brandList'>
            <xsl:for-each select='//audio/*'>
                <div>
                    <!-- <span><xsl:value-of select='.'/></span> -->
                    <!-- <img src='https://raw.githubusercontent.com/max-pub/audio/gh-pages/vendors/{//self}/{.}/main.jpg' /> -->
                    <div class='image'><img src='/vendors/{name(.)}/logo.png' /></div>

                    <xsl:for-each select='./*'>
                        <xsl:if test="not(@key = 'logo.png')">
                            <xsl:value-of select='@key' />
                            <div class='image'><img src='/vendors/{name(..)}/{name(.)}/{./*[@key!="index.json"][1]/@key}' /></div>
                        </xsl:if>
                    </xsl:for-each>
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

const CSS = document.createTextNode(`#brandList {
        height: 256px;
        white-space: nowrap;
    }

    #brandList>div>div {
        display: inline-block
    }

    .image {
        height: 256px;
        width: 256px;
        border: 2px solid transparent;
        border-radius: 5px;
    }
    .image:hover{
        border: 2px solid silver;
        /* background: silver; */
        cursor: pointer;
    }
    .image img {
        object-fit: contain;
        width: 100%;
        height: 100%;
        /* background:silver; */
    }`);
//importCSS import CSS from './css.js';
let STYLE = document.createElement('style');
STYLE.appendChild(CSS);

window.customElements.define('product-list', class extends HTMLElement {
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



    



    //[WATCH
    static get observedAttributes() { return ['vendor'];; }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) this[name] = newValue
        if (this.attTO) clearTimeout(this.attTO);
        if (this.attributeChange) this.attTO = setTimeout(() => this.attributeChange(), 10);
    }
    //WATCH]




// }); // will be appended later

        set vendor(v) { this.load(v); }
        async load(url) {
            // let list = await fetch(`https://api.github.com/repos/max-pub/audio/contents/vendors/${url}/`).then(x => x.json());
            let data = await fetch(`/vendors/index.json`).then(x => x.json());
            console.log('products', data)
            // data = {
            //     list: list.map(x => x.name).filter(x => !x.endsWith('.png')),
            //     self: url
            // }
            console.log(this.json2xml('audio', data))
            this.insertAdjacentHTML('beforeend', this.json2xml('audio', data))
        }

        json2xml(key, value, level = 0) {
            let tag = key.replace(/\./g, '_').replace(/\s/g, '_')
            if (key * 1 == key) key = 'a' + key;
            if (typeof value == 'object') return `<${tag} key='${key}'>${Object.entries(value).map(([k, v]) => this.json2xml(k, v)).join('\n')}</${tag}>`;
            else return `<${tag} key='${key}'>${value}</${tag}>`;
        }

    });