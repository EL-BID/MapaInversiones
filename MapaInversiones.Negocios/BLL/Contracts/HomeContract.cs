using Microsoft.Extensions.Configuration;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.Home;
using System;
using System.Collections.Generic;
using System.Text;


namespace PlataformaTransparencia.Negocios.BLL.Contracts
{
    public class HomeContract : RespuestaContratoBase
    {
        private readonly TransparenciaDB _connection;
        private readonly IConfiguration _configuration; 

        public ModelHomeData HomeModel { get; set; }

        public HomeContract(TransparenciaDB connection,IConfiguration configuration)
        {
            this.HomeModel = new ModelHomeData();
            _connection = connection;
            _configuration = configuration;

        }

        public void Fill(bool esHome = true)
        {
            try {

                HomeBLL objNegocioConsolidados = new HomeBLL(_connection,_configuration);
                this.HomeModel = objNegocioConsolidados.ObtenerDatosModeloInicio(esHome);
                this.Status = true;

            }
            catch (Exception ex) {
                this.Status = false;
                this.Message = "Lo sentimos, ha ocurrido un error.";
            }
        }

    }
}
