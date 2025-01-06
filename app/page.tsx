import { supabase } from '../lib/initSupabase';

export default async function Home() {

  const { data, error } = await supabase
    .schema('tootp_users')
    .from("users")
    .select('username');
  
  if (error) return <div>{error.message}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
      <h1 style={{ fontSize: '2em', color: '#333' }}>Users</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {data?.map((user) => (
        <li key={user.username}>
          {user.username}
        </li>
        ))}
      </ul>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
      <a href="/register">
        <button style={{ padding: '10px 20px', fontSize: '1em', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Register
        </button>
      </a>
      <a href="/login">
        <button style={{ padding: '10px 20px', fontSize: '1em', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Login
        </button>
      </a>
      </div>
    </div>
  );
}
