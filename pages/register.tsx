import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
    const [error, setError] = useState<string | null>(null);
    const [qrCodeDataURL, setQRCodeDataURL] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const totp_expiry = parseInt(formData.get('totp_expiry') as string, 10);
        
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, totp_expiry }),
        });

        const result = await response.json();

        if (response.ok) {
            setQRCodeDataURL(result.qrCodeDataURL);
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
                <input type="number" name="totp_expiry" placeholder="Expiration" defaultValue="30" required />

                <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {qrCodeDataURL && (
                <div>
                    <h2>Scan this QR code with your authenticator app. Recommended Aegis Authenticator.</h2>
                    <img src={qrCodeDataURL} alt="QR code" />
                    <Link href="/">Home</Link>
                </div>
            )}
        </div>
    );
}
