import { useState } from 'react';

export default function useToken(){
    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken;
    };

    const [token, setToken] = useState(getToken());

    // Code to save token to local storage
    const saveToken = userToken => {
        console.log("Set token is called: " + userToken);
        sessionStorage.setItem('token', JSON.stringify(userToken));
        setToken(token => userToken.token);
    };

    return {
        setToken: saveToken,
        token
    }
}