using System;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;
using System.Linq;
using PlataformaTransparencia.Negocios.Project;

namespace PlataformaTransparencia.Negocios.Proyectos
{
  public class InvestmentProjectProfileBLL : RespuestaContratoBase
  {
    private int projectId;
    private string usuarioAuxId;
    private string nombreUsuarioAux;
    /// <summary>
    /// Es el modelo que vamos a retornar.
    /// </summary>
    public ModelProjectProfile ModelProjectProfile { get; set; }
    /// <summary>
    /// Constructor de la clase
    /// </summary>
    /// <param name="IdProject">Es el Id del proyecto</param>
    private readonly TransparenciaDB _connection;
    public InvestmentProjectProfileBLL(int ProjectId, TransparenciaDB connection, string usuarioId, string nombreUsuario)
    {
      projectId = ProjectId;
      ModelProjectProfile = new ModelProjectProfile();
      _connection = connection;
      usuarioAuxId = usuarioId;
      nombreUsuarioAux = nombreUsuario;
    }
    /// <summary>
    /// Llena la propiedad ModelProjectProfile.
    /// </summary>
    public void Fill()
    {
      List<Images> imagesProyecto = [];
      string urlImgPrincipal = "/img/preview-project.jpg";
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
        ModelProjectProfile.actores_proy = [];// ActoresProy;
                                                 //-----------------------------------------------------------------------------
        imagesProyecto = BusquedasProyectosBLL.ObtenerImagenesParaProyecto(projectId);
        ModelProjectProfile.Images = imagesProyecto;

        if (imagesProyecto.Count > 0)
        {
          urlImgPrincipal = imagesProyecto.FirstOrDefault(x => x.priority.HasValue && x.priority.Value)?.large;
          if (urlImgPrincipal == null)
          {
            urlImgPrincipal = "/img/preview-project.jpg";
          }
        }
        //----------------------------------------------------------------
        ModelProjectProfile.FotosU = BusquedasProyectosBLL.ObtenerFotosUsusarioPerProyecto(projectId);
        ModelProjectProfile.urlImgBackground = urlImgPrincipal;
        ModelProjectProfile.id_usu_participa = usuarioAuxId;
        ModelProjectProfile.nom_usu_participa = nombreUsuarioAux;
        ModelProjectProfile.rol_participacion = part.ObtenerRolesProyAsync();
        ModelProjectProfile.genero_participacion = part.ObtenerGenerosProyAsync();
        ModelProjectProfile.medios_participacion = part.ObtenerMotivosProyAsync();
        ModelProjectProfile.tipo_comentario = part.ObtenerTipoComentarioAsync(1);
        ModelProjectProfile.avanceFisicoFaseInversion = [];
        //ModelProjectProfile.avanceFisicoFaseInversion = BusquedasProyectosBLL.ObtenerAvanceFisicoPorComponenteProductoFaseProyecto(projectId);
        Status = true;
      }
      catch (Exception)
      {
        Status = false;
        Message = "Lo sentimos, ha ocurrido un error.";
      }
    }
  }
}
