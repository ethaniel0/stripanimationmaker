import { Block } from './instances'

interface SidebarProps {
  block: Block;
  selected: number;
}
const Sidebar = ({block, selected}: SidebarProps) => {
  return (
    <>
      {
        block.getChild(selected)?.variables.map((v, ind) => {
              return <div key={ind}>{v.exportJSX()}</div>
        })
      }
    </>
  )
}

export default Sidebar