import { List, Listenable, Listener, Option, Value } from './definitions';

export class Int implements Value, Listenable {
    name: string;
    type: string;
    value: number;
    active: boolean;
    listeners: Listener[];
    rerender: () => void;
    constructor(name: string, value: number, rerender: () => void) {
        this.name = name;
        this.type = 'int';
        this.value = value;
        this.active = true;
        this.listeners = [];
        this.rerender = rerender;
    }
    exportJSX() {
        if (!this.active) return <></>;
        return(
        <div className='sb-row'>
            <span>{this.name}</span>
            <input className='input-int' onChange={e => this.set(Math.floor(parseFloat(e.target.value)))} type="number" value={this.value} />
        </div>
        )
    }
    exportString() {
        if (!this.active) return '';
        return this.value.toString();
    }
    clone() {
        return new Int(this.name, this.value, this.rerender);
    }
    set(value: number) {
        this.value = value;
        this.listeners.forEach((v) => v.listen(this));
        this.rerender();
    }
    addListener(value: Listener) {
        this.listeners.push(value);
    }
}

export class Position implements Value, Listenable {
    type: string;
    value: number;
    active: boolean;
    name: string;
    listeners: Listener[];
    rerender: () => void;
    constructor(name: string, value: number, rerender: () => void) {
        this.name = name;
        this.type = 'position';
        this.value = value;
        this.active = true;
        this.listeners = [];
        this.rerender = rerender;
    }
    exportJSX() {
        if (!this.active) return <></>;
        return (
        <div className='sb-row'>
            <span>{this.name}</span>
            <input onChange={e => this.set(Math.floor(parseFloat(e.target.value)))} type="number" value={this.value} className='input-int' />
            <button>Select</button>
        </div>
        )
    }
    exportString() {
        if (!this.active) return '';
        return this.value.toString();
    }
    clone(){
        return new Position(this.name, this.value, this.rerender);
    }
    set(value: number){
        this.value = value;
        this.rerender();
    }
    addListener(value: Listener){
        this.listeners.push(value);
    }
}

export class Boolean implements Value, Listenable {
    name: string;
    type: string;
    value: boolean;
    active: boolean;
    listeners: Listener[];
    rerender: () => void;
    constructor(name: string, value: boolean, rerender: () => void) {
        this.name = name;
        this.type = 'boolean';
        this.value = value;
        this.active = true;
        this.listeners = [];
        this.rerender = rerender;
    }
    exportJSX() {
        if (!this.active) return <></>;

        return (
            <div className='sb-row'>
                <span>{this.name}</span>
                <input onChange={e => this.set(e.target.checked)} type="checkbox" checked={this.value} />
            </div>
        )
    }
    exportString() {
        if (!this.active) return "";
        return this.value ? '1' : '0';
    }
    clone(){
        return new Boolean(this.name, this.value, this.rerender);
    }
    set(value: boolean){
        this.value = value;
        this.listeners.forEach((v) => v.listen(this));
        this.rerender();
    }
    addListener(value: Listener){
        this.listeners.push(value);
    }
}

export class Select implements Value, Listenable {
    name: string;
    type: string;
    value: Option;
    active: boolean;
    options: Option[];
    listeners: Listener[];
    rerender: () => void;
    constructor(name: string, value: Option[], rerender: () => void) {
        this.name = name;
        this.type = 'select';
        this.value = value[0];
        this.options = value;
        this.active = true;
        this.listeners = [];
        this.rerender = rerender;
    }
    exportJSX() {
        if (!this.active) return <></>
        return (
            <div className='sb-row'>
                <span>{this.name}</span>
                <select onChange={e => this.set(e.target.value)} value={this.value.value}>
                    {this.options.map((val, ind) => <option key={ind} value={val.value}>{val.name}</option>)}
                </select>
            </div>
        );
    }
    exportString() {
        if (!this.active) return "";
        return this.value.value.toString();
    }
    clone(){
        return new Select(this.name, this.options, this.rerender);
    }
    set(value: string){
        let index = this.options.findIndex((v) => v.value === value);
        this.value = this.options[index];
        this.listeners.forEach((v) => v.listen(this));
        this.rerender();
    }
    addListener(value: Listener){
        this.listeners.push(value);
    }
}

