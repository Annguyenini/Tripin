import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin() {
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: process.env.GOOGLE_CLIENT_ID,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;

            console.log('Google ID Token:', id_token);

            // send to your backend
            // fetch('https://your-api.com/auth/google', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ idToken: id_token }),
            // });
        }
    }, [response]);

    return (
        <Button
            title="Login with Google"
            disabled={!request}
            onPress={() => promptAsync()}
        />
    );
}