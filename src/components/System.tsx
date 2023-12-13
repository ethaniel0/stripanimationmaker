import { Block } from './instances'
import BlockItem from './BlockItem';

interface SystemProps {
    system: Block;
    select: (id: number) => void;
    selected: number
}

const System = ({system, select, selected}: SystemProps) => {
    return (
        <div>
            <BlockItem block={system} select={select} selected={selected} />
        </div>
    )
}

export default System
