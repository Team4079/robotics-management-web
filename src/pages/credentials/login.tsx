import React from 'react';
import '../../assets/scss/login.scss';

interface LoginData {
    status: number;
    message: string;
}

const LoginPage: React.FC = (): React.JSX.Element => {
    const username = React.useRef<HTMLInputElement>(null);
    const password = React.useRef<HTMLInputElement>(null);

    const loginToAccount = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const jsonData: object = {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "username": username.current!.value,
                "password": password.current!.value
            })
        }

        try {
            const response: Response = await fetch('/login/user', jsonData);
            const data: LoginData = await response.json();

            if (data.status === 200) {
                // console.log('Login successful!');
                window.location.href = '/';
            } else if (data.status === 404) {
                console.error('User not found:', data.message);
                alert('User not found. Please try again.');
            } else if (data.status === 401) {
                console.error('Incorrect password:', data.message);
                alert('Incorrect password. Please try again.');
            } else {
                console.error('Login failed:', data.message);
                alert('Login failed. Please try again.');
            }
        } catch (error: unknown) {
            console.error('Error:', error as string);
        }
    };

    const googleLogin = async (): Promise<void> => {
        window.location.href = '/auth/google';
    }

    const guestLogin = async (): Promise<void> => {
        try {
            const response: Response = await fetch('/login/guest');

            if (response.status === 200) {
                // console.log('Login successful!');
                window.location.href = '/';
            } else {
                console.error('Login failed:', response);
            }
        } catch (error: unknown) {
            console.error('Error:', error as string);
        }
    }

    React.useEffect(() => {
        const checkLogin = async (): Promise<void> => {
            try {
                const response = await fetch('/login', {
                    method: 'GET',
                    credentials: 'include',
                });

                const data: LoginData = await response.json();

                if (data.status === 200) {
                    // console.log('Already logged in!');
                    window.location.href = '/';
                } else {
                    // console.log('Not logged in.');
                }
            } catch (error: unknown) {
                console.error('Error:', error as string);
            }
        }

        checkLogin();
    }, []);

    return (
        <section id="login">
            <div id="container">
                <div id="regLogin">
                    <h1>Login</h1>

                    <form onSubmit={loginToAccount}>
                        <input type="text" placeholder="Email" ref={username} />
                        <input type="password" placeholder="Password" autoComplete='current-password' ref={password} />

                        <button type="submit">Login</button>
                    </form>

                    <hr />

                    <button onClick={() => googleLogin()}>Register/Sign In with Google</button>

                    <hr />

                    <button onClick={() => guestLogin()}>Continue as Guest</button>
                </div>
            </div>
        </section>
    )
}

export default LoginPage;