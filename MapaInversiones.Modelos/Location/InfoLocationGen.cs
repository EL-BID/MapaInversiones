using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Location
{
    public class InfoLocationGen
    {
        public string IdDepartamento { get; set; }
        public string IdMunicipio { get; set; }
        public Nullable<decimal> Costo { get; set; }
        public Nullable<decimal> Duracion { get; set; }
        public Nullable<decimal> CantProyectos { get; set; }
        public string urlImgXL { get; set; }
    }
}
