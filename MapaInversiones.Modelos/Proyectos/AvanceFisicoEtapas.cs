using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Proyectos
{
    public class AvanceFisicoEtapas
    {
        public string Etapa { get; set; }
        public decimal Porcentaje { get; set; }
        public DateTime fechaInicio { get; set; }
        public DateTime fechaFin { get; set; }

    }
}
