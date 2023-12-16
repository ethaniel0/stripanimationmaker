import { ReactElement } from "react";

export enum ItemType {
    SYSTEM = "System",
    OBJECT = "Object",
    ANIMATION = "Animation",
    FUNCTION = "Function",
    NONE = "None"
}

export enum ObjectProperties {
    POSITION = 'p',
    RELATIVE_POSITION = 'r',
    COLORS = 'c',
    OPACITY = 'o',
    BRIGHTNESS = 'b',
}

export interface Item {
    name: string;
    symbol: string;
    vars: { [key: string]: string };
    toString: (symbol: string, vars: { [key: string]: string }, inner: Item[]) => string;
    acceptsInner: ItemType[];
    innerMax?: number;
}

export interface Value {
    name: string;
    type: string;
    value: any;
    active: boolean;
    exportJSX: () => ReactElement;
    exportString: () => string;
    clone: () => Value;
    addListener: (listener: Listener) => void;
}

export interface Listener {
    listenInner: boolean;
    listen: (value: any, rerender?: boolean) => void;
    setListen(obj: Listenable): void;
    rerender: () => void;
}

export interface Listenable {
    addListener: (listener: Listener) => void;
}

export class Option {
    name: string;
    value: any;
    constructor(name: string, value: any) {
        this.name = name;
        this.value = value;
    }
}

export interface List {
    length: number;
}
