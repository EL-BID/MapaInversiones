﻿using PlataformaTransparencia.Modelos.Comunes;
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
    ***REMOVED***

        public FiltroBusquedaProyecto(int zoom, List<string> lstCodigosRegion, List<string> lstCodigosDptos, List<string> lstCodigosMunicipios, List<int> lstCodigosSector, List<int> lstCodigosEstado, List<int> lstCodigosOrgFinanciador, List<int> lstAños, string nombreProyecto, List<decimal> puntosTopLeft, List<decimal> puntosBottomRight, List<int> lstCodigoPrograma)
        {
            this.InicializarValoresDefecto();
            this.CodigosRegion = lstCodigosRegion;
            this.CodigosDepartamentos = lstCodigosDptos;
            this.CodigosMunicipios = lstCodigosMunicipios;
            this.CodigosSector = lstCodigosSector;
            this.CodigosOrgFinanciador = lstCodigosOrgFinanciador;
            this.CodigosEstado = lstCodigosEstado;
            this.Zoom = zoom;
            this.TopLeft = puntosTopLeft;
            this.BottomRight = puntosBottomRight;
            if ((lstAños != null) && (lstAños.Count > 0))
            {
                this.fechasEjecucion = lstAños;
                this.FechasPorDefecto = false;
        ***REMOVED***
            this.ContieneNombreProyecto = nombreProyecto;
            this.CodigoPrograma = lstCodigoPrograma;
    ***REMOVED***

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
            this.fechasEjecucion = new List<int>();
            PeriodoDeTiempo tiempo = new PeriodoDeTiempo();
            this.fechasEjecucion.AddRange(tiempo.FechasEjecucion);
            this.FechasPorDefecto = true;
            this.CodigoPrograma = new List<int>();
    ***REMOVED***

        // Properties
        public List<decimal> BottomRight { get; set; ***REMOVED***

        public List<string> CodigosDepartamentos { get; set; ***REMOVED***

        public List<int> CodigosEstado { get; set; ***REMOVED***

        public List<string> CodigosMunicipios { get; set; ***REMOVED***

        public List<string> CodigosRegion { get; set; ***REMOVED***

        public List<int> CodigosSector { get; set; ***REMOVED***
        public List<int> CodigosOrgFinanciador { get; set; ***REMOVED***

        public string ContieneNombreProyecto { get; set; ***REMOVED***

        public List<int> fechasEjecucion { get; set; ***REMOVED***

        public List<decimal> TopLeft { get; set; ***REMOVED***

        public int Zoom { get; set; ***REMOVED***

        public List<int> CodigoPrograma { get; set; ***REMOVED***

***REMOVED***


***REMOVED***