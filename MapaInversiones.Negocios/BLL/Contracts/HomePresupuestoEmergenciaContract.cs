using Microsoft.Extensions.Configuration;
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
        private IConfiguration _configuration;
        /// <summary>
        /// 
        /// </summary>
        public ModelPresupuestoEmergenciaData HomePresupuestoEmergenciaModel { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public HomePresupuestoEmergenciaContract(TransparenciaDB connection, IConfiguration configuration)
        {
            _connection = connection;
            _configuration = configuration;
            HomePresupuestoEmergenciaModel = new ModelPresupuestoEmergenciaData();
        }

        public void Fill(int idTipoEmergencia)
        {
            try
            {
                PresupuestoEmergenciaBLL objNegocioConsolidados = new(_connection, _configuration);
                HomePresupuestoEmergenciaModel = objNegocioConsolidados.ObtenerDatosModeloInicioPorTipoEmergencia(idTipoEmergencia);
                Status = true;
            }
            catch (Exception ex)
            {
                Status = false;
                LogHelper.GenerateLog(ex);
                Message = "Lo sentimos, ha ocurrido un error.";
            }
        }
    }
}
