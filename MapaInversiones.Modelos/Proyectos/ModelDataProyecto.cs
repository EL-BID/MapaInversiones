using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos.Comunes;

namespace PlataformaTransparencia.Modelos.Proyectos
{
    public class ModelDataProyecto : RespuestaContratoBase
    {
        public ModelDataProyecto()
        {
            componentes = new List<ComponentesProy>();
            fuentesFinanciacion = new List<itemFuentes>();
            periodosFuentes = new List<Period>();
            FotosU = new List<ImagesUsuario>();
            proyNacionales = new List<InfoProyectos>();
            proyNacionalesAll = new List<InfoProyectos>();

        }

        public List<ComponentesProy> componentes { get; set; }
        public List<itemFuentes> fuentesFinanciacion { get; set; }
        public List<Period> periodosFuentes { get; set; }
        public List<ImagesUsuario> FotosU { get; set; }
        public int totalNumber { get; set; }
        public int totalPages { get; set; }
        public int pagesNumber { get; set; }
        public List<InfoProyectos> proyNacionales { get; set; }

        public List<InfoProyectos> proyNacionalesAll { get; set; }


    }

}
