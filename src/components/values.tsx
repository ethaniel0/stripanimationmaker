import { List, Listener, Option, Value } from './definitions';

export class Int implements Value {
    name: string;
    type: string;
    value: number;
    active: boolean;
    listeners: Listener[];
    constructor(name: string, value: number) {
        this.name = name;
        this.type = 'int';
        this.value = value;
        this.active = true;
        this.listeners = [];
    }
    exportJSX() {
        if (!this.active) return <></>;
        return <input onChange={e => this.set(Math.floor(parseFloat(e.target.value)))} type="number" value={this.value} />;
    }
    exportString() {
        if (!this.active) return '';
        return this.value.toString();
    }
    clone() {
        return new Int(this.name, this.value);
    }
    set(value: number) {
        this.value = value;
        this.listeners.forEach((v) => v.listen(this));
    }
    addListener(value: Listener) {
        this.listeners.push(value);
    }
}

export class Position implements Value {
    type: string;
    value: number;
    active: boolean;
    name: string;
    listeners: Listener[];
    constructor(name: string, value: number) {
        this.name = name;
        this.type = 'position';
        this.value = value;
        this.active = true;
        this.listeners = [];
    }
    exportJSX() {
        if (!this.active) return <></>;
        return (
        <div>
            <span>{this.name}</span>
            <input onChange={e => this.set(Math.floor(parseFloat(e.target.value)))} type="number" value={this.value} />
            <button>Select</button>
        </div>
        )
    }
    exportString() {
        if (!this.active) return '';
        return this.value.toString();
    }
    clone(){
        return new Position(this.name, this.value);
    }
    set(value: number){
        this.value = value;
    }
    addListener(value: Listener){
        this.listeners.push(value);
    }
}

export class Boolean implements Value {
    name: string;
    type: string;
    value: boolean;
    active: boolean;
    listeners: Listener[];
    constructor(name: string, value: boolean) {
        this.name = name;
        this.type = 'boolean';
        this.value = value;
        this.active = true;
        this.listeners = [];
    }
    exportJSX() {
        if (!this.active) return <></>;

        return (
            <div>
                <span>{this.name}</span>
                <input onChange={e => this.set(e.target.checked)} type="checkbox" checked={this.value} />;
            </div>
        )
    }
    exportString() {
        if (!this.active) return "";
        return this.value.toString();
    }
    clone(){
        return new Boolean(this.name, this.value);
    }
    set(value: boolean){
        this.value = value;
        this.listeners.forEach((v) => v.listen(this));
    }
    addListener(value: Listener){
        this.listeners.push(value);
    }
}

