using System;
using System.Collections.Generic;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Contratos;

namespace PlataformaTransparencia.Modelos
{
  public class ModelContratistaData : RespuestaContratoBase
    {
        /// Datos encabezado
        /// </summary>
        public string nomContratista { get; set; }
        public Nullable<int> numContratos { get; set; }
        public Nullable<decimal> valorContratos { get; set; }
        /// <summary>
        /// id identificador 
        /// </summary>
        public string ruc { get; set; }
        public string codigoContrato { get; set; }

        /// <summary>
        /// Arreglo con objetos representando el grafico de contratos por año
        /// </summary>
        public List<InfoContratosPerAnyo> ContratosPerAnyo {
            get { return contratosPerAnyo; }
            set { contratosPerAnyo = value; }
        }
        private List<InfoContratosPerAnyo> contratosPerAnyo = new List<InfoContratosPerAnyo>();

        public ModelContratistaData()
        {
            rol_participacion = new List<RolParticipa>();
            genero_participacion = new List<GenerosParticipacion>();
            medios_participacion = new List<MediosParticipacion>();
            tipo_comentario = new List<TiposComentario>();
            entes_beneficiarios = new List<ActorFicha>();
            listInformacion = new List<InformacionContratos>();


        }
        public List<RolParticipa> rol_participacion { get; set; }

        public List<GenerosParticipacion> genero_participacion { get; set; }

        public List<MediosParticipacion> medios_participacion { get; set; }

        public List<TiposComentario> tipo_comentario { get; set; }

        public List<ActorFicha> entes_beneficiarios { get; set; }

        public List<InformacionContratos> listInformacion;

        public List<EncabezadoContratosCancelados> listEncabezadoContratosCancelados;

        public List<UnidadCompras> listUnidadCompra;

        public List<Contratista> listContratista;
        public List<TotalContrato> listTotalContratos;


        public List<TotalProceso> listTotalProcesos;
        public Nullable<int> numProcesos { get; set; }
        public Nullable<decimal> valorProcesos { get; set; }
        public Nullable<decimal> valorEjecutado { get; set; }

        public Nullable<int> numProcesosCancelados { get; set; }
        public Nullable<decimal> valProcesosCancelados { get; set; }

        public List<ContratosEstado> listEstadosContratos;
        public Nullable<int> tipoEmergencia { get; set; }
        public string nombreUnidadCompra { get; set; }

        public string nombreEntidad { get; set; }
    }
}
