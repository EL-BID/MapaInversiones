using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Text;

namespace PlataformaTransparencia.Modelos.Proyectos
{
    public class PlanDesarrolloProyectos
    {
        public int IdProyecto { get; set; } // int
        public string CodigoBPIN { get; set; } // varchar(max)
        public string CodigoObjetivoPlanDesarrollo { get; set; } // nvarchar(max)
        public string ObjetivoPlanDesarrollo { get; set; } // nvarchar(max)
        public string CodigoProgramaPOT { get; set; } // nvarchar(max)
        public string ProgramaPlanDesarrollo { get; set; } // nvarchar(max)
        public string CodigoMetaProductoPlanDesarrollo { get; set; } // nvarchar(max)
        public string MetaPlanDesarrollo { get; set; } // nvarchar(max)
        public double ProgramadoMeta { get; set; } // nvarchar(max)
        public int Anio { get; set; } // int
    }
}
