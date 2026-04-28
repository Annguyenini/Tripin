import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import AuthHandler from '../../app-core/flow/auth_handler';
import AppFlow from '../../app-core/flow/app_flow';
WebBrowser.maybeCompleteAuthSession();
const GoogleIcon = () => (
    <Svg width={18} height={18} viewBox="0 0 18 18">
        <Path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
        <Path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
        <Path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
        <Path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335" />
    </Svg>
);
export default function GoogleAuth({ pending }) {
    /**
     * action is either 'signin' or 'signup'
     */
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: process.env.GOOGLE_CLIENT_ID,
        iosClientId: process.env.OAUTH_GOOGLE_IOS_CLIENT
    });
    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const verify = async () => {
                const res = await AuthHandler.providerVerifyHandler(id_token, 'google')
                if (res?.status == 202) {
                    const pending_token = res.data?.pending_token
                    pending?.(pending_token, id_token, 'google')
                }
                else if (res?.status === 200) {
                    AppFlow?.onAuthSuccess()
                }
            }
            verify()
            // console.log('access_token:', authentication.accessToken);
            // console.log('Google ID Token:', id_token);

            // send to your backend
            // fetch('https://your-api.com/auth/google', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ idToken: id_token }),
            // });
        }
    }, [response]);

    return (
        <TouchableOpacity onPress={() => promptAsync()} style={styles.button}>
            <GoogleIcon />
            <Text style={styles.label}>Continue with Google</Text>
        </TouchableOpacity>
    );
}
const styles = {
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#1a1917',   // your dark warm bg
        borderWidth: 0.5,
        borderColor: '#3a3835',
        borderRadius: 8,
        marginTop: 10,
    },
    label: {
        fontSize: 15,
        fontWeight: '500',
        color: '#f0f0ec',
        fontFamily: 'DMMono',         // your body font
    },
};