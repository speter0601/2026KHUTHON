import { Outlet } from 'react-router-dom';
import Header from '../components/organisms/Header';

/**
 * MainLayout Component
 * Centralized layout that provides a global Header and consistent theme.
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
