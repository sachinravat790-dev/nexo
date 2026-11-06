import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/cart/CartDrawer';
import Home from './pages/Home';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Home />
        <CartDrawer />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;