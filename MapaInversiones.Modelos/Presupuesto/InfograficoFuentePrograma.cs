using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Presupuesto
{
    public class InfograficoFuentePrograma
    {
        public string Id { get; set; ***REMOVED***
        public string Nombre { get; set; ***REMOVED***
        public decimal presupuesto { get; set; ***REMOVED***
        public decimal avance { get; set; ***REMOVED***
        public decimal total_presupuesto { get; set; ***REMOVED***
        public decimal total_avance { get; set; ***REMOVED***
        public List<InfograficoOrganismo> Detalles { get; set; ***REMOVED***

        public InfograficoFuentePrograma(string id, string nombre)
        {
            Id = id;
            Nombre = nombre;
            Detalles = new List<InfograficoOrganismo>();
            presupuesto = 0;
            avance = 0;
    ***REMOVED***

***REMOVED***
***REMOVED***
