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
    ***REMOVED***

        public override void Configure(IApplicationBuilder builder, IEndpointRouteBuilder routes, IServiceProvider serviceProvider)
        {
            routes.MapAreaControllerRoute(
            name: "Home",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "Home",
            defaults: new { controller = "Home", action = "Index" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
            name: "Busqueda",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "BusquedaResultados",
            defaults: new { controller = "Home", action = "BusquedaResultados" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
            name: "Noticias",
            areaName: "PlataformaTransparencia.Modulo.Noticias",
            pattern: "Noticias",
            defaults: new { controller = "Noticias", action = "Index" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                name: "Noticia",
                areaName: "PlataformaTransparencia.Modulo.Noticias",
                pattern: "{Noticia***REMOVED***/{id?***REMOVED***",
                defaults: new { controller = "Noticias", action = "Noticia" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                name: "Geo",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "MapView",
                defaults: new { controller = "Map", action = "MapView" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
            name: "LocationProfile",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "Location/{type?***REMOVED***/{idLoc?***REMOVED***",
            defaults: new { controller = "LocationProfile", action = "Location" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
            name: "PlanNacional",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "PlanNacional",
            defaults: new { controller = "Plan", action = "PlanNacional" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                name: "ProcesoPlanNacional",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "ProcesoPlanNacional",
                defaults: new { controller = "Plan", action = "ProcesoPlanNacional" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                     name: "Contactanos",
                     areaName: "PlataformaTransparencia.Modulo.Principal",
                     pattern: "Contactanos",
                     defaults: new { controller = "CentroAyuda", action = "Contactanos" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                    name: "Acercade",
                    areaName: "PlataformaTransparencia.Modulo.Principal",
                    pattern: "Acercade",
                    defaults: new { controller = "CentroAyuda", action = "Acercade" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                            name: "CentroAyuda",
                            areaName: "PlataformaTransparencia.Modulo.Principal",
                            pattern: "CentroAyuda",
                            defaults: new { controller = "CentroAyuda", action = "Index" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                name: "Buscar",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "Buscar",
                defaults: new { controller = "Home", action = "Search" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
               name: "perfilEntidad",
               areaName: "PlataformaTransparencia.Modulo.Principal",
               pattern: "perfilEntidad",
               defaults: new { controller = "Entidad", action = "perfilEntidad" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                name: "PerfilPrograma",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "PerfilPrograma",
                defaults: new { controller = "Plan", action = "PerfilPrograma" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                name: "BusquedaResultados",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "BusquedaResultados",
                defaults: new { controller = "Home", action = "BusquedaResultados" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                name: "ProcesoPresupuesto",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "ProcesoPresupuesto",
                defaults: new { controller = "Presupuesto", action = "ProcesoPresupuesto" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                name: "PresupuestoInversionPublica",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "PresupuestoInversionPublica",
                defaults: new { controller = "Presupuesto", action = "PresupuestoInversionPublica" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                name: "ParticipacionCiudadana",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "ParticipacionCiudadana",
                defaults: new { controller = "Participacion", action = "ParticipacionCiudadana" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                name: "Aprobar",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "Aprobar",
                defaults: new { controller = "Participacion", action = "Aprobar" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
               name: "VerificaCuenta",
               areaName: "PlataformaTransparencia.Modulo.Principal",
               pattern: "VerificaCuenta/{id***REMOVED***",
               defaults: new { controller = "Participacion", action = "VerificaCuenta" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                name: "DatosAbiertos",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "DatosAbiertos",
                defaults: new { controller = "DatosAbiertos", action = "DatosAbiertos" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                    name: "InversionesPrioritarias",
                    areaName: "PlataformaTransparencia.Modulo.Principal",
                    pattern: "InversionesPrioritarias",
                    defaults: new { controller = "Home", action = "InversionesPrioritarias" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                    name: "ArticulacionPlan",
                    areaName: "PlataformaTransparencia.Modulo.Principal",
                    pattern: "ArticulacionPlan",
                    defaults: new { controller = "Home", action = "ArticulacionPlan" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                        name: "PlanificacionResultados",
                        areaName: "PlataformaTransparencia.Modulo.Principal",
                        pattern: "PlanificacionResultados",
                        defaults: new { controller = "Home", action = "PlanificacionResultados" ***REMOVED***
            );


            routes.MapAreaControllerRoute(
                    name: "PresupuestoResultados",
                    areaName: "PlataformaTransparencia.Modulo.Principal",
                    pattern: "PresupuestoResultados",
                    defaults: new { controller = "Home", action = "PresupuestoResultados" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                name: "ElaboraPresupuesto",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "ElaboraPresupuesto",
                defaults: new { controller = "Presupuesto", action = "ElaboraPresupuesto" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                        name: "MarcoLegal",
                        areaName: "PlataformaTransparencia.Modulo.Principal",
                        pattern: "MarcoLegal",
                        defaults: new { controller = "CentroAyuda", action = "MarcoLegal" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                        name: "PoliticasdePrivacidad",
                        areaName: "PlataformaTransparencia.Modulo.Principal",
                        pattern: "PoliticasdePrivacidad",
                        defaults: new { controller = "CentroAyuda", action = "PoliticasdePrivacidad" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                        name: "TerminosyCondiciones",
                        areaName: "PlataformaTransparencia.Modulo.Principal",
                        pattern: "TerminosyCondiciones",
                        defaults: new { controller = "CentroAyuda", action = "TerminosyCondiciones" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                name: "POI",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "POI",
                defaults: new { controller = "Home", action = "POI" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                    name: "Plansectorial",
                    areaName: "PlataformaTransparencia.Modulo.Principal",
                    pattern: "Plansectorial",
                    defaults: new { controller = "Home", action = "Plansectorial" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                            name: "PEI",
                            areaName: "PlataformaTransparencia.Modulo.Principal",
                            pattern: "PEI",
                            defaults: new { controller = "Home", action = "PEI" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                name: "Contratos",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "Contratos",
                defaults: new { controller = "Contratos", action = "Contratos" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
              name: "Contrato",
              areaName: "PlataformaTransparencia.Modulo.Principal",
              pattern: "Contrato",
              defaults: new { controller = "Contratos", action = "Contrato" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
            name: "Contratista",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "Contratista",
            defaults: new { controller = "Contratos", action = "Contratista" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                    name: "PresupuestoGeneral",
                    areaName: "PlataformaTransparencia.Modulo.Principal",
                    pattern: "PresupuestoGeneral",
                    defaults: new { controller = "Presupuesto", action = "PresupuestoGeneral" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                    name: "prueba",
                    areaName: "PlataformaTransparencia.Modulo.Principal",
                    pattern: "prueba",
                    defaults: new { controller = "Presupuesto", action = "prueba" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                 name: "EntidadesGeneral",
                 areaName: "PlataformaTransparencia.Modulo.Principal",
                 pattern: "Entidades",
                 defaults: new { controller = "Entidad", action = "EntidadesGeneral" ***REMOVED***
             );

            routes.MapAreaControllerRoute(
              name: "ProcesoCiclo",
              areaName: "PlataformaTransparencia.Modulo.Principal",
              pattern: "Ciclo",
              defaults: new { controller = "Home", action = "ProcesoCiclo" ***REMOVED***
             );

            routes.MapAreaControllerRoute(
                name: "PerfilProyecto",
                areaName: "PlataformaTransparencia.Modulo.Principal",
                pattern: "{PerfilProyecto***REMOVED***/{id***REMOVED***",
                defaults: new { controller = "Proyecto", action = "PerfilProyecto" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
               name: "EmergenciaPresupuesto",
               areaName: "PlataformaTransparencia.Modulo.Principal",
               pattern: "EmergenciaPresupuesto",
               defaults: new { controller = "PresupuestoEmergencia", action = "EmergenciaPresupuesto" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
              name: "FinancialOrganization",
              areaName: "PlataformaTransparencia.Modulo.Principal",
              pattern: "FinancialOrganization",
              defaults: new { controller = "FinancialOrganization", action = "Index" ***REMOVED***
           );

            routes.MapAreaControllerRoute(
               name: "FinancialOrganization",
               areaName: "PlataformaTransparencia.Modulo.Principal",
               pattern: "FinancialOrganizationDetail",
               defaults: new { controller = "FinancialOrganization", action = "FinancialOrganizationDetail" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
                  name: "MapViewMobile",
                  areaName: "PlataformaTransparencia.Modulo.Principal",
                  pattern: "MapViewMobile",
                  defaults: new { controller = "Map", action = "MapViewMobile" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
            name: "PerfilSector",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "PerfilSector",
            defaults: new { controller = "Sectores", action = "PerfilSectores" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
            name: "Emergencia",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "Emergencia",
            defaults: new { controller = "Emergencias", action = "Emergencia" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
            name: "ContratosEmergencia",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "ContratosEmergencia",
            defaults: new { controller = "Emergencias", action = "ContratosEmergencia" ***REMOVED***
            );

            routes.MapAreaControllerRoute(
            name: "ProcesosCanceladosEmergencia",
            areaName: "PlataformaTransparencia.Modulo.Principal",
            pattern: "ProcesosCanceladosEmergencia",
            defaults: new { controller = "Emergencias", action = "ProcesosCanceladosEmergencia" ***REMOVED***
            );


            routes.MapAreaControllerRoute(
           name: "PresupuestoGeneralEmergencia",
           areaName: "PlataformaTransparencia.Modulo.Principal",
           pattern: "PresupuestoGeneralEmergencia",
           defaults: new { controller = "PresupuestoGeneralEmergencias", action = "PresupuestoGeneralEmergencia" ***REMOVED***
           );
    ***REMOVED***
***REMOVED***
***REMOVED***