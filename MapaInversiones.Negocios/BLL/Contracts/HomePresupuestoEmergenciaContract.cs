using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.BLL.Comunes;
using PlataformaTransparencia.Negocios.Presupuesto;
using System;

namespace PlataformaTransparencia.Negocios.BLL.Contracts
{
  public class HomePresupuestoEmergenciaContract : RespuestaContratoBase
  {
    private readonly TransparenciaDB _connection;
    /// <summary>
    /// 
    /// </summary>
    public ModelPresupuestoEmergenciaData HomePresupuestoEmergenciaModel { get; set; ***REMOVED***

    /// <summary>
    /// 
    /// </summary>
    public HomePresupuestoEmergenciaContract(TransparenciaDB connection)
    {
      _connection = connection;
      HomePresupuestoEmergenciaModel = new ModelPresupuestoEmergenciaData();
***REMOVED***

    public void Fill(int idTipoEmergencia)
    {
      try
      {
        PresupuestoEmergenciaBLL objNegocioConsolidados = new(_connection);
        HomePresupuestoEmergenciaModel = objNegocioConsolidados.ObtenerDatosModeloInicioPorTipoEmergencia(idTipoEmergencia);
        Status = true;
  ***REMOVED***
      catch (Exception ex)
      {
        Status = false;
        LogHelper.GenerateLog(ex);
        Message = "Lo sentimos, ha ocurrido un error.";
  ***REMOVED***
***REMOVED***
  ***REMOVED***
***REMOVED***
