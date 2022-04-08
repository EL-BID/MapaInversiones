using System;
using System.Collections.Generic;
using System.Text;
using SolrNet.Attributes;

namespace PlataformaTransparencia.Modelos
{
    public class ResultadoBusquedaItem
    {
        [SolrUniqueKey("id")]
        public int Id { get; set; }
        [SolrField("CodigoBPIN")]
        public List<string> CodigoBPIN { get; set; }
        [SolrField("NombreProyecto")]
        public string NombreProyecto { get; set; }
        [SolrField("IdSector")]
        public int IdSector { get; set; }
        [SolrField("Sector")]
        public string Sector { get; set; }
        [SolrField("Url")]
        public string Url { get; set; }
        [SolrField("Type")]
        public string Type { get; set; }
        [SolrField("numFound")]
        public int numFound { get; set; }


    }
}
