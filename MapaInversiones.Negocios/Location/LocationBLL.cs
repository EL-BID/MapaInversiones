using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using System.Linq;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Modelos.Location;
using static PlataformaTransparencia.Modelos.ModelLocationData;

namespace PlataformaTransparencia.Negocios.Location
{
    public class LocationBLL : ILocationBLL
    {
        /// <summary>
        /// Capa de negocio para funciones perfil Localizacon 
        /// </summary>

        public LocationBLL()
        {
    ***REMOVED***

        public ModelLocationData ObtenerDatosLocalizacionInicio(string location_id, string type)
        {
            ModelLocationData objReturn = new ModelLocationData() { nomLocation = string.Empty, Encabezado = new Modelos.Location.InfoLocationGen { CantProyectos = 0, Costo = 0, Duracion = 0 ***REMOVED*** ***REMOVED***;
            if (string.IsNullOrEmpty(location_id)) return objReturn;
            type = string.IsNullOrEmpty(type) ? "COUNTY" : type;
            objReturn.location_id = location_id;
            objReturn.nomLocation = GetNameLocationByIdType(location_id, type);
            objReturn.descLocation = type.ToUpper();
            objReturn.tipo = type;
            objReturn.ProyectosEjecucion = GetInvestingProjects(location_id, type);
            objReturn.Encabezado = GetInfoLocation(location_id, type);
            objReturn.ProjectsPerEstado = GetProjectsByState(location_id, type);
            objReturn.ProjectsPerSectorGroup = GetProjectsBySector(location_id, type);
            if (objReturn.ProjectsPerSectorGroup.Count > 0)
            {
                objReturn.sectorPrincipal = objReturn.ProjectsPerSectorGroup[0].labelGroup;
        ***REMOVED***

            //#region FILTROS
            ////habilitar en caso de no usarse web api, sino carga directa desde el controlador
            ////objReturn.Filtros = addFiltroProyectos();
            //#endregion

            //#region PROYXSECTOR
            //objReturn.ProjectsPerSectorGroup = ObtenerProyectosPorSectorGroup(filtro_busqueda);
            ////objReturn.nomLocation = "MUNICIPIO";

            objReturn.Status = true;
            return objReturn;
    ***REMOVED***
        private List<InfoProjectPerSector> GetProjectsBySector(string location_id, string type)
        {

            var defaultRta = new List<InfoProjectPerSector>();

            using (var DataModel = new TransparenciaDB())
            {

                if (string.IsNullOrEmpty(type) || string.IsNullOrEmpty(location_id)) return defaultRta;
                if (type.ToUpper() == "REGION")
                {
                    var localizacionSeleccionada = (from info in DataModel.VwSectorProyectosDeptoInvs
                                                    where info.IdDepartamento == location_id
                                                    orderby info.NumeroProyectosSect descending
                                                    select new InfoProjectPerSector
                                                    {
                                                        label = info.NombreEstado,
                                                        labelGroup = info.NombreSector,
                                                        rawValue = ((decimal)info.NumeroProyectosSect),
                                                        value = (info.NumeroProyectosSect).ToString()
                                                ***REMOVED***).ToList();
                    return localizacionSeleccionada ?? defaultRta;
            ***REMOVED***
                else if (type.ToUpper() == "COUNTY")
                {
                    var localizacionSeleccionada = (from info in DataModel.VwSectorProyectosInvs
                                                    where info.IdMunicipio == location_id
                                                    orderby info.NumeroProyectosSect descending
                                                    select new InfoProjectPerSector
                                                    {
                                                        label = info.NombreEstado,
                                                        labelGroup = info.NombreSector,
                                                        rawValue = ((decimal)info.NumeroProyectosSect),
                                                        value = (info.NumeroProyectosSect).ToString()
                                                ***REMOVED***).ToList();
                    return localizacionSeleccionada ?? defaultRta;
            ***REMOVED***
                else return defaultRta;
        ***REMOVED***
    ***REMOVED***

        private List<InfoProjectsPerEstado> GetProjectsByState(string location_id, string type)
        {
            var defaultRta = new List<InfoProjectsPerEstado>();
            using (var DataModel = new TransparenciaDB())
            {

                if (string.IsNullOrEmpty(type) || string.IsNullOrEmpty(location_id)) return defaultRta;
                if (type.ToUpper() == "REGION")
                {
                    var localizacionSeleccionada = (from info in DataModel.VwEstadoProyectosDeptoInvs
                                                    where info.IdDepartamento == location_id
                                                    select new InfoProjectsPerEstado
                                                    {
                                                        label = info.NombreEstado,
                                                        rawValue = ((decimal)info.NumeroProyectos),
                                                        value = ((decimal)info.NumeroProyectos).ToString()
                                                ***REMOVED***).ToList();
                    return localizacionSeleccionada ?? defaultRta;
            ***REMOVED***
                else if (type.ToUpper() == "COUNTY")
                {
                    var localizacionSeleccionada = (from info in DataModel.VwEstadoProyectosInvs
                                                    where info.IdMunicipio == location_id
                                                    select new InfoProjectsPerEstado
                                                    {
                                                        label = info.NombreEstado,
                                                        rawValue = ((decimal)info.NumeroProyectos),
                                                        value = ((decimal)info.NumeroProyectos).ToString()
                                                ***REMOVED***).ToList();
                    return localizacionSeleccionada == null ? defaultRta : localizacionSeleccionada;
            ***REMOVED***
                else return defaultRta;
        ***REMOVED***
    ***REMOVED***

        private Modelos.Location.InfoLocationGen GetInfoLocation(string location_id, string type)
        {
            using (var DataModel = new TransparenciaDB())
            {
                var defaultRta = new Modelos.Location.InfoLocationGen { CantProyectos = 0, Costo = 0, Duracion = 0, IdDepartamento = string.Empty, IdMunicipio = string.Empty, urlImgXL = string.Empty ***REMOVED***;
                if (string.IsNullOrEmpty(type) || string.IsNullOrEmpty(location_id)) return defaultRta;
                if (type.ToUpper() == "REGION")
                {
                    var localizacionSeleccionada = (from info in DataModel.VwInformacionGeneralPerfilLocalizacionDeptos
                                                    join galeria in DataModel.VwGaleriaEntidadesTerritorialesDepartamentos on info.IdDepartamento equals galeria.IdDepartamento
                                                    where info.IdDepartamento == location_id
                                                    select new Modelos.Location.InfoLocationGen
                                                    {
                                                        IdDepartamento = info.IdDepartamento,
                                                        Costo = Math.Round((decimal)info.ValorPromedioProyecto, 2),
                                                        Duracion = Math.Round((decimal)info.DuracionPromedioProyectos, 2),
                                                        CantProyectos = Math.Round((decimal)info.NumeroProyectos, 2),
                                                        urlImgXL = galeria.UrlImageGrande
                                                ***REMOVED***).FirstOrDefault();
                    return localizacionSeleccionada == null ? defaultRta : localizacionSeleccionada;
            ***REMOVED***
                else if (type.ToUpper() == "COUNTY")
                {
                    var localizacionSeleccionada = (from info in DataModel.VwInformacionGeneralPerfilLocalizacions
                                                    join galeria in DataModel.VwGaleriaEntidadesTerritorialesMunicipios on info.IdMunicipio equals galeria.IdMunicipio
                                                    where info.IdMunicipio == location_id
                                                    select new Modelos.Location.InfoLocationGen
                                                    {
                                                        IdDepartamento = info.IdDepartamento,
                                                        IdMunicipio = info.IdMunicipio,
                                                        Costo = Math.Round((decimal)info.ValorPromedioProyecto, 2),
                                                        Duracion = Math.Round((decimal)info.DuracionPromedioProyectos, 2),
                                                        CantProyectos = Math.Round((decimal)info.NumeroProyectos, 2),
                                                        urlImgXL = galeria.UrlImageGrande
                                                ***REMOVED***).FirstOrDefault();
                    return localizacionSeleccionada == null ? defaultRta : localizacionSeleccionada;
            ***REMOVED***
                else return defaultRta;
        ***REMOVED***
    ***REMOVED***

        private string GetNameLocationByIdType(string location_id, string type)
        {
            if (string.IsNullOrEmpty(type) || string.IsNullOrEmpty(location_id)) return string.Empty;
            string tipoFiltro = string.Empty;
            using (var DataModel = new TransparenciaDB())
            {

                if (type.ToUpper() == "REGION")
                {
                    tipoFiltro = "DEPARTAMENTO";
                    var localizacionSeleccionada = (from info in DataModel.EnteTerritorials
                                                    where info.Tipo.ToUpper().Trim() == tipoFiltro && info.IdDepartamento == location_id
                                                    select info).FirstOrDefault();
                    return localizacionSeleccionada == null ? string.Empty : localizacionSeleccionada.NombreDepartamento;
            ***REMOVED***
                else if (type.ToUpper() == "COUNTY")
                {
                    tipoFiltro = "MUNICIPIO";
                    var localizacionSeleccionada = (from info in DataModel.EnteTerritorials
                                                    where info.Tipo.ToUpper().Trim() == tipoFiltro && info.IdMunicipio == location_id
                                                    select info).FirstOrDefault();
                    return localizacionSeleccionada == null ? string.Empty : localizacionSeleccionada.NombreMunicipio;
            ***REMOVED***
                else return string.Empty;
        ***REMOVED***
    ***REMOVED***

        private List<InfoProyectos> GetInvestingProjects(string location_id, string type)
        {
            if (type == null || location_id == null) return new List<InfoProyectos>();

            using (var DataModel = new TransparenciaDB())
            {

                if (type.ToUpper() == "REGION")
                {
                    var localizacionSeleccionada = (from info in DataModel.VwProyectosAprobadosInvs
                                                    join pxe in DataModel.ProyectoXEntidadTerritorials on info.IdProyecto equals pxe.IdProyecto
                                                    join sector in DataModel.Sectors on info.IdSector equals sector.IdSector
                                                    join ente in DataModel.EnteTerritorials on pxe.IdDepartamento equals ente.IdDepartamento
                                                    join histEstado in DataModel.HistoriaEstados on info.IdProyecto equals histEstado.IdProyecto
                                                    where ente.IdDepartamento == location_id && histEstado.IdEstado == 3 //pxe.IdMunicipio == ente.IdMunicipio
                                                    select new InfoProyectos
                                                    {
                                                        IdProyecto = info.IdProyecto,
                                                        NombreProyecto = info.NombreProyecto.Replace("\r\n", "").Replace("\n", "").Replace("\r", ""),
                                                        VlrTotalProyectoFuenteRegalias = info.VlrTotalProyectoFuenteRegalias,
                                                        porcentajeGastado = (decimal)info.AvanceFinanciero,
                                                        //NombreMunicipio = ente.NombreMunicipio,
                                                        UrlImagen = info.URLImagen,
                                                        NombreSector = sector.NombreSector,
                                                        IdSector = sector.IdSector,
                                                        cantidadFotos = info.NumeroImagenes,
                                                        MesInicioProyecto = info.MesInicioProyecto,
                                                        AnioInicioProyecto = info.AnioInicioProyecto,
                                                        MesFinProyecto = info.MesFinProyecto,
                                                        AnioFinProyecto = info.AnioFinProyecto,
                                                        FechaInicioProyecto = info.FechaInicioProyecto,
                                                        Megusta = info.MeGusta,
                                                        Comentarios = info.Comentarios,
                                                        IdDepartamento = pxe.IdDepartamento
                                                ***REMOVED***).Distinct().ToList();
                    return localizacionSeleccionada;
            ***REMOVED***
                else if (type.ToUpper() == "COUNTY")
                {
                    var localizacionSeleccionada = (from info in DataModel.VwProyectosAprobadosInvs
                                                    join pxe in DataModel.ProyectoXEntidadTerritorials on info.IdProyecto equals pxe.IdProyecto
                                                    join sector in DataModel.Sectors on info.IdSector equals sector.IdSector
                                                    join ente in DataModel.EnteTerritorials on pxe.IdMunicipio equals ente.IdMunicipio
                                                    join histEstado in DataModel.HistoriaEstados on info.IdProyecto equals histEstado.IdProyecto
                                                    where ente.IdMunicipio == location_id && histEstado.IdEstado == 3 //pxe.IdMunicipio == ente.IdMunicipio
                                                    select new InfoProyectos
                                                    {
                                                        IdProyecto = info.IdProyecto,
                                                        NombreProyecto = info.NombreProyecto,
                                                        VlrTotalProyectoFuenteRegalias = info.VlrTotalProyectoFuenteRegalias,
                                                        porcentajeGastado = (decimal)info.AvanceFinanciero,
                                                        NombreMunicipio = ente.NombreMunicipio,
                                                        UrlImagen = info.URLImagen,
                                                        NombreSector = sector.NombreSector,
                                                        IdSector = sector.IdSector,
                                                        cantidadFotos = info.NumeroImagenes,
                                                        MesInicioProyecto = info.MesInicioProyecto,
                                                        AnioInicioProyecto = info.AnioInicioProyecto,
                                                        MesFinProyecto = info.MesFinProyecto,
                                                        AnioFinProyecto = info.AnioFinProyecto,
                                                        FechaInicioProyecto = info.FechaInicioProyecto,
                                                        Megusta = info.MeGusta,
                                                        Comentarios = info.Comentarios,
                                                        IdDepartamento = pxe.IdDepartamento
                                                ***REMOVED***).ToList();
                    return localizacionSeleccionada;
            ***REMOVED***
        ***REMOVED***
            return new List<InfoProyectos>();
    ***REMOVED***

        /// <summary>
        /// obt listado sectores filtro proy ejecucion
        /// </summary>
        /// <returns></returns>
        public List<TableSectores> GetListSectores()
        {
            List<TableSectores> lstSectores = new List<TableSectores>();
            using (var DataModel = new TransparenciaDB())
            {

                lstSectores = (from maestro in DataModel.Sectors
                               select new TableSectores
                               {
                                   nombre = maestro.NombreSector,
                                   valor = maestro.IdSector.ToString()
                           ***REMOVED***).OrderBy(p => p.nombre).ToList();
        ***REMOVED***
            return lstSectores;

    ***REMOVED***



***REMOVED***
***REMOVED***
