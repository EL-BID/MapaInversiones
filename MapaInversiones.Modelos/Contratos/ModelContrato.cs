using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class ModelContrato: RespuestaContratoBase
    {
        public List<Contrato> Query { get; set; }

        public string id_usu_participa { get; set; }
        public string nom_usu_participa { get; set; }
        public List<RolParticipa> rol_participacion { get; set; }
        public List<GenerosParticipacion> genero_participacion { get; set; }
        public List<MediosParticipacion> medios_participacion { get; set; }

        public List<TiposComentario> tipo_comentario { get; set; }
    }
}
