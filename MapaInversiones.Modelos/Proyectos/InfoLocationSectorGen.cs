using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Proyectos
{
    public class InfoLocationSectorGen
    {
        public string IdDepartamento { get; set; } = string.Empty;
        public string IdSector { get; set; } = string.Empty;
        public decimal Costo { get; set; } = 0m;
        public decimal Duracion { get; set; } = 0m;
        public decimal CantProyectos { get; set; } = 0m;
        public string UrlImgXL { get; set; } = "";
        public string nomSector { get; set; } = string.Empty;
    }

}
