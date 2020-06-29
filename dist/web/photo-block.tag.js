console.log('loaded', import.meta);
const HTM = new DOMParser().parseFromString(`<img src='' />`, 'text/html');
//importXSL import XSL from './xsl.js';
// console.log("XSL",XSL);



const CSS = document.createTextNode(`:host {
        display: inline-block;
    }`);
//importCSS import CSS from './css.js';
let STYLE = document.createElement('style');
STYLE.appendChild(CSS);

window.customElements.define('photo-block', class extends HTMLElement {
    constructor() {
        super();
        // console.log('constructor', this.innerHTML);
        this.attachShadow({ mode: 'open', delegatesFocus: true });
        // this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#app-auth').content.cloneNode(true));

        

        //[HTML
        this.applyHTML();
        // this.shadowRoot.innerHTML = `<style>${STYLE.textContent}</style>` + new XMLSerializer().serializeToString(HTM);
        // this.shadowRoot.insertAdjacentElement('afterbegin',STYLE);
        //HTML]

        

        
		
        

        
    }


    connectedCallback() {
        
        if(this.dataChange) this.dataChange();
        
    }



    //[HTML
    applyHTML() {
        this.shadowRoot.innerHTML = `<style>${STYLE.textContent}</style>` + new XMLSerializer().serializeToString(HTM);
        // this.shadowRoot.insertAdjacentElement('afterbegin',STYLE);
    }
    //HTML]


    

    //[$1
    $(q) { return this.shadowRoot.querySelector(q) }
    //$1]

    

    __(q){return Array.from(this.querySelectorAll(q))}



    



    //[WATCH
    static get observedAttributes() { return ['src'];; }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) this[name] = newValue
        if (this.attTO) clearTimeout(this.attTO);
        if (this.attributeChange) this.attTO = setTimeout(() => this.attributeChange(), 10);
    }
    //WATCH]




// }); // will be appended later

        set src(v) {
            this.$('img').setAttribute('src', v);
        }


    });