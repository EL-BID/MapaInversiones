using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class MetricperYear
    {
        public MetricperYear()
        {
            metrics = new List<Metric>();
        }
        public int year { get; set; }
        public List<Metric> metrics { get; set; }
    }
    public class Metric
    {
        public string name { get; set; }
        public double goal { get; set; }
        public double? current { get; set; }
        public decimal PorcentajeEjecutado { get; set; }
        public string UnidadDeMedida { get; set; }
        /// <summary>
        /// Objetivo
        /// </summary>
        public string goalDescription { get; set; }
        public string product { get; set; }
        public string activities { get; set; }

    }

}
