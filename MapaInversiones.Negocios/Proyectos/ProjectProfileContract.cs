using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.Proyectos;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;


namespace PlataformaTransparencia.Negocios.Project
{
    public class ProjectProfileContract : RespuestaContratoBase
    {
        private int projectId;
        private string id_usuario_aux;
        private string nom_usuario_aux;
        /// <summary>
        /// Es el modelo que vamos a retornar.
        /// </summary>
        public ModelProjectProfile ModelProjectProfile { get; set; ***REMOVED***
        /// <summary>
        /// Constructor de la clase
        /// </summary>
        /// <param name="IdProject">Es el Id del proyecto</param>
        private readonly TransparenciaDB _connection;
        private readonly IHttpContextAccessor _context;
        private readonly IHostingEnvironment _hostingEnvironment;

        public ProjectProfileContract(int ProjectId, TransparenciaDB connection, string id_usuario, string nom_usuario)
        {
            projectId = ProjectId;
            ModelProjectProfile = new ModelProjectProfile();
            _connection = connection;
            id_usuario_aux = id_usuario;
            nom_usuario_aux = nom_usuario;

    ***REMOVED***
        /// <summary>
        /// Llena la propiedad ModelProjectProfile.
        /// </summary>
        public void Fill()
        {
            this.Status = false;
            try {
                BllProjectProfile bussines = new BllProjectProfile(_connection);
                this.ModelProjectProfile.idproject = projectId;
                ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);

                
                var CodPeriodos = BusquedasProyectosBLL.ObtenerPeriodosFuentes(projectId);
                var CodComponentes = BusquedasProyectosBLL.ObtenerComponentesProy(projectId);
                var ActoresProy = BusquedasProyectosBLL.ObtenerActoresByCategoriaProy(projectId);

                //----------------------------------------------------------------------------------------
                this.ModelProjectProfile.ProjectInformation=bussines.GetProjectInformation(projectId);
                this.ModelProjectProfile.periodos_fuentes = CodPeriodos;
                this.ModelProjectProfile.componentes_proy = CodComponentes;
                this.ModelProjectProfile.actores_proy = ActoresProy;
                this.ModelProjectProfile.Images = BusquedasProyectosBLL.ObtenerImagenesParaProyecto(projectId);
                this.ModelProjectProfile.entregables = BusquedasProyectosBLL.ObtenerEntregablesProyecto(projectId);
                this.ModelProjectProfile.id_usu_participa = id_usuario_aux;
                this.ModelProjectProfile.nom_usu_participa = nom_usuario_aux;
                this.ModelProjectProfile.rol_participacion = part.ObtenerRolesProyAsync();
                this.ModelProjectProfile.genero_participacion = part.ObtenerGenerosProyAsync();
                this.ModelProjectProfile.medios_participacion = part.ObtenerMotivosProyAsync();
                this.ModelProjectProfile.tipo_comentario = part.ObtenerTipoComentarioAsync();

                //bussines.GetListImagesbyId(this.ModelProjectProfile, projectId);
                //bussines.GetOtherProjectsbyId(this.ModelProjectProfile, projectId);
                //bussines.GetProgressProject(this.ModelProjectProfile, projectId);

                //bussines.GetSourcesByProject(this.ModelProjectProfile, projectId);
                this.Status = true;

        ***REMOVED***
            catch (Exception ex) {
                this.Status = false;
                //LogHelper.GenerateLog(ex);
                this.Message = "Lo sentimos, ha ocurrido un error.";
        ***REMOVED***
    ***REMOVED***
***REMOVED***

***REMOVED***
