import React from "react";
import '../../assets/scss/login.scss';

const LoginPage: React.FC = (): React.JSX.Element => {
    return (
        <section id="login">
            <div id="container">
                <form>
                    <h1>Login</h1>
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button>Login</button>
                </form>
            </div>
        </section>
    )
}

export default LoginPage;