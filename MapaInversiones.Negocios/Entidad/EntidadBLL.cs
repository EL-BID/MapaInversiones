using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Modelos.Plan;
using PlataformaTransparencia.Negocios;
using PlataformaTransparencia.Negocios.BLL.Contracts;
using PlataformaTransparencia.Negocios.Home;
using SolrNet;
using SolrNet.Commands.Parameters;

namespace PlataformaTransparencia.Negocios.Entidad
{
  public class EntidadBLL : IEntidadBLL
  {
    private readonly TransparenciaDB _connection;

    public EntidadBLL(TransparenciaDB connection)
    {
      _connection = connection;
***REMOVED***

    private string ConvertirTextoMayusculaMinuscula(string texto)
    {
      if (texto == string.Empty || texto=="*") return string.Empty;
      texto = texto.ToLower();
      var primeraLetra = texto.Substring(0, 1);
      texto = texto.Remove(0, 1);
      texto = primeraLetra.ToUpper() + texto;
      return texto;
***REMOVED***

        public List<infograficoPrograma> GetProgramasByEntidad(int annio,int codEntidad) {
            List<infograficoPrograma> objReturn = new List<infograficoPrograma>();
            var RecursosPerObjetoQuery = (from a in _connection.VwPresupuesto
                                          where a.Periodo==annio && a.CodigoInstitucion == codEntidad
                                          group a by new {a.CodigoPrograma,a.Programa ***REMOVED*** into g
                                          select new infograficoPrograma
                                          {
                                                Id=g.Key.CodigoPrograma.Value,
                                                Nombre=g.Key.Programa
                                      ***REMOVED***).ToList();

             objReturn = RecursosPerObjetoQuery;

            return objReturn;
        
        
    ***REMOVED***

        public List<infograficoActividad> GetActividadByPrograma(int annio, string codEntidad, int codPrograma)
        {
            List<infograficoActividad> objReturn = new List<infograficoActividad>();

            var query1 = (from pre in _connection.VwPresupuesto
                          where (pre.Periodo == annio && Convert.ToInt32(pre.CodigoInstitucion)== Convert.ToInt32(codEntidad) && pre.CodigoPrograma== Convert.ToInt32(codPrograma))
                          group pre by new {pre.Periodo,pre.CodigoInstitucion,pre.CodigoPrograma,pre.CodigoSubPrograma,pre.CodigoActividadObra,pre.ActividadObra,pre.CodigoObjetoDeGasto ***REMOVED*** into g
                          select new 
                          {
                              periodo=g.Key.Periodo,
                              codInstitucion= Convert.ToInt32(g.Key.CodigoInstitucion),
                              codPrograma=g.Key.CodigoPrograma,
                              codSubprograma=g.Key.CodigoSubPrograma,
                              codActividad=g.Key.CodigoActividadObra,
                              nomActividad= g.Key.ActividadObra,
                              codObjeto=g.Key.CodigoObjetoDeGasto,
                              asignado=(decimal)g.Sum(t => t.Vigente) / 1000000,
                      ***REMOVED***);


            var query2 = (from x in _connection.VWContratosXPresupuestoes
                          where (x.Periodo == annio && Convert.ToInt32(x.CodigoInstitucion) == Convert.ToInt32(codEntidad) && x.CodigoPrograma == codPrograma)
                          group x by new {x.Periodo,x.CodigoInstitucion,x.CodigoPrograma,x.CodigoSubPrograma, x.CodigoActividadObra,x.CodigoObjetoDeGasto,x.Ocid,x.IdBudget ***REMOVED*** into g
                          select new 
                          {
                              periodo = g.Key.Periodo,
                              codInstitucion = Convert.ToInt32(g.Key.CodigoInstitucion),
                              codPrograma = g.Key.CodigoPrograma,
                              codSubprograma = g.Key.CodigoSubPrograma,
                              codActividad = g.Key.CodigoActividadObra,
                              codObjeto = g.Key.CodigoObjetoDeGasto,
                              ocid =g.Key.Ocid,
                              contrato=g.Key.IdBudget

                      ***REMOVED***);


            var query3 = (from presupuesto in query1
                          from contratos in query2.Where(j => j.periodo == presupuesto.periodo)
                             .Where(j => j.codInstitucion == presupuesto.codInstitucion)
                             .Where(j => j.codPrograma == presupuesto.codPrograma)
                             .Where(j => j.codActividad == presupuesto.codActividad)
                             .Where(j => j.codObjeto == presupuesto.codObjeto)
                          from detalle in _connection.VwContratosDetalles
                          .Where(j => j.CodigoProceso == contratos.ocid)
                          select new
                          {
                            codActividad=presupuesto.codActividad,
                            nomActividad="act|" + presupuesto.nomActividad,
                            codProceso=contratos.ocid,
                            descProceso="proc|" + detalle.DescripcionProceso,
                            estadoProceso=detalle.EstadoProceso,
                            codContrato="contr|" + detalle.CodigoContrato,
                            AportePresupuesto = detalle.ValorAdjudicado.Value

                      ***REMOVED***
                          ).Distinct().OrderBy(x => x.nomActividad).
                                    ThenBy(x => x.codProceso).
                                    ThenBy(x => x.codContrato).ToList();


            infograficoActividad objActividad = null;
            infograficoProcesos objProcesos = null;
            infograficoContratos objContratos = null;

            foreach (var fila in query3)
            {
                objActividad = objReturn.Find(p => p.Id == fila.codActividad.ToString());
                if (objActividad == null)
                {
                    objActividad = new infograficoActividad();
                    objActividad.Id = fila.codActividad.ToString();
                    objActividad.Nombre = fila.nomActividad;
                    objActividad.presupuesto = fila.AportePresupuesto;
                    //objActividad.avance = fila.Avance;

                    objProcesos = objActividad.Detalles.Find(p => p.Id == fila.codActividad.ToString());
                    if (objProcesos == null)
                    {
                        objProcesos = new infograficoProcesos();
                        objProcesos.Id = fila.codProceso.ToString();
                        objProcesos.Nombre = fila.descProceso;
                        objProcesos.presupuesto = fila.AportePresupuesto;
                        objProcesos.Estado = fila.estadoProceso;
                        //objProcesos.avance = fila.Avance;

                        objContratos = objProcesos.Detalles.Find(p => p.Id == fila.codContrato.ToString());
                        if (objContratos == null)
                        {
                            objContratos = new infograficoContratos();
                            objContratos.Id = fila.codContrato.ToString();
                            objContratos.Nombre = fila.codContrato;
                            objContratos.presupuesto = fila.AportePresupuesto;
                            //objContratos.avance = fila.Avance;

                            objProcesos.Detalles.Add(objContratos);

                    ***REMOVED***
                        else
                        {
                            objContratos.presupuesto += fila.AportePresupuesto;
                            //objContratos.avance += fila.Avance;

                    ***REMOVED***

                        objActividad.Detalles.Add(objProcesos);
                ***REMOVED***
                    else
                    {
                        objProcesos.presupuesto += fila.AportePresupuesto;
                        //objProcesos.avance += fila.Avance;

                        objContratos = objProcesos.Detalles.Find(p => p.Id == fila.codContrato.ToString());
                        if (objContratos == null)
                        {
                            objContratos = new infograficoContratos();
                            objContratos.Id = fila.codContrato;
                            objContratos.Nombre = fila.codContrato;
                            objContratos.presupuesto = fila.AportePresupuesto;
                            //objContratos.avance = fila.Avance;
                                    
                            objProcesos.Detalles.Add(objContratos);

                    ***REMOVED***
                        else
                        {
                            objContratos.presupuesto += fila.AportePresupuesto;
                            //objContratos.avance += fila.Avance;
                    ***REMOVED***

                ***REMOVED***

                    objReturn.Add(objActividad);
            ***REMOVED***
                else
                {
                    objActividad.presupuesto += fila.AportePresupuesto;
                    objProcesos = objActividad.Detalles.Find(p => p.Id == fila.codProceso.ToString());
                    if (objProcesos == null)
                    {
                        objProcesos = new infograficoProcesos();
                        objProcesos.Id = fila.codProceso.ToString();
                        objProcesos.Nombre = fila.descProceso;
                        objProcesos.presupuesto = fila.AportePresupuesto;
                        objProcesos.Estado = fila.estadoProceso;
                        //objProcesos.avance = fila.Avance;

                        objContratos = objProcesos.Detalles.Find(p => p.Id == fila.codContrato.ToString());
                        if (objContratos == null)
                        {
                            objContratos = new infograficoContratos();
                            objContratos.Id = fila.codContrato;
                            objContratos.Nombre = fila.codContrato;
                            objContratos.presupuesto = fila.AportePresupuesto;
                            //objContratos.avance = fila.Avance;

                            objProcesos.Detalles.Add(objContratos);

                    ***REMOVED***
                        else
                        {
                            objContratos.presupuesto += fila.AportePresupuesto;
                            //objContratos.avance += fila.Avance;

                    ***REMOVED***

                        objActividad.Detalles.Add(objProcesos);
                ***REMOVED***
                    else
                    {
                        objProcesos.presupuesto += fila.AportePresupuesto;
                        objContratos = objProcesos.Detalles.Find(p => p.Id == fila.codContrato);
                        if (objContratos == null)
                        {
                            objContratos = new infograficoContratos();
                            objContratos.Id = fila.codContrato.ToString();
                            objContratos.Nombre = fila.codContrato;
                            objContratos.presupuesto = fila.AportePresupuesto;
                            //objContratos.avance = fila.Avance;

                            objProcesos.Detalles.Add(objContratos);

                    ***REMOVED***
                        else
                        {
                            objContratos.presupuesto += fila.AportePresupuesto;
                            //objContratos.avance += fila.Avance;
                    ***REMOVED***

                ***REMOVED***


            ***REMOVED***
        ***REMOVED***

            ///ordena primer nivel actividad
            var result = objReturn.OrderByDescending(x => x.presupuesto).ToList();
            foreach (var item in result)
            {
                //ordena nivel proceso
                item.Detalles = item.Detalles.OrderByDescending(x => x.presupuesto).ToList();
                foreach (var item_actividad in item.Detalles)
                {
                    //ordena nivel cont
                    item_actividad.Detalles = item_actividad.Detalles.OrderByDescending(x => x.presupuesto).ToList();
            ***REMOVED***
        ***REMOVED***
            return result;



    ***REMOVED***


        public infograficoEntidad GetGastoByPrograma(int annio, int codEntidad, int codPrograma,string estado, string proceso)
        {
            String estado_aux = null;
            String proceso_aux = null;
            if (proceso != null && proceso.Trim() != "") { proceso_aux = proceso; ***REMOVED***
            if (estado != null && estado.Trim() != "") { estado_aux = estado; ***REMOVED***


            infograficoEntidad objReturn = new infograficoEntidad();

            var query1 = (from pre in _connection.VwPresupuesto
                          where (pre.Periodo == annio && pre.CodigoInstitucion== codEntidad && pre.CodigoPrograma == codPrograma)
                          group pre by new { pre.Periodo, pre.CodigoInstitucion, pre.CodigoPrograma, pre.CodigoSubPrograma,pre.CodigoActividadObra, pre.CodigoGrupoDeGasto, pre.GrupoDeGasto, pre.CodigoObjetoDeGasto ***REMOVED*** into g
                          select new
                          {
                              periodo = g.Key.Periodo,
                              codInstitucion = g.Key.CodigoInstitucion.Value,
                              codPrograma = g.Key.CodigoPrograma,
                              codSubprograma = g.Key.CodigoSubPrograma,
                              codGrupoGasto = g.Key.CodigoGrupoDeGasto,
                              nomGrupoGasto = g.Key.GrupoDeGasto,
                              codActividad= g.Key.CodigoActividadObra,
                              codObjeto = g.Key.CodigoObjetoDeGasto,
                              vigente = (decimal)g.Sum(t => t.Vigente),
                              ejecutado=(decimal)g.Sum(t=>t.EjecucionDelMes)
                      ***REMOVED***);
            
           

            var query2 = (from x in _connection.VWContratosXPresupuestoes
                          where (x.Periodo == annio && x.CodigoInstitucion == codEntidad && x.CodigoPrograma == codPrograma)
                          group x by new { x.Periodo, x.CodigoInstitucion, x.CodigoPrograma, x.CodigoSubPrograma, x.CodigoActividadObra,x.CodigoObjetoDeGasto, x.Ocid, x.IdBudget ***REMOVED*** into g
                          select new
                          {
                              periodo = g.Key.Periodo,
                              codInstitucion = g.Key.CodigoInstitucion.Value,
                              codPrograma = g.Key.CodigoPrograma,
                              codSubprograma = g.Key.CodigoSubPrograma,
                              codActividad = g.Key.CodigoActividadObra,
                              codObjeto = g.Key.CodigoObjetoDeGasto,
                              ocid = g.Key.Ocid,
                              contrato = g.Key.IdBudget

                      ***REMOVED***);

            var query3 = (from presupuesto in query1
                          from contratos in query2.Where(j => j.periodo == presupuesto.periodo)
                             .Where(j => j.codInstitucion == presupuesto.codInstitucion)
                             .Where(j => j.codPrograma == presupuesto.codPrograma)
                             .Where(j => j.codActividad == presupuesto.codActividad)
                             .Where(j => j.codObjeto == presupuesto.codObjeto)
                          from detalle in _connection.VwContratosDetalles
                          //where (detalle.EstadoProceso.Contains(estado_aux) || estado_aux == null)
                          .Where(j => j.CodigoProceso == contratos.ocid)
                          .Where(j=>j.DescripcionProceso.Contains(proceso_aux) || proceso_aux == null)
                          .Where(j => j.EstadoProceso.Contains(estado_aux) || estado_aux == null)
                          .Where (j=>j.OrigenInformacion.ToUpper().Contains("SEFIN"))
                          select new
                          {
                              codGrupoGasto = presupuesto.codGrupoGasto,
                              nomGrupoGasto = "grp|" + presupuesto.nomGrupoGasto,
                              codProceso = contratos.ocid,
                              descProceso = "proc|" + detalle.DescripcionProceso,
                              estadoProceso = detalle.EstadoProceso,
                              codContrato = "contr|" + detalle.CodigoContrato,
                              AportePresupuesto = detalle.ValorAdjudicado.Value,
                              MonedaContrato=detalle.MonedaContrato,
                              UrlProceso=detalle.DocURL,
                              ValorPlaneado=detalle.ValorPlaneado,
                              ValorAdjudicado=detalle.ValorAdjudicado,
                              ValorContratado=detalle.ValorContratado,
                              Contratista=detalle.Contratista, 
                              CodigoProveedor=detalle.CodigoProveedor
                      ***REMOVED***
                          ).Distinct().OrderBy(x => x.nomGrupoGasto).
                                    ThenBy(x => x.codProceso).
                                    ThenBy(x => x.codContrato).ToList();


            var queryInfo = (from info in query1
                             group info by new { info.codGrupoGasto, info.nomGrupoGasto ***REMOVED*** into g
                             select new
                          {
                              codGrupoGasto = g.Key.codGrupoGasto,
                              nomGrupoGasto = "grp|" + g.Key.nomGrupoGasto,
                              vigente= (decimal)g.Sum(t => t.vigente),
                              ejecutado= (decimal)g.Sum(t => t.ejecutado)
                         ***REMOVED***
                          ).Distinct().OrderBy(x => x.nomGrupoGasto).ToList();


            List<string> estados = query3.Select(e => e.estadoProceso).Distinct().ToList();
                infograficoGrupoGasto objGrupo = null;
                infograficoProcesos objProcesos = null;
                infograficoContratos objContratos = null;

            foreach (var fila in queryInfo) {
                objGrupo = objReturn.infoGasto.Find(p => p.Id == fila.codGrupoGasto.ToString());
                    if (objGrupo == null)
                    {
                        objGrupo = new infograficoGrupoGasto();
                        objGrupo.Id = fila.codGrupoGasto.ToString();
                        objGrupo.Nombre = fila.nomGrupoGasto;
                        objGrupo.presupuesto = (double)fila.vigente;
                        objGrupo.ejecutado= (double)fila.ejecutado;


                    objReturn.infoGasto.Add(objGrupo);
                ***REMOVED***
                    else {
                        objGrupo.presupuesto += (double)fila.vigente;
                        objGrupo.ejecutado += (double)fila.ejecutado;
                ***REMOVED***

            ***REMOVED***

                foreach (var fila in query3)
                {
                    
                    objGrupo = objReturn.infoGasto.Find(p => p.Id == fila.codGrupoGasto.ToString());
                    if (objGrupo == null)
                    {
                        objGrupo = new infograficoGrupoGasto();
                        objGrupo.Id = fila.codGrupoGasto.ToString();
                        objGrupo.Nombre = fila.nomGrupoGasto;
                        //objGrupo.presupuesto = fila.AportePresupuesto;
                        //objGrupo.avance = fila.Avance;



                    objProcesos = objGrupo.Detalles.Find(p => p.Id == fila.codGrupoGasto.ToString());
                        if (objProcesos == null)
                        {
                            objProcesos = new infograficoProcesos();
                            objProcesos.Id = fila.codProceso.ToString();
                            objProcesos.Nombre = fila.descProceso;
                            objProcesos.presupuesto = fila.AportePresupuesto;
                            objProcesos.Estado = fila.estadoProceso;
                            objProcesos.UrlProceso = fila.UrlProceso;
                            //objProcesos.avance = fila.Avance;

                            objContratos = objProcesos.Detalles.Find(p => p.Id == fila.codContrato.ToString());
                            if (objContratos == null)
                            {
                                objContratos = new infograficoContratos();
                                objContratos.Id = fila.codContrato.ToString();
                                objContratos.Nombre = fila.codContrato;
                                objContratos.moneda = fila.MonedaContrato;
                                objContratos.contratista = fila.Contratista;
                                objContratos.proveedor = fila.CodigoProveedor;
                                objContratos.presupuesto = fila.AportePresupuesto;
                                objContratos.valor_planeado = fila.ValorPlaneado.Value;
                                objContratos.valor_adjudicado = fila.ValorAdjudicado.Value;
                                objContratos.valor_contratado = fila.ValorContratado.Value;
                                //objContratos.avance = fila.Avance;

                                objProcesos.Detalles.Add(objContratos);

                        ***REMOVED***
                            else
                            {
                                objContratos.presupuesto += fila.AportePresupuesto;
                                objContratos.valor_planeado += fila.ValorPlaneado.Value;
                                objContratos.valor_adjudicado += fila.ValorAdjudicado.Value;
                                objContratos.valor_contratado += fila.ValorContratado.Value;
                                //objContratos.avance += fila.Avance;

                        ***REMOVED***

                            objGrupo.Detalles.Add(objProcesos);
                    ***REMOVED***
                        else
                        {
                            objProcesos.presupuesto += fila.AportePresupuesto;
                            //objProcesos.avance += fila.Avance;

                            objContratos = objProcesos.Detalles.Find(p => p.Id == fila.codContrato.ToString());
                            if (objContratos == null)
                            {
                                objContratos = new infograficoContratos();
                                objContratos.Id = fila.codContrato.ToString();
                                objContratos.Nombre = fila.codContrato;
                                objContratos.moneda = fila.MonedaContrato;
                                objContratos.contratista = fila.Contratista;
                                objContratos.proveedor = fila.CodigoProveedor;
                                objContratos.presupuesto = fila.AportePresupuesto;
                                objContratos.valor_planeado = fila.ValorPlaneado.Value;
                                objContratos.valor_adjudicado = fila.ValorAdjudicado.Value;
                                objContratos.valor_contratado = fila.ValorContratado.Value;
                                //objContratos.avance = fila.Avance;

                                objProcesos.Detalles.Add(objContratos);

                        ***REMOVED***
                            else
                            {
                                objContratos.presupuesto += fila.AportePresupuesto;
                                objContratos.valor_planeado += fila.ValorPlaneado.Value;
                                objContratos.valor_adjudicado += fila.ValorAdjudicado.Value;
                                objContratos.valor_contratado += fila.ValorContratado.Value;
                                //objContratos.avance += fila.Avance;
                        ***REMOVED***

                    ***REMOVED***

                        objReturn.infoGasto.Add(objGrupo);
                ***REMOVED***
                    else
                    {
                        //objGrupo.presupuesto += fila.AportePresupuesto;
                        objProcesos = objGrupo.Detalles.Find(p => p.Id == fila.codProceso.ToString());
                        if (objProcesos == null)
                        {
                            objProcesos = new infograficoProcesos();
                            objProcesos.Id = fila.codProceso.ToString();
                            objProcesos.Nombre = fila.descProceso;
                            //objProcesos.presupuesto = fila.AportePresupuesto;
                            objProcesos.Estado = fila.estadoProceso;
                            objProcesos.UrlProceso = fila.UrlProceso;
                            //objProcesos.avance = fila.Avance;

                            objContratos = objProcesos.Detalles.Find(p => p.Id == fila.codContrato.ToString());
                            if (objContratos == null)
                            {
                                objContratos = new infograficoContratos();
                                objContratos.Id = fila.codContrato.ToString();
                                objContratos.Nombre = fila.codContrato;
                                objContratos.moneda = fila.MonedaContrato;
                                objContratos.contratista = fila.Contratista;
                                objContratos.proveedor = fila.CodigoProveedor;
                                objContratos.presupuesto = fila.AportePresupuesto;
                                objContratos.valor_planeado = fila.ValorPlaneado.Value;
                                objContratos.valor_adjudicado = fila.ValorAdjudicado.Value;
                                objContratos.valor_contratado = fila.ValorContratado.Value;
                                //objContratos.avance = fila.Avance;

                                objProcesos.Detalles.Add(objContratos);

                        ***REMOVED***
                            else
                            {
                                objContratos.presupuesto += fila.AportePresupuesto;
                                objContratos.valor_planeado += fila.ValorPlaneado.Value;
                                objContratos.valor_adjudicado += fila.ValorAdjudicado.Value;
                                objContratos.valor_contratado += fila.ValorContratado.Value;
                                //objContratos.avance += fila.Avance;

                        ***REMOVED***

                            objGrupo.Detalles.Add(objProcesos);
                    ***REMOVED***
                        else
                        {
                            objProcesos.presupuesto += fila.AportePresupuesto;
                            objContratos = objProcesos.Detalles.Find(p => p.Id == fila.codContrato);
                            if (objContratos == null)
                            {
                                objContratos = new infograficoContratos();
                                objContratos.Id = fila.codContrato.ToString();
                                objContratos.Nombre = fila.codContrato;
                                objContratos.moneda = fila.MonedaContrato;
                                objContratos.contratista = fila.Contratista;
                                objContratos.proveedor = fila.CodigoProveedor;
                                objContratos.presupuesto = fila.AportePresupuesto;
                                objContratos.valor_planeado = fila.ValorPlaneado.Value;
                                objContratos.valor_adjudicado = fila.ValorAdjudicado.Value;
                                objContratos.valor_contratado = fila.ValorContratado.Value;
                                //objContratos.avance = fila.Avance;

                                objProcesos.Detalles.Add(objContratos);

                        ***REMOVED***
                            else
                            {
                                objContratos.presupuesto += fila.AportePresupuesto;
                                objContratos.valor_planeado += fila.ValorPlaneado.Value;
                                objContratos.valor_adjudicado += fila.ValorAdjudicado.Value;
                                objContratos.valor_contratado += fila.ValorContratado.Value;
                                //objContratos.avance += fila.Avance;
                        ***REMOVED***

                    ***REMOVED***


                ***REMOVED***
            ***REMOVED***

                ///ordena primer nivel actividad
                var result = objReturn.infoGasto.OrderByDescending(x => x.presupuesto).ToList();
                foreach (var item in result)
                {
                    //ordena nivel proceso
                    item.Detalles = item.Detalles.OrderByDescending(x => x.presupuesto).ToList();
                    foreach (var item_actividad in item.Detalles)
                    {
                        //ordena nivel cont
                        item_actividad.Detalles = item_actividad.Detalles.OrderByDescending(x => x.presupuesto).ToList();
                ***REMOVED***
            ***REMOVED***

                objReturn.infoGasto = result;
                objReturn.programa.estados = estados;
                objReturn.programa.Id = codPrograma;
           

            return objReturn;

    ***REMOVED***

        public List<InfoConsolidadoPresupuesto> ObtenerRecursosPerGrupos(int annio,int codEntidad)
        {

            List<InfoConsolidadoPresupuesto> objReturn = new List<InfoConsolidadoPresupuesto>();
            var RecursosPerObjetoQuery = (from info in _connection.VwPresupuesto
                                          where info.Periodo == annio && info.CodigoInstitucion==codEntidad
                                          group info by new { info.GrupoDeGasto, info.ObjetoDeGasto ***REMOVED*** into g

                                          select new InfoConsolidadoPresupuesto
                                          {
                                              labelGroup = g.Key.GrupoDeGasto,
                                              label = g.Key.ObjetoDeGasto,
                                              rawValueDouble = g.Sum(g => g.Vigente.Value),
                                      ***REMOVED***).ToList();

            objReturn = RecursosPerObjetoQuery;


            return objReturn;

    ***REMOVED***


***REMOVED***
***REMOVED***