export class Select implements Value {
    name: string;
    type: string;
    value: Option;
    active: boolean;
    options: Option[];
    listeners: Listener[];
    constructor(name: string, value: Option[]) {
        this.name = name;
        this.type = 'select';
        this.value = value[0];
        this.options = value;
        this.active = true;
        this.listeners = [];
    }
    exportJSX() {
        if (!this.active) return <></>
        return (
            <div>
                <span>{this.name}</span>
                <select onChange={e => this.set(e.target.value)}>
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
        return new Select(this.name, this.options);
    }
    set(value: string){
        let index = this.options.findIndex((v) => v.value === value);
        this.value = this.options[index];
        this.listeners.forEach((v) => v.listen(this));
    }
    addListener(value: Listener){
        this.listeners.push(value);
    }
}

export class String implements Value {
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
            <div>
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

export class Color implements Value {
    type: string;
    value: string;
    active: boolean;
    name: string;
    listeners: Listener[];
    constructor(name: string, value: string) {
        this.name = name;
        this.type = 'color';
        this.value = value;
        this.active = true;
        this.listeners = [];
    }
    exportJSX() {
        if (!this.active) return <></>;
        return <input onChange={e => this.set(e.target.value)} type="color" value={this.value} />;
    }
    exportString() {
        if (!this.active) return "";
        return this.value.toString();
    }
    clone(){
        return new Color(this.name, this.value);
    }
    set(value: string){
        this.value = value;
        this.listeners.forEach((v) => v.listen(this));
    }
    addListener(value: Listener){
        this.listeners.push(value);
    }
}

export class Repeat implements Value, List {
    name: string;
    type: string;
    value: Value[][];
    active: boolean;
    referenceValues: Value[];
    listeners: Listener[];
    length: number;
    constructor(name: string, values: Value[]) {
        this.name = name;
        this.type = 'repeat';
        this.referenceValues = values;
        this.value = [];
        this.active = true;
        this.listeners = [];
        this.length = 0;
    }
    add(){
        this.value.push(this.referenceValues.map(v => v.clone()));
        this.length++;
        this.listeners.forEach((v) => v.listen(this));
    }
    remove(index: number){
        this.value.splice(index, 1);
        this.length--;
        this.listeners.forEach((v) => v.listen(this));
    }
    exportJSX() {
        if (!this.active) return <></>;
        return (
        <div>
            {this.value.map((val, ind) => 
                <div key={ind}>
                    {val.map((v, ind) => 
                        <div key={ind}>
                            {v.name}: {v.exportJSX()}
                        </div>
                    )}
                </div>
            )}
            <button>Add</button>
        </div>
        )
    }
    exportString() {
        if (!this.active) return "";
        return `${this.length} ${this.value.toString()}`;
    }
    clone(){
        return new Repeat(this.name, this.referenceValues);
    }
    addListener(value: Listener){
        this.listeners.push(value);
    }
}

export class LinkLength implements Value, Listener, List {
    name: string;
    type: string;
    value: Value[][];
    active: boolean;
    referenceValues: Value[];
    listeners: Listener[];
    link: List;
    length: number;
    constructor(name: string, values: Value[], link: List) {
        this.name = name;
        this.type = 'link';
        this.referenceValues = values;
        this.value = [];
        this.active = true;
        this.listeners = [];
        this.link = link;
        this.length = 0;
    }
    listen(value: List){
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
        this.listeners.forEach((v) => v.listen(this));
    }
    exportJSX() {
        if (!this.active || this.length === 0) return <></>;
        return (
        <div>
            {this.value.map((val, ind) => 
                <div key={ind}>
                    {val.map((v, ind) =>
                        <div key={ind}>
                            {v.name}: {v.exportJSX()}
                        </div>
                    )}            
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
        return new LinkLength(this.name, this.referenceValues, this.link);
    }
    addListener(value: Listener){
        this.listeners.push(value);
    }
}

export class Rely implements Value, Listener {
    name: string;
    type: string;
    value: Value;
    active: boolean;
    link: Value;
    listeners: Listener[];
    constructor(name: string, value: Value, link: Value) {
        this.name = name;
        this.type = 'rely';
        this.value = value;
        this.active = true;
        this.link = link;
        this.listeners = [];
    }
    exportJSX(){
        if (this.active) return this.value.exportJSX();
        return <></>;
    }
    exportString(){
        if (this.active) return this.value.exportString();
        return "";
    }
    clone(){
        return new Rely(this.name, this.value.clone(), this.link);
    }
    addListener(listener: Listener){
        this.listeners.push(listener);
        this.value.addListener(listener);
    }
    listen(value: Value){
        this.active = value.active;
        this.listeners.forEach((v) => v.listen(this));
    }
}

export class RelyValue implements Value, Listener {
    name: string;
    type: string;
    value: Value;
    wantedValue: any;
    active: boolean;
    link: Value;
    listeners: Listener[];
    constructor(name: string, value: Value, link: Value, wantedValue: any) {
        this.name = name;
        this.type = 'rely_value';
        this.value = value;
        this.active = true;
        this.link = link;
        this.listeners = [];
        this.wantedValue = wantedValue;
    }
    exportJSX(){
        if (this.active) return this.value.exportJSX();
        return <></>;
    }
    exportString(){
        if (this.active) return this.value.exportString();
        return "";
    }
    clone(){
        return new RelyValue(this.name, this.value.clone(), this.link, this.wantedValue);
    }
    addListener(listener: Listener){
        this.listeners.push(listener);
        this.value.addListener(listener);
    }
    listen(value: Value){
        if (value.value instanceof Option){
            this.active = value.value.value === this.wantedValue;
        } else {
            this.active = value.value === this.wantedValue;
        }
        
        this.listeners.forEach((v) => v.listen(this));
    }
}