export class String implements Value, Listenable {
    name: string;
    type: string;
    value: string;
    active: boolean;
    listeners: Listener[];
    constructor(name: string, value: string) {
        this.name = name;
        this.type = 'string';
        this.value = value;
        this.active = true;
        this.listeners = [];
    }
    exportJSX() {
        if (!this.active) return <></>;
        return (
            <div className='sb-row'>
                <span>{this.name}</span>
                <input onChange={e => this.set(e.target.value)} type="text" value={this.value} />
            </div>
        );
    }
    exportString() {
        if (!this.active) return "";
        return this.value.toString();
    }
    clone(){
        return new String(this.name, this.value);
    }
    set(value: string){
        this.value = value;
        this.listeners.forEach((v) => v.listen(this));
    }
    addListener(value: Listener){
        this.listeners.push(value);
    }
}

export class Color implements Value, Listenable {
    type: string;
    value: string;
    active: boolean;
    name: string;
    listeners: Listener[];
    rerender: () => void
    constructor(name: string, value: string, rerender: () => void) {
        this.name = name;
        this.type = 'color';
        this.value = value;
        this.active = true;
        this.listeners = [];
        this.rerender = rerender;
    }
    exportJSX() {
        if (!this.active) return <></>;
        return (
            <div className='sb-row'>
                <span>{this.name}</span>
                <input onChange={e => this.set(e.target.value)} type="color" value={"#" + this.value} />
            </div>
        
        )
    }
    exportString() {
        if (!this.active) return "";
        console.log('color:', this.value);
        return this.value;
    }
    clone(){
        return new Color(this.name, this.value, this.rerender);
    }
    set(value: string){
        this.value = value.replace('#', '');
        this.listeners.forEach((v) => v.listen(this));
        this.rerender();
    }
    addListener(value: Listener){
        this.listeners.push(value);
    }
}

export class Repeat implements Value, List, Listenable {
    name: string;
    type: string;
    value: Value[][];
    active: boolean;
    referenceValues: Value[];
    listeners: Listener[];
    length: number;
    rerender: () => void;
    constructor(name: string, values: Value[], rerender: () => void) {
        this.name = name;
        this.type = 'repeat';
        this.referenceValues = values;
        this.value = [];
        this.active = true;
        this.listeners = [];
        this.length = 0;
        this.rerender = rerender;
    }
    add(){
        this.value.push(this.referenceValues.map(v => v.clone()));
        this.length++;
        this.listeners.forEach((v) => v.listen(this));
        this.rerender();
    }
    remove(index: number){
        this.value.splice(index, 1);
        this.length--;
        this.listeners.forEach((v) => v.listen(this));
        this.rerender();
    }
    exportJSX() {
        if (!this.active) return <></>
        return (
        <div>
            <span>{this.name}</span>
            
            <div style={{paddingLeft: '0.5rem'}}>
                {this.value.map((val, ind) => 
                    <div key={ind}>
                        <button onClick={() => this.remove(ind)} className='repeat-remove-btn'>-</button>
                        {val.map((v, ind) => 
                            <div key={ind}>
                                {v.exportJSX()}
                            </div>
                        )}
                    </div>
                )}
                <button onClick={() => this.add()}>Add</button>

            </div>
            
            
        </div>
        )
    }
    exportString() {
        if (!this.active) return "";
        let s = `${this.length}`;
        for (let val of this.value){
            for (let v of val)
                s += ` ${v.exportString()}`;
        }
        return s;
    }
    clone(){
        return new Repeat(this.name, this.referenceValues, this.rerender);
    }
    addListener(value: Listener){
        this.listeners.push(value);
    }
}

class InnerListClass implements List, Listenable {
    length: number;
    constructor(){
        this.length = 0;
    }
    addListener(listener: Listener){};
}
export const INNER = new InnerListClass();

