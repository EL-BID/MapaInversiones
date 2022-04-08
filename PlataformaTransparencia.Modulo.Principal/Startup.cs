using System;
using AngleSharp.Dom.Events;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using OrchardCore.Modules;
using PlataformaTransparencia.Modelos;
using SolrNet;

namespace PlataformaTransparencia.Modulo.Principal
{
  public class Startup : StartupBase
  {
    public override void ConfigureServices(IServiceCollection services)
    {
    }

    public override void Configure(IApplicationBuilder builder, IEndpointRouteBuilder routes, IServiceProvider serviceProvider)
    {
      routes.MapAreaControllerRoute(
      name: "Home",
      areaName: "PlataformaTransparencia.Modulo.Principal",
      pattern: "",
      defaults: new { controller = "Home", action = "Index" }
      );

      routes.MapAreaControllerRoute(
          name: "Noticias",
          areaName: "PlataformaTransparencia.Modulo.Noticias",
          pattern: "Noticias",
          defaults: new { controller = "Noticias", action = "Index" }
      );


      routes.MapAreaControllerRoute(
          name: "Noticia",
          areaName: "PlataformaTransparencia.Modulo.Noticias",
          pattern: "{Noticia}/{id?}",
          defaults: new { controller = "Noticias", action = "Noticia" }
      );

      routes.MapAreaControllerRoute(
          name: "PlanNacional",
          areaName: "PlataformaTransparencia.Modulo.Principal",
          pattern: "PlanNacional",
          defaults: new { controller = "Plan", action = "PlanNacional" }
      );

      routes.MapAreaControllerRoute(
          name: "ProcesoPlanNacional",
          areaName: "PlataformaTransparencia.Modulo.Principal",
          pattern: "ProcesoPlanNacional",
          defaults: new { controller = "Plan", action = "ProcesoPlanNacional" }
      );

      routes.MapAreaControllerRoute(
               name: "Contactanos",
               areaName: "PlataformaTransparencia.Modulo.Principal",
               pattern: "Contactanos",
               defaults: new { controller = "CentroAyuda", action = "Contactanos" }
           );

      routes.MapAreaControllerRoute(
              name: "Acercade",
              areaName: "PlataformaTransparencia.Modulo.Principal",
              pattern: "Acercade",
              defaults: new { controller = "CentroAyuda", action = "Acercade" }
          );


      routes.MapAreaControllerRoute(
                      name: "CentroAyuda",
                      areaName: "PlataformaTransparencia.Modulo.Principal",
                      pattern: "CentroAyuda",
                      defaults: new { controller = "CentroAyuda", action = "Index" }
                  );

      routes.MapAreaControllerRoute(
          name: "Buscar",
          areaName: "PlataformaTransparencia.Modulo.Principal",
          pattern: "Buscar",
          defaults: new { controller = "Home", action = "Search" }
      );

      routes.MapAreaControllerRoute(
          name: "PresupuestoGeneral",
          areaName: "PlataformaTransparencia.Modulo.Principal",
          pattern: "PresupuestoGeneral",
          defaults: new { controller = "Presupuesto", action = "PresupuestoGeneral" }
      );

      routes.MapAreaControllerRoute(
         name: "perfilEntidad",
         areaName: "PlataformaTransparencia.Modulo.Principal",
         pattern: "perfilEntidad",
         defaults: new { controller = "Entidad", action = "perfilEntidad" }
     );
      routes.MapAreaControllerRoute(
          name: "PerfilPrograma",
          areaName: "PlataformaTransparencia.Modulo.Principal",
          pattern: "PerfilPrograma",
          defaults: new { controller = "Plan", action = "PerfilPrograma" }
      );

      routes.MapAreaControllerRoute(
          name: "BusquedaResultados",
          areaName: "PlataformaTransparencia.Modulo.Principal",
          pattern: "BusquedaResultados",
          defaults: new { controller = "Home", action = "BusquedaResultados" }
      );


     routes.MapAreaControllerRoute(
         name: "ProcesoPresupuesto",
         areaName: "PlataformaTransparencia.Modulo.Principal",
         pattern: "ProcesoPresupuesto",
         defaults: new { controller = "Presupuesto", action = "ProcesoPresupuesto" }
     );

    routes.MapAreaControllerRoute(
        name: "pruebaGrafica",
        areaName: "PlataformaTransparencia.Modulo.Principal",
        pattern: "pruebaGrafica",
        defaults: new { controller = "Plan", action = "pruebaGrafica" }
    );


    routes.MapAreaControllerRoute(
        name: "DatosAbiertos",
        areaName: "PlataformaTransparencia.Modulo.Principal",
        pattern: "DatosAbiertos",
        defaults: new { controller = "DatosAbiertos", action = "DatosAbiertos" }
    );

    routes.MapAreaControllerRoute(
            name: "InversionesPrioritarias",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "InversionesPrioritarias",
            defaults: new { controller = "Home", action = "InversionesPrioritarias" }
        );

    routes.MapAreaControllerRoute(
            name: "ArticulacionPlan",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "ArticulacionPlan",
            defaults: new { controller = "Home", action = "ArticulacionPlan" }
        );

    routes.MapAreaControllerRoute(
                name: "PlanificacionResultados",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "PlanificacionResultados",
                defaults: new { controller = "Home", action = "PlanificacionResultados" }
            );

    routes.MapAreaControllerRoute(
        name: "PlanODS",
        areaName: "PlataformaTransparencia.Modulo.Principal",
        pattern: "PlanODS",
        defaults: new { controller = "Home", action = "PlanODS" }
    );

    routes.MapAreaControllerRoute(
            name: "PlanificacionParaguay",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "PlanificacionParaguay",
            defaults: new { controller = "Home", action = "PlanificacionParaguay" }
        );

    routes.MapAreaControllerRoute(
            name: "PresupuestoResultados",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "PresupuestoResultados",
            defaults: new { controller = "Home", action = "PresupuestoResultados" }
        );

    routes.MapAreaControllerRoute(
            name: "DesarrolloSostenible",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "DesarrolloSostenible",
            defaults: new { controller = "Home", action = "DesarrolloSostenible" }
        );

    routes.MapAreaControllerRoute(
                name: "MarcoLegal",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "MarcoLegal",
                defaults: new { controller = "CentroAyuda", action = "MarcoLegal" }
            );

    routes.MapAreaControllerRoute(
        name: "POI",
        areaName: "PlataformaTransparencia.Modulo.Principal",
        pattern: "POI",
        defaults: new { controller = "Home", action = "POI" }
    );


        routes.MapAreaControllerRoute(
            name: "PND",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "PND",
            defaults: new { controller = "Home", action = "PND" }
        );


    routes.MapAreaControllerRoute(
            name: "Plansectorial",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "Plansectorial",
            defaults: new { controller = "Home", action = "Plansectorial" }
        );

    routes.MapAreaControllerRoute(
            name: "PDT",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "PDT",
            defaults: new { controller = "Home", action = "PDT" }
        );

    routes.MapAreaControllerRoute(
                    name: "PEI",
                    areaName: "PlataformaTransparencia.Modulo.Principal",
                    pattern: "PEI",
                    defaults: new { controller = "Home", action = "PEI" }
                );
        }
  }
}