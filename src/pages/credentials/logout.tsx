import React from "react";
import '../../assets/scss/logout.scss';

interface LogoutData {
    error: string;
}

const LogoutPage: React.FC = (): React.JSX.Element => {
    const logout = async (): Promise<void> => {       
        const response: Response = await fetch("/credentials/logout", { "method": "POST", "credentials": "include" });
        const data: LogoutData = await response.json();

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