import React from 'react';
import { Platform, StyleSheet, View, ScrollView, Text,  } from 'react-native';
import SearchBar from './components/SearchBar';
import LabelValue from './components/LabelValue';
import Grid from './components/Grid';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { placa: 'ABC1234', nombre: '', total: '', loading: false };
  }

  onTextChanged = (placa) => {
    this.setState({ placa, nombre: '', multas: undefined, total: '' });
  }

  onSearch = () => {
    // clear state and set loading
    this.setState({ nombre: '', multas: undefined, total: '', loading: true });

    fetch('https://www.hermosillo.gob.mx:444/ServicioTemporal/Proyectos2008/Multas/DetalleMulta.aspx?pPlaca=' + this.state.placa, {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }
    }).then(response => {
      response.text().then(text => {
        const cheerio = require('cheerio-without-node-native')
        const $ = cheerio.load(text);

        let nombre = $('#lblNombre').val();
        let total = $('#Totalpagar').val();
        let multas = [];

        $('tr', '#GridView1').nextAll().each(function (i, element) {
          row = $(element).children();
          if (row.length > 8) {
            let multa = []
            multa.push(row.eq(2).text());
            multa.push(row.eq(1).text());
            multa.push(row.eq(7).text().trim());
            multas.push(multa);
          }
        });

        // update state, remove loading
        this.setState({ nombre, multas, total, loading: false });
      })
    })
  }

  render() {

    let gridColumnNames = ['fecha', 'concepto', 'importe'];
    let gridColumnWidths = ['22%', '58%', '20%'];

    return (
      <View style={styles.container}>

        <SearchBar plate={this.state.placa.toUpperCase()} onChange={this.onTextChanged.bind(this)} onSearch={this.onSearch.bind(this)} />

        <ScrollView style={styles.result}>
          {this.state.loading ? <LabelValue value='...buscando...' /> :
            <View>
              {!!this.state.nombre && <LabelValue label='Propietario' value={this.state.nombre} />}

              {!!this.state.multas &&
                (
                  this.state.multas.length == 0 ?
                    <LabelValue value='-sin multas-' /> :
                    <Grid titles={gridColumnNames} values={this.state.multas} widths={gridColumnWidths} />
                )
              }

              {!!this.state.total && <LabelValue label={'Total a Pagar (' + this.state.multas.length + ' multas)'} value={this.state.total} footnote='incluye donativos y descuentos' />}

            </View>}
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'deepskyblue',
    justifyContent: 'flex-start',
    // IMPORTANT!! fixes statusBar height problem on Android Expo 
    //REMOVE IF EJECTING (causes apk to force close)
    paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight,
  },
  result: {
    flexDirection: 'column',
    backgroundColor: 'deepskyblue',
    padding: 10,
  },
  resultText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
