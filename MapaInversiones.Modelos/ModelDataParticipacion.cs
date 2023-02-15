using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class ModelDataParticipacion: RespuestaContratoBase
    {
        public List<TiposComentario> tipo_comentario;

        public List<Comentarios> comentarios { get; set; ***REMOVED***

        public List<itemcomentario> itemcomentario { get; set; ***REMOVED***
        public List<RolParticipa> rol_participacion { get; set; ***REMOVED***
        public List<GenerosParticipacion> genero_participacion { get; set; ***REMOVED***
        public List<MediosParticipacion> medios_participacion { get; set; ***REMOVED***

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
    ***REMOVED***

        public itemUsuarios usuarios { get; set; ***REMOVED***

        public itemEstadisticas estadisticasProy { get; set; ***REMOVED***

        public string id_usu_participa { get; set; ***REMOVED***

        public string nom_usu_participa { get; set; ***REMOVED***

        public int totalNumber { get; set; ***REMOVED***
        public int totalPages { get; set; ***REMOVED***
        public int pagesNumber { get; set; ***REMOVED***

        public List<filtrosParticipacion> filtrosEstado { get; set; ***REMOVED***
        public List<filtrosParticipacion> filtrosAsociacion { get; set; ***REMOVED***




***REMOVED***
***REMOVED***
