'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData, updateAccessToken, clearCredentials } from '../features/auth/authSlice';
import { fetchPosts, createPost, updatePost, deletePost } from '../features/posts/postsSlice';
import { getCookie, deleteCookie } from '../lib/utils/cookie';

export default function DashboardPage() {
  const { user, accessToken, status: authStatus, error: authError } = useSelector((state) => state.auth);
  const { posts, status: postsStatus, error: postsError } = useSelector((state) => state.posts);
  const [error, setError] = useState('');
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
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

      // Fetch posts after authentication is confirmed
      if (currentAccessToken) {
        dispatch(fetchPosts());
      }
    };

    checkToken();
  }, [user, accessToken, dispatch, router]);

  const handleCreatePost = async (postData) => {
    try {
      await dispatch(createPost(postData)).unwrap();
      setIsPostFormOpen(false);
    } catch (err) {
      console.error('Create post error:', err);
      setError('Failed to create post');
    }
  };

  const handleUpdatePost = async (postId, postData) => {
    try {
      await dispatch(updatePost({ postId, postData })).unwrap();
      setIsPostFormOpen(false);
      setEditingPost(null);
    } catch (err) {
      console.error('Update post error:', err);
      setError('Failed to update post');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await dispatch(deletePost(postId)).unwrap();
    } catch (err) {
      console.error('Delete post error:', err);
      setError('Failed to delete post');
    }
  };

  const handleLogout = () => {
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    dispatch(clearCredentials());
    router.push('/login');
  };

  if (authStatus === 'loading' || postsStatus === 'loading') {
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
      {(error || authError || postsError) && <p style={{ color: 'red' }}>{error || authError || postsError}</p>}
      <button
        onClick={() => setIsPostFormOpen(true)}
        style={{ padding: '10px 20px', marginTop: '20px' }}
      >
        Create Post
      </button>
      {isPostFormOpen && (
        <PostForm
          post={editingPost}
          onSubmit={editingPost ? (data) => handleUpdatePost(editingPost.post_id, data) : handleCreatePost}
          onClose={() => {
            setIsPostFormOpen(false);
            setEditingPost(null);
          }}
        />
      )}
      <div style={{ marginTop: '20px' }}>
        <h2>Posts</h2>
        {posts.map((post) => (
          <div key={post.post_id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <button onClick={() => {
              setEditingPost(post);
              setIsPostFormOpen(true);
            }}>Edit</button>
            <button onClick={() => handleDeletePost(post.post_id)}>Delete</button>
          </div>
        ))}
      </div>
      <button
        onClick={handleLogout}
        style={{ padding: '10px 20px', marginTop: '20px' }}
      >
        Logout
      </button>
    </div>
  );
}

function PostForm({ post, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    title: post ? post.title : '',
    description: post ? post.description : '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '400px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}>
        <h2 style={{ marginBottom: '20px' }}>{post ? 'Edit Post' : 'Create Post'}</h2>
        <div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px', height: '100px' }}
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '10px 20px', marginRight: '10px' }}
            >
              Cancel
            </button>
            <button
              onClick={handleFormSubmit}
              style={{ padding: '10px 20px' }}
            >
              {post ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}