function formatDate(fechaLocalCliente = new Date()) {

  var año = fechaLocalCliente.getFullYear();
  var mes = ('0' + (fechaLocalCliente.getMonth() + 1)).slice(-2); // Se agrega 1 porque los meses son indexados desde 0
  var dia = ('0' + fechaLocalCliente.getDate()).slice(-2);
  var horas = ('0' + fechaLocalCliente.getHours()).slice(-2);
  var minutos = ('0' + fechaLocalCliente.getMinutes()).slice(-2);
  var segundos = ('0' + fechaLocalCliente.getSeconds()).slice(-2);

  var fechaFormateada = año + '-' + mes + '-' + dia + ' ' + horas + ':' + minutos + ':' + segundos;

  console.log("FECHA DE ACTUALIZACION:", fechaLocalCliente);
  console.log('FECHA FORMATEADA:', fechaFormateada);
  return fechaFormateada;
}

module.exports = formatDate;