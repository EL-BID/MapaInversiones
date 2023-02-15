using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class infograficoGrupoGasto
    {
        public string Id { get; set; }
        public string Nombre { get; set; }

        public double presupuesto { get; set; }

        public double ejecutado { get; set; }

        public List<infograficoProcesos> Detalles { get; set; }

        public Boolean flagProcesos { get; set; }

        public infograficoGrupoGasto()
        {
            Id = "";
            Nombre = "";
            presupuesto = 0;
            ejecutado = 0;
            Detalles = new List<infograficoProcesos>();
            flagProcesos = false;

        }
    }
}
