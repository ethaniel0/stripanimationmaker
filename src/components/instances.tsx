import React, { ReactElement } from "react";
import { ItemType, Value, Option, Listener, List } from "./definitions";
import * as values from "./values";

function setSelection(e: React.MouseEvent, id: number, select: (id: number) => void){
    e.stopPropagation();
    e.preventDefault();
    select(id);
}

export class Block implements List{
    static blockCount: number = 0;
    identifier: string;
    id: number;
    type: ItemType;
    variables: Value[];
    inner: Block[];
    innerTypes: ItemType[];
    innerMax: number;
    innerListeners: Listener[];
    length: number = 0;
    rerender: () => void;
    constructor(def: BlockDefinition, rerender: () => void = () => {}){
        this.identifier = def.symbol;
        this.id = Block.blockCount;
        Block.blockCount++;
        this.type = def.type;
        this.inner = [];
        this.innerTypes = def.innerTypes;
        this.innerMax = def.innerMax ?? -1;
        this.innerListeners = [];
        this.variables = def.createVariables(this);
        this.rerender = rerender;
    }
    addInner(item: Block){
        if (this.innerMax !== -1 && this.inner.length >= this.innerMax) return;
        if (!this.innerTypes.includes(item.type)) return;
        item.rerender = this.rerender;
        this.inner.push(item);
        this.length++;
        this.innerListeners.forEach((l) => {
            l.listen(this.inner);
        });
        this.rerender();
    }
    addType(type: ItemType){
        if (type === ItemType.FUNCTION) {
            this.addInner(new Block(functions[0], this.rerender));
        }
        else if (type === ItemType.ANIMATION) {
            this.addInner(new Block(animations[0], this.rerender));
        }
        else if (type === ItemType.OBJECT) {
            this.addInner(new Block(objects[0], this.rerender));
        }
    }
    removeInner(item: Block){
        let index = this.inner.indexOf(item);
        if (index === -1) return;
        this.inner.splice(index, 1);
        this.length--;
        this.innerListeners.forEach((l) => {
            l.listen(this.inner);
        });
        this.rerender();
    }
    addListener(listener: Listener){
        this.innerListeners.push(listener);
    }
    exportSidebarJSX(selected: number): ReactElement | undefined{
        if (selected === this.id){
            return (
                <>
                    {this.variables.map((v, ind) => {
                        return <div key={ind}>{v.exportJSX()}</div>
                    })}
                </>
            );
        }
        return (
            <>
                {this.inner.map((i) => {
                    return i.exportSidebarJSX(selected);
                })}
            </>
        );
        
    }
    exportJSX(select: (id: number) => void, key?: number){
        return (
        <div key={key ?? 1} className="block" onClick={(e) => setSelection(e, this.id, select)}>
            <span>{this.type}</span>

            <div style={{paddingLeft: '1rem'}}>
                {
                    this.inner.map((i, ind) => {
                        return i.exportJSX(select, ind);
                    })
                }
                {
                    this.innerTypes.map((t) => {
                        return (
                            <button key={t} onClick={() => {
                                this.addType(t);
                            }}>
                                Add {t}
                            </button>
                        );
                    })
                }
            </div>
        </div>);
    }
    exportString(){
        let s = this.identifier;
        this.variables.forEach((v) => {
            s += ' ' + v.exportString();
        });
        s += ` ${this.length}`;
        this.inner.forEach((i) => {
            s += ' ' + i.exportString();
        });
        return s.substring(1);
    }
}

interface BlockDefinition {
    name: string;
    symbol: string;
    type: ItemType;
    innerTypes: ItemType[];
    innerMax?: number;
    createVariables: (parent: Block) => Value[];
}

// Functions
export var functions: BlockDefinition[] = [
    // EaseTransform
    {
        name: 'Ease',
        symbol: 'e',
        type: ItemType.FUNCTION,
        innerTypes: [],
        innerMax: 0,
        createVariables: () => {
            let start = new values.Int("start", 0);
            let end = new values.Int("end", 0);
            return [start, end];
        },
    },
    {
        name: 'Linear',
        symbol: 'l',
        type: ItemType.FUNCTION,
        innerTypes: [],
        innerMax: 0,
        createVariables: () => {
            let start = new values.Int("start", 0);
            let end = new values.Int("end", 0);
            return [start, end];
        },
    },
    {
        name: 'Perlin',
        symbol: 'p',
        type: ItemType.FUNCTION,
        innerTypes: [],
        innerMax: 0,
        createVariables: () => {
            let speed = new values.Int("speed", 0);
            let min = new values.Int("min", 0);
            let max = new values.Int("max", 0);
            return [speed, min, max];
        },
    },
    {
        name: 'Random',
        symbol: 'r',
        type: ItemType.FUNCTION,
        innerTypes: [],
        innerMax: 0,
        createVariables: () => {
            let min = new values.Int("min", 0);
            let max = new values.Int("max", 0);
            return [min, max];
        },
    },
    {
        name: 'Static',
        symbol: 's',
        type: ItemType.FUNCTION,
        innerTypes: [],
        innerMax: 0,
        createVariables: () => {
            let value = new values.Int("value", 0);
            return [value];
        },
    },
];

