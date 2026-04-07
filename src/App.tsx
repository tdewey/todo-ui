import { Switch, Route } from 'react-router-dom'
import Layout from '~/components/Layout'
import TodoPage from '~/pages/TodoPage'

function App() {
  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={TodoPage} />
      </Switch>
    </Layout>
  )
}

export default App
