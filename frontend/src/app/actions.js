'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function signUpUser(prevState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    
    const data = await res.json();
    if (!res.ok) {
      return { error: data?.error?.message || 'Failed to register.' };
    }

    const cookieStore = await cookies();
    cookieStore.set('jwt', data.jwt, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7 });
    cookieStore.set('userId', data.user.id.toString(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7 });
  } catch (err) {
    return { error: 'Server error. Please try again.' };
  }

  redirect('/dashboard');
}

export async function signInUser(prevState, formData) {
  const identifier = formData.get('identifier');
  const password = formData.get('password');

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { error: data?.error?.message || 'Invalid credentials.' };
    }

    const cookieStore = await cookies();
    cookieStore.set('jwt', data.jwt, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7 });
    cookieStore.set('userId', data.user.id.toString(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7 });
  } catch (error) {
    return { error: 'Server error. Please try again.' };
  }

  redirect('/dashboard');
}

export async function logOut() {
  const cookieStore = await cookies();
  cookieStore.delete('jwt');
  cookieStore.delete('userId');
  redirect('/signin');
}

export async function getTodos() {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;
  const userId = cookieStore.get('userId')?.value;
  if (!token || !userId) return [];

  try {
    const res = await fetch(`${STRAPI_URL}/api/todos?filters[user][id][$eq]=${userId}&populate=*`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store'
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
}

export async function createTodo(formData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;
  const userId = cookieStore.get('userId')?.value;
  if (!token || !userId) return { error: 'Not authorized' };
  
  const title = formData.get('title');
  if (!title || title.trim() === '') return { error: 'Title is required' };

  try {
    const res = await fetch(`${STRAPI_URL}/api/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        data: { 
          title: title.trim(), 
          isCompleted: false,
          user: parseInt(userId, 10)
        } 
      })
    });
    
    if (!res.ok) return { error: 'Failed to create todo' };
    const createdData = await res.json();
    
    const { revalidatePath } = require('next/cache');
    revalidatePath('/dashboard');
    return { success: true, todo: createdData.data };
  } catch (error) {
    return { error: 'Server error' };
  }
}

export async function toggleTodo(documentId, isCompleted) {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;
  if (!token) return { error: 'Not authorized' };

  try {
    const res = await fetch(`${STRAPI_URL}/api/todos/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ data: { isCompleted } })
    });

    if (!res.ok) return { error: 'Failed to update todo' };
  } catch (error) {
    return { error: 'Server error' };
  }

  const { revalidatePath } = require('next/cache');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteTodo(documentId) {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;
  if (!token) return { error: 'Not authorized' };

  try {
    const res = await fetch(`${STRAPI_URL}/api/todos/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) return { error: 'Failed to delete todo' };
  } catch (error) {
    return { error: 'Server error' };
  }

  const { revalidatePath } = require('next/cache');
  revalidatePath('/dashboard');
  return { success: true };
}