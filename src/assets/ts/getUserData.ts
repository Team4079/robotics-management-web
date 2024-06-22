import UserData from "./interfaces";

async function getUserData(): Promise<UserData | null | undefined> {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');

        const result = await response.json();

        return result;
    } catch (error: unknown) {
        console.error('Error:', error);
    }

    return
}

export default getUserData;