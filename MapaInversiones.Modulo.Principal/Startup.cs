using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using OrchardCore.Modules;

namespace PlataformaTransparencia.Modulo.Principal
{
    public class Startup : StartupBase
    {
        public override void ConfigureServices(IServiceCollection services)
        {
            services.AddPdfGenerator();
        }

        public override void Configure(IApplicationBuilder builder, IEndpointRouteBuilder routes, IServiceProvider serviceProvider)
        {
            routes.MapAreaControllerRoute(
            name: "Home",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "Home",
            defaults: new { controller = "Home", action = "Index" }
            );

            routes.MapAreaControllerRoute(
            name: "Busqueda",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "BusquedaResultados",
            defaults: new { controller = "Home", action = "BusquedaResultados" }
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
                name: "Geo",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "MapView",
                defaults: new { controller = "Map", action = "MapView" }
            );

            routes.MapAreaControllerRoute(
                name: "AzureGeo",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "AzureMapView",
                defaults: new { controller = "Map", action = "AzureMapView" }
            );

            routes.MapAreaControllerRoute(
            name: "LocationProfile",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "Location/{type?}/{idLoc?}",
            defaults: new { controller = "LocationProfile", action = "Location" }
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
                name: "PresupuestoInversionPublica",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "PresupuestoInversionPublica",
                defaults: new { controller = "Presupuesto", action = "PresupuestoInversionPublica" }
            );

            routes.MapAreaControllerRoute(
                name: "ParticipacionCiudadana",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "ParticipacionCiudadana",
                defaults: new { controller = "Participacion", action = "ParticipacionCiudadana" }
            );

            routes.MapAreaControllerRoute(
                name: "Aprobar",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "Aprobar",
                defaults: new { controller = "Participacion", action = "Aprobar" }
            );

            routes.MapAreaControllerRoute(
               name: "VerificaCuenta",
               areaName: "PlataformaTransparencia.Modulo.Principal",
               pattern: "VerificaCuenta/{id}",
               defaults: new { controller = "Participacion", action = "VerificaCuenta" }
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
                name: "ElaboraPresupuesto",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "ElaboraPresupuesto",
                defaults: new { controller = "Presupuesto", action = "ElaboraPresupuesto" }
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
                        name: "PoliticasdePrivacidad",
                        areaName: "PlataformaTransparencia.Modulo.Principal",
                        pattern: "PoliticasdePrivacidad",
                        defaults: new { controller = "CentroAyuda", action = "PoliticasdePrivacidad" }
            );

            routes.MapAreaControllerRoute(
                        name: "TerminosyCondiciones",
                        areaName: "PlataformaTransparencia.Modulo.Principal",
                        pattern: "TerminosyCondiciones",
                        defaults: new { controller = "CentroAyuda", action = "TerminosyCondiciones" }
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

            routes.MapAreaControllerRoute(
                name: "Contratos",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "Contratos",
                defaults: new { controller = "Contratos", action = "Contratos" }
            );

            routes.MapAreaControllerRoute(
              name: "Contrato",
              areaName: "PlataformaTransparencia.Modulo.Principal",
              pattern: "Contrato",
              defaults: new { controller = "Contratos", action = "Contrato" }
            );

            routes.MapAreaControllerRoute(
            name: "Contratista",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "Contratista",
            defaults: new { controller = "Contratos", action = "Contratista" }
            );

            routes.MapAreaControllerRoute(
                    name: "PresupuestoGeneral",
                    areaName: "PlataformaTransparencia.Modulo.Principal",
                    pattern: "PresupuestoGeneral",
                    defaults: new { controller = "Presupuesto", action = "PresupuestoGeneral" }
            );

            routes.MapAreaControllerRoute(
                    name: "prueba",
                    areaName: "PlataformaTransparencia.Modulo.Principal",
                    pattern: "prueba",
                    defaults: new { controller = "Presupuesto", action = "prueba" }
            );

            routes.MapAreaControllerRoute(
                 name: "EntidadesGeneral",
                 areaName: "PlataformaTransparencia.Modulo.Principal",
                 pattern: "Entidades",
                 defaults: new { controller = "Entidad", action = "EntidadesGeneral" }
             );

            routes.MapAreaControllerRoute(
              name: "ProcesoCiclo",
              areaName: "PlataformaTransparencia.Modulo.Principal",
              pattern: "Ciclo",
              defaults: new { controller = "Home", action = "ProcesoCiclo" }
             );

            routes.MapAreaControllerRoute(
              name: "ProcesoIngresos",
              areaName: "PlataformaTransparencia.Modulo.Principal",
              pattern: "Ingresos",
              defaults: new { controller = "Home", action = "ProcesoIngresos" }
             );

            routes.MapAreaControllerRoute(
              name: "ProcesoGastos",
              areaName: "PlataformaTransparencia.Modulo.Principal",
              pattern: "Gastos",
              defaults: new { controller = "Home", action = "ProcesoGastos" }
             );


            routes.MapAreaControllerRoute(
                name: "PerfilProyecto",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "{PerfilProyecto}/{id}",
                defaults: new { controller = "Proyecto", action = "PerfilProyecto" }
            );

            //routes.MapAreaControllerRoute(
            //   name: "EmergenciaPresupuesto",
            //   areaName: "PlataformaTransparencia.Modulo.Principal",
            //   pattern: "{EmergenciaPresupuesto}/{emergencia}",
            //   defaults: new { controller = "PresupuestoEmergencia", action = "EmergenciaPresupuesto" }
            //);

            routes.MapAreaControllerRoute(
               name: "EmergenciaPresupuesto",
               areaName: "PlataformaTransparencia.Modulo.Principal",
               pattern: "EmergenciaPresupuesto",
               defaults: new { controller = "PresupuestoEmergencia", action = "EmergenciaPresupuesto" }
            );

            routes.MapAreaControllerRoute(
              name: "FinancialOrganization",
              areaName: "PlataformaTransparencia.Modulo.Principal",
              pattern: "FinancialOrganization",
              defaults: new { controller = "FinancialOrganization", action = "Index" }
           );

            routes.MapAreaControllerRoute(
               name: "FinancialOrganization",
               areaName: "PlataformaTransparencia.Modulo.Principal",
               pattern: "FinancialOrganizationDetail",
               defaults: new { controller = "FinancialOrganization", action = "FinancialOrganizationDetail" }
            );

            routes.MapAreaControllerRoute(
                  name: "MapViewMobile",
                  areaName: "PlataformaTransparencia.Modulo.Principal",
                  pattern: "MapViewMobile",
                  defaults: new { controller = "Map", action = "MapViewMobile" }
            );

            routes.MapAreaControllerRoute(
            name: "PerfilSector",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "PerfilSector",
            defaults: new { controller = "Sectores", action = "PerfilSectores" }
            );

            //routes.MapAreaControllerRoute(
            // name: "PerfilSector",
            // areaName: "PlataformaTransparencia.Modulo.Principal",
            // pattern: "PerfilSector",
            // defaults: new { controller = "Sectores", action = "PerfilSectores" }
            //);

            routes.MapAreaControllerRoute(
            name: "Emergencia",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "Emergencia",
            defaults: new { controller = "Emergencias", action = "Emergencia" }
            );

            routes.MapAreaControllerRoute(
            name: "ContratosEmergencia",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "ContratosEmergencia",
            defaults: new { controller = "Emergencias", action = "ContratosEmergencia" }
            );

            routes.MapAreaControllerRoute(
            name: "ProcesosCanceladosEmergencia",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "ProcesosCanceladosEmergencia",
            defaults: new { controller = "Emergencias", action = "ProcesosCanceladosEmergencia" }
            );


            routes.MapAreaControllerRoute(
           name: "PresupuestoGeneralEmergencia",
           areaName: "PlataformaTransparencia.Modulo.Principal",
           pattern: "PresupuestoGeneralEmergencia",
           defaults: new { controller = "PresupuestoGeneralEmergencias", action = "PresupuestoGeneralEmergencia" }
           );

            routes.MapControllerRoute(
                name: "Mapi",
                pattern: "Mapi",
                defaults: new { controller = "Mapi", action = "Mapi" }
            );





        }

    }
}