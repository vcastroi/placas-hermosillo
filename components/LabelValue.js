import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';

export default class LabelValue extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { label, value, footnote, style } = this.props;
        return (
            <View>
                {!!label && <Text style={styles.label}>{label}: </Text>}
                {!!value && <Text style={style ? style : styles.textValue}>{value}</Text>}
                {!!footnote && <Text style={styles.footnote}>{footnote}</Text>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    label: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        //textShadowColor: 'steelblue',
        //textShadowOffset: { width: -1, height: 1 },
        //textShadowRadius: 2,
    },
    textValue: {
        fontSize: 18,
        color: '#ed6f00',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    footnote: {
        fontSize: 12,
        color: '#ee9d00',
        textAlign: 'right',
    }
});