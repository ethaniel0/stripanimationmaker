import { ReactElement } from "react";

export enum ItemType {
    SYSTEM = "System",
    OBJECT = "Object",
    ANIMATION = "Animation",
    FUNCTION = "Function"
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

/*
    Item Vars language:

    BASIC TYPES:
    int -> integer, shows a number input
    position: int -> integer, shows a number input, but with a position label that allows you to select where on the strip(s) the object is
    boolean -> 0 or 1, shows a checkbox
    select <option1> <option2> ... -> shows a dropdown with the listed options
    string -> shows a text input
    color -> shows a color picker

    INTERPRETED TYPES:
    repeat <name1> <type1>, <name2, type2> -> displays inputs and a box to add more, in a list.
    link <link name> <prop1> <type1> <prop2> <type2> -> displays the same number of inputs as is in the linked array (inner for inner, or variable name as in the vars object), with the listed properties.
    rely <link name> <definition of type> -> only displays / includes the item if the linked variable exists or is true (for booleans).
    rely_value <link name> <value> <value type> <definition of type> -> only displays / includes the item if the linked variable exists and is equal to the given value.
*/

export var functions: Item[] = [
    // EaseTransform
    {
        name: 'Ease',
        symbol: 'e',
        vars: {
            start: 'int',
            end: 'int',
        },
        toString: (symbol: string, vars: { [key: string]: string }, _) => `${symbol} ${vars.start} ${vars.end}`,
        acceptsInner: []
    },
    // LinearTransform
    {
        name: 'Linear',
        symbol: 'l',
        vars: {
            start: 'int',
            end: 'int',
        },
        toString: (symbol: string, vars: { [key: string]: string }, _) => `${symbol} ${vars.start} ${vars.end}`,
        acceptsInner: []
    },
    // PerlinTransform
    {
        name: 'Perlin',
        symbol: 'p',
        vars: {
            speed: 'int',
            min: 'int',
            max: 'int',
        },
        toString: (symbol: string, vars: { [key: string]: string }, _) => `${symbol} ${vars.speed} ${vars.min} ${vars.max}`,
        acceptsInner: []
    },
    // RandomTransform
    {
        name: 'Random',
        symbol: 'r',
        vars: {
            min: 'int',
            max: 'int',
        },
        toString: (symbol: string, vars: { [key: string]: string }, _) => `${symbol} ${vars.min} ${vars.max}`,
        acceptsInner: []
    },
    // StaticTransform
    {
        name: 'Static',
        symbol: 's',
        vars: {
            value: 'int',
        },
        toString: (symbol: string, vars: { [key: string]: string }, _) => `${symbol} ${vars.value}`,
        acceptsInner: []
    }
];

export var animations: Item[] = [
    // BaseAnimation
    {
        // syntax: <duration> <loop> <bind> <bind to length> <frameOffset> <lightOffset> 
        // <# of functions> <functions> 
        // <# absolute state transitions> <state> <frame> ... 
        // <# relative state transitions> <state> <frame> ...
        name: 'Basic Animation',
        symbol: 'b',
        vars: {
            duration: 'int',
            loop: 'boolean',
            bind: 'objectProperties',
            frameOffset: 'int',
            bindToLength: 'boolean',
            lightOffset: 'int',
            absoluteStateTransitions: 'repeat state int frame int',
            relativeStateTransitions: 'repeat state int frame int',
        },
        toString: (symbol: string, vars: { [key: string]: string }, inner: Item[]) => {
            var s = `${symbol} ${vars.duration} ${vars.loop ? '1' : '0'} ${vars.bind} ${vars.bindToLength ? '1' : '0'} ${vars.frameOffset} ${vars.lightOffset} ${inner.length}`;
            // add functions
            inner.forEach(item => {
                s += ` ${item.toString(item.symbol, item.vars, [])}`;
            });
            // add absolute state transitions
            s += ` ${vars.absoluteStateTransitions.length}`;
            for (let i of (vars.absoluteStateTransitions as unknown as [number, number][])) {
                s += ` ${i[0]} ${i[1]}`;
            };
            // add relative state transitions
            s += ` ${vars.relativeStateTransitions.length}`;
            for (let i of (vars.relativeStateTransitions as unknown as [number, number][])) {
                s += ` ${i[0]} ${i[1]}`;
            };
            return s;
        
        },
        acceptsInner: [ItemType.FUNCTION],
        innerMax: 16
    },
    // AnimationSequence
    {
        // // syntax: <loops> <# of animations> <animations> ... <# next triggers> <state1> <state2>... <# prev triggers> <state1>... <# reset triggers> <state1>...
        name: 'Animation Sequence',
        symbol: 's',
        vars: {
            loops: 'int',
            nextTriggers: 'repeat state int',
            prevTriggers: 'repeat state int',
            resetTriggers: 'repeat state int',
        },
        toString(symbol: string, vars: { [key: string]: string }, inner: Item[]) {
            var s = `${symbol} ${vars.loops} ${inner.length}`;
            // add animations
            inner.forEach(item => {
                s += ` ${item.toString(item.symbol, item.vars, [])}`;
            });
            // add next triggers
            s += ` ${vars.nextTriggers.length}`;
            
            for (let i of (vars.nextTriggers as unknown as [number][])) {
                s += ` ${i[0]}`;
            };
            // add prev triggers
            s += ` ${vars.prevTriggers.length}`;
            for (let i of (vars.prevTriggers as unknown as [number][])) {
                s += ` ${i[0]}`;
            };
            // add reset triggers
            s += ` ${vars.resetTriggers.length}`;
            for (let i of (vars.resetTriggers as unknown as [number][])) {
                s += ` ${i[0]}`;
            };
            return s;
        },
        acceptsInner: [ItemType.ANIMATION],
        innerMax: 16
    },
    // AnimationStateMap
    {
        // syntax: <# of states> <state1> <animation1> <state2> <animation2> ...
        name: 'State Map',
        symbol: 'm',
        vars: {
            states: 'link inner state int',
        },
        toString(symbol: string, vars: { [key: string]: string }, inner: Item[]) {
            var s = `${symbol} ${inner.length}`;
            // add states
            inner.forEach(item => {
                s += ` ${item.toString(item.symbol, item.vars, [])}`;
            });
            return s;
        },
        acceptsInner: [ItemType.ANIMATION],
        innerMax: 16
    },
];

export var objects: Item[] = [
    // LightObject
    {
        // define by either segments or colors
        // define PlaceableObject parameters first:
        // <pos> <persistent>
        // define by segments:
        //    l <# lights>
        // define by colors:
        //    c <# colors> <color1 hex> <color2 hex> ...
        // after defining segments or colors:
        // ... <# animations> <animation1> <animation2> ...
        name: "Standard Object",
        symbol: 'l',
        vars: {
            position: 'position',
            persistent: 'boolean',
            defineBy: 'select length colors',
            length: 'rely_value defineBy length string int',
            colors: 'rel_value defineBy colors string repeat color color',
        },
        toString(symbol: string, vars: { [key: string]: string }, inner: Item[]) {
            var s = `${symbol} ${vars.position} ${vars.persistent ? '1' : '0'} ${vars.defineBy}`;
            // add length or colors
            if (vars.defineBy === 'length') {
                // length is an int
                s += ` ${vars.length}`;
            } else {
                let colors: [string][] = vars.colors as unknown as [string][];
                s += ` ${colors.length}`;
                for (let i of colors){
                    s += ` ${i[0]}`;
                }
            }

            // add animations
            s += ` ${inner.length}`;
            inner.forEach(item => {
                s += ` ${item.toString(item.symbol, item.vars, [])}`;
            });

            return s;
        },
        acceptsInner: [ItemType.ANIMATION],
        innerMax: 16
    },
    // Generator
    {
        // syntax: <pos> <spacing> <... object to copy>
        name: 'Generator',
        symbol: 'g',
        vars: {
            position: 'position',
            spacing: 'int',
        },
        toString(symbol: string, vars: { [key: string]: string }, inner: Item[]) {
            var s = `${symbol} ${vars.position} ${vars.spacing} ${inner.length}`;
            inner.forEach(item => {
                s += ` ${item.toString(item.symbol, item.vars, [])}`;
            });
            return s;
        },
        acceptsInner: [ItemType.OBJECT],
        innerMax: 1
    }
];
