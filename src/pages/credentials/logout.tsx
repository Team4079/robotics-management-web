import React from "react";
import '../../assets/scss/logout.scss';

const LogoutPage: React.FC = (): React.JSX.Element => {
    return (
        <section id="logout">
            <div id="container">
                <h1>Logout</h1>
                <p>Are you sure you want to logout?</p>
                <button>Yes</button>
                <button>No</button>
            </div>
        </section>
    )
}

export default LogoutPage;