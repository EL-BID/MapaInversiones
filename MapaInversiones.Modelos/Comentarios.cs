using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class Comentarios
    {
        public int IdUsuario { get; set; }
        public string nom_usuario { get; set; }
        public System.DateTime fecha { get; set; }

        public int IdComentario { get; set; }
        public int IdTipoComentario { get; set; }
        public int IdProyecto { get; set; }
        public Nullable<int> CodEnteTerritorialBeneficiario { get; set; }
        public string IdDepartamento { get; set; }
        public string IdMunicipio { get; set; }
        public System.DateTime FechaCreacion { get; set; }
        public int IdEstado { get; set; }
        public string ComentarioOriginal { get; set; }
        public string ComentarioModerado { get; set; }
        public Nullable<System.DateTime> fechaPublicacion { get; set; }
        public Nullable<int> IdTipoRespuesta { get; set; }
        public Nullable<int> ComentarioRelacionado { get; set; }
        public Nullable<bool> Anonimo { get; set; }
        public string JustificacionParaNoPublicar { get; set; }

        //public virtual EstadoComentario EstadoComentario { get; set; }
        //public virtual TipoComentario TipoComentario { get; set; }
        //public virtual TipoRespuesta TipoRespuesta { get; set; }
    }
}
