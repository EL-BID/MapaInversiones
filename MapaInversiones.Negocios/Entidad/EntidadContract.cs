using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Negocios.Home;

namespace PlataformaTransparencia.Negocios.Entidad
{
  public class EntidadContract : RespuestaContratoBase
  {
    private readonly TransparenciaDB _connection;
    public ModelEntidadData EntidadModel { get; set; ***REMOVED***
    public List<ContratosConsolidado> Consolidados { get; set; ***REMOVED***
        public EntidadContract(TransparenciaDB connection)
    {
      EntidadModel = new ModelEntidadData();
      _connection = connection;
***REMOVED***

    public void Fill(string nombreEntidad, string codEntidad)
    {
      try {

        ConsolidadosNacionalesBLL objNegocioConsolidados = new ConsolidadosNacionalesBLL(_connection);
        EntidadModel = objNegocioConsolidados.ObtenerDatosEntidad(codEntidad,nombreEntidad, DateTime.Now.Year+1);
        Consolidados = objNegocioConsolidados.ObtenerOrigenContratos(null, "ONCAE", codEntidad);
        Status = true;

  ***REMOVED***
      catch (Exception) {
        Status = false;
        Message = "Lo sentimos, ha ocurrido un error.";
  ***REMOVED***
***REMOVED***
    public string ObtenerNombreEntidad(string codEntidad)
    {
      try {

        ConsolidadosNacionalesBLL objNegocioConsolidados = new ConsolidadosNacionalesBLL(_connection);
        return objNegocioConsolidados.ObtenerNombreEntidad(codEntidad);
  ***REMOVED***
      catch (Exception) {
        return string.Empty;
  ***REMOVED***
***REMOVED***
        public DatosEntidadAnio GetDatosEntidadPorAnnio(string anioEntidad, string codEntidad)
        {
            int.TryParse(anioEntidad, out int anio);
            ConsolidadosNacionalesBLL objNegocioConsolidados = new ConsolidadosNacionalesBLL(_connection);
            return objNegocioConsolidados.GetDatosEntidadPorAnnio(anio, codEntidad);
    ***REMOVED***


        public List<InformationSource> ObtFuenteDatos()
        {
            try {
                List<InformationSource> objReturn = new List<InformationSource>();
                ConsolidadosNacionalesBLL objNegocioConsolidados = new ConsolidadosNacionalesBLL(_connection);
                return objNegocioConsolidados.ObtFuenteDatos();
        ***REMOVED***
            catch (Exception)
            {
                return null;
        ***REMOVED***
 
            
    ***REMOVED***


***REMOVED***
***REMOVED***
