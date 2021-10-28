import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../constants';

interface Props {
    title: string;
    errorText?: boolean;
    bold?: boolean;
}
const Title = (props: Props) => {
    if (props.errorText) {
        return <Text style={styles.errorText}>{props.title}</Text>;
    }

    if (props.bold) {
        return (
            <View
                style={[
                    styles.view,
                    {
                        borderBottomColor: COLORS.border,
                        borderBottomWidth: 1,
                        width: '100%',
                        paddingHorizontal: 10,
                    },
                ]}>
                <Text
                    style={[
                        styles.title,
                        {
                            fontWeight: 'bold',
                            fontSize: 18,
                            textAlign: 'center',
                            width: '100%',
                        },
                    ]}>
                    {props.title}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.view}>
            <Text style={styles.title}>{props.title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 2,
        paddingTop: 10,
    },
    title: {
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 0,
        color: COLORS.themecolorrevert,
        fontWeight: '400',
    },
    errorText: {
        fontSize: 14,
        paddingTop: 0,
        paddingBottom: 0,
        color: COLORS.error,
    },
});

export default Title;
