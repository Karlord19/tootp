"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {

  const [users, setUsers] = useState<{ username: string }[]>([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users');
      const result = await response.json();
      if (response.ok) {
        setUsers(result);
      }
      else {
        setError(result.error);
        return;
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
      <h1 style={{ fontSize: '2em', color: '#333' }}>Users</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {users.map((user) => (
        <li key={user.username}>
          {user.username}
        </li>
        ))}
      </ul>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
      <Link href="/register">
        <button style={{ padding: '10px 20px', fontSize: '1em', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Register
        </button>
      </Link>
      <Link href="/login">
        <button style={{ padding: '10px 20px', fontSize: '1em', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Login
        </button>
      </Link>
      </div>
    </div>
  );
}
