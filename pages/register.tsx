import { useState } from 'react';

export default function Register() {
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const expiration = formData.get('expiration');
        
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, expiration }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log(result);
            alert('Registration successful');
            window.location.href = '/';
        } else {
            setError(result.error);
            alert(result.error);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input type="text" name="username" placeholder="Username" required />
                <input type="password" name="password" placeholder="Password" required />
                <input type="number" name="expiration" placeholder="Expiration" defaultValue="30" required />

                <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
