using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class itemcomentario
    {
        public int IdComentario { get; set; }
        public int IdTipoComentario { get; set; }
        public int IdAsociacion { get; set; }
        public string NombreTipoComentario { get; set; }
        public Nullable<int> IdProyecto { get; set; }
        public string id_departamento { get; set; }
        public string nom_departamento { get; set; }
        public string id_municipio { get; set; }
        public string nom_municipio { get; set; }
        public string NombreProyecto { get; set; }
        public Nullable<int> CodEnteTerritorialBeneficiario { get; set; }
        public int IdUsuario { get; set; }
        public string nom_usuario { get; set; }
        public System.DateTime fechaCreacion { get; set; }
        public int IdEstado { get; set; }
        public string NombreEstado { get; set; }
        public string ComentarioOriginal { get; set; }
        public string ComentarioModerado { get; set; }
        public Nullable<System.DateTime> fechaPublicacion { get; set; }
        public Nullable<int> IdTipoRespuesta { get; set; }
        public Nullable<int> ComentarioRelacionado { get; set; }
        public Nullable<bool> Anonimo { get; set; }
        public int IdEstadoRelacionado { get; set; }
        //Auxiliar
        public int UsuarioComenta { get; set; }
        public string textoJustifica { get; set; }
        public int IdTipologia { get; set; }
        public string Tipologia { get; set; }
        public int Relacion { get; set; }
        public Nullable<int> TipoSubsidio { get; set; }
        public string NombreSubsidio { get; set; }
        public string CodigoContrato { get; set; }

    }
}
