import { useState } from 'react';

export default function Login() {
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log(result);
            alert('Login successful');
            window.location.href = '/user';
        } else {
            setError(result.error);
            alert(result.error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="text" name="username" placeholder="Username" required />
                <input type="password" name="password" placeholder="Password" required />

                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
