using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class itemGenPresupuesto
    {
        public string id { get; set; ***REMOVED***
        public string nombre { get; set; ***REMOVED***
        public decimal? aprobado { get; set; ***REMOVED***
        public decimal? vigente { get; set; ***REMOVED***
        public decimal ejecutado { get; set; ***REMOVED***

        public decimal comprometido { get; set; ***REMOVED***

        public decimal porcentaje { get; set; ***REMOVED***

        public string url { get; set; ***REMOVED***

        public string recurso { get; set; ***REMOVED***

        public double? avance_fisico { get; set; ***REMOVED***

        public double? avance_financiero { get; set; ***REMOVED***
        public double? AvanceFinancieroOrganismo { get; set; ***REMOVED***

        public List<itemLineaPresupuestal> detalleLineas { get; set; ***REMOVED***

        public string estado { get; set; ***REMOVED*** = string.Empty;

        public itemGenPresupuesto()
        {
            id = "";
            nombre = "";
            aprobado = 0;
            vigente = 0;
            ejecutado = 0;
            porcentaje = 0;
            avance_fisico = 0;
            avance_financiero = 0;
            recurso = "";
            url = "";
            detalleLineas = new List<itemLineaPresupuestal>();
            estado=string.Empty;
    ***REMOVED***
***REMOVED***
***REMOVED***
