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

        public List<InfoParticipacionSector> ObtenerPorcentajeParticipacionSector(string Annio);

        public List<InfoParticipacionEntidad> ObtenerPorcentajeParticipacionEntidad(string Annio);

    }
}
