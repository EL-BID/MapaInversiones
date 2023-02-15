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

    ***REMOVED***

        public List<ComponentesProy> componentes { get; set; ***REMOVED***
        public List<itemFuentes> fuentesFinanciacion { get; set; ***REMOVED***
        public List<Period> periodosFuentes { get; set; ***REMOVED***
        public List<ImagesUsuario> FotosU { get; set; ***REMOVED***
        public int totalNumber { get; set; ***REMOVED***
        public int totalPages { get; set; ***REMOVED***
        public int pagesNumber { get; set; ***REMOVED***
        public List<InfoProyectos> proyNacionales { get; set; ***REMOVED***

        public List<InfoProyectos> proyNacionalesAll { get; set; ***REMOVED***


***REMOVED***

***REMOVED***
