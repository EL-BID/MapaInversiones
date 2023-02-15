using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class infograficoPrograma
    {
        public int Id { get; set; }
        public string Nombre { get; set; }

        public double presupuesto { get; set; }

        public List<string> estados { get; set; }

    }
}