export class LinkLength implements Value, Listener, List, Listenable {
    name: string;
    type: string;
    value: Value[][];
    active: boolean;
    referenceValues: Value[];
    listeners: Listener[];
    link: List;
    length: number;
    listenInner: boolean;
    rerender: () => void;
    constructor(name: string, values: Value[], link: List, rerender: () => void) {
        this.listenInner = link === INNER;
        this.name = name;
        this.type = 'link';
        this.referenceValues = values;
        this.value = [];
        this.active = true;
        this.listeners = [];
        this.link = link;
        this.length = 0;
        this.rerender = rerender;
        this.listen(link, false);
    }
    listen(value: List, rerender?: boolean){
        if (rerender === undefined) rerender = true;
        if (value.length > this.length){
            for (let i = this.length; i < value.length; i++){
                this.value.push(this.referenceValues.map(v => v.clone()));
            }
        }
        else if (value.length < this.length){
            for (let i = this.length; i > value.length; i--){
                this.value.pop();
            }
        }
        this.length = value.length;
        this.listeners.forEach((v) => v.listen(this, rerender));
        if (rerender)
            this.rerender();
    }
    setListen(obj: Listenable & List){
        obj.addListener(this);
        this.link = obj;
    }
    exportJSX() {
        if (!this.active || this.length === 0) return <></>
        return (
        <div>
            <span>{this.name}</span>
            {this.value.map((val, ind) => 
                <div key={ind} style={{paddingLeft: '1rem'}}>
                    <span>{ind}</span>
                    <div style={{paddingLeft: '1rem'}}>
                        {val.map((v, ind) =>
                            <div key={ind}>
                                {v.exportJSX()}
                            </div>
                        )}  
                    </div>
                              
                </div>
            )}
        </div>
        )
    }
    exportString() {
        if (!this.active) return "";
        let s = `${this.length} `;
        for (let val of this.value){
            for (let v of val) 
                s += `${v.exportString()} `;
        }
        return s;
    }
    clone(){
        return new LinkLength(this.name, this.referenceValues, this.link, this.rerender);
    }
    addListener(value: Listener){
        this.listeners.push(value);
    }
}

export class Rely implements Value, Listener, Listenable {
    name: string;
    type: string;
    value: Value;
    active: boolean;
    link: Value;
    listeners: Listener[];
    listenInner: boolean;
    rerender: () => void;
    constructor(name: string, value: Value, link: Value, rerender: () => void) {
        this.listenInner = false;
        this.name = name;
        this.type = 'rely';
        this.value = value;
        this.active = true;
        this.link = link;
        link.addListener(this);
        this.listeners = [];
        this.rerender = rerender;
        this.listen(link, false);
    }
    setListen(obj: Value & Listenable): void {
        this.link = obj;
    }
    exportJSX(){
        if (this.active) return this.value.exportJSX();
        return <></>
    }
    exportString(){
        if (this.active) return this.value.exportString();
        return "";
    }
    clone(){
        return new Rely(this.name, this.value.clone(), this.link, this.rerender);
    }
    addListener(listener: Listener){
        this.listeners.push(listener);
        this.value.addListener(listener);
    }
    listen(value: Value, rerender?: boolean){
        if (rerender === undefined) rerender = true;
        this.active = value.active;
        this.listeners.forEach((v) => v.listen(this, rerender));
        if (rerender)
            this.rerender();
    }
}

export class RelyValue implements Value, Listener, Listenable {
    name: string;
    type: string;
    value: Value;
    wantedValue: any;
    active: boolean;
    link: Value;
    listeners: Listener[];
    listenInner: boolean;
    rerender: () => void;
    constructor(name: string, value: Value, link: Value, wantedValue: any, rerender: () => void) {
        this.listenInner = false;
        this.name = name;
        this.type = 'rely_value';
        this.value = value;
        this.active = true;
        this.link = link;
        link.addListener(this);
        this.listeners = [];
        this.wantedValue = wantedValue;
        this.rerender = rerender;
        this.listen(link, false);
    }
    setListen(obj: Value & Listenable): void {
        this.link = obj;
    }
    exportJSX(){
        if (this.active) return this.value.exportJSX();
        return <></>
    }
    exportString(){
        if (this.active) return this.value.exportString();
        return "";
    }
    clone(){
        return new RelyValue(this.name, this.value.clone(), this.link, this.wantedValue, this.rerender);
    }
    addListener(listener: Listener){
        this.listeners.push(listener);
        this.value.addListener(listener);
    }
    listen(value: Value, rerender?: boolean){
        if (rerender === undefined) rerender = true;
        if (value.value instanceof Option){
            this.active = value.value.value === this.wantedValue;
        } else {
            this.active = value.value === this.wantedValue;
        }
        
        this.listeners.forEach((v) => v.listen(this));
        if (rerender)
            this.rerender();
    }
}

