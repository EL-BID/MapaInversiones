using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.Home;

namespace PlataformaTransparencia.Negocios.BLL.Contracts
{
    public class HomeContract : RespuestaContratoBase
    {
        private readonly TransparenciaDB _connection;
        public ModelHomeData HomeModel { get; set; }

        public HomeContract(TransparenciaDB connection)
        {
            this.HomeModel = new ModelHomeData();
            _connection = connection;
        }

        public void Fill(bool esHome = true)
        {
            try {

                HomeBLL objNegocioConsolidados = new HomeBLL(_connection);
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
