﻿using PlataformaTransparencia.Modelos.Entidad;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Home
{
    public class InfoPresupuestoEncabezado
    {
        public int Periodo { get; set; }
        
        public double Presupuesto{ get; set; }
        public double Ejecutado { get; set; }

        public double AprobadoFondoPropio { get; set; }

        public InfoPresupuestoEncabezado()
        {
            Periodo = DateTime.Now.Year;
            Presupuesto = 0;
            Ejecutado = 0;
            AprobadoFondoPropio = 0;

        }


    }

}
