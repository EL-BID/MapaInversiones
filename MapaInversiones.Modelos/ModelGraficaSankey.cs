using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos.Entidad;

namespace PlataformaTransparencia.Modelos
{
      public class ModelGraficaSankey : RespuestaContratoBase
      {
            //public List<string> Nodos { get; set; }
            //public List<RelacionEmisiorReceptor> Enlaces { get; set; }
            public List<infograficoEje> distribucionObjetivos = new List<infograficoEje>();
      }
}
