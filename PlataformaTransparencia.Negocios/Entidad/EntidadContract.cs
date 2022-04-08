using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Negocios.Home;

namespace PlataformaTransparencia.Negocios.Entidad
{
  public class EntidadContract : RespuestaContratoBase
  {
    private readonly TransparenciaDB _connection;
    public ModelEntidadData EntidadModel { get; set; }
  
    public EntidadContract(TransparenciaDB connection)
    {
      EntidadModel = new ModelEntidadData();
      _connection = connection;
    }

    public void Fill(string nombreEntidad, string codEntidad)
    {
      try {

        ConsolidadosNacionalesBLL objNegocioConsolidados = new ConsolidadosNacionalesBLL(_connection);
        EntidadModel = objNegocioConsolidados.ObtenerDatosEntidad(codEntidad,nombreEntidad, DateTime.Now.Year+1);
        Status = true;

      }
      catch (Exception) {
        Status = false;
        Message = "Lo sentimos, ha ocurrido un error.";
      }
    }
    public string ObtenerNombreEntidad(string codEntidad)
    {
      try {

        ConsolidadosNacionalesBLL objNegocioConsolidados = new ConsolidadosNacionalesBLL(_connection);
        return objNegocioConsolidados.ObtenerNombreEntidad(codEntidad);
      }
      catch (Exception) {
        return string.Empty;
      }
    }

    public ModelGraficaSankey GetGraficaSankey(string codEntidad)
    {
      ConsolidadosNacionalesBLL objNegocioConsolidados = new ConsolidadosNacionalesBLL(_connection);
      return objNegocioConsolidados.GetGraficaSankey(codEntidad);
    }

    public ConsolidadoProgramasEntidad GetConsolidadoProgramasXCodEntidadAnio(string anioEntidad, string codEntidad)
    {
      int.TryParse(anioEntidad, out int anio);
      ConsolidadosNacionalesBLL objNegocioConsolidados = new ConsolidadosNacionalesBLL(_connection);
      return objNegocioConsolidados.GetConsolidadoProgramasXCodEntidadAnio(anio,codEntidad);
    }


  }
}
