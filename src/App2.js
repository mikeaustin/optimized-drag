import React from 'react';

const SelectionContext = React.createContext(0)
const NullContext = React.createContext({ x: 0, y: 0 })

const selectedShapes = [0, 1, 2]

class Shape extends React.PureComponent {
  render() {
    console.log('Shape.render()')

    const { x, y, selected, ...props } = this.props
    const Context = selected ? SelectionContext : NullContext

    return (
      <Context.Consumer>
        {translate => (
          selected && console.log('translate'),
          <rect x={x + translate.x} y={y + translate.y} width={90} height={90} {...props} />
        )}
      </Context.Consumer>
    )
  }
}

class Canvas extends React.PureComponent {
  render() {
    const { shapes, onMouseDown, onMouseMove, onMouseUp } = this.props

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
          />
        ))}
      </svg>
    )
  }
}

class App extends React.PureComponent {  
  state = {
    translate: { x: 0, y: 0 },
    shapes: Array.from({ length: 100 }, (_, index) => ({
      id: index,
      x: index % 10 * 100 + 10,
      y: Math.floor(index / 10) * 100 + 10,
    }))
  }

  touchStart = null

  handleMouseDown = event => {
    this.touchStart = {
      x: event.pageX,
      y: event.pageY
    }
  }

  handleMouseMove = event => {
    if (event.buttons === 1) {
      this.setState({
        translate: {
          x: event.pageX - this.touchStart.x,
          y: event.pageY - this.touchStart.y,
        }
      })
    }
  }

  handleMouseUp = event => {
    this.setState({
      shapes: this.state.shapes.map(shape => selectedShapes.includes(shape.id) ? {
          ...shape,
          x: shape.x + event.pageX - this.touchStart.x,
          y: shape.y + event.pageY - this.touchStart.y,
        } : shape
      ),
      translate: {
        x: 0,
        y: 0
      }
    })
  }

  render() {
    return (
      <SelectionContext.Provider value={this.state.translate}>
        <Canvas
          shapes={this.state.shapes}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
        />
      </SelectionContext.Provider>
    )
  }
}

export default App
