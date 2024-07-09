using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Presupuesto
{
    public class InfograficoFuentes_Nivel_1
    {
        public string Id { get; set; ***REMOVED***
        public string Nombre { get; set; ***REMOVED***
        public decimal presupuesto { get; set; ***REMOVED***
        public decimal avance { get; set; ***REMOVED***
        public decimal total_presupuesto { get; set; ***REMOVED***
        public decimal total_avance { get; set; ***REMOVED***
        public List<InfograficoFuentes_Nivel_2> Detalles { get; set; ***REMOVED***

        public InfograficoFuentes_Nivel_1(string id, string nombre)
        {
            Id = id;
            Nombre = nombre;
            Detalles = new List<InfograficoFuentes_Nivel_2>();
            presupuesto = 0;
            avance = 0;
    ***REMOVED***
***REMOVED***
***REMOVED***
