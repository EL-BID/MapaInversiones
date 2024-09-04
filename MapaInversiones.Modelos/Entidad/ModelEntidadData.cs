using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Modelos.Plan;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class ModelEntidadData : RespuestaContratoBase
    {
        public string Mision { get; set; }
        public string Vision { get; set; }
        public string NombreEntidad { get; set; }
        public string CodigoEntidad { get; set; }

        public List<string> Annios = new List<string>();
        public string UrlParticipacionCiudadana { get; set; }

        public List<RelacionEmisiorReceptor> RelacionEntidadObjetivos { get; set; }

        public List<InfoEntidad> Entidades { get; set; }
        public List<ProyectosPerfilEntidad> ProyectosHaciendaCentral { get; set; }
        public List<ProyectosPerfilEntidad> ProyectosHaciendaNoAsignable { get; set; }
        public List<ProyectosProgramas> ProyectosHaciendaSustantivo { get; set; }

        public List<infograficoPrograma> infoProgramas { get; set; }

        public List<infograficoActividad> infograficoActividad { get; set; }

        public List<infograficoGrupoGasto> infograficoGasto { get; set; }

        public infograficoEntidad infograficoEntidad { get; set; }

        public decimal PresupuestoVigenteAnnioDisplay { get; set; }
        public decimal PresupuestoEjecutadoAnnioDisplay { get; set; }
        public decimal PorcEjecutadoAnnioDisplay { get; set; }

        public itemGenInversion detalleTipo { get; set; }
    }

    public class ProyectosPerfilEntidad
    {
        public string NombreProyectoActividad { get; set; }
        public string Descripcion { get; set; }
        public string Clasificacion { get; set; }
        public decimal PresupuestoVigente { get; set; }
        public decimal PresupuestoAvance { get; set; }

        public List<IndicadorProyecto> Indicadores { get; set; }
    }

    public class IndicadorProyecto
    {
        public int Codigo { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string UnidadMedidaAnioBase { get; set; }
        public string UnidadMedidaTotal { get; set; }
        public string UnidadIndicador { get; set; }
        public decimal Avance { get; set; }
        public string Frecuencia { get; set; }
        public string Fuente { get; set; }
        public string Formula { get; set; }

        public string ind_frecuen { get; set; }

        public string tipoIndicador { get; set; }

        public string nivel { get; set; }

        public string DescripcionPoblTotal { get; set; }

        public decimal? indAnioBase { get; set; }

    }

    public class TableIndicadorGraphics
    {
        public int anio { get; set; }

        public string meta_numerador { get; set; }

        public decimal? denominador { get; set; }

        public decimal? avance_numerador { get; set; }

        public double? porc_meta { get; set; }

        public double? porc_avance { get; set; }


    }

    public class ProyectosProgramas
    {
        public string NombrePrograma { get; set; }
        public string ResultadoInmediato { get; set; }
        public string ResultadoIntermedio { get; set; }
        public string Problematica { get; set; }
        public decimal PresupuestoAsignado { get; set; }
        public List<ProyectosPerfilEntidad> Proyectos { get; set; }
    }

    public class ConsolidadoProgramasEntidad
    {
        public int TotalActividadesProgramaCentral { get; set; }
        public int TotalProgramasSustantivos { get; set; }
        public int TotalActividadesProgramasNoAsignables { get; set; }


    }

    public class DatosEntidadAnio
    {
        public decimal? PresupuestoInicial { get; set; }
        public decimal? PresupuestoVigente { get; set; }
        public decimal? PresupuestoEjecutado { get; set; }
        public int FirmadosOncae { get; set; }
        public decimal? ValorOncae { get; set; }
        public int FirmadosSefin { get; set; }
        public decimal? ValorSefin { get; set; }
        public List<ContratistaData> DataContratos { get; set; }
    }


}
