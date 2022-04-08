using System;
using SolrNet.Attributes;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Proyectos
{
    public class Proyecto
    {
        [SolrUniqueKey("id")]
        public int Id { get; set; ***REMOVED***
        [SolrField("CodigoBPIN")]
        public List<string> CodigoBPIN { get; set; ***REMOVED***
        [SolrField("NombreProyecto")]
        public string NombreProyecto { get; set; ***REMOVED***
        [SolrField("FechaInicioProyecto")]
        public DateTime FechaInicioProyecto { get; set; ***REMOVED***
        [SolrField("FechaFinProyecto")]
        public DateTime FechaFinProyecto { get; set; ***REMOVED***
        [SolrField("ObjetivoGeneral")]
        public string ObjetivoGeneral { get; set; ***REMOVED***
        [SolrField("IdSector")]
        public int IdSector { get; set; ***REMOVED***
        [SolrField("Sector")]
        public string Sector { get; set; ***REMOVED***
        [SolrField("TipoDeProyecto")]
        public string TipoDeProyecto { get; set; ***REMOVED***
***REMOVED***
***REMOVED***
