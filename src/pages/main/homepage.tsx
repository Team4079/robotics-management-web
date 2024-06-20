import React from 'react';
import '../../assets/scss/homepage.scss';

const HomePage: React.FC = (): React.JSX.Element => {
    return (
        <section id="home">
            <div id="container">
                <div id="sidebar">
                    <h1>Home</h1>
                    <p>Click the links above to navigate to other pages.</p>
                </div>
                <div id="content">
                    <h1>Welcome to the Home Page</h1>
                    <p>This is a simple homepage.</p>
                </div>
            </div>
        </section>
    )
}

export default HomePage;