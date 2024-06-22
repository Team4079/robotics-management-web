async function getUserData(): Promise<object> {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');

        const result = await response.json();

        return result;
    } catch (error: unknown) {
        console.error('Error:', error);
        return {};
    }
}

export default getUserData;