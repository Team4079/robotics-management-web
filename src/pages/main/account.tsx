/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import '../../assets/scss/account.scss';
import Sidebar from '../../assets/components/sidebar.tsx';
import { UserData } from '../../assets/ts/interfaces.ts';
import getUserData from '../../assets/ts/getUserData.ts';

const AccountPage: React.FC = (): React.JSX.Element => {
    const [data, setData] = React.useState<UserData | null | undefined>();

    const passwordRef = React.useRef<HTMLInputElement>(null);
    const confirmPasswordRef = React.useRef<HTMLInputElement>(null);

    const getData = async (): Promise<void> => {
        try {
            const userData: UserData[] | undefined | null = await getUserData();

            if (!userData) {
                window.location.href = '/login';
                return;
            }

            setData(userData[0]);
        } catch (error: unknown) {
            console.error('Error:', error as string);
        }
    }

    const logout = async (): Promise<void> => {
        try {
            const response = await fetch('/credentials/logout', { "method": "POST", "credentials": "include" });
            const data = await response.json();

            if (data.error) {
                console.error(data.error);
            } else {
                window.location.href = '/login';
            }
        } catch (error: unknown) {
            console.error('Error:', error as string);
        }
    }

    const deleteAccount = async (): Promise<void> => {
        try {
            if (!confirm('Are you sure you want to delete your account?')) {
                return;
            }

            const response = await fetch('/post/delete', { "method": "POST", "credentials": "include" });

            if (response.status === 401) {
                alert('You must be logged in to delete your account');
                return;
            } else if (response.status === 500) {
                alert('An error occurred. Please try again later.');
                return;
            } else if (response.status === 404) {
                alert('No account found');
                return;
            } else {
                window.location.href = '/login';
            }
        } catch (error: unknown) {
            console.error('Error:', error as string);
        }
    }

    const setPassword = async () => {
        try {
            const password: string = passwordRef.current?.value as string;
            const confirmPassword: string = confirmPasswordRef.current?.value as string;

            if (password === "" || confirmPassword === "") {
                alert('Please fill out all fields');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            const dataJson = {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify({
                    "password": password
                })
            }

            const response = await fetch('/post/password', { ...dataJson, "credentials": "include" });
            const data = await response.json();

            if (data.error) {
                console.error(data.error);
            }
        } catch (error: unknown) {
            console.error('Error:', error as string);
        }
    }

    React.useEffect(() => {
        getData();

        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                setPassword();
            }
        });
    }, []);

    return (
        <section id='account'>
            <Sidebar />
            <div id='container'>
                <h1>Account</h1>
                <div id='info'>
                    <h2>Username: {data?.displayName}</h2>
                    <h2>Email: {data?.email}</h2>
                    <input type='password' placeholder='Password' ref={passwordRef} />
                    <input type='password' placeholder='Confirm Password' ref={confirmPasswordRef} />
                    <button onClick={() => setPassword()}>Change Password</button>
                </div>

                <div id="other">
                    <h1 id="main">Other</h1>
                    <button onClick={() => logout()}>Logout</button>
                    <button id="delete" onClick={() => deleteAccount()}>Delete Account</button>
                </div>
            </div>
        </section>
    );
};

export default AccountPage;