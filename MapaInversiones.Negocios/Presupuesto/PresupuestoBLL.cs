using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Plan;
using PlataformaTransparencia.Modelos.Presupuesto;
using PlataformaTransparencia.Negocios.Interfaces;

namespace PlataformaTransparencia.Negocios.Presupuesto
{
    public class PresupuestoBLL : IPresupuestoBLL
    {
        private readonly TransparenciaDB _connection;

        public PresupuestoBLL(TransparenciaDB connection)
        {
            _connection = connection;
    ***REMOVED***

        public List<InfoConsolidadoPresupuesto> ObtenerRecursosPerNivel(int annio)
        {

            List<InfoConsolidadoPresupuesto> objReturn = new List<InfoConsolidadoPresupuesto>();
            var RecursosPerObjetoQuery = (from info in _connection.VwPresupuesto
                                          where info.Periodo == annio
                                          group info by new { info.NivelDeAdministracion,info.CodigoInstitucion,info.Institucion ***REMOVED*** into g

                                          select new InfoConsolidadoPresupuesto
                                          { 
                                              labelGroup = g.Key.NivelDeAdministracion,
                                              Id=g.Key.CodigoInstitucion.Value,
                                              label = g.Key.Institucion,
                                              rawValueDouble = g.Sum(g => g.Vigente.Value),
                                              vigente= g.Sum(g => g.Vigente.Value),
                                              aprobado= g.Sum(g => g.Aprobado.Value),
                                              ejecutado=g.Sum(g=>g.EjecucionDelMes.Value)

                                      ***REMOVED***).OrderBy(x => x.labelGroup).ThenBy(n => n.label).ToList();

            objReturn = RecursosPerObjetoQuery;


            return objReturn;

    ***REMOVED***

        public List<InfoConsolidadoPresupuesto> ObtenerRecursosPerOrganismo(int annio)
        {

            List<InfoConsolidadoPresupuesto> objReturn = new List<InfoConsolidadoPresupuesto>();
            var RecursosPerObjetoQuery = (from info in _connection.VwPresupuesto
                                          where info.Periodo == annio
                                          group info by new { info.FuenteDeFinanciamiento, info.Institucion ***REMOVED*** into g

                                          select new InfoConsolidadoPresupuesto
                                          {
                                              labelGroup = g.Key.FuenteDeFinanciamiento,
                                              label = g.Key.Institucion,
                                              rawValueDouble = g.Sum(g => g.Vigente.Value),
                                      ***REMOVED***).ToList();

            objReturn = RecursosPerObjetoQuery;


            return objReturn;

    ***REMOVED***

        public List<InfoConsolidadoPresupuesto> GetConsolidadoPeriodos(int anyo)
        {

            var max = anyo;
            var min = max-3;

            List<InfoConsolidadoPresupuesto> objReturn = new List<InfoConsolidadoPresupuesto>();
            var RecursosPerObjetoQuery = (from info in _connection.VwPresupuesto
                                          where (info.Periodo >= min && info.Periodo <= max) //datos del año anterior al seleccionado
                                          group info by new { info.Periodo ***REMOVED*** into g

                                          select new InfoConsolidadoPresupuesto
                                          {
                                              periodo = g.Key.Periodo.Value,
                                              vigente = g.Sum(g => g.Vigente.Value),
                                              aprobado = g.Sum(g => g.Aprobado.Value),
                                              ejecutado = g.Sum(g => g.EjecucionDelMes.Value)
                                      ***REMOVED***).OrderByDescending(x => x.periodo).ToList();

            objReturn = RecursosPerObjetoQuery;


            return objReturn;

    ***REMOVED***

        public List<InfoConsolidadoPresupuesto> ObtenerInfoPerGrupoDeGasto(List<int> filtro,int anyo,List<String> filtro_gasto)
        {
            List<InfoConsolidadoPresupuesto> objReturn = new List<InfoConsolidadoPresupuesto>();
            List<InfoConsolidadoPresupuesto> query1 = new List<InfoConsolidadoPresupuesto>();

                var max = filtro.Max();
                var min = filtro.Min();
                
                var queryTotal= (from pre in _connection.VwPresupuesto
                                 where filtro.Contains(pre.Periodo.Value)
                                 group pre by new { pre.Periodo ***REMOVED*** into g
                                 select new InfoConsolidadoPresupuesto
                                 {
                                     rawValue = (decimal)g.Sum(g => g.EjecucionDelMes) / 1000000,
                                     periodo = (int)g.Key.Periodo.Value
                             ***REMOVED***).ToList();

                if (filtro_gasto.Count > 0)
                {
                    query1 = (from pre in _connection.VwPresupuesto
                              where filtro.Contains(pre.Periodo.Value) && filtro_gasto.Contains(pre.GrupoDeGasto)
                              group pre by new { pre.Periodo, pre.GrupoDeGasto ***REMOVED*** into g
                              select new InfoConsolidadoPresupuesto
                              {
                                  rawValue = (decimal)g.Sum(g => g.EjecucionDelMes) / 1000000,
                                  labelGroup = g.Key.GrupoDeGasto,
                                  periodo = (int)g.Key.Periodo.Value,
                          ***REMOVED***).ToList();
            ***REMOVED***
                else
                {
                    query1 = (from pre in _connection.VwPresupuesto
                                  //where (pre.Periodo >= min && pre.Periodo<=max) //datos del año anterior al seleccionado
                              where filtro.Contains(pre.Periodo.Value)
                              group pre by new { pre.Periodo, pre.GrupoDeGasto ***REMOVED*** into g
                              from q0 in ((from pre in _connection.VwPresupuesto
                                           where pre.Periodo == anyo ///top del presupuesto del año seleccionado
                                           group pre by new { pre.GrupoDeGasto ***REMOVED*** into h
                                           select new InfoConsolidadoPresupuesto
                                           {
                                               rawValue = (decimal)(h.Sum(h => h.EjecucionDelMes)),
                                               labelGroup = h.Key.GrupoDeGasto
                                       ***REMOVED***).OrderByDescending(h => h.rawValue).Take(4))
                                           .Where(j => j.labelGroup == g.Key.GrupoDeGasto) //inner join
                              select new InfoConsolidadoPresupuesto
                              {
                                  rawValue = (decimal)g.Sum(g => g.EjecucionDelMes) / 1000000,
                                  labelGroup = g.Key.GrupoDeGasto,
                                  periodo = (int)g.Key.Periodo.Value,
                          ***REMOVED***).ToList();

            ***REMOVED***


                objReturn = query1.OrderByDescending(x => x.periodo).ThenBy(n => n.rawValue).ToList();
                foreach (var item in objReturn)
                {
                    //calculo porcentaje
                    var objTotalPeriodo = queryTotal.Find(p => p.periodo == item.periodo);
                    if (objTotalPeriodo != null)
                    {
                        item.porcentaje = Math.Round((item.rawValue / objTotalPeriodo.rawValue) * 100, 2);
                ***REMOVED***
            ***REMOVED***

            return objReturn;

    ***REMOVED***

        public List<InfoEntidad> ObtenerEntidadesPlanNacional()
        {
            List<InfoEntidad> objReturn = new List<InfoEntidad>();
            var entidadesPlanNacional = (from info in _connection.CatalogoEntidades
                                         where info.Institucion!=null && !info.Institucion.ToUpper().Contains("ALCALD")
                                         select new InfoEntidad
                                         {
                                             CodEntidad = info.CodigoInstitucion,
                                             Nombre = info.Institucion,
                                     ***REMOVED***
                                         ).Distinct().OrderBy(x => x.Nombre).ToList();
            objReturn = new List<InfoEntidad>(entidadesPlanNacional.Count > 6 ? entidadesPlanNacional.OrderBy(x => x.Nombre).Take(6) : entidadesPlanNacional.OrderBy(x => x.Nombre));
            return objReturn;
    ***REMOVED***

    /// <summary>
    /// Entidades que hacen parte del plan nacional de desarrollo sin alcaldías
    /// </summary>
    /// <returns>Un listado con las entidades relacionadas con el plan Nacional de desarrollo sin alcaldías</returns>
    public List<InfoEntidad> ObtenerEntidadesPlanNacionalNoAlcaldias()
    {
      List<InfoEntidad> objReturn = new List<InfoEntidad>();
      var entidadesPlanNacional = (from info in _connection.CatalogoEntidades
                                   where info.Institucion != null && !info.Institucion.ToUpper().Contains("ALCALD")
                                   select new InfoEntidad
                                   {
                                     CodEntidad = info.CodigoInstitucion,
                                     Nombre = info.Institucion,
                               ***REMOVED***
                                   ).Distinct().OrderBy(x => x.Nombre).ToList();
      objReturn = new List<InfoEntidad>(entidadesPlanNacional.Count > 6 ? entidadesPlanNacional.OrderBy(x => x.Nombre).Take(6) : entidadesPlanNacional.OrderBy(x => x.Nombre));
      return objReturn;
***REMOVED***

    public List<infograficoGasto> GetInfograficoPerGasto(int annio)
        {
            var objReturn = new List<infograficoGasto>();

            var infoQuery = (from info in _connection.VwPresupuesto
                             where info.Periodo==annio
                             group info by new { 
                                 info.CodigoGrupoDeGasto
                                 ,info.GrupoDeGasto
                                 ,info.CodigoInstitucion
                                 ,info.Institucion
                                 ,info.CodigoActividadObra
                                 ,info.ActividadObra 
                         ***REMOVED*** into g
                             select new
                             {
                                 IdCodGrupo = g.Key.CodigoGrupoDeGasto,
                                 GrupoGasto = "grp|" + g.Key.GrupoDeGasto,
                                 IdEntidad = g.Key.CodigoInstitucion,
                                 NombreEntidad = "ent|" + g.Key.Institucion,
                                 IdActividad = g.Key.CodigoActividadObra,
                                 NombreActividad = "act|" + g.Key.ActividadObra,
                                 AportePresupuesto = (g.Sum(g => g.Vigente.Value)),
                                 Avance = (g.Sum(g => g.EjecucionDelMes.Value))
                         ***REMOVED***
                            ).Distinct().OrderBy(x => x.GrupoGasto).
                                    ThenBy(x => x.NombreEntidad).
                                    ThenBy(x => x.NombreActividad).ToList();

            infograficoGasto objGasto = null;
            infograficoEntidad objEntidad = null;
            infograficoActividad objActividad = null;
            double total = 0;

            foreach (var fila in infoQuery)
            {
                objGasto = objReturn.Find(p => p.Id == fila.IdCodGrupo.ToString());
                if (objGasto == null)
                {
                    objGasto = new infograficoGasto();
                    objGasto.Id = fila.IdCodGrupo.ToString();
                    objGasto.Nombre = fila.GrupoGasto;
                    objGasto.presupuesto = fila.AportePresupuesto;
                    objGasto.avance = fila.Avance;

                    objEntidad = objGasto.Detalles.Find(p => p.Id == fila.IdEntidad.ToString());
                    if (objEntidad == null)
                    {
                        objEntidad = new infograficoEntidad();
                        objEntidad.Id = fila.IdEntidad.ToString();
                        objEntidad.Nombre = fila.NombreEntidad;
                        objEntidad.presupuesto = fila.AportePresupuesto;
                        objEntidad.avance = fila.Avance;

                        objActividad = objEntidad.Detalles.Find(p => p.Id == fila.IdActividad.ToString());
                        if (objActividad == null)
                        {
                            objActividad = new infograficoActividad();
                            objActividad.Id = fila.IdActividad.ToString();
                            objActividad.Nombre = fila.NombreActividad;
                            objActividad.presupuesto = fila.AportePresupuesto;
                            objActividad.avance = fila.Avance;

                            objEntidad.Detalles.Add(objActividad);

                    ***REMOVED***
                        else
                        {
                            objActividad.presupuesto += fila.AportePresupuesto;
                            objActividad.avance += fila.Avance;

                    ***REMOVED***

                        objGasto.Detalles.Add(objEntidad);
                ***REMOVED***
                    else
                    {
                        objEntidad.presupuesto += fila.AportePresupuesto;
                        objEntidad.avance += fila.Avance;

                        objActividad = objEntidad.Detalles.Find(p => p.Id == fila.IdActividad.ToString());
                        if (objActividad == null)
                        {
                            objActividad = new infograficoActividad();
                            objActividad.Id = fila.IdActividad.ToString();
                            objActividad.Nombre = fila.NombreActividad;
                            objActividad.presupuesto =fila.AportePresupuesto;
                            objActividad.avance = fila.Avance;

                            objEntidad.Detalles.Add(objActividad);

                    ***REMOVED***
                        else
                        {
                            objActividad.presupuesto += fila.AportePresupuesto;
                            objActividad.avance += fila.Avance;
                    ***REMOVED***

                ***REMOVED***

                    objReturn.Add(objGasto);
            ***REMOVED***
                else
                {
                    objGasto.presupuesto += fila.AportePresupuesto;
                    objGasto.avance += fila.Avance;
                    objEntidad = objGasto.Detalles.Find(p => p.Id == fila.IdEntidad.ToString());
                    if (objEntidad == null)
                    {
                        objEntidad = new infograficoEntidad();
                        objEntidad.Id = fila.IdEntidad.ToString();
                        objEntidad.Nombre = fila.NombreEntidad;
                        objEntidad.presupuesto = fila.AportePresupuesto;
                        objEntidad.avance = fila.Avance;

                        objActividad = objEntidad.Detalles.Find(p => p.Id == fila.IdActividad.ToString());
                        if (objActividad == null)
                        {
                            objActividad = new infograficoActividad();
                            objActividad.Id = fila.IdActividad.ToString();
                            objActividad.Nombre = fila.NombreActividad;
                            objActividad.presupuesto = fila.AportePresupuesto;
                            objActividad.avance = fila.Avance;

                            objEntidad.Detalles.Add(objActividad);

                    ***REMOVED***
                        else
                        {
                            objActividad.presupuesto += fila.AportePresupuesto;
                            objActividad.avance += fila.Avance;

                    ***REMOVED***

                        objGasto.Detalles.Add(objEntidad);
                ***REMOVED***
                    else
                    {
                        objEntidad.presupuesto += fila.AportePresupuesto;
                        objEntidad.avance += fila.Avance;

                        objActividad = objEntidad.Detalles.Find(p => p.Id == fila.IdActividad.ToString());
                        if (objActividad == null)
                        {
                            objActividad = new infograficoActividad();
                            objActividad.Id = fila.IdActividad.ToString();
                            objActividad.Nombre = fila.NombreActividad;
                            objActividad.presupuesto = fila.AportePresupuesto;
                            objActividad.avance = fila.Avance;

                            objEntidad.Detalles.Add(objActividad);

                    ***REMOVED***
                        else
                        {
                            objActividad.presupuesto += fila.AportePresupuesto;
                            objActividad.avance += fila.Avance;
                    ***REMOVED***

                ***REMOVED***


            ***REMOVED***
        ***REMOVED***

            ///ordena primer nivel gasto
            var result = objReturn.OrderByDescending(x => x.presupuesto).ToList();
            foreach (var item in result)
            {
                //ordena nivel entidad
                item.Detalles = item.Detalles.OrderByDescending(x => x.presupuesto).ToList();
                foreach (var item_actividad in item.Detalles)
                {
                    //ordena nivel actividad
                    item_actividad.Detalles = item_actividad.Detalles.OrderByDescending(x => x.presupuesto).ToList();
            ***REMOVED***
        ***REMOVED***
            return result;

    ***REMOVED***

        public List<infograficoGasto> GetInfograficoPerEntidad(int annio)
        {
            var objReturn = new List<infograficoGasto>();

            var infoQuery = (from info in _connection.VwPresupuesto
                             where info.Periodo == annio
                             group info by new
                             {
                                 info.CodigoGrupoDeGasto,
                                 info.GrupoDeGasto,
                                 info.CodigoInstitucion,
                                 info.Institucion,
                                 info.CodigoActividadObra,
                                 info.ActividadObra
                         ***REMOVED*** into g
                             select new
                             {
                                 IdCodGrupo = g.Key.CodigoGrupoDeGasto,
                                 GrupoGasto = "grp|" + g.Key.GrupoDeGasto,
                                 IdEntidad = g.Key.CodigoInstitucion,
                                 NombreEntidad = "ent|" + g.Key.Institucion,
                                 IdActividad = g.Key.CodigoActividadObra,
                                 NombreActividad = "act|" + g.Key.ActividadObra,
                                 AportePresupuesto = (g.Sum(g => g.Vigente.Value)),
                                 Avance = (g.Sum(g => g.EjecucionDelMes.Value))
                         ***REMOVED***
                            ).Distinct().OrderBy(x => x.NombreEntidad).
                                    ThenBy(x => x.GrupoGasto).
                                    ThenBy(x => x.NombreActividad).ToList();

            //cambia orden por: entidad - gasto - actividad obra
            
            infograficoGasto objGasto = null;
            infograficoEntidad objEntidad = null;
            infograficoActividad objActividad = null;
            double total = 0;

            foreach (var fila in infoQuery)
            {
                objGasto = objReturn.Find(p => p.Id == fila.IdEntidad.ToString());
                if (objGasto == null)
                {
                    objGasto = new infograficoGasto();
                    objGasto.Id = fila.IdEntidad.ToString();
                    objGasto.Nombre = fila.NombreEntidad;
                    objGasto.presupuesto = fila.AportePresupuesto;
                    objGasto.avance = fila.Avance;

                    objEntidad = objGasto.Detalles.Find(p => p.Id == fila.IdCodGrupo.ToString());
                    if (objEntidad == null)
                    {
                        objEntidad = new infograficoEntidad();
                        objEntidad.Id = fila.IdCodGrupo.ToString();
                        objEntidad.Nombre = fila.GrupoGasto;
                        objEntidad.presupuesto = fila.AportePresupuesto;
                        objEntidad.avance = fila.Avance;

                        objActividad = objEntidad.Detalles.Find(p => p.Id == fila.IdActividad.ToString());
                        if (objActividad == null)
                        {
                            objActividad = new infograficoActividad();
                            objActividad.Id = fila.IdActividad.ToString();
                            objActividad.Nombre = fila.NombreActividad;
                            objActividad.presupuesto = fila.AportePresupuesto;
                            objActividad.avance = fila.Avance;

                            objEntidad.Detalles.Add(objActividad);

                    ***REMOVED***
                        else
                        {
                            objActividad.presupuesto += fila.AportePresupuesto;
                            objActividad.avance += fila.Avance;

                    ***REMOVED***

                        objGasto.Detalles.Add(objEntidad);
                ***REMOVED***
                    else
                    {
                        objEntidad.presupuesto += fila.AportePresupuesto;
                        objEntidad.avance += fila.Avance;

                        objActividad = objEntidad.Detalles.Find(p => p.Id == fila.IdActividad.ToString());
                        if (objActividad == null)
                        {
                            objActividad = new infograficoActividad();
                            objActividad.Id = fila.IdActividad.ToString();
                            objActividad.Nombre = fila.NombreActividad;
                            objActividad.presupuesto = fila.AportePresupuesto;
                            objActividad.avance = fila.Avance;

                            objEntidad.Detalles.Add(objActividad);

                    ***REMOVED***
                        else
                        {
                            objActividad.presupuesto += fila.AportePresupuesto;
                            objActividad.avance += fila.Avance;
                    ***REMOVED***

                ***REMOVED***

                    objReturn.Add(objGasto);
            ***REMOVED***
                else
                {
                    objGasto.presupuesto += fila.AportePresupuesto;
                    objGasto.avance += fila.Avance;
                    objEntidad = objGasto.Detalles.Find(p => p.Id == fila.IdCodGrupo.ToString());
                    if (objEntidad == null)
                    {
                        objEntidad = new infograficoEntidad();
                        objEntidad.Id = fila.IdCodGrupo.ToString();
                        objEntidad.Nombre = fila.GrupoGasto;
                        objEntidad.presupuesto = fila.AportePresupuesto;
                        objEntidad.avance = fila.Avance;

                        objActividad = objEntidad.Detalles.Find(p => p.Id == fila.IdActividad.ToString());
                        if (objActividad == null)
                        {
                            objActividad = new infograficoActividad();
                            objActividad.Id = fila.IdActividad.ToString();
                            objActividad.Nombre = fila.NombreActividad;
                            objActividad.presupuesto = fila.AportePresupuesto;
                            objActividad.avance = fila.Avance;

                            objEntidad.Detalles.Add(objActividad);

                    ***REMOVED***
                        else
                        {
                            objActividad.presupuesto += fila.AportePresupuesto;
                            objActividad.avance += fila.Avance;

                    ***REMOVED***

                        objGasto.Detalles.Add(objEntidad);
                ***REMOVED***
                    else
                    {
                        objEntidad.presupuesto += fila.AportePresupuesto;
                        objEntidad.avance += fila.Avance;

                        objActividad = objEntidad.Detalles.Find(p => p.Id == fila.IdActividad.ToString());
                        if (objActividad == null)
                        {
                            objActividad = new infograficoActividad();
                            objActividad.Id = fila.IdActividad.ToString();
                            objActividad.Nombre = fila.NombreActividad;
                            objActividad.presupuesto = fila.AportePresupuesto;
                            objActividad.avance = fila.Avance;

                            objEntidad.Detalles.Add(objActividad);

                    ***REMOVED***
                        else
                        {
                            objActividad.presupuesto += fila.AportePresupuesto;
                            objActividad.avance += fila.Avance;
                    ***REMOVED***

                ***REMOVED***


            ***REMOVED***
        ***REMOVED***

            ///ordena primer nivel gasto
            var result = objReturn.OrderByDescending(x => x.presupuesto).ToList();
            foreach (var item in result)
            {
                //ordena nivel entidad
                item.Detalles = item.Detalles.OrderByDescending(x => x.presupuesto).ToList();
                foreach (var item_actividad in item.Detalles)
                {
                    //ordena nivel actividad
                    item_actividad.Detalles = item_actividad.Detalles.OrderByDescending(x => x.presupuesto).ToList();
            ***REMOVED***
        ***REMOVED***
            return result;

    ***REMOVED***

        public List<InfoPresupuesto> GetComparativePerVersiones(List<int> filtro, int anyo)
        {
           List<InfoPresupuesto> objReturn = new List<InfoPresupuesto>();

            var queryTotal = (from info in _connection.VwPresupuestoVersiones
                              where info.AnioPresupuesto == anyo
                              where filtro.Contains(info.CodigoVersion.Value)
                              orderby info.Presupuesto descending
                              group info by new { info.NombreVersion ***REMOVED*** into g
                              select new InfoPresupuesto
                              {
                                  rawValue = (decimal)(g.Sum(g => g.Presupuesto) / 1000000),
                                  labelGroup = g.Key.NombreVersion

                          ***REMOVED***).OrderByDescending(g => g.rawValue).ToList();

            objReturn = (from info in _connection.VwPresupuestoVersiones
                             where info.AnioPresupuesto == anyo                              
                             where filtro.Contains(info.CodigoVersion.Value)
                             orderby info.Presupuesto descending
                             group info by new { info.Sectores, info.NombreVersion ***REMOVED*** into g
                         from q0 in ((from pre in _connection.VwPresupuestoVersiones
                                      where pre.AnioPresupuesto == anyo ///top del presupuesto del año seleccionado
                                      where filtro.Contains(pre.CodigoVersion.Value)
                                      group pre by new { pre.Sectores ***REMOVED*** into h
                                      select new InfoRecAsignadosPresupuesto
                                      {
                                          rawValue = (decimal)(h.Sum(h => h.Presupuesto)),
                                          labelGroup = h.Key.Sectores
                                  ***REMOVED***).OrderByDescending(h => h.rawValue).Take(4))
                                    .Where(j => j.labelGroup == g.Key.Sectores) //inner join
                         select new InfoPresupuesto
                             {
                                 rawValue = (decimal)(g.Sum(g => g.Presupuesto) / 1000000),
                                 label = g.Key.Sectores,
                                 labelGroup = g.Key.NombreVersion
                                 
                         ***REMOVED***).OrderByDescending(g => g.rawValue).ToList();

            foreach (var item in objReturn)
            {
                //calculo porcentaje
                var objTotalVersion = queryTotal.Find(p => p.labelGroup == item.labelGroup);
                if (objTotalVersion != null)
                {
                    item.porcentaje = Math.Round((item.rawValue / objTotalVersion.rawValue) * 100, 2);
            ***REMOVED***



        ***REMOVED***


            return objReturn;

    ***REMOVED***

        public List<InfoConsolidadoPresupuesto> ObtenerInfoPerFuncionesGob(List<int> filtro, int anyo,List<string>filtro_func)
        {
            List<InfoConsolidadoPresupuesto> objReturn = new List<InfoConsolidadoPresupuesto>();
            List<InfoConsolidadoPresupuesto> query1 = new List<InfoConsolidadoPresupuesto>();
                var queryTotal = (from pre in _connection.VwPresupuesto
                              where filtro.Contains(pre.Periodo.Value)
                              group pre by new { pre.Periodo***REMOVED*** into g
                              select new InfoConsolidadoPresupuesto
                              {
                                  rawValue = (decimal)g.Sum(g => g.Aprobado) / 1000000,
                                  periodo = (int)g.Key.Periodo.Value,
                          ***REMOVED***).ToList();


            if (filtro_func.Count>0)
            {
                query1 = (from pre in _connection.VwPresupuesto
                              where filtro.Contains(pre.Periodo.Value) && filtro_func.Contains(pre.Funcion)
                              group pre by new { pre.Periodo, pre.Funcion ***REMOVED*** into g
                              select new InfoConsolidadoPresupuesto
                              {
                                  rawValue = (decimal)g.Sum(g => g.Aprobado) / 1000000,
                                  labelGroup = g.Key.Funcion,
                                  periodo = (int)g.Key.Periodo.Value,
                          ***REMOVED***).ToList();

        ***REMOVED***
            else 
            {
                query1 = (from pre in _connection.VwPresupuesto
                              where filtro.Contains(pre.Periodo.Value)
                              group pre by new { pre.Periodo, pre.Funcion ***REMOVED*** into g
                              from q0 in ((from pre in _connection.VwPresupuesto
                                           where pre.Periodo == anyo ///top del presupuesto del año seleccionado
                                           group pre by new { pre.Funcion ***REMOVED*** into h
                                           select new InfoConsolidadoPresupuesto
                                           {
                                               rawValue = (decimal)(h.Sum(h => h.Aprobado)),
                                               labelGroup = h.Key.Funcion
                                       ***REMOVED***).OrderByDescending(h => h.rawValue).Take(4))
                                           .Where(j => j.labelGroup == g.Key.Funcion) //inner join
                              select new InfoConsolidadoPresupuesto
                              {
                                  rawValue = (decimal)g.Sum(g => g.Aprobado) / 1000000,
                                  labelGroup = g.Key.Funcion,
                                  periodo = (int)g.Key.Periodo.Value,
                          ***REMOVED***).ToList();


        ***REMOVED***

               

                objReturn = query1.OrderByDescending(x => x.periodo).ThenBy(n => n.rawValue).ToList();
                foreach (var item in objReturn)
                {
                    //calculo porcentaje
                    var objTotalPeriodo = queryTotal.Find(p => p.periodo == item.periodo);
                    if (objTotalPeriodo != null)
                    {
                        item.porcentaje = Math.Round((item.rawValue / objTotalPeriodo.rawValue)*100, 2);
                ***REMOVED***
                    
                    
                    
            ***REMOVED***


            

            return objReturn;

    ***REMOVED***

        public List<InformationGraphics> ObtenerFuncionesPerNombre(string texto, int anyo)
        {
            List<InformationGraphics> _objreturn = new List<InformationGraphics>();
            if (texto != null)
            {
                _objreturn = (from cont in _connection.VwPresupuesto
                              where cont.Periodo == anyo && (cont.Funcion.Contains(texto))
                              group cont by cont.Funcion into g
                              select new InformationGraphics
                              {
                                  label = g.Key
                          ***REMOVED***).Distinct().ToList();
        ***REMOVED***
            else {
                _objreturn = (from cont in _connection.VwPresupuesto
                              where cont.Periodo == anyo
                              group cont by cont.Funcion into g
                              select new InformationGraphics
                              {
                                  label = g.Key
                          ***REMOVED***).Distinct().ToList();

        ***REMOVED***
            

            return _objreturn;

    ***REMOVED***

        public List<InformationGraphics> ObtenerGrupoGastoPerNombre(int anyo)
        {
            List<InformationGraphics> _objreturn = new List<InformationGraphics>();
                _objreturn = (from cont in _connection.VwPresupuesto
                              where cont.Periodo == anyo
                              group cont by cont.GrupoDeGasto into g
                              select new InformationGraphics
                              {
                                  label = g.Key
                          ***REMOVED***).Distinct().ToList();

           

            return _objreturn;

    ***REMOVED***

***REMOVED***
***REMOVED***
