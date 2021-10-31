import React, {useEffect, useState} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    TextInput,
    View,
    ToastAndroid,
    TouchableOpacity,
    Image,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import AsyncStorage from '@react-native-community/async-storage';
import dayjs from 'dayjs';

import {COLORS, ACTUAL_STATES_ARRAY, EVERY_DISTRICT_ARRAY} from '../constants';
import Title from '../components/Title';
import Button from '../components/Button';
import Header from '../components/Header';
import MainHeader from '../components/MainHeader';
import {Alert} from 'react-native';
import {Text} from 'react-native';
import {capitalizeWords} from '../constants/utils';

const HISTORY_STORAGE_POINTER = 'HISTORY_STORAGE_POINTER';
interface HistoryType {
    aadhaar: string;
    name: string;
    phone?: string;
    state: string;
    district: string;
    line1: string;
    line2?: string;
    pin: string;
    address: string;
    timestamp: string;
}

const App = () => {
    const [aadhaar, setAadhaar] = useState('');
    const [aadhaarDisplay, setAadhaarDisplay] = useState('');

    const [name, setName] = useState('');

    const [error, setError] = useState('');

    const [state, setState] = useState('Andhra Pradesh');
    const [district, setDistrict] = useState('Anantapur');
    const [line1, setLine1] = useState('');
    const [line2, setLine2] = useState('');
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');

    const [history, setHistory] = useState<HistoryType[]>([]);

    function clearInputs() {
        setName('');
        setAadhaar('');
        setAadhaarDisplay('');
        setError('');
        setLine1('');
        setLine2('');
        setPhone('');
        setPin('');
    }

    function formatAadhaar(aadhaar: string) {
        return aadhaar
            .replace(/[^\dA-Z]/g, '')
            .replace(/(.{4})/g, '$1 ') // 1 space
            .trim();
    }

    function isValidAadhaar(aadhaar: string) {
        // since we are adding spaces so we also need actual aadhaar variable
        // which is after removing the spaces
        const actualAadhaarNumber = aadhaar.replace(/\s/g, '');
        const formatedAadhaar = formatAadhaar(aadhaar);

        setAadhaar(actualAadhaarNumber);
        setAadhaarDisplay(formatedAadhaar);

        // if any one by passes the code by mistake then this code
        // if someone tried to mod or hack this app then this condition will help
        // if the aadhaar number is larger then 12 digits then error
        if (
            actualAadhaarNumber.length < 12 ||
            actualAadhaarNumber.length > 12
        ) {
            setError('Please enter a valid 12 digit aadhaar number.');
            return;
        }

        // the aadhaar number is not numeric
        if (!actualAadhaarNumber.match(/\d/g)) {
            setError('Aadhaar number should be numeric only.');
            return;
        }

        // the adhaar number in not valid
        // we are also accepting spaces here in the regex so we must use the formated aadhaar number
        var regexp = /^[2-9]{1}[0-9]{3}\s{1}[0-9]{4}\s{1}[0-9]{4}$/;
        if (!regexp.test(formatedAadhaar)) {
            setError('Invalid Aadhaar Number');
            return;
        }

        setError('');
    }

    function loadData(history: HistoryType) {
        setName(history.name);
        setAadhaar(history.aadhaar);
        setAadhaarDisplay(formatAadhaar(history.aadhaar));
        setError('');
        setState(history.state);
        setDistrict(history.district);
        setLine1(history.line1);
        setLine2(history.line2 || '');
        setPhone(history.phone || '');
        setPin(history.pin || '');
    }

    function addNewHistory() {
        if (aadhaar.length !== 12) {
            ToastAndroid.show(
                'Please enter a valid Aadhaar number',
                ToastAndroid.SHORT,
            );
            return;
        } else if (name.length <= 5) {
            ToastAndroid.show(
                'Please enter a valid name from the aadhaar card.',
                ToastAndroid.SHORT,
            );
            return;
        } else if (state.length <= 0) {
            ToastAndroid.show(
                'Please choose a valid State',
                ToastAndroid.SHORT,
            );
            return;
        } else if (district.length <= 0) {
            ToastAndroid.show(
                'Please choose a valid District',
                ToastAndroid.SHORT,
            );
            return;
        } else if (line1.length <= 5) {
            ToastAndroid.show(
                'Please enter a valid Local Address (line 1)',
                ToastAndroid.SHORT,
            );
            return;
        } else if (pin.length !== 6) {
            ToastAndroid.show(
                'Please enter a valid PIN Code',
                ToastAndroid.SHORT,
            );
            return;
        } else if (
            phone.length > 0 &&
            !phone.match(
                /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/,
            )
        ) {
            // console.log(
            //     !phone.match(
            //         /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/,
            //     ),
            // );
            ToastAndroid.show(
                'Please enter a valid Phone number',
                ToastAndroid.SHORT,
            );
            return;
        } else if (
            phone.length > 0 &&
            (phone.length < 10 || phone.length > 10)
        ) {
            ToastAndroid.show(
                'Please enter a valid Phone number of 10 digits',
                ToastAndroid.SHORT,
            );
            return;
        }

        const currentValues = history;
        currentValues.push({
            name: capitalizeWords(name),
            aadhaar: capitalizeWords(aadhaar),
            phone: phone,
            pin: pin,
            state: capitalizeWords(state),
            district: capitalizeWords(district),
            line1: capitalizeWords(line1),
            line2: capitalizeWords(line2),
            address: capitalizeWords(
                finalFormattedAddress(pin, state, district, line1, line2),
            ),
            timestamp: dayjs().toString(),
        });

        const stringifiedHistory = JSON.stringify(currentValues);
        AsyncStorage.setItem(HISTORY_STORAGE_POINTER, stringifiedHistory)
            .then(_res => {
                loadHistory();
            })
            .catch(_err => {
                loadHistory();
            });
    }

    function loadHistory() {
        AsyncStorage.getItem(HISTORY_STORAGE_POINTER).then(
            (res: string | null) => {
                if (res && res?.length) {
                    const parsedString: HistoryType[] = JSON.parse(res || '[]');
                    setHistory(parsedString);
                } else {
                    AsyncStorage.setItem(HISTORY_STORAGE_POINTER, '[]');
                }
            },
        );
    }

    function deleteAllHistory() {
        function deleteConfirm() {
            AsyncStorage.setItem(HISTORY_STORAGE_POINTER, '[]')
                .then(_res => {
                    ToastAndroid.show(
                        'Deleted History list successfully.',
                        ToastAndroid.SHORT,
                    );
                    loadHistory();
                })
                .catch(_err => {
                    ToastAndroid.show(
                        'Error while deleting history list.',
                        ToastAndroid.SHORT,
                    );
                    loadHistory();
                });
        }

        Alert.alert(
            'Delete History!',
            'Are you sure you want to delete the full history list. This action will delete the whole history permanently.',
            [
                {
                    style: 'cancel',
                    text: 'Cancel',
                },
                {
                    style: 'default',
                    text: 'DELETE',
                    onPress: deleteConfirm,
                },
            ],
        );
    }

    function finalFormattedAddress(
        pin: string,
        state: string,
        district: string,
        line1: string,
        line2?: string,
    ) {
        return `${line1 ? `${line1}, ` : ''} ${line2 ? `${line2}, ` : ''} ${
            district ? `${district}, ` : ''
        } ${state ? `${state}, ` : ''} ${pin}`;
    }

    useEffect(() => {
        loadHistory();
    }, []);

    const CommonTextInputStyle = {
        marginVertical: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        borderRadius: 6,
        borderColor: COLORS.themecolorrevert + '45',
        borderWidth: 0.5,
        color: COLORS.themecolorrevert + 'DF',
    };
    const CommonTextInputProps = {
        style: CommonTextInputStyle,
        placeholderTextColor: COLORS.themecolorrevert + '7F',
        selectionColor: COLORS.grey,
    };

    const parsedAddress = finalFormattedAddress(
        pin,
        state,
        district,
        line1,
        line2,
    );

    return (
        <SafeAreaView
            style={{
                flex: 1,
            }}>
            <View
                style={{
                    backgroundColor: COLORS.themecolor,
                }}>
                <StatusBar
                    translucent={false}
                    backgroundColor={COLORS.themecolor}
                    barStyle="light-content"
                />
                <MainHeader />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        backgroundColor: COLORS.themecolor,
                    }}>
                    <Header
                        title={'Aadhaar Address Updater'}
                        onPressClearInputsButton={() => clearInputs()}
                    />

                    <View
                        style={{
                            marginHorizontal: 20,
                        }}>
                        <Title title="Name in Aadhaar Card" />
                        <TextInput
                            focusable
                            placeholder={'Enter The Name in Aadhaar Card'}
                            value={name}
                            onChangeText={setName}
                            {...CommonTextInputProps}
                        />

                        {/* <KeyboardAvoidingView behavior="padding" style={{flex: 1}}> */}
                        <Title title="Aadhaar Number (12 digits)" />
                        <TextInput
                            focusable
                            placeholder={'Enter Your Aadhaar Number'}
                            value={aadhaarDisplay}
                            onChangeText={isValidAadhaar}
                            maxLength={14} // with spaces
                            // aadhaar number is of 12 digit and we are giving 1 spaces between every 4 digits so total length would be
                            // 12 + 1 + 1 = 14
                            {...CommonTextInputProps}
                        />
                        {aadhaar.length > 0 ? (
                            <Title title={error} errorText />
                        ) : null}

                        <Title title="Mobile Number (10 digits)" />
                        <TextInput
                            focusable
                            placeholder={'Enter Your 10 Digits Phone Number'}
                            value={phone}
                            onChangeText={setPhone}
                            maxLength={10}
                            keyboardType="numeric"
                            {...CommonTextInputProps}
                        />

                        <Title title="PIN Code (6 digits)" />
                        <TextInput
                            focusable
                            placeholder={'Enter Your PIN Code'}
                            value={pin}
                            onChangeText={setPin}
                            maxLength={6}
                            keyboardType="numeric"
                            {...CommonTextInputProps}
                        />

                        <Title title="Enter State Name" />
                        <View
                            style={{
                                marginVertical: 5,
                                borderRadius: 6,
                                borderWidth: 0.5,
                                borderColor: COLORS.themecolorrevert + '45',
                            }}>
                            <Picker
                                mode="dropdown"
                                itemStyle={{
                                    backgroundColor: COLORS.themecolor + 'EF',
                                    color: COLORS.themecolorrevert,
                                }}
                                dropdownIconColor={COLORS.themecolor}
                                dropdownIconRippleColor={COLORS.themecolor}
                                selectedValue={state}
                                onValueChange={item => setState(item)}
                                style={{
                                    fontSize: 16,
                                    borderRadius: 6,
                                    borderColor: COLORS.themecolorrevert + '45',
                                    color: COLORS.themecolorrevert + 'DF',
                                    backgroundColor: COLORS.themecolor + 'EF',
                                    marginVertical: 0,
                                    paddingVertical: 0,
                                }}>
                                {ACTUAL_STATES_ARRAY.map((state, index) => {
                                    return (
                                        <Picker.Item
                                            color={COLORS.themecolorrevert}
                                            style={{
                                                color: COLORS.themecolorrevert,
                                                backgroundColor:
                                                    COLORS.themecolor + 'EF',
                                            }}
                                            key={index}
                                            label={state}
                                            value={state}
                                        />
                                    );
                                })}
                            </Picker>
                        </View>

                        <Title title="Enter District Name" />
                        <View
                            style={{
                                marginVertical: 5,
                                borderRadius: 6,
                                borderWidth: 0.5,
                                borderColor: COLORS.themecolorrevert + '45',
                            }}>
                            <Picker
                                mode="dropdown"
                                itemStyle={{
                                    backgroundColor: COLORS.themecolor + 'EF',
                                    color: COLORS.themecolorrevert,
                                }}
                                dropdownIconColor={COLORS.themecolor}
                                dropdownIconRippleColor={COLORS.themecolor}
                                selectedValue={district}
                                onValueChange={item => setDistrict(item)}
                                style={{
                                    fontSize: 16,
                                    borderRadius: 6,
                                    borderColor: COLORS.themecolorrevert + '45',
                                    color: COLORS.themecolorrevert + 'DF',
                                    backgroundColor: COLORS.themecolor + 'EF',
                                    marginVertical: 0,
                                    paddingVertical: 0,
                                }}>
                                {EVERY_DISTRICT_ARRAY[state].map(
                                    (district, index) => {
                                        return (
                                            <Picker.Item
                                                color={COLORS.themecolorrevert}
                                                style={{
                                                    color: COLORS.themecolorrevert,
                                                    backgroundColor:
                                                        COLORS.themecolor +
                                                        'EF',
                                                }}
                                                key={index}
                                                label={district}
                                                value={district}
                                            />
                                        );
                                    },
                                )}
                            </Picker>
                        </View>

                        <Title title="Address Line 1" />
                        <TextInput
                            focusable
                            placeholder={'Enter Your Address Line 1'}
                            value={line1}
                            onChangeText={setLine1}
                            {...CommonTextInputProps}
                        />

                        <Title title="Address Line 2" />
                        <TextInput
                            focusable
                            placeholder={'Enter Your Address Line 2 (optional)'}
                            value={line2}
                            onChangeText={setLine2}
                            {...CommonTextInputProps}
                        />

                        <Title title="Parsed Final Address" bold />
                        <Text
                            onLongPress={() => {
                                Clipboard.setString(parsedAddress);
                                ToastAndroid.showWithGravity(
                                    'Address Copied',
                                    ToastAndroid.SHORT,
                                    ToastAndroid.CENTER,
                                );
                            }}
                            style={{
                                fontSize: 16,
                                textAlign: 'left',
                            }}>
                            {parsedAddress}
                        </Text>

                        <Text
                            style={{
                                marginVertical: 10,
                                fontSize: 14,
                            }}>
                            Long Press the address to copy to clipboard.
                        </Text>

                        <Button
                            title={'Save This Data'}
                            onPress={() => addNewHistory()}
                        />

                        {/* history area */}
                        {history.length > 0 ? (
                            <View>
                                <Title title="History" bold />
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-evenly',
                                    }}>
                                    <Button
                                        style={{
                                            maxWidth: 130,
                                            flexGrow: 1,
                                        }}
                                        title="Reload"
                                        onPress={() => loadHistory()}
                                    />
                                    <Button
                                        style={{
                                            maxWidth: 130,
                                            flexGrow: 1,
                                        }}
                                        title="Delete"
                                        onPress={() => deleteAllHistory()}
                                    />
                                </View>

                                {history.map((item, index) => {
                                    return (
                                        <HistoryBlock
                                            key={index}
                                            history={item}
                                            loadData={loadData}
                                            index={index}
                                        />
                                    );
                                })}
                            </View>
                        ) : null}

                        <View
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                            }}>
                            <Image
                                source={require('../assets/aadhaar.png')}
                                style={{
                                    resizeMode: 'cover',
                                    width: 100,
                                    height: 100,
                                    flex: 1,
                                }}
                                resizeMode="cover"
                            />
                        </View>

                        <MadeInText />

                        <View style={{paddingBottom: 200}} />
                        {/* </KeyboardAvoidingView> */}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const HistoryBlock = (props: {
    history: HistoryType;
    index: number;
    loadData: Function;
}) => {
    const {history, index, loadData} = props;

    const [showDetail, setShowDetail] = useState(false);

    const timestamp = dayjs(history.timestamp).format('DD-MMM-YYYY HH:mm:ss');

    return (
        <TouchableOpacity
            style={{
                paddingVertical: 6,
                paddingHorizontal: 10,
                backgroundColor: COLORS.surface + '7F',
                marginVertical: 4,
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',

                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                borderRadius: 5,
            }}
            disabled
            onPress={() => setShowDetail(value => !value)}>
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            paddingLeft: 5,
                            paddingRight: 10,
                            fontWeight: 'bold',
                            color: COLORS.themecolorrevert,
                        }}
                        onPress={() => setShowDetail(value => !value)}>
                        {index + 1}.
                    </Text>
                    <View>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                color: COLORS.themecolorrevert,
                            }}
                            numberOfLines={1}
                            onPress={() => setShowDetail(value => !value)}>
                            {history.name || `+91 ${history.phone}`}
                        </Text>

                        <Text
                            numberOfLines={1}
                            style={{
                                fontWeight: showDetail ? 'bold' : '400',
                                color: COLORS.themecolorrevert + '9A',
                            }}
                            onPress={() => setShowDetail(value => !value)}>
                            {history.aadhaar}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        minWidth: 40,
                        marginRight: 7,
                    }}>
                    <FontAwesome
                        name="copy"
                        size={16}
                        color={COLORS.themecolorrevert}
                        onPress={() => {
                            Clipboard.setString(history.address);
                            ToastAndroid.showWithGravity(
                                'Address Copied',
                                ToastAndroid.SHORT,
                                ToastAndroid.CENTER,
                            );
                        }}
                    />

                    <FontAwesome
                        onPress={() => setShowDetail(value => !value)}
                        name={showDetail ? 'angle-up' : 'angle-down'}
                        size={22}
                        color={COLORS.themecolorrevert}
                    />
                </View>
            </View>

            {showDetail ? (
                <View
                    style={{
                        paddingVertical: 10,
                    }}>
                    <Text
                        style={{
                            color: COLORS.themecolorrevert + '9A',
                        }}>
                        Saved On: {timestamp}
                    </Text>

                    {history.phone ? (
                        <Title title={'Phone Number: +91 ' + history.phone} />
                    ) : null}

                    <Title title={'State: ' + history.state} />
                    <Title title={'District: ' + history.district} />
                    <Title title={'Address Line 1: ' + history.line1} />

                    {history.line2 ? (
                        <Title title={'Address Line 2: ' + history.line2} />
                    ) : null}

                    <Text
                        onPress={() => {
                            Clipboard.setString(history.address);
                            ToastAndroid.showWithGravity(
                                'Address Copied',
                                ToastAndroid.SHORT,
                                ToastAndroid.CENTER,
                            );
                        }}>
                        {history.address}{' '}
                        <FontAwesome
                            name="copy"
                            size={16}
                            color={COLORS.themecolorrevert}
                        />
                    </Text>

                    <View
                        style={{
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Button
                            title="Load This Data"
                            onPress={() => loadData(history)}
                        />
                    </View>
                </View>
            ) : null}
        </TouchableOpacity>
    );
};

/**
 * this section was somewhat looking meesy in the above main component so I made
 * it as separate component
 * @returns the made in detail of the application
 */
const MadeInText = () => {
    return (
        <>
            <Text
                style={{
                    letterSpacing: 1,
                    color: COLORS.themecolorrevert + 'DF',
                    textAlignVertical: 'center',
                    textAlign: 'center',
                }}>
                {'Made with '}
                <MaterialCommunityIcons
                    name="heart"
                    size={18 - 2}
                    color={COLORS.error + 'DF'}
                />
                {' by '}
            </Text>
            <Text
                style={[
                    {
                        color: '#81E4DA',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    },
                ]}>
                {'Darshan Patil\nVaishnavi Deulkar\nKhushi Mishra\nG. Sakarkar'}
            </Text>
        </>
    );
};

export default App;
