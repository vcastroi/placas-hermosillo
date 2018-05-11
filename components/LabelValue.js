import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';

export default class LabelValue extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { label, value } = this.props;
        return (
            <View>
                {!!label && <Text style={styles.label}>{label}: </Text>}
                {!!value && <Text style={styles.textValue}>{value}</Text>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    label: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'gold',
        textShadowColor: 'steelblue',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 2,
    },
    textValue: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    }
});