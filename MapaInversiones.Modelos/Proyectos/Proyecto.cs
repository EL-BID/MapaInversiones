using System;
using SolrNet.Attributes;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Proyectos
{
    public class Proyecto
    {
        [SolrUniqueKey("id")]
        public int Id { get; set; }
        [SolrField("CodigoBPIN")]
        public List<string> CodigoBPIN { get; set; }
        [SolrField("NombreProyecto")]
        public string NombreProyecto { get; set; }
        [SolrField("FechaInicioProyecto")]
        public DateTime FechaInicioProyecto { get; set; }
        [SolrField("FechaFinProyecto")]
        public DateTime FechaFinProyecto { get; set; }
        [SolrField("ObjetivoGeneral")]
        public string ObjetivoGeneral { get; set; }
        [SolrField("IdSector")]
        public int IdSector { get; set; }
        [SolrField("Sector")]
        public string Sector { get; set; }
        [SolrField("TipoDeProyecto")]
        public string TipoDeProyecto { get; set; }
    }
}
