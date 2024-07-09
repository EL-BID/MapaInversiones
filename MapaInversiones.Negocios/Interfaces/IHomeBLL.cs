using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Home;
using PlataformaTransparencia.Modelos.Plan;

namespace PlataformaTransparencia.Negocios.Home
{
    public interface IHomeBLL
    {
        public ModelHomeData ObtenerDatosModeloInicio(bool esHome = true);

        public List<HierarchyModel> GetSearchHierarchyModel();

        public List<InfoProjectPerSector> ObtenerProyectoPorSectorGroupHome(int anyo);

        public List<InfoOrganismosFinan> ObtenerOrganismosPorFuenteHome(string Annio, int IdFuente);

    }
}
