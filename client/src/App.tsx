// src/App.tsx
import { Provider } from 'react-redux';
import { store } from './store/store';
import Navbar from './components/Navbar';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import SamplePage from './pages/sample-page';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter> 
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<SamplePage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;