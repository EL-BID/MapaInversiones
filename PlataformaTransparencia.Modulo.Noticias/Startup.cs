using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using OrchardCore.Modules;
using System;

namespace PlataformaTransparencia.Modulo.Noticias
{
    public class Startup : StartupBase
    {
        public override void ConfigureServices(IServiceCollection services)
        {
        }

        public override void Configure(IApplicationBuilder builder, IEndpointRouteBuilder routes, IServiceProvider serviceProvider)
        {
            routes.MapAreaControllerRoute(
                name: "Noticias",
                areaName: "PlataformaTransparencia.Modulo.Noticias",
                pattern: "Noticias",
                defaults: new { controller = "Noticias", action = "Index" }
            );
        }
    }
}