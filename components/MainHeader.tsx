import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {COLORS} from '../constants';

interface Props {}
const MainHeader = (props: Props) => {
    return (
        <View
            style={[
                styles.header,
                {
                    backgroundColor: COLORS.themecolor,
                    borderBottomColor: COLORS.border,
                    borderBottomWidth: 0,
                    paddingHorizontal: 20,
                },
            ]}>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Image
                    source={require('../assets/aadhaar.png')}
                    style={{
                        resizeMode: 'cover',
                        flex: 1,
                        width: 47,
                        height: 23,
                    }}
                    resizeMode="cover"
                />
            </View>

            <Text
                style={[
                    styles.title,
                    {
                        paddingHorizontal: 20,
                        color: COLORS.error,
                    },
                ]}
                numberOfLines={1}>
                {'आधार:  '}
                <Text
                    style={{
                        color: COLORS.themecolorrevert,
                    }}>
                    आम आदमी का अधिकार
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.themecolorrevert,
    },
});

export default MainHeader;
