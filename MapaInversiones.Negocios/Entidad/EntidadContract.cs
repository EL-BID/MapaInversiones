using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;
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
        private IConfiguration _configuration;
        public ModelEntidadData EntidadModel { get; set; }
        public List<ContratosConsolidado> Consolidados { get; set; }
        public EntidadContract(IConfiguration configuration, TransparenciaDB connection)
        {
            EntidadModel = new ModelEntidadData();
            _connection = connection;
            _configuration = configuration;
        }

        public void Fill(string nombreEntidad, string codEntidad)
        {
            try
            {

                HomeBLL objNegocioConsolidados = new HomeBLL(_connection, _configuration);

                Status = true;

            }
            catch (Exception)
            {
                Status = false;
                Message = "Lo sentimos, ha ocurrido un error.";
            }
        }
        public string ObtenerNombreEntidad(string codEntidad)
        {
            try
            {

                HomeBLL objNegocioConsolidados = new HomeBLL(_connection, _configuration);
                return null;
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }
       


        public List<InformationSource> ObtFuenteDatos()
        {
            try
            {
                List<InformationSource> objReturn = new List<InformationSource>();
                HomeBLL objNegocioConsolidados = new HomeBLL(_connection, _configuration);
                return objReturn;
            }
            catch (Exception)
            {
                return null;
            }


        }


    }
}
