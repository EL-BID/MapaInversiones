using System;
using Microsoft.Extensions.Configuration;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.Home;

namespace PlataformaTransparencia.Negocios.BLL.Contracts
{
    public class HomeContract : RespuestaContratoBase
    {
        private readonly TransparenciaDB _connection;
        private IConfiguration _configuration;
        public ModelHomeData HomeModel { get; set; }

        public HomeContract(IConfiguration configuration,TransparenciaDB connection)
        {
            HomeModel = new ModelHomeData();
            _connection = connection;
            _configuration = configuration;
        }

        public void Fill(bool esHome = true)
        {
            try {

                HomeBLL objNegocioConsolidados = new HomeBLL(_connection, _configuration);
                HomeModel = objNegocioConsolidados.ObtenerDatosModeloInicio(esHome);
                Status = true;

            }
            catch (Exception) {
                Status = false;
                Message = "Lo sentimos, ha ocurrido un error en el home.";
            }
        }

    }
}
