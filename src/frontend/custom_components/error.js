// components/MessageBox.js
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/function/error_box_style';

export function ErrorMessageBox({ title, message, duration = 3000 }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
}