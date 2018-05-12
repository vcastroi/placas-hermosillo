import React from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default class Grid extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { titles, values, widths } = this.props;
        return (
            <View style={styles.grid}>
                <View style={styles.columnTitles}>
                    {titles.map(
                        (colName, index) => (<Text style={[styles.label, { width: widths[index] }]} key={index}>{colName}</Text>)
                    )}
                </View>
                <View style={styles.rows}>
                    {values.map(
                        (row, index) =>
                            <View style={styles.columnValues} key={index}>
                                {row.map(
                                    (col, index2) =>
                                        <Text style={[styles.textValue, { width: widths[index2] }]} key={index2}>{col}</Text>
                                )}
                            </View>

                    )}

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'column',
        marginTop: 15,
        marginBottom: 15,
        elevation: 4,
        backgroundColor: 'white',

        borderColor: 'dodgerblue',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
    },
    columnTitles: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'dodgerblue',
    },
    rows: {
        flexDirection: 'column',
    },
    columnValues: {
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        backgroundColor: 'white',
    },
    label: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FFE0B2',
        //textShadowColor: 'steelblue',
        //textShadowOffset: { width: -1, height: 1 },
        //textShadowRadius: 2,
    },
    textValue: {
        fontSize: 12,
        color: 'dodgerblue',
        fontWeight: 'bold',
        textAlign: 'justify',
        paddingLeft: 5,
    }
});