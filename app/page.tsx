import { supabase } from '../lib/initSupabase';

export default async function Home() {

  const { data, error } = await supabase
    .from("tootp_users.users")
    .select('username');
  
  if (error) return <div>{error.message}</div>;

  console.log("hello" + data);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {data?.map((user) => (
          <li key={user.username}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}
