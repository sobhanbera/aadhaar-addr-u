import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../constants';

interface Props {
    title: string;
    onPressClearInputsButton: Function;
}
const Header = (props: Props) => {
    return (
        <View
            style={[
                styles.header,
                {
                    backgroundColor: COLORS.themecolor,
                    borderBottomColor: COLORS.border,
                    borderBottomWidth: 1,
                },
            ]}>
            <Text
                style={[
                    styles.title,
                    {
                        paddingHorizontal: 20,
                    },
                ]}
                numberOfLines={1}>
                {props.title}
            </Text>

            <MaterialIcons
                onPress={() => props.onPressClearInputsButton()}
                name="clear"
                color={COLORS.themecolorrevert}
                size={20}
                style={{
                    marginHorizontal: 25,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.themecolorrevert,
    },
});

export default Header;
