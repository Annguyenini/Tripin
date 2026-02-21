// components/MessageBoxStyle.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        opacity :50,
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: '#ff7e7e',
        padding: 15,
        borderRadius: 8,
        zIndex: 1000,
    },
    title: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    message: {
        color: 'white',
        fontSize: 14,
    },
});