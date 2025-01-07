import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function User() {
    const [username, setUsername] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async() => {
            const response = await fetch('/api/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();
            if (response.ok) {
                setUsername(result.username);
            }
            else {
                router.push('/login');
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = () => {
        document.cookie = 'username=; path=/';
        router.push('/');
    };

    if (!username) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Hello, {username}</h1>
            
            <button onClick={handleLogout} style={{ padding: '10px 20px', fontSize: '1em', backgroundColor: '#b71416', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Logout
            </button>
        </div>
    )
}
