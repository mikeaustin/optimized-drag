import React, { useCallback, useState, useMemo, useRef, useContext } from 'react';

const SelectionContext = React.createContext(0)
const NullContext = React.createContext({ x: 0, y: 0 })

const Shape = ({ x, y, selected, ...props }) => {
  console.log('Shape()')

  const translate = useContext(selected ? SelectionContext : NullContext)

  return (
    <rect x={x + translate.x} y={y + translate.y} width={90} height={90} {...props} />
  )
}

const Shape2 = ({ x, y, selected, ...props }) => {
  return useMemo(() => {
    return <Shape x={x} y={y} selected={selected} {...props} />
  }, [selected])
}

const selectedShapes = [1]

const ShapeMemo = React.memo(Shape)

const Canvas = React.memo(({ shapes, onMouseDown, onMouseMove, onMouseUp }) => {
  console.log('Canvas()')

  return (
    <svg width="1000" height="1000">
      {shapes.map(shape => (
        <ShapeMemo
          key={shape.id}
          x={shape.x}
          y={shape.y}
          selected={selectedShapes.includes(shape.id)}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        />)
      )}
    </svg>
  )
})

function App() {
  const [shapes, setShapes] = useState([
    { id: 1, x: 100, y: 100 },
    { id: 2, x: 200, y: 100 },
    { id: 3, x: 300, y: 100 },
    { id: 4, x: 400, y: 100 },
  ])
  const touchStart = useRef()
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const translateRef = useRef(translate)

  const handleMouseDown = useCallback(event => {
    touchStart.current = { x: event.pageX, y: event.pageY }
  }, [touchStart])

  const handleMouseMove = useCallback(event => {
    if (event.buttons === 1) {
      setTranslate({ x: event.pageX - touchStart.current.x, y: event.pageY - touchStart.current.y })
      translateRef.current = { x: event.pageX - touchStart.current.x, y: event.pageY - touchStart.current.y }
    }
  }, [touchStart, setTranslate])

  const handleMouseUp = useCallback(event => {
      setTranslate({ x: 0, y: 0 })

      setShapes(shapes.map(shape => selectedShapes.includes(shape.id)
        ? { ...shape, x: shape.x + translateRef.current.x, y: shape.y + translateRef.current.y }
        : shape
      ))
      
      translateRef.current = { x: 0, y: 0 }
  }, [shapes, selectedShapes, setTranslate])

  console.log('App()')

  return (
    <SelectionContext.Provider value={translate}>
      <Canvas shapes={shapes} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} />
    </SelectionContext.Provider>
  );
}

export default App;
