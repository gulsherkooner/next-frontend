import AuthProvider from './components/AuthProvider.js';
import './globals.css';
import Footer from './components/Footer.jsx';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-right" />
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}