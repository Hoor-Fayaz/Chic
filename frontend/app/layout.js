import '../styles/globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AuthHydrator from '../components/layout/AuthHydrator';
import Toast from '../components/ui/Toast';

export const metadata = {
  title: 'Chic | Premium Clothing',
  description: 'A premium fashion eCommerce experience inspired by modern clothing brands.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col bg-white">
          <AuthHydrator />
          <Toast />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

