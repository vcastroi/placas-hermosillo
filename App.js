import React from 'react';
import { Platform, StyleSheet, View, ScrollView, Text, } from 'react-native';
import { SearchBar, Grid, LabelValue, Message } from './components';

export default class App extends React.Component {


  constructor(props) {
    super(props);
    this.cleanState = { datos: undefined, nombre: undefined, multas: [], total: undefined }
    this.state = { ...this.cleanState, placa: 'WEN8287', loading: false };
  }

  onTextChanged = (placa) => {
    this.setState({ ...this.cleanState, placa });
  }

  onSearch = () => {
    // clear state and set loading
    this.setState({ ...this.cleanState, loading: true });

    fetch('https://www.hermosillo.gob.mx:444/ServicioTemporal/Proyectos2008/Multas/DetalleMulta.aspx?pPlaca=' + this.state.placa, {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }
    }).then(response => {
      response.text().then(text => {
        const cheerio = require('cheerio-without-node-native')
        const $ = cheerio.load(text);

        let datos = $('#txtDatos').text().replace('PLACA: ', '').replace(this.state.placa + ', ', '');
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
        this.setState({ datos, nombre, multas, total, loading: false });
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
          {this.state.loading ? <Message value='...buscando...' /> :
            (!this.state.datos ? <Message value='- sin resultados -' /> :
              <View>
                <Message value={this.state.datos} />
                <LabelValue label='Propietario' value={this.state.nombre} />
                {
                  this.state.multas.length == 0 ?
                    <Message value='- sin multas -' /> :
                    <Grid titles={gridColumnNames} values={this.state.multas} widths={gridColumnWidths} />
                }
                {this.state.total && <LabelValue
                  label={'Total a Pagar (' + this.state.multas.length + ' multas)'}
                  value={this.state.total}
                  footnote='incluye donativos y descuentos'
                />}
              </View>
            )}
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
    backgroundColor: 'white',
    padding: 10,
  },
});
