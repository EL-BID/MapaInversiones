using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class itemGenInversion
    {
        public List<itemGenPresupuesto> proyInv { get; set; }

        public List<itemLineaPresupuestal> otrasLineas { get; set; }

        public List<itemGenPresupuesto> genericoTipo { get; set; }
    }
}
