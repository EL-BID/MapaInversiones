using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PlataformaTransparencia.Infrastructura.DataModels;
using Microsoft.Extensions.Configuration;
using LinqToDB.AspNet;
using LinqToDB.AspNet.Logging;
using LinqToDB.Configuration;
using Microsoft.AspNetCore.Mvc.Razor;
using SolrNet;

namespace PlataformaTransparencia.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            
            services.AddOrchardCms();
            services
                .AddOrchardCore()
                .AddMvc()
                ;
            services.Configure<RazorViewEngineOptions>(o => {
                o.ViewLocationExpanders.Add(new MyViewLocationExpander());
            });
            services.AddLinqToDbContext<TransparenciaDB>((provider, options) =>
            {
                options
                .UseSqlServer(Configuration.GetConnectionString("PISGREntities"))
                .UseDefaultLogging(provider);
            });
            services.AddSolrNet<PlataformaTransparencia.Modelos.SolrResponse>(Configuration.GetValue<string>("ConnectionSearchEngine"));

            services.AddTransient(typeof(Negocios.Home.IConsolidadosNacionalesBLL), typeof(Negocios.Home.ConsolidadosNacionalesBLL));
            services.AddTransient(typeof(Negocios.Interfaces.IPlanNacionalBLL), typeof(Negocios.PlanNacional.PlanNacionalBLL));
            services.AddTransient(typeof(Negocios.Entidad.IEntidadBLL), typeof(Negocios.Entidad.EntidadBLL));

        }

        public void Configure(IApplicationBuilder app, IHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseStaticFiles();
            app.UseOrchardCore();
            
        }
    }
}
