import { Switch, Route } from 'react-router-dom'
import './App.scss'

function App() {
  return (
    <Switch>
      <Route exact path="/" render={() => <div />} />
    </Switch>
  )
}

export default App
