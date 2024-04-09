import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.jsx';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
  <Router>
    <App>
      <Switch>
        <Route exact path="/" component={SearchBooks} />
        <Route path="/saved" component={SavedBooks} />
      </Switch>
    </App>
  </Router>
);