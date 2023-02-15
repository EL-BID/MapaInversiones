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

        public List<InfoEntidadesConsolida> GetConsolidadoEntidades();


        public List<HierarchyModel> GetSearchHierarchyModel();


        public List<InformationSource> ObtFuenteDatos();


  ***REMOVED***
***REMOVED***
