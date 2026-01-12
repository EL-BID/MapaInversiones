using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Text;

namespace PlataformaTransparencia.Modelos.Proyectos
{
    public class PlanOrdenamientoTerritorialProyectos
    {
        public int IdProyecto { get; set; } // int
        public string CodigoBPIN { get; set; } // varchar(max)
        public string CodigoObjetivoEstrategicoPOT { get; set; } // nvarchar(max)
        public string ObjetivoEstrategicoPOT { get; set; } // nvarchar(max)
        public string CodigoEstrategiaPOT { get; set; } // nvarchar(max)
        public string EstrategiaPOT { get; set; } // nvarchar(max)
        public string CodigoProgramaPOT { get; set; } // nvarchar(max)
        public string ProgramaPOT { get; set; } // nvarchar(max)
        public string CodigoSubProgramaPOT { get; set; } // nvarchar(max)
        public string SubProgramaPOT { get; set; } // nvarchar(max)
        public string CodigoMetaPOT { get; set; } // nvarchar(max)
        public string MetaSubprogramaPOT { get; set; } // nvarchar(max)
    }
}
