# Strip Animation Maker

This project is still a work in progress. To run the project, clone the repository and run `npm install` in the project directory. Then run `npm start` to start the development server.

## How To Use

This is a primitive block editor - this later may be changed.

There are three types of blocks - objects, animations, and functions. Each may have child blocks, but not all do. In general, objects will have animations as children, and animations will have functions as children. The type of child available will be the only type presented, automatically.

The sidebar holds any variables associated with the block. This can be related to position, size, color, etc.

To export, press the `export` button. Currently, since the strip editor isn't implemented, this export is incomplete. The full system will be as such:

> "\<# of strips\> \<strip1 length\> \<strip2 length\> ... \<export\>"

So if the system has two LED strips of length 10 and 20, the export will be:

> "2 10 20 ...export"

The export itself starts with the number of objects, and then the definitions for each object, like so: \<# objects> \<obj1 def> \<obj2 def> ...

So if you want to add a suncle object in the c++ code, copy the text after the number for each of the objects, and use `systemCreator.parseObject` on it.

## Augmentation

If you want to add a new block type, as of right now you must add to the source code, and the definition must go into the `objects`, `animations`, or `functions` arrays in `src/components/instances.txt`. As this is in typescript, a block obejct looks like this:

```ts
interface BlockDefinition {
    name: string;
    symbol: string;
    type: ItemType;
    innerType: ItemType;
    innerMax?: number;
    innerMin?: number;
    createVariables: (parent: Block) => Value[];
}
```

The name will be what is shown in the block dropdown, and the symbol will be the _**single character**_ added to the export string to distinguish the block type. The type is the type of the block, and the innerType is the type of the child block it can contain. 

If the block has a variable number of children, the innerMax and innerMin are the maximum and minimum number of children, respectively.

The createVariables function will create the variables necessary, and will return an array of them _in order_ so the export can occur properly.

The variables types are as included (and are included in `/src/components/values.tsx`):

Int (name: str, value: number, rerender: () => void)

- An integer.
- name: the name that will be displayed in the sidebar
- value: the default value. 
- rerender: the rerender function. Pass in the parent.rerender function.

Position (name: str, value: number, rerrerender: () => voidender)

- A position on the strip.
- Same as an Int. In the future, will render differently to allow the user to select a point on a strip.

Boolean (name: str, value: boolean, rerender: () => void)

- A boolean.
- name: the name that will be displayed in the sidebar
- value: the default value (true or false). 
- rerender: the rerender function. Pass in the parent.rerender function.

Select (name: str, value: Option[], rerererender: () => voidnder)

- A dropdown of options. Often compined with RelyValue (see below)
- name: the name that will be displayed in the sidebar
- value: a list of options, defined as {name: str, value: any}. The name is what will be displayed in the dropdown, and the value is what will be exported.
- rerender: the rerender function. Pass in the parent.rerender function.

Color (name: str, value: string, rerender: () => void)

- name: the name that will be displayed in the sidebar
- value: the default value, as hex (no #).
- rerender: the rerender function. Pass in the parent.rerender function.


Repeat (name: str, value: Value[], rerender: () => void)

- A list of values that can appear more than once, such as a list of colors
- name: the name that will be displayed in the sidebar
- value: a group of values that will be repeated every time the user adds another row or removed when the user subtracts a row.
- rerender: the rerender function. Pass in the parent.rerender function.

LinkLength (name: string, values: Value[], link: List, rerender: () => void)

- Like a repeat, but it binds the number of value groups to the length of another value (such as a Repeat or the number of children of the block)
- name: the name that will be displayed in the sidebar
- value: the group of values that will be repeated
- link: the value that will determine the number of value groups
- rerender: the rerender function. Pass in the parent.rerender function.

Rely (name: string, value: Value, link: Value, rerender: () => void)

- conditionally includes the linked value, based on id the link is currently being shown (the linked value could be hidden by a RelyValue, for intance)
- name: the name that will be displayed in the sidebar
- value: the value that will be shown if the link is shown
- link: the value that will determine if the value is shown
- rerender: the rerender function. Pass in the parent.rerender function.

RelyValue (name: string, value: Value, link: Value, wantedValue: any, rerender: () => void)

- conditionally includes the linked value, based on if the link is equal to a certain value
- name: the name that will be displayed in the sidebar
- value: the value that will be shown if the link is shown
- link: the value that will determine if the value is shown
- wantedValue: the value that the link must be equal to for the value to be shown
- rerender: the rerender function. Pass in the parent.rerender function.
