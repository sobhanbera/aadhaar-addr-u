import React from 'react';
import {StyleSheet} from 'react-native';
import {Text, TouchableOpacity} from 'react-native';
import {COLORS} from '../constants';

interface Props {
    onPress: Function;
    title: string;
}
const Button = (props: Props) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    borderColor: COLORS.grey + '55',
                },
            ]}
            activeOpacity={0.7}
            onPress={() => props.onPress()}>
            <Text style={styles.buttonText}>{props.title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        borderWidth: 0.65,
        marginVertical: 20,
        paddingHorizontal: 18,
        backgroundColor: COLORS.themecolorrevert,
        flexGrow: 2, // gives the full available space
    },
    buttonText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: COLORS.themecolor,
        paddingVertical: 12,
    },
});

export default Button;
