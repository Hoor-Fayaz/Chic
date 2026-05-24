import '../styles/globals.css';
import AuthHydrator from '../components/layout/AuthHydrator';
import Toast from '../components/ui/Toast';
import Shell from '../components/layout/Shell';

export const metadata = {
  title: 'Jannah | Premium Clothing',
  description: 'A premium fashion eCommerce experience inspired by modern clothing brands.',
  verification: {
    google: 'V0zwyN7qNvL6pQjcXa3q2pefod1rmTBifc-I5l_cPCo',
  },
};

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col bg-white">
          <AuthHydrator />
          <Toast />
          <Shell>{children}</Shell>
        </div>
      </body>
    </html>
  );
}

