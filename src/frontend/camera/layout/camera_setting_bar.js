import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CameraSetting = ({ flash, setFlash, facing, setFacing }) => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>

                {/* Flip Camera */}
                <TouchableOpacity
                    style={styles.pill}
                    onPress={() => setFacing(prev => prev === 'back' ? 'front' : 'back')}
                >
                    <Text style={styles.icon}>⟲</Text>
                    {/* <Text style={styles.label}>Flip</Text> */}
                </TouchableOpacity>

                {/* Flash */}
                <TouchableOpacity
                    style={flash === 'auto' ? styles.pill_active : styles.pill}
                    onPress={() => setFlash(prev => prev === 'off' ? 'auto' : 'off')}
                >
                    <Text style={styles.icon}>⚡︎</Text>
                    {/* <Text style={styles.label}>{flash === 'auto' ? 'Auto' : 'Off'}</Text> */}
                </TouchableOpacity>

                {/* Add more buttons here in future */}

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        right: 0,
        top: '10%',
        
    },
    container: {
        backgroundColor: '#373737',
        borderRadius: 28,
        top: 50,
        paddingVertical: 10,
        paddingHorizontal: 6,
        alignItems: 'center',
        opacity:0.8
    },
    pill: {
        // backgroundColor: '#b3b3b3',
        borderRadius: 16,
        paddingVertical: 2,
        paddingHorizontal: 2,
        alignItems: 'center',
        marginVertical: 5,
        minWidth: 50,
    },
    pill_active: {
        backgroundColor: '#FFD600',
        borderRadius: 16,
        paddingVertical: 2,
        paddingHorizontal: 2,
        alignItems: 'center',
        marginVertical: 5,
        minWidth: 50,
    },
    icon: {
        fontSize: 30,
        fontWeight: '700',
        color:'white'
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        opacity: 0.7,
        marginTop: 2,
        
    },
})

export default CameraSetting;