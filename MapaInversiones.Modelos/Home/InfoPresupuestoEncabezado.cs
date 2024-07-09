using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Home
{
    public class InfoPresupuestoEncabezado
    {
        public int AnioActual { get; set; }
        public int AnioAnterior { get; set; }
        public double PresupuestoActual { get; set; }
        public double PresupuestoAnterior { get; set; }
        public double Porcentaje { get; set; }
        public int CantProcesosAdjudicados { get; set; }
        public int CantContratosActivos { get; set; }
        public int CantContratosCerrados { get; set; }


    }
}
