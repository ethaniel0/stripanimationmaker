import Draggable from 'react-draggable';

const Strips = () => {
  return (
    <>
        <span>LED Strips</span>
        <div id="strips-playground">

          <Draggable>
            <div id="strip-1" className="strip"></div>

          </Draggable>

        </div>
    </>
    
  )
}

export default Strips