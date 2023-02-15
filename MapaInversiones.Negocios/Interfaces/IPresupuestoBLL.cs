using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Plan;
using PlataformaTransparencia.Modelos.Presupuesto;
using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Negocios.Interfaces
{
    public interface IPresupuestoBLL
    {
        public List<InfoConsolidadoPresupuesto> ObtenerRecursosPerNivel(int annio);
        public List<InfoConsolidadoPresupuesto> ObtenerRecursosPerOrganismo(int annio);

        public List<InfoConsolidadoPresupuesto> GetConsolidadoPeriodos(int anyo);

        public List<InfoConsolidadoPresupuesto> ObtenerInfoPerGrupoDeGasto(List<int> filtro, int anyo, List<String> filtro_gasto);

        public List<InfoEntidad> ObtenerEntidadesPlanNacional();

    public List<InfoEntidad> ObtenerEntidadesPlanNacionalNoAlcaldias();
    public List<infograficoGasto> GetInfograficoPerGasto(int annio);

        public List<infograficoGasto> GetInfograficoPerEntidad(int annio);

        public List<InfoPresupuesto> GetComparativePerVersiones(List<int> filtro, int anyo);

        public List<InfoConsolidadoPresupuesto> ObtenerInfoPerFuncionesGob(List<int> filtro, int anyo, List<string> filtro_func);

        public List<InformationGraphics> ObtenerFuncionesPerNombre(string texto, int anyo);

        public List<InformationGraphics> ObtenerGrupoGastoPerNombre(int anyo);
***REMOVED***
***REMOVED***
