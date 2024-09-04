using System.Collections.Generic;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Proyectos;

namespace PlataformaTransparencia.Negocios.Interfaces
{
    public interface IGeneradorDatosProximidad
    {
        int TotalCantidadProyectos { get; set; }
        decimal TotalValorRegalias { get; set; }
        decimal TotalValorTodasLasFuentes { get; set; }

        List<objectProjectsSearchMap> ObtenerPinesDeProyectos(int zoom, List<decimal> topLeft, List<decimal> bottomRight, List<InfoProyectos> infoProyectos, FiltroBusquedaProyecto filtro);
    }
}