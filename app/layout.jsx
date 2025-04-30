import AuthProvider from './components/AuthProvider.js';
import './globals.css';
import Footer from './components/Footer.jsx';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}