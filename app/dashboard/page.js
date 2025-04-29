'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData, updateAccessToken, clearCredentials } from '../features/auth/authSlice';
import { getCookie, deleteCookie } from '../utils/cookie'; // Import cookie utils

export default function DashboardPage() {
  const { user, accessToken, status: authStatus, error: authError } = useSelector((state) => state.auth);
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {
      let currentAccessToken = accessToken || getCookie('accessToken');

      if (!currentAccessToken) {
        const refreshToken = getCookie('refreshToken');

        if (refreshToken) {
          try {
            const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
            const res = await fetch(`${apiGatewayUrl}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
              credentials: 'include',
            });

            const data = await res.json();
            if (res.ok) {
              dispatch(updateAccessToken(data.accessToken));
              currentAccessToken = data.accessToken;
            } else {
              throw new Error(data.error || 'Unable to refresh token');
            }
          } catch (err) {
            console.error('Token refresh error:', err);
            setError('Session expired. Please log in again.');
            dispatch(clearCredentials());
            router.push('/login');
            return;
          }
        } else {
          setError('No session found. Please log in.');
          dispatch(clearCredentials());
          router.push('/login');
          return;
        }
      }

      if (!accessToken && currentAccessToken) {
        dispatch(updateAccessToken(currentAccessToken));
      }

      if (!user && currentAccessToken) {
        dispatch(fetchUserData());
      }
    };

    checkToken();
  }, [user, accessToken, dispatch, router]);

  const handleLogout = () => {
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    dispatch(clearCredentials());
    router.push('/login');
  };

  if (authStatus === 'loading') {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Welcome, {user.email}</h1>
      <div>
        <p><strong>User ID:</strong> {user.user_id}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Name:</strong> {user.name || 'N/A'}</p>
        <p><strong>Bio:</strong> {user.bio || 'N/A'}</p>
        {user.profile_img_url && (
          <p>
            <strong>Profile Image:</strong>
            <br />
            <img src={user.profile_img_url} alt="Profile" style={{ maxWidth: '100px', marginTop: '10px' }} />
          </p>
        )}
        <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(user.updated_at).toLocaleString()}</p>
      </div>
      {(error || authError) && <p style={{ color: 'red' }}>{error || authError}</p>}
      <button
        onClick={handleLogout}
        style={{ padding: '10px 20px', marginTop: '20px' }}
      >
        Logout
      </button>
    </div>
  );
}