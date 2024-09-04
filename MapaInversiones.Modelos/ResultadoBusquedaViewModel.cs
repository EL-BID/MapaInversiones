using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class ResultadoBusquedaViewModel
    {
        public ResultadoBusquedaViewModel()
        {
            ListaResultados = new List<ResultadoBusquedaItem>();
            ListaJerarquia = new List<HierarchyModel>();
        }
        public List<ResultadoBusquedaItem> ListaResultados { get; set; }

        public string CadenaBusqueda { get; set; }
        public string Type { get; set; }

        public int TotalResultados { get; set; }

        public List<HierarchyModel> ListaJerarquia { get; set; }

    }

    public class HierarchyModel
    {

        public HierarchyModel()
        {
            ListaTipos = new List<TypeModel>();
        }
        public string Hierarchy { get; set; }

        public List<TypeModel> ListaTipos { get; set; }

        public int TotalResultados { get; set; }


    }

    public class TypeModel
    {
        public string Type { get; set; }

        public int TotalResultados { get; set; }

    }
}
