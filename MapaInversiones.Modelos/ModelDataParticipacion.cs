using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class ModelDataParticipacion: RespuestaContratoBase
    {
        public List<TiposComentario> tipo_comentario;

        public List<Comentarios> comentarios { get; set; }

        public List<itemcomentario> itemcomentario { get; set; }
        public List<RolParticipa> rol_participacion { get; set; }
        public List<GenerosParticipacion> genero_participacion { get; set; }
        public List<MediosParticipacion> medios_participacion { get; set; }

        public ModelDataParticipacion()
        {
            itemcomentario = new List<itemcomentario>();
            comentarios = new List<Comentarios>();
            tipo_comentario = new List<TiposComentario>();
            rol_participacion = new List<RolParticipa>();
            genero_participacion = new List<GenerosParticipacion>();
            medios_participacion = new List<MediosParticipacion>();
            id_usu_participa = string.Empty;
            nom_usu_participa = string.Empty;
            totalNumber = 0;
            totalPages = 0;
            pagesNumber = 0;
        }

        public itemUsuarios usuarios { get; set; }

        public itemEstadisticas estadisticasProy { get; set; }

        public string id_usu_participa { get; set; }

        public string nom_usu_participa { get; set; }

        public int totalNumber { get; set; }
        public int totalPages { get; set; }
        public int pagesNumber { get; set; }

        public List<filtrosParticipacion> filtrosEstado { get; set; }
        public List<filtrosParticipacion> filtrosAsociacion { get; set; }




    }
}
