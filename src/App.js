import React, { useCallback, useState, useRef, useMemo, useContext } from 'react';

const SelectionContext = React.createContext(0)
const NullContext = React.createContext({ x: 0, y: 0 })

const selectedShapes = [0, 1, 2]

const Shape = React.memo(({ x, y, selected, ...props }) => {
  console.log('Shape()')

  const translate = useContext(selected ? SelectionContext : NullContext)

  return useMemo(() => (
    <rect x={x + translate.x} y={y + translate.y} width={90} height={90} {...props} />
  ), [x, y, translate, props])
})

const Canvas = React.memo(({ shapes, onMouseDown, onMouseMove, onMouseUp }) => {
  console.log('Canvas()')

  return (
    <svg width="1000" height="1000">
      {shapes.map(shape => (
        <Shape
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
  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  })
  const [shapes, setShapes] = useState(Array.from({ length: 100 }, (_, index) => ({
    id: index,
    x: index % 10 * 100 + 10,
    y: Math.floor(index / 10) * 100 + 10,
  })))

  const touchStart = useRef()
 
  const handleMouseDown = useCallback(event => {
    touchStart.current = {
      x: event.pageX,
      y: event.pageY
    }
  }, [touchStart])

  const handleMouseMove = useCallback(event => {
    if (event.buttons === 1) {
      setTranslate({
        x: event.pageX - touchStart.current.x,
        y: event.pageY - touchStart.current.y
      })
    }
  }, [touchStart, setTranslate])

  const handleMouseUp = useCallback(event => {
      setShapes(shapes.map(shape => selectedShapes.includes(shape.id) ? {
          ...shape,
          x: shape.x + event.pageX - touchStart.current.x,
          y: shape.y + event.pageY - touchStart.current.y,
        } : shape
      ))

      setTranslate({
        x: 0,
        y: 0
      })
   }, [shapes, setTranslate])

  return (
    <SelectionContext.Provider value={translate}>
      <Canvas
        shapes={shapes}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </SelectionContext.Provider>
  );
}

export default App
