using System.Collections.Generic;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Modelos.Presupuesto;

namespace PlataformaTransparencia.Modelos
{
    //public class ModelTrazabilidadFinanciadorData : RespuestaContratoBase
    //{
    //    public ModelPresupuestoData ModelPresupuestoData { get; set; }
    //}
    public class ModelProyectoTrazabilidadFinanciadorData : RespuestaContratoBase
    {
        public List<itemGenPresupuesto> Proyectos { get; set; } = new();
    }
    public class ModelPresupuestoData : RespuestaContratoBase
    {
        public List<PresupuestoXSectorMinHacienda> Presupuesto { get; set; }
        public List<InfoPresupuesto> InfoGrafica { get; set; }
        public List<InfoConsolidadoPresupuesto> InfoRecursos { get; set; }
        public decimal TotalPresupuesto { get; set; }
        public decimal TotalAprobado { get; set; }
        public decimal TotalEjecutado { get; set; }

        public InfoConsolidadoPresupuesto InfoConsolidado { get; set; }

        public List<InfoConsolidadoPresupuesto> ListInfoConsolidado { get; set; }

        public List<infograficoGasto> InfograficoPerGasto { get; set; }

        public List<Period> periodos { get; set; }

        public List<itemVersiones> versiones { get; set; }

        public List<InformationGraphics> funciones { get; set; }

        public int totalCantidades { get; set; }

        public List<itemNiveles> ConsolidadoNiveles { get; set; }

        public List<InformationGraphics> gruposGasto { get; set; }


        public List<InfograficoFuentes_Nivel_1> distribucionItemsByFuente = new List<InfograficoFuentes_Nivel_1>();

        public List<itemFuente> fuentes { get; set; }

        public string Sector { get; set; }

        public List<InfoPerSector> sectores { get; set; }

        public List<itemGenerico> organismos { get; set; }

        public List<infograficoEntidadPerPresup> InfograficoPerEntidad { get; set; }

        public List<InformationGraphics> entidades { get; set; }

        public List<itemGenPresupuesto> proyectosInv { get; set; }

        

    }
}
