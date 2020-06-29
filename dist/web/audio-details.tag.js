console.log('loaded', import.meta);
const XSL = new DOMParser().parseFromString(`<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
        <div id='images'>
            <xsl:for-each select='.//images/*'>
                <img src='https://raw.githubusercontent.com/max-pub/audio/gh-pages/{//self}/{.}' />
            </xsl:for-each>
        </div>
        <table>
            <tr>
                <td>Dimensions</td>
                <td>
                    <xsl:value-of select='//size/h' /> x
                    <xsl:value-of select='//size/w' /> x
                    <xsl:value-of select='//size/d' /> cm
                    = 
                    <xsl:value-of select='//volume' /> liter
                </td>
            </tr>
            <!-- <tr>
                <td>width</td>
                <td>
                    <xsl:value-of select='//size/w' /> cm
                </td>
            </tr>
            <tr>
                <td>depth</td>
                <td>
                    <xsl:value-of select='//size/d' /> cm
                </td>
            </tr>
            <tr>
                <td>volume</td>
                <td>
                    <xsl:value-of select='//volume' /> liter
                </td>
            </tr> -->
            <tr>
                <td>weight</td>
                <td>
                    <xsl:value-of select='//weight' /> g
                </td>
            </tr>
            <tr>
                <td>density</td>
                <td>
                    <xsl:value-of select='round(//weight div //volume)' /> g/l
                </td>
            </tr>
            <tr>
                <td>total driver size</td>
                <td>
                    <xsl:value-of select='//totaldriversize' />
                    cm<sup>2</sup>
                </td>
            </tr>
        </table>
        <xsl:value-of select='//price/eur' />€
        <xsl:if test='//apple/airplay'>
            <img class='brand' src='/apple.svg' />
        </xsl:if>
        <xsl:if test='//google/cast'>
            <img class='brand' src='/google.svg' />
        </xsl:if>
        <xsl:if test='//spotify'>
            <img class='brand' src='/spotify.svg' />
        </xsl:if>
        <img class='brand' src='/amazon.svg' />

        driver:
        <div id='driverList'>
            <xsl:for-each select='.//driver/*'>
                <div class='driver' style='width:{translate(.," ","")}; height:{translate(.," ","")}; '></div>
            </xsl:for-each>
        </div>
        
        front:
        <div class='dimensions' style='width:{translate(//size/w," ","")}; height:{translate(//size/h," ","")}; '></div>
        side:
        <div class='dimensions' style='width:{translate(//size/d," ","")}; height:{translate(//size/h," ","")}; '></div>


    </xsl:template>
</xsl:stylesheet>
`, 'text/xml');
//importXSL import XSL from './xsl.js';
// console.log("XSL",XSL);

//[XSLT
const XSLT = new XSLTProcessor();
XSLT.importStylesheet(XSL);
//XSLT]

const CSS = document.createTextNode(`/* *{color:red} */
    #images {
        height: 400px;
        white-space: nowrap;
        overflow-x: auto;
    }

    #images img {
        height: 100%
    }

    .dimensions {
        background: silver;
    }

    img.brand {
        width: 50px;
        margin: 5px;
    }

    #driverList{
        white-space: nowrap;
        overflow-x: auto;
        vertical-align: middle;
    }
    .driver {
        background: silver;
        border-radius: 100%;
        margin: 5px;
        display: inline-block;
    }`);
//importCSS import CSS from './css.js';
let STYLE = document.createElement('style');
STYLE.appendChild(CSS);

window.customElements.define('audio-details', class extends HTMLElement {
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
    static get observedAttributes() { return ['item'];; }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) this[name] = newValue
        if (this.attTO) clearTimeout(this.attTO);
        if (this.attributeChange) this.attTO = setTimeout(() => this.attributeChange(), 10);
    }
    //WATCH]




// }); // will be appended later

        set item(v) { this.load(v); }
        async load(url) {
            let item = 'jays/living3';
            // let data = await fetch(`http://git.max.pub/audio/sonos/one/index.json`).then(x=>x.json());
            let data = await fetch(`http://git.max.pub/audio/${item}/index.json`).then(x => x.json());
            let images = await fetch(`https://api.github.com/repos/max-pub/audio/contents/${item}`).then(x => x.json());
            data.images = images.filter(x => x.name.endsWith('.jpg')).map(x => x.name);
            data.self = item;
            console.log(Object.values(data.size));
            data.volume = Number.parseFloat(Object.values(data.size).reduce((acc, val) => acc * this.size(val), 1) / 1000).toFixed(1);
            // data.driverSize = data.driver.map(x => this.size(x) ** 2).map(x => x.toFixed(1)) // square
            data.driverSize = data.driver.map(x => Math.round((this.size(x) / 2) ** 2 * 3.14)).map(x => x.toFixed(1)) // circle
            data.totalDriverSize = data.driverSize.reduce((acc, val) => acc + val * 1, 0);
            for(let dim in data.size) data.size[dim] = this.size(data.size[dim])
            console.log(data)
            console.log(this.json2xml('audio', data))
            // this.DATA = this.json2xml('audio',data);
            this.insertAdjacentHTML('beforeend', this.json2xml('audio', data))
        }
        size(p) {
            let [value, unit] = p.split(' ')
            let map = { in: 2.54, mm: 1 / 10, g: 1 / 1000 }
            return value * map[unit];
        }
        json2xml(key, value, level = 0) {
            if (key * 1 == key) key = 'a' + key;
            if (typeof value == 'object') return `<${key}>${Object.entries(value).map(([k, v]) => this.json2xml(k, v)).join('\n')}</${key}>`;
            else return `<${key}>${value}</${key}>`;
        }

    });