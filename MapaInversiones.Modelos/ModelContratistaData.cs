using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Contratos;

namespace PlataformaTransparencia.Modelos
{
    public class ModelContratistaData : RespuestaContratoBase
    {
        /// Datos encabezado
        /// </summary>
        public string nomContratista { get; set; ***REMOVED***
        public Nullable<int> numContratos { get; set; ***REMOVED***
        public Nullable<decimal> valorContratos { get; set; ***REMOVED***
        /// <summary>
        /// id identificador 
        /// </summary>
        public string ruc { get; set; ***REMOVED***
        public string CodigoContrato { get; set; ***REMOVED***

        /// <summary>
        /// Arreglo con objetos representando el grafico de contratos por año
        /// </summary>
        public List<InfoContratosPerAnyo> ContratosPerAnyo {
            get { return contratosPerAnyo; ***REMOVED***
            set { contratosPerAnyo = value; ***REMOVED***
    ***REMOVED***
        private List<InfoContratosPerAnyo> contratosPerAnyo = new List<InfoContratosPerAnyo>();

        public ModelContratistaData()
        {
            rol_participacion = new List<RolParticipa>();
            genero_participacion = new List<GenerosParticipacion>();
            medios_participacion = new List<MediosParticipacion>();
            tipo_comentario = new List<TiposComentario>();
            entes_beneficiarios = new List<ActorFicha>();
            listInformacion = new List<InformacionContratos>();


    ***REMOVED***
        public List<RolParticipa> rol_participacion { get; set; ***REMOVED***

        public List<GenerosParticipacion> genero_participacion { get; set; ***REMOVED***

        public List<MediosParticipacion> medios_participacion { get; set; ***REMOVED***

        public List<TiposComentario> tipo_comentario { get; set; ***REMOVED***

        public List<ActorFicha> entes_beneficiarios { get; set; ***REMOVED***

        public List<InformacionContratos> listInformacion;

        public List<EncabezadoContratosCancelados> listEncabezadoContratosCancelados;

***REMOVED***
***REMOVED***
