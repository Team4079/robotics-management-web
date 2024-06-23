import React from "react";
import { APP_HOSTNAME } from "../../../server/modules/env.ts";
import '../../assets/scss/login.scss';

const LoginPage: React.FC = (): React.JSX.Element => {
    const username = React.useRef<HTMLInputElement>(null);
    const password = React.useRef<HTMLInputElement>(null);

    const loginToAccount = async () => {
        const jsonData = {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "username": username.current?.value,
                "password": password.current?.value
            })
        }

        const response = await fetch(`${APP_HOSTNAME}/login`, jsonData);
        const data = await response.json();

        if (data.error) {
            alert(data.error);
        } else {
            document.cookie = `token=${data.token}; path=/`;
            window.location.href = "/";
        }
    }

    React.useEffect(() => {
        window.onkeydown = (e) => {
            if (e.key === "Enter") {
                loginToAccount();
            }
        }
    }, []);

    return (
        <section id="login">
            <div id="container">
                <div id="regLogin">
                    <h1>Login</h1>

                    <input type="text" placeholder="Username" ref={username} />
                    <input type="password" placeholder="Password" ref={password} />

                    <button type="submit" onClick={() => loginToAccount()}>Login</button>

                    <hr />

                    <div id="googleLogin">
                        <button>Login with Google</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LoginPage;