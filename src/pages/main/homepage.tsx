import React from 'react';
import '../../assets/scss/homepage.scss';
import Sidebar from '../../assets/ts/sidebar';
import getUserData from '../../assets/ts/getUserData';

const HomePage: React.FC = (): React.JSX.Element => {
    const [data, setData] = React.useState<object>({});

    React.useEffect(() => {
        getUserData().then((result: object) => {
            setData(result);
        });
    });


    return (
        <section id="home">
            <div id="container">
                <Sidebar />
                <div id="content">
                    <h1>Welcome to the Home Page</h1>
                    <p>This is a simple homepage.</p>
                </div>
            </div>
        </section>
    )
}

export default HomePage;