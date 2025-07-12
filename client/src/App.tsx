// src/App.tsx
import { Provider } from 'react-redux';
import { store } from './store/store';
import AuthExample from './components/AuthExample';


function App() {
  return (
    <Provider store={store}>
      <AuthExample />
    </Provider>
  );
}

export default App;