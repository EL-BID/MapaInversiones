using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Presupuesto
{
    public class InfograficoOrganismo
    {
        public string Id{ get; set; ***REMOVED***
        public string Nombre { get; set; ***REMOVED***
        public decimal presupuesto { get; set; ***REMOVED***
        public decimal avance { get; set; ***REMOVED***
        public List<InfoGraficoItemPrograma> Detalles { get; set; ***REMOVED***

        public InfograficoOrganismo(string id, string nombre)
        {
            Id = id;
            Nombre = nombre;
            Detalles = new List<InfoGraficoItemPrograma>();
            presupuesto = 0;
            avance = 0;

    ***REMOVED***
***REMOVED***
***REMOVED***
