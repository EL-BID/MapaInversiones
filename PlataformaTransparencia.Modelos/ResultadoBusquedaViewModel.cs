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
    ***REMOVED***
        public List<ResultadoBusquedaItem> ListaResultados { get; set; ***REMOVED***

        public string CadenaBusqueda { get; set; ***REMOVED***
        public string Type { get; set; ***REMOVED***

        public int TotalResultados { get; set; ***REMOVED***

        public List<HierarchyModel> ListaJerarquia { get; set; ***REMOVED***

***REMOVED***

    public class HierarchyModel
    {

        public HierarchyModel()
        {
            ListaTipos = new List<TypeModel>();
    ***REMOVED***
        public string Hierarchy { get; set; ***REMOVED***

        public List<TypeModel> ListaTipos { get; set; ***REMOVED***

        public int TotalResultados { get; set; ***REMOVED***


***REMOVED***

    public class TypeModel
    {
        public string Type { get; set; ***REMOVED***

        public int TotalResultados { get; set; ***REMOVED***

***REMOVED***
***REMOVED***
