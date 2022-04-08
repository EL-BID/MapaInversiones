using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos.Plan;

namespace PlataformaTransparencia.Modelos
{
    public class ModelHomeData : RespuestaContratoBase
    {
        public List<InfoEntidadesConsolida> Entidades { get; set; }

        public List<InfoRecAsignadosPlan> RecursosPerObjeto { get; set; }

        public List<InfoRecAsignadosPlan> RecursosAsignados { get; set; }

        public List<InformationGraphics> RecursosBySector { get; set; }
    }
}
