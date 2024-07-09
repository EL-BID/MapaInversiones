using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Emergencia;
using PlataformaTransparencia.Modelos.Presupuesto;
using System;
using System.Collections.Generic;

namespace PlataformaTransparencia.Negocios.Interfaces
{
  public interface IPresupuestoEmergenciaBLL
  {
    public ModelContratistaData ObtenerDatosContratos(string entidad = null);
    public ModelContratistaData ObtenerDatosContratosPorTipoEmergencia(int tipoEmergencia);
    public ModelHomeGestionData ObtenerDatosModeloInicio(bool esHome = true);
    public ModelHomeGestionData ObtenerDatosModeloInicio(int tipoEmergencia);
    public ModelPresupuestoEmergenciaData ObtenerDatosModeloInicioPorTipoEmergencia(int tipoEmergencia);
    public ModelPresupuestoGeneralEmergenciaData ObtenerDatosPresupuestoGeneralEmergencias();
    public List<InfoGraficoItemPrograma> ObtenerInfoGraficoGastoPorTipoEmergencia(int tipoEmergencia);
    public List<InfoGraficoItemPrograma> ObtenerPresupuestoGeneralAsignadoPorEntidad();
    public List<InfoPresupuestoEjecutadoPorEmergencia> ObtenerPresupuestoGeneralEjecutadoPorEmergencias();
    public List<InfoRecursosEmergenciaPerObjeto> ObtenerRecursosPerContratosGroup();
    public List<InfoRecursosEmergenciaPerObjeto> ObtenerRecursosPerContratosPorTipoEmergencia(int tipoEmergencia);
    public List<InfoRecursosEmergenciaPerObjeto> ObtenerRecursosPerProcesosGroup();
    public List<InfoRecursosEmergenciaPerObjeto> ObtenerRecursosPerProcesosPorTipoEmergencia(int tipoEmergencia);
    public List<InfoRecursosEmergenciaPerObjeto> ObtenerRecursosPorOrganismoFinanciadorPorTipoEmergencia(int tipoEmergencia);

    public List<InfograficoFuentePrograma> ObtDistribucionPresupuestalPorTipoEmergencia(int? tipoEmergencia);

  }
}
