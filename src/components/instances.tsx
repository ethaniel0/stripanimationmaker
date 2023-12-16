import { ItemType, Value, Option, Listener, List } from "./definitions";
import * as values from "./values";

export interface BlockDefinition {
    name: string;
    symbol: string;
    type: ItemType;
    innerType: ItemType;
    innerMax?: number;
    innerMin?: number;
    createVariables: (parent: Block) => Value[];
}

// Functions
export var functions: BlockDefinition[] = [
    // EaseTransform
    {
        name: 'Ease',
        symbol: 'e',
        type: ItemType.FUNCTION,
        innerType: ItemType.NONE,
        innerMax: 0,
        innerMin: 0,
        createVariables: (parent: Block) => {
            let start = new values.Int("start", 0, parent.rerender);
            let end = new values.Int("end", 0, parent.rerender);
            return [start, end];
        },
    },
    {
        name: 'Linear',
        symbol: 'l',
        type: ItemType.FUNCTION,
        innerType: ItemType.NONE,
        innerMax: 0,
        innerMin: 0,
        createVariables: (parent: Block) => {
            let start = new values.Int("start", 0, parent.rerender);
            let end = new values.Int("end", 0, parent.rerender);
            return [start, end];
        },
    },
    {
        name: 'Perlin',
        symbol: 'p',
        type: ItemType.FUNCTION,
        innerType: ItemType.NONE,
        innerMax: 0,
        innerMin: 0,
        createVariables: (parent: Block) => {
            let speed = new values.Int("speed", 0, parent.rerender);
            let min = new values.Int("min", 0, parent.rerender);
            let max = new values.Int("max", 0, parent.rerender);
            return [speed, min, max];
        },
    },
    {
        name: 'Random',
        symbol: 'r',
        type: ItemType.FUNCTION,
        innerType: ItemType.NONE,
        innerMax: 0,
        innerMin: 0,
        createVariables: (parent: Block) => {
            let min = new values.Int("min", 0, parent.rerender);
            let max = new values.Int("max", 0, parent.rerender);
            return [min, max];
        },
    },
    {
        name: 'Static',
        symbol: 's',
        type: ItemType.FUNCTION,
        innerType: ItemType.NONE,
        innerMax: 0,
        innerMin: 0,
        createVariables: (parent: Block) => {
            let value = new values.Int("value", 0, parent.rerender);
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
        innerType: ItemType.FUNCTION,
        innerMax: 16,
        innerMin: 1,
        createVariables: (parent: Block) => {
            let duration = new values.Int("Duration", 0, parent.rerender);
            let loop = new values.Boolean("Loop", false, parent.rerender);
            let bind = new values.Select("Bind", [
                new Option('Position', 'p'),
                new Option('Relative Position', 'r'),
                new Option('Colors', 'c'),
                new Option('Opacity', 'o'),
                new Option('Brightness', 'b'),
                new Option('Length', 'l')
            ], parent.rerender);

            let updateFrames = new values.Boolean("Update Frames", true, parent.rerender);

            let bindToLength = new values.Boolean("Bind to Length", false, parent.rerender);
            let frameOffset = new values.Int("Frame Offset", 0, parent.rerender);
            let lightOffset = new values.RelyValue("Light Offset", new values.Int("Light Offset", 1, parent.rerender), bindToLength, true, parent.rerender);
            
            // let lightOffset = new values.Int("lightOffset", 0, parent.rerender);
            let absoluteStateTransitions = new values.Repeat("Direct Transitions", [new values.Int("state", 0, parent.rerender), new values.Int("frame", 0, parent.rerender)], parent.rerender);
            let relativeStateTransitions = new values.Repeat("Relative Transitions", [new values.Int("state", 0, parent.rerender), new values.Int("frame", 0, parent.rerender)], parent.rerender);
            return [duration, loop, bind, updateFrames, bindToLength, frameOffset, lightOffset, absoluteStateTransitions, relativeStateTransitions];
        },
    },
    // AnimationSequence
    {
        name: 'Animation Sequence',
        symbol: 's',
        type: ItemType.ANIMATION,
        innerType: ItemType.ANIMATION,
        innerMax: 16,
        innerMin: 1,
        createVariables: (parent: Block) => {
            let loops = new values.Int("loops", 0, parent.rerender);
            let nextTriggers = new values.Repeat("nextTriggers", [new values.Int("state", 0, parent.rerender), new values.Int("frame", 0, parent.rerender)], parent.rerender);
            let prevTriggers = new values.Repeat("prevTriggers", [new values.Int("state", 0, parent.rerender), new values.Int("frame", 0, parent.rerender)], parent.rerender);
            let resetTriggers = new values.Repeat("resetTriggers", [new values.Int("state", 0, parent.rerender), new values.Int("frame", 0, parent.rerender)], parent.rerender);
            return [loops, nextTriggers, prevTriggers, resetTriggers];
        },
    },
    // AnimationStateMap
    {
        name: 'State Map',
        symbol: 'm',
        type: ItemType.ANIMATION,
        innerType: ItemType.ANIMATION,
        innerMax: 16,
        innerMin: 1,
        createVariables: (parent: Block) => {
            let states = new values.LinkLength(
                "states",
                [new values.Int("state", 0, parent.rerender)], 
                parent,
                parent.rerender
            );
            return [states];
        },
    },
    // DataReactor
    {
        name: 'Data Reactor',
        symbol: 'd',
        type: ItemType.ANIMATION,
        innerType: ItemType.ANIMATION,
        innerMax: 1,
        innerMin: 1,
        createVariables: (parent: Block) => {
            let value = new values.Int('Data Index', 0, parent.rerender);
            return [value];
        }
    }
];

export var objects: BlockDefinition[] = [
    // LightObject
    {
        name: "Standard Object",
        symbol: "l",
        type: ItemType.OBJECT,
        innerType: ItemType.ANIMATION,
        innerMax: -1,
        innerMin: 0,
        createVariables: (parent: Block) => {
            let position = new values.Position("position", 0, parent.rerender);
            let persistent = new values.Boolean("persistent", false, parent.rerender);
            let defineBy = new values.Select("defineBy", [
                new Option('Length', 'l'),
                new Option('Colors', 'c')
            ], parent.rerender);
            let length = new values.RelyValue("length", new values.Int("length", 0, parent.rerender), defineBy, 'l', parent.rerender);

            let colorRepeat = new values.Repeat('colors', [
                new values.Color('color', '000000', parent.rerender)
            ], parent.rerender)
            let colors = new values.RelyValue("colors", colorRepeat, defineBy, 'c', parent.rerender);

            let usePath = new values.Boolean("use path", false, parent.rerender);
            let loopPath = new values.RelyValue("loop path", new values.Boolean("loop path", false, parent.rerender), usePath, true, parent.rerender);
            let path = new values.RelyValue("path", 
                    new values.Repeat("path", [
                        new values.Int("start", 0, parent.rerender),
                        new values.Int("end", 0, parent.rerender),
                    ], parent.rerender), 
                usePath, true, parent.rerender);

            return [position, persistent, defineBy, length, colors, usePath, loopPath, path];
        }
    },
    // Generator
    {
        name: "Generator",
        symbol: 'g',
        type: ItemType.OBJECT,
        innerType: ItemType.OBJECT,
        innerMax: 1,
        innerMin: 1,
        createVariables: (parent: Block) => {
            let position = new values.Position("position", 0, parent.rerender);
            let spacing = new values.Int("spacing", 0, parent.rerender);
            return [position, spacing];
        }
    },
    // ObjectGroup
    {
        name: "Object Group",
        symbol: 'o',
        type: ItemType.OBJECT,
        innerType: ItemType.OBJECT,
        createVariables: (parent: Block) => {
            return [];
        }
    },
    // ObjectGroupStateMap
    {
        name: "Object Group State Map",
        symbol: 'm',
        type: ItemType.OBJECT,
        innerType: ItemType.OBJECT,
        innerMax: 16,
        innerMin: 1,
        createVariables: (parent: Block) => {
            let states = new values.LinkLength(
                "states",
                [new values.Int("state", 0, parent.rerender)], 
                parent,
                parent.rerender
            );
            return [states];
        }
    }
];

export var system: BlockDefinition = {
    name: "System",
    symbol: "",
    type: ItemType.SYSTEM,
    innerType: ItemType.OBJECT,
    innerMax: -1,
    innerMin: 0,
    createVariables: function (parent: Block): Value[] {
        return []
    }
}

export class Block implements List{
    static blockCount: number = 0;
    symbol: string;
    id: number;
    type: ItemType;
    variables: Value[];
    inner: Block[];
    innerType: ItemType;
    innerMax: number;
    innerMin: number;
    innerListeners: Listener[];
    length: number = 0;
    rerender: () => void;
    remove: () => void;
    constructor(def: BlockDefinition, rerender: () => void = () => {}){
        this.symbol = def.symbol;
        this.id = Block.blockCount;
        Block.blockCount++;
        this.type = def.type;
        this.inner = [];
        this.innerType = def.innerType;
        this.innerMax = def.innerMax ?? -1;
        this.innerMin = def.innerMin ?? 0;
        this.innerListeners = [];
        this.rerender = rerender;
        this.variables = def.createVariables(this);
        this.remove = () => {};
        for (let i of this.variables){
            if ('listenInner' in i){
                // Handle Listener instance
                (i as unknown as Listener).setListen(this);
            }
        }

        for (let i = 0; i < this.innerMin; i++){
            this.addType(this.innerType)
        }

    }
    addInner(item: Block){
        if (this.innerMax !== -1 && this.inner.length >= this.innerMax) return;
        if (this.innerType != item.type) return;
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
            let b = new Block(functions[0], this.rerender);
            b.remove = () => this.removeInner(b);
            this.addInner(b);
        }
        else if (type === ItemType.ANIMATION) {
            let b = new Block(animations[0], this.rerender);
            b.remove = () => this.removeInner(b);
            this.addInner(b);
        }
        else if (type === ItemType.OBJECT) {
            let b = new Block(objects[0], this.rerender);
            b.remove = () => this.removeInner(b);
            this.addInner(b);
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
    getChild(id: number): Block | null{
        // console.log('searching for', id);
        if (id === this.id){
            return this;
        }
        for (let i = 0; i < this.inner.length; i++){
            let b = this.inner[i].getChild(id);
            if (b) return b;
        }
        return null;
    }
    toString(){
        let s = this.symbol;
        this.variables.forEach((v) => {
            s += ' ' + v.exportString();
        });
        if (this.innerMax < 0 || this.innerMax > 1) s += ` ${this.length}`;
        this.inner.forEach((i) => {
            s += ' ' + i.toString();
        });
        return s;
    }
}
