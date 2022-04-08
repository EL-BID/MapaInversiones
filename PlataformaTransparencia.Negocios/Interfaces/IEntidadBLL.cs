using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Entidad;


namespace PlataformaTransparencia.Negocios.Entidad
{
    public interface IEntidadBLL
    {
        public List<infograficoEje> GetGraficaSankey(string codEntidad);

        public List<ProyectosPerfilEntidad> GetActividadesClasePrograma(string clasePrograma, int anio, string codEntidad);
        public List<ProyectosProgramas> GetActividadesProgramaSustantivo(string clasePrograma, int anio, string codEntidad);

        List<TableIndicadorGraphics> GetGraficaIndicadores(int codigoIndicador, int anio, string codEntidad);

***REMOVED***
***REMOVED***
