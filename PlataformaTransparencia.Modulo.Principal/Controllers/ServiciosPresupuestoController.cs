using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.Presupuesto;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
    [Route("api/serviciospresupuesto")]
    public class ServiciosPresupuestoController : Controller
    {
        private readonly ILogger<ServiciosPresupuestoController> _logger;
        private readonly TransparenciaDB _connection;
 

        public ServiciosPresupuestoController(ILogger<ServiciosPresupuestoController> logger, TransparenciaDB connection)
        {
            _logger = logger;
            _connection = connection;

    ***REMOVED***

        [HttpGet("TreeMapSectores")]
        public ModelPresupuestoData TreeMapSectores(int consulta, int annio)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            try {
                var aux = new PresupuestoBLL(_connection);
                Presupuesto.InfoGrafica = aux.ObtenerPresupuesto(consulta, annio);
                Presupuesto.Status = true;
                return Presupuesto;
        ***REMOVED***
            catch (Exception exception) {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
        ***REMOVED***
    ***REMOVED***


        [HttpGet("DatosSectores")]
        public ModelPresupuestoData DatosSectores(int annio)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            try {
                var aux = new PresupuestoBLL(_connection);
                Presupuesto.InfoGrafica = aux.ObtenerPresupuestoTotalAnnio( annio);
                Presupuesto.Status = true;
                return Presupuesto;
        ***REMOVED***
            catch (Exception exception) {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
        ***REMOVED***
    ***REMOVED***

        [HttpGet("BarChartSectores")]
        public ModelPresupuestoData BarChartSectores(int consulta, int annio)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            try {
                var aux = new PresupuestoBLL(_connection);
                Presupuesto.InfoGrafica = aux.ObtenerGastoSectores(consulta, annio);
                Presupuesto.Status = true;
                return Presupuesto;
        ***REMOVED***
            catch (Exception exception) {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
        ***REMOVED***
    ***REMOVED***


        [HttpGet("LinePlotPresupuestoSolicitadoAprobado")]
        public ModelPresupuestoData LinePlotPresupuestoSolicitadoAprobado(int consulta, int annio, int version1, int version2)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            try {
                var aux = new PresupuestoBLL(_connection);
                Presupuesto.InfoGrafica = aux.ObtenerPresupuestoSolicitadoAprobado(consulta, annio, version1, version2);
                Presupuesto.Status = true;
                return Presupuesto;
        ***REMOVED***
            catch (Exception exception) {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
        ***REMOVED***
    ***REMOVED***

        [HttpGet("LinePlotGastoPresupuestalTiempo")]
        public ModelPresupuestoData LinePlotGastoPresupuestalTiempo(int consulta, int annio)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            try {
                var aux = new PresupuestoBLL(_connection);
                Presupuesto.InfoGrafica = aux.ObtenerGastoPresupuestalTiempo(consulta, annio);
                Presupuesto.Status = true;
                return Presupuesto;
        ***REMOVED***
            catch (Exception exception) {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
        ***REMOVED***
    ***REMOVED***


        [HttpGet("ComboClasificacion")]
        public ModelPresupuestoData ComboClasificacion(int annio)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            try {
                var aux = new PresupuestoBLL(_connection);
                Presupuesto.InfoGrafica = aux.ObtenerClasificacion(annio);
                Presupuesto.Status = true;
                return Presupuesto;
        ***REMOVED***
            catch (Exception exception) {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
        ***REMOVED***
    ***REMOVED***

        [HttpGet("ComboClasePrograma")]
        public ModelPresupuestoData ComboClasePrograma(int annio, string clasificacion, string entidad)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            try {
                var aux = new PresupuestoBLL(_connection);
                Presupuesto.InfoGrafica = aux.ObtenerClasePrograma(annio, clasificacion, entidad);
                Presupuesto.Status = true;
                return Presupuesto;
        ***REMOVED***
            catch (Exception exception) {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
        ***REMOVED***
    ***REMOVED***

        [HttpGet("ComboEntidad")]
        public ModelPresupuestoData ComboProgramas(int annio, string clasificacion)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            try {
                var aux = new PresupuestoBLL(_connection);
                Presupuesto.InfoGrafica = aux.ObtenerEntidad(annio, clasificacion);
                Presupuesto.Status = true;
                return Presupuesto;
        ***REMOVED***
            catch (Exception exception) {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
        ***REMOVED***
    ***REMOVED***

        [HttpGet("ComboProyectoActividad")]
        public ModelPresupuestoData ComboProyectoActividad(int annio, string clasificacion, string entidad, string clasePrograma)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            try {
                var aux = new PresupuestoBLL(_connection);
                Presupuesto.InfoGrafica = aux.ObtenerProyectoActividades(annio, clasificacion, entidad, clasePrograma );
                Presupuesto.Status = true;
                return Presupuesto;
        ***REMOVED***
            catch (Exception exception) {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
        ***REMOVED***
    ***REMOVED***

        [HttpGet("ComboVersiones")]
        public ModelPresupuestoData ComboVersiones(int annio)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            try {
                var aux = new PresupuestoBLL(_connection);
                Presupuesto.InfoGrafica = aux.ObtenerVersiones(annio);
                Presupuesto.Status = true;
                return Presupuesto;
        ***REMOVED***
            catch (Exception exception) {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
        ***REMOVED***
    ***REMOVED***


        [HttpGet("LinePlotGrupoDeGasto")]
        public ModelPresupuestoData LinePlotGrupoDeGasto(int consulta, int annio)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            try {
                var aux = new PresupuestoBLL(_connection);
                Presupuesto.InfoGrafica = aux.ObtenerGrupoDeGasto(consulta, annio);
                Presupuesto.Status = true;
                return Presupuesto;
        ***REMOVED***
            catch (Exception exception) {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
        ***REMOVED***
    ***REMOVED***


        [HttpGet("ComboEntidadOG")]
        public ModelPresupuestoData ComboEntidadOG(int annio)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            try {
                var aux = new PresupuestoBLL(_connection);
                Presupuesto.InfoGrafica = aux.ObtenerEntidadOG(annio);
                Presupuesto.Status = true;
                return Presupuesto;
        ***REMOVED***
            catch (Exception exception) {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
        ***REMOVED***
    ***REMOVED***

        [HttpGet("ComboProyectoActividadOG")]
        public ModelPresupuestoData ComboProyectoActividadOG(int annio, string entidad)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            try {
                var aux = new PresupuestoBLL(_connection);
                Presupuesto.InfoGrafica = aux.ObtenerProyectoActividadesOG(annio,  entidad);
                Presupuesto.Status = true;
                return Presupuesto;
        ***REMOVED***
            catch (Exception exception) {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
        ***REMOVED***
    ***REMOVED***

        [HttpGet("ComboObjetoGasto")]
        public ModelPresupuestoData ComboObtenerObjetoGasto(int annio, string entidad, string proyectoActividad)
        {
            ModelPresupuestoData Presupuesto = new ModelPresupuestoData();
            try {
                var aux = new PresupuestoBLL(_connection);
                Presupuesto.InfoGrafica = aux.ObtenerObjetoGasto(annio, entidad, proyectoActividad);
                Presupuesto.Status = true;
                return Presupuesto;
        ***REMOVED***
            catch (Exception exception) {
                Presupuesto.Status = false;
                Presupuesto.Message = "Error: " + exception.Message;
                Presupuesto = null;
                return Presupuesto;
        ***REMOVED***
    ***REMOVED***
        
***REMOVED***
***REMOVED***