export var animations: BlockDefinition[] = [
    // BaseAnimation
    {
        name: 'Basic Animation',
        symbol: 'b',
        type: ItemType.ANIMATION,
        innerTypes: [ItemType.FUNCTION],
        innerMax: 16,
        createVariables: () => {
            let duration = new values.Int("duration", 0);
            let loop = new values.Boolean("loop", false);
            let bind = new values.Select("bind", [
                new Option('Position', 'p'),
                new Option('Relative Position', 'r'),
                new Option('Colors', 'c'),
                new Option('Opacity', 'o'),
                new Option('Brightness', 'b'),
                new Option('Length', 'l')
            ]);
            let frameOffset = new values.Int("frameOffset", 0);
            let bindToLength = new values.Boolean("bindToLength", false);
            let lightOffset = new values.Int("lightOffset", 0);
            let absoluteStateTransitions = new values.Repeat("absoluteStateTransitions", [new values.Int("state", 0), new values.Int("frame", 0)]);
            let relativeStateTransitions = new values.Repeat("relativeStateTransitions", [new values.Int("state", 0), new values.Int("frame", 0)]);
            return [duration, loop, bind, frameOffset, bindToLength, lightOffset, absoluteStateTransitions, relativeStateTransitions];
        },
    },
    // AnimationSequence
    {
        name: 'Animation Sequence',
        symbol: 's',
        type: ItemType.ANIMATION,
        innerTypes: [ItemType.ANIMATION],
        innerMax: 16,
        createVariables: () => {
            let loops = new values.Int("loops", 0);
            let nextTriggers = new values.Repeat("nextTriggers", [new values.Int("state", 0), new values.Int("frame", 0)]);
            let prevTriggers = new values.Repeat("prevTriggers", [new values.Int("state", 0), new values.Int("frame", 0)]);
            let resetTriggers = new values.Repeat("resetTriggers", [new values.Int("state", 0), new values.Int("frame", 0)]);
            return [loops, nextTriggers, prevTriggers, resetTriggers];
        },
    },
    // AnimationStateMap
    {
        name: 'State Map',
        symbol: 'm',
        type: ItemType.ANIMATION,
        innerTypes: [ItemType.ANIMATION],
        innerMax: 16,
        createVariables: (parent: Block) => {
            let states = new values.LinkLength(
                "states",
                [new values.Int("state", 0), new values.Int("animation", 0)], 
                parent
            );
            return [states];
        },
    }
];

export var objects: BlockDefinition[] = [
    // LightObject
    {
        name: "Standard Object",
        symbol: "l",
        type: ItemType.OBJECT,
        innerTypes: [ItemType.ANIMATION],
        innerMax: -1,
        createVariables: () => {
            let position = new values.Position("position", 0);
            let persistent = new values.Boolean("persistent", false);
            let defineBy = new values.Select("defineBy", [
                new Option('Length', 'l'),
                new Option('Colors', 'c')
            ]);
            let length = new values.RelyValue("length", new values.Int("length", 0), defineBy, 'l');
            let colors = new values.RelyValue("colors", new values.Color("color", '000000'), defineBy, 'c');
            return [position, persistent, defineBy, length, colors];
        }
    },
    // Generator
    {
        name: "Generator",
        symbol: 'g',
        type: ItemType.OBJECT,
        innerTypes: [ItemType.OBJECT],
        innerMax: 1,
        createVariables: () => {
            let position = new values.Position("position", 0);
            let spacing = new values.Int("spacing", 0);
            return [position, spacing];
        }
    }
];

export var system: BlockDefinition = {
    name: "System",
    symbol: "",
    type: ItemType.SYSTEM,
    innerTypes: [ItemType.OBJECT],
    innerMax: -1,
    createVariables: function (parent: Block): Value[] {
        return []
    }
}
