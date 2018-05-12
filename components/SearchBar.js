import React from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';

export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);
    }

    onStartSearch = () => {
        // remove focus to hide keyboard when button pressed
        if (this.refs.searchInput.isFocused())
            this.refs.searchInput.blur();
        this.props.onSearch();
    }

    render() {
        let { plate, onChange, onSearch } = this.props;
        return (
            <View style={styles.topbar}>
                <Text style={styles.label}>Placa:</Text>
                <TextInput
                    ref="searchInput"
                    caretHidden
                    selectTextOnFocus
                    autoCapitalize='characters'
                    selectionColor={'transparent'}
                    returnKeyType='search'
                    underlineColorAndroid='transparent'
                    style={styles.input}
                    placeholder='ABC1234'
                    placeholderTextColor='silver'
                    maxLength={8}
                    value={plate.toUpperCase()}
                    onChangeText={onChange}
                    onSubmitEditing={this.onStartSearch.bind(this)}
                    onFocus={() => { this.refs.searchInput.clear(); onChange(''); }}
                />
                <Button
                    color='#ed6f00'
                    title="Buscar"
                    onPress={this.onStartSearch.bind(this)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    topbar: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#1E88E5',
        elevation: 8,
    },
    input: {
        fontSize: 22,
        minWidth: '25%',
        fontWeight: 'bold',
        color: 'white',
    },
    label: {
        fontSize: 18,
        //fontWeight: 'bold', 
        color: 'white',
        //textShadowColor: 'steelblue',
        //textShadowOffset: { width: -1, height: 1 },
        //textShadowRadius: 2,
    },
});