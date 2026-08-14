using PlataformaTransparencia.Modelos.Emprestitos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos
{
    public class ModelEmprestitoData: RespuestaContratoBase
    {
        public List<itemCredito> Creditos { get; set; }

        public List<InformationGraphics> RecursosByPrestamo { get; set; }

        public List<itemProyecto> Proyectos { get; set; }


        public infoFuentesRecursos FechasCorte { get; set; }


    }
}
