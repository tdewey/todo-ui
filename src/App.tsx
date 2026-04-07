import { Switch, Route } from 'react-router-dom'
import Layout from '~/components/Layout'

function App() {
  return (
    <Layout>
      <Switch>
        <Route exact path="/" render={() => <div />} />
      </Switch>
    </Layout>
  )
}

export default App
