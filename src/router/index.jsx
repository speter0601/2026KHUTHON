import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import MovieDetailPage from '../pages/MovieDetailPage';
import WatchPage from '../pages/WatchPage';
import FeedbackPage from '../pages/FeedbackPage';
import CreatorProfilePage from '../pages/CreatorProfilePage';
import UserMyPage from '../pages/UserMyPage';
import UploadPage from '../pages/UploadPage';
import CreatorDashboardPage from '../pages/CreatorDashboardPage';
import NotFound from '../pages/NotFound';

/**
 * Modern Router configuration using createBrowserRouter.
 * Optimized for clean URL management and scalable page additions.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'movies/:movieId',
        element: <MovieDetailPage />,
      },
      {
        path: 'movies/:movieId/watch',
        element: <WatchPage />,
      },
      {
        path: 'movies/:movieId/feedback',
        element: <FeedbackPage />,
      },
      {
        path: 'movies/:movieId/dashboard',
        element: <CreatorDashboardPage />,
      },
      {
        path: 'creators/:creatorId',
        element: <CreatorProfilePage />,
      },
      {
        path: 'mypage',
        element: <UserMyPage />,
      },
      {
        path: 'upload',
        element: <UploadPage />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
