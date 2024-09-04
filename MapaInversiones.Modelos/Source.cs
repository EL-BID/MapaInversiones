using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class SourcesPerYear
    {
        public SourcesPerYear()
        {
        }
        public string name { get; set; }
        public decimal total { get; set; }
        public decimal current { get; set; }
        public decimal PorcentajeEjecutado { get; set; }
    }
    public class Source
    {
        public string name { get; set; }
        public int total { get; set; }
        public int current { get; set; }
    }
}
