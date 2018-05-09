import React from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, WebView } from 'react-native';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { text: 'ABC1234', html: '', nombre: '', total: '', loading: false };
  }

  onTextChanged = (text) => {
    this.setState({ text, html: '', nombre: '', total: '' });
  }

  onSearch = () => {
    // remove focus to hide keyboard when button pressed
    if (this.refs.searchInput.isFocused())
      this.refs.searchInput.blur();

    // clear state and set loading
    this.setState({ html: '', nombre: '', total: '', loading: true });

    fetch('https://www.hermosillo.gob.mx:444/ServicioTemporal/Proyectos2008/Multas/DetalleMulta.aspx?pPlaca=' + this.state.text, {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }
    }).then(response => {
      response.text().then(text => {

        // get propietario using ugly regex
        const rgxNam = new RegExp("id=\"lblNombre\".*?=\"(.*?)\".*?/>");
        let name = '';
        if (rgxNam.test(text))
          name = rgxNam.exec(text)[1];

        // multiline regex to get the total
        const rgxTot = new RegExp("id=\"Totalpagar\"[\\S\\s]*?value=\"(.*?)\"", "m");
        let total = name ? '$0.00' : '';
        if (rgxTot.test(text))
          total = rgxTot.exec(text)[1];

        // remove span (& spam?) messages
        newtext = text.replace("<div id=\"DivMensajesNoExiste\">", "<div id=\"DivMensajesNoExiste\" style=\"display: none;\">")
          .replace("<div id=\"DivMensajesinConexion\">", "<div id=\"DivMensajesinConexion\" style=\"display: none;\">")
          .replace("<div id=\"DivPendienteProcesar\">", "<div id=\"DivPendienteProcesar\" style=\"display: none;\">")
          .replace("<div id=\"DivBloqueado\">", "<div id=\"DivBloqueado\" style=\"display: none;\">")
          .replace("<div id=\"DivConciliacion\">", "<div id=\"DivConciliacion\" style=\"display: none;\">")
          .replace("<div id=\"DivCiudadanoCumplido\">", "<div id=\"DivCiudadanoCumplido\" style=\"display: none;\">")
          .replace("<div id=\"divRecibos\">", "<div id=\"divRecibos\" style=\"display: none;\">")
          .replace("alt=\"/images/fondos/linea01.jpg\"", "")
          .replace("<div id=\"Div2\" width: \"650px\">", "<div id=\"Div2\" width: \"650px\" style=\"display: none;\">")
          .replace("<div id=\"DivPagar\">", "<div id=\"DivPagar\" style=\"display: none;\">");

        // update state, remove loading
        this.setState({ html: newtext, nombre: name, total: total, loading: false });
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
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
            value={this.state.text.toUpperCase()}
            onChangeText={this.onTextChanged}
            onSubmitEditing={this.onSearch.bind(this)}
            onFocus={() => this.refs.searchInput.clear()}
          ></TextInput>
          <Button title="Buscar" onPress={this.onSearch.bind(this)} />
        </View>
        <View style={styles.result}>

          {!!this.state.loading && <Text style={styles.resultText}>...buscando...</Text>}

          {!!this.state.nombre && <View>
            <Text style={styles.label}>Propietario: </Text>
            <Text style={styles.resultText}>{this.state.nombre}</Text>
          </View>
          }

          {!!this.state.total && <View>
            <Text style={styles.label}>Total a Pagar: </Text>
            <Text style={styles.resultText}>{this.state.total}</Text>
          </View>
          }

        </View>
        <WebView style={styles.webview} source={{ html: this.state.html }}
          injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.42, maximum-scale=1, user-scalable=1'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
          scalesPageToFit={false}
        ></WebView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    // IMPORTANT!! fixes statusBar height problem on Android Expo 
    //REMOVE IF EJECTING (causes apk to force close)
    paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight,
  },
  topbar: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'dodgerblue',
  },
  result: {
    flexDirection: 'column',
    backgroundColor: 'deepskyblue',
    padding: 10,
  },
  webview: {
  },
  input: {
    fontSize: 20,
    minWidth: '25%',
    fontWeight: 'bold',
    color: 'white',
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'gold',
    textShadowColor: 'steelblue',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },
  resultText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
