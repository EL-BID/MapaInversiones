using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Plan;

namespace PlataformaTransparencia.Negocios.Home
{
    public interface IConsolidadosNacionalesBLL
    {
        public ModelHomeData ObtenerDatosModeloInicio(bool esHome = true);
        public List<InfoRecAsignadosPlan> GetRecursosAsigByObjEstrategico(int id);

        public List<InformationGraphics> GetRecursosAsigPerSectoresByObjEstrateg(int id);

        public List<InfoEntidadesConsolida> GetConsolidadoEntidades();

        public List<InfoEntidadesConsolida> GetConsolidadoEntidadesByObjEspecifico(int id_eje, int id);

        public List<InfoRecAsignadosPlan> ObtenerRecursosPerPlanGroup();

        public List<HierarchyModel> GetSearchHierarchyModel();
    List<ModelAvanceIndicador> GetHistoricoAvanceIndicador(int indicadorId);
  }
}
