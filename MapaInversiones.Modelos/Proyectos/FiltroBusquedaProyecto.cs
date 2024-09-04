using PlataformaTransparencia.Modelos.Comunes;
using System;
using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos.Proyectos
{
    [Serializable]
    public class FiltroBusquedaProyecto
    {
        // Fields
        public bool FechasPorDefecto;

        // Methods
        public FiltroBusquedaProyecto()
        {
            this.InicializarValoresDefecto();
        }

        public FiltroBusquedaProyecto(int zoom, List<string> lstCodigosRegion, List<string> lstCodigosDptos, List<string> lstCodigosMunicipios, List<int> lstCodigosSector, List<int> lstCodigosEstado, List<int> lstCodigosOrgFinanciador, List<int> lstCodigosEntidadEjecutora, List<int> lstAños, string nombreProyecto, List<decimal> puntosTopLeft, List<decimal> puntosBottomRight, List<int> lstCodigoPrograma)
        {
            this.InicializarValoresDefecto();
            this.CodigosRegion = lstCodigosRegion;
            this.CodigosDepartamentos = lstCodigosDptos;
            this.CodigosMunicipios = lstCodigosMunicipios;
            this.CodigosSector = lstCodigosSector;
            this.CodigosOrgFinanciador = lstCodigosOrgFinanciador;
            this.CodigosEstado = lstCodigosEstado;
            this.CodigosEntidadEjecutora = lstCodigosEntidadEjecutora;
            this.Zoom = zoom;
            this.TopLeft = puntosTopLeft;
            this.BottomRight = puntosBottomRight;
            if ((lstAños != null) && (lstAños.Count > 0))
            {
                this.fechasEjecucion = lstAños;
                this.FechasPorDefecto = false;
            }
            this.ContieneNombreProyecto = nombreProyecto;
            this.CodigoPrograma = lstCodigoPrograma;
        }

        private void InicializarValoresDefecto()
        {
            this.Zoom = 6;
            this.ContieneNombreProyecto = string.Empty;
            this.TopLeft = new List<decimal>();
            this.BottomRight = new List<decimal>();
            this.CodigosRegion = new List<string>();
            this.CodigosDepartamentos = new List<string>();
            this.CodigosMunicipios = new List<string>();
            this.CodigosSector = new List<int>();
            this.CodigosOrgFinanciador = new List<int>();
            this.CodigosEstado = new List<int>();
            this.CodigosEntidadEjecutora = new List<int>();
            this.fechasEjecucion = new List<int>();
            PeriodoDeTiempo tiempo = new PeriodoDeTiempo();
            this.fechasEjecucion.AddRange(tiempo.FechasEjecucion);
            this.FechasPorDefecto = true;
            this.CodigoPrograma = new List<int>();
        }

        // Properties
        public List<decimal> BottomRight { get; set; }

        public List<string> CodigosDepartamentos { get; set; }

        public List<int> CodigosEstado { get; set; }

        public List<string> CodigosMunicipios { get; set; }

        public List<string> CodigosRegion { get; set; }

        public List<int> CodigosSector { get; set; }

        public List<int> CodigosOrgFinanciador { get; set; }

        public List<int> CodigosEntidadEjecutora { get; set; }

        public string ContieneNombreProyecto { get; set; }

        public List<int> fechasEjecucion { get; set; }

        public List<decimal> TopLeft { get; set; }

        public int Zoom { get; set; }

        public List<int> CodigoPrograma { get; set; }

    }


}