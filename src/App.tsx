import { Switch, Route } from 'react-router-dom'

function App() {
  return (
    <Switch>
      <Route exact path="/" render={() => <div />} />
    </Switch>
  )
}

export default App
