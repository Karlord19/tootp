import { useState } from 'react';

export default function Login() {
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const [userID, setUserID] = useState<string | null>(null);
    const [attempts, setAttempts] = useState(0);

    const handleStep1 = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        const response = await fetch('/api/login-step1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (response.ok) {
            setUserID(result.userID);
            setStep(2);
            setError(null);
        } else {
            setError(result.error);
        }
    };

    const handleStep2 = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const totpCode = formData.get('totpCode') as string;

        const response = await fetch('/api/login-step2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID, totpCode }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Login successful');
            window.location.href = '/user';
        } else {
            setError(result.error);
            setAttempts(attempts + 1);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {step === 1 && (
                <form onSubmit={handleStep1}>
                    <input type="text" name="username" placeholder="Username" required />
                    <input type="password" name="password" placeholder="Password" required />

                    <button type="submit">Next</button>
                </form>
            )}
            {step === 2 && (
                <form onSubmit={handleStep2}>
                    <input type="text" name="totpCode" placeholder="TOTP Code" required />

                    <button type="submit">Login</button>
                </form>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {step === 2 && attempts > 0 && (
                <p style={{ color: 'red' }}>Invalid TOTP code. You already tried {attempts} times.</p>
            )}
        </div>
    );
}
