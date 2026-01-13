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
    public ModelEntidadData EntidadModel { get; set; }
    public List<ContratosConsolidado> Consolidados { get; set; }
        public EntidadContract(TransparenciaDB connection)
    {
      EntidadModel = new ModelEntidadData();
      _connection = connection;
    }

    public void Fill(string nombreEntidad, string codEntidad)
    {
      try {

        HomeBLL objNegocioConsolidados = new HomeBLL(_connection);
        //EntidadModel = objNegocioConsolidados.ObtenerDatosEntidad(codEntidad,nombreEntidad, DateTime.Now.Year+1);
        //Consolidados = objNegocioConsolidados.ObtenerOrigenContratos(null, "ONCAE", codEntidad);
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

        HomeBLL objNegocioConsolidados = new HomeBLL(_connection);
                //return objNegocioConsolidados.ObtenerNombreEntidad(codEntidad
                return null;
      }
      catch (Exception) {
        return string.Empty;
      }
    }
        public DatosEntidadAnio GetDatosEntidadPorAnnio(string anioEntidad, string codEntidad)
        {
            int.TryParse(anioEntidad, out int anio);
            HomeBLL objNegocioConsolidados = new HomeBLL(_connection);
            //return objNegocioConsolidados.GetDatosEntidadPorAnnio(anio, codEntidad);
            return null;
        }


        public List<InformationSource> ObtFuenteDatos()
        {
            try {
                List<InformationSource> objReturn = new List<InformationSource>();
                HomeBLL objNegocioConsolidados = new HomeBLL(_connection);
                //return objNegocioConsolidados.ObtFuenteDatos();
                return objReturn;
            }
            catch (Exception)
            {
                return null;
            }
 
            
        }


    }
}
