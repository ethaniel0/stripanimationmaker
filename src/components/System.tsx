import { Block } from './instances'

interface SystemProps {
    system: Block;
    select: (id: number) => void;
}

const System = ({system, select}: SystemProps) => {
    return (
        <div>
            {system.exportJSX(select)}
        </div>
    )
}

export default System
