import React from 'react';
import '../../assets/scss/homepage.scss';
import Sidebar from '../../assets/components/sidebar';
import getUserData from '../../assets/ts/getUserData';
import UserData from '../../assets/ts/interfaces';

const HomePage: React.FC = (): React.JSX.Element => {
    const [data, setData] = React.useState<UserData | null | undefined>({ username: 'Erick Tran' });

    React.useEffect(() => {
        try {
            setUserData({ username: 'Erick Tran' });
            // getUserData().then((result: UserData | null | undefined) => {
            //     setData(result);
            // });
        } catch (error: unknown) {
            console.error('Error:', error as string);
        }
    }, []);

    const setUserData = (data: UserData | null): void => {
        setData(data);
    }


    return (
        <section id="home">
            <Sidebar />
            <div id="container">
                <div id="content">
                    <h1>Welcome {data!.username}!</h1>
                    <p>This is a simple homepage.</p>
                </div>
            </div>
        </section>
    )
}

export default HomePage;