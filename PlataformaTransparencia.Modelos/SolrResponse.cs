using System;
using SolrNet.Attributes;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class SolrResponse
    {
        [SolrUniqueKey("id")]
        public string Id { get; set; }
        [SolrField("principal")]
        public string Principal { get; set; }
        [SolrField("metadata")]
        public string Metadata { get; set; }
        [SolrField("descripcion")]
        public string Descripcion { get; set; }
        [SolrField("IdSector")]
        public int IdSector { get; set; }
        [SolrField("hierarchy")]
        public string Hierarchy { get; set; }
        [SolrField("type")]
        public string Type { get; set; }
        [SolrField("url")]
        public string Url { get; set; }
        [SolrField("numFound")]
        public int numFound { get; set; }


    }
}