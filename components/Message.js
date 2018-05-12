import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';

export default class LabelValue extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { value } = this.props;
        return (
            <Text style={styles.messageText}>{value}</Text>
        )
    }
}

const styles = StyleSheet.create({
    messageText: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16,
        color: '#ed6f00',
        textAlign: 'center',
    }
});