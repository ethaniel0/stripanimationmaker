import React, { useState } from 'react'
import { Block, BlockDefinition, functions, animations, objects } from './instances'
import { ItemType } from './definitions';
import arrow from '../imgs/arrow.svg';

interface BlockItemProps {
    block: Block;
    select: (id: number) => void;
    selected: number;
}

function setSelection(e: React.MouseEvent, id: number, select: (id: number) => void){
    e.stopPropagation();
    e.preventDefault();
    select(id);
}

function setBlockValue(block: Block, e: React.ChangeEvent<HTMLSelectElement>){
    let value = e.target.value;

    let def: BlockDefinition | undefined = undefined;
    if (block.type === ItemType.FUNCTION){
        def = functions.find((f) => f.symbol === value);
    }
    else if (block.type === ItemType.ANIMATION){
        def = animations.find((a) => a.symbol === value);
    }
    else if (block.type === ItemType.OBJECT){
        def = objects.find((o) => o.symbol === value);
    }
    if (!def) return;

    let b = new Block(def, block.rerender);
    // copy everything except id and rerender
    block.symbol = b.symbol;
    block.variables = b.variables;
    block.inner = b.inner;
    block.innerType = b.innerType;
    block.innerMax = b.innerMax;
    block.innerListeners = b.innerListeners;
    block.length = b.length;

    block.rerender();
}

const BlockItem = ({block, select, selected}: BlockItemProps) => {
    let [expanded, setExpanded] = useState(true);
    return (
        <div className="block" onClick={(e) => setSelection(e, block.id, select)}>
            <div className={'block-head-row' + (selected === block.id ? ' selected' : '')}>
                {
                    block.type === ItemType.SYSTEM ? 
                    <span className="block-head">System</span>
                    :
                    <select name="type" value={block.symbol} onChange={e => setBlockValue(block, e)} className="block-head">
                        {
                            block.type === ItemType.FUNCTION &&
                            functions.map((f) => {
                                return <option key={f.symbol} value={f.symbol}>{f.name}</option>
                            })
                        }
                        {
                            block.type === ItemType.ANIMATION &&
                            animations.map((a) => {
                                return <option key={a.symbol} value={a.symbol}>{a.name}</option>
                            })
                        }
                        {
                            block.type === ItemType.OBJECT &&
                            objects.map((o) => {
                                return <option key={o.symbol} value={o.symbol}>{o.name}</option>
                            })
                        }
                    </select>
                }
                {
                    block.type !== ItemType.SYSTEM &&
                    <button className="block-remove" onClick={(e) => {e.stopPropagation(); e.preventDefault(); block.remove();}}>
                        X
                    </button>
                }
                {
                    expanded ? 
                    <button className='expand-btn' onClick={() => setExpanded(!expanded)}>
                        <img src={arrow} alt="" />
                    </button>
                    :
                    <button className='expand-btn reverse' onClick={() => setExpanded(!expanded)}>
                        <img src={arrow} alt="" />
                    </button>
                }
                
                
            </div>
            
            <div style={{paddingLeft: '2rem'}}>
                {
                    expanded ?
                    block.inner.map((i, ind) => {
                        return <BlockItem key={i.id} block={i} select={select} selected={selected} />
                    })
                    :
                    <div>...</div>
                }
                {
                    (block.innerMax === -1 || block.inner.length < block.innerMax) && expanded && block.innerType != ItemType.NONE &&

                    <button key={block.innerType} className={'add-btn ' + block.innerType} onClick={() => block.addType(block.innerType)} >
                        + {block.innerType}
                    </button>
                    
                }
            </div>
        </div>
    )
}

export default BlockItem