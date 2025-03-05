using System;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.Proyectos;
using Microsoft.AspNetCore.Http;
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
        public ModelProjectProfile ModelProjectProfile { get; set; }
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
        }
        /// <summary>
        /// Llena la propiedad ModelProjectProfile.
        /// </summary>
        public async void Fill()
        {
            Status = false;
            try
            {
                BllProjectProfile bussines = new(_connection);
                ModelProjectProfile.idproject = projectId;
                ParticipacionCiudadana part = new(_connection);
                //----------------------------------------------------------------------------------------
                ModelProjectProfile.ProjectInformation = bussines.GetProjectInformation(projectId);
                ModelProjectProfile.periodos_fuentes = BusquedasProyectosBLL.ObtenerAniosFuentesFinanciacionPorProyecto(projectId); //    new();// CodPeriodos;
                ModelProjectProfile.OrigenDelProyecto = BusquedasProyectosBLL.ObtenerNombreOrganismoFinanciadorPorProyecto(projectId);
                ModelProjectProfile.componentes_proy = new();// CodComponentes;
                ModelProjectProfile.actores_proy = new();// ActoresProy;
                ModelProjectProfile.Images = BusquedasProyectosBLL.ObtenerImagenesParaProyecto(projectId);
                ModelProjectProfile.id_usu_participa = id_usuario_aux;
                ModelProjectProfile.nom_usu_participa = nom_usuario_aux;
                ModelProjectProfile.rol_participacion = part.ObtenerRolesProyAsync();
                ModelProjectProfile.genero_participacion = part.ObtenerGenerosProyAsync();
                ModelProjectProfile.medios_participacion = part.ObtenerMotivosProyAsync();
                ModelProjectProfile.tipo_comentario = part.ObtenerTipoComentarioAsync(1);
                ModelProjectProfile.avanceFisicoFaseInversion = new();
                //ModelProjectProfile.avanceFisicoFaseInversion = BusquedasProyectosBLL.ObtenerAvanceFisicoPorComponenteProductoFaseProyecto(projectId);
                Status = true;
            }
            catch (Exception ex)
            {
                Status = false;
                Message = "Lo sentimos, ha ocurrido un error.";
            }
        }
    }
}
