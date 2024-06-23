import React from "react";
import { APP_HOSTNAME } from "../../../server/modules/env.ts";
import '../../assets/scss/logout.scss';

const LogoutPage: React.FC = (): React.JSX.Element => {
    const logout = async (): Promise<void> => {
        document.cookie = "token=; path=/";
        const jsonData = {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "token": ""
            })
        }

        const response = await fetch(`${APP_HOSTNAME}/logout`, jsonData);
        const data = await response.json();

        if (data.error) {
            alert(data.error);
            window.location.href = "/login";
        } else {
            window.location.href = "/login";
        }
    };

    const cancel = (): void => {
        window.location.href = "/";
    }

    return (
        <section id="logout">
            <div id="container">
                <h1>Logout</h1>
                <p>Are you sure you want to logout?</p>
                <button onClick={() => logout()}>Yes</button>
                <button onClick={() => cancel()}>No</button>
            </div>
        </section>
    )
}

export default LogoutPage;