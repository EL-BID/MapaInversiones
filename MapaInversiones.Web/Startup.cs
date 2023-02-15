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
using LinqToDB.DataProvider.SqlServer;
using LinqToDB.Data;
using System.Globalization;
using Microsoft.AspNetCore.Localization;

namespace PlataformaTransparencia.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
    ***REMOVED***
        public IConfiguration Configuration { get; ***REMOVED***

        public void ConfigureServices(IServiceCollection services)
        {
            
            services.AddOrchardCms();
            services
                .AddOrchardCore()
                .AddMvc()
                ;
            services.Configure<RazorViewEngineOptions>(o => {
                o.ViewLocationExpanders.Add(new MyViewLocationExpander());
        ***REMOVED***);
            services.AddLinqToDbContext<TransparenciaDB>((provider, options) =>
            {
                options
                .UseSqlServer(Configuration.GetConnectionString("Default"))
                .UseDefaultLogging(provider);
        ***REMOVED***);

            // Set connection configuration
            DataConnection
                .AddConfiguration(
                    "Default",
                    Configuration.GetConnectionString("Default"),
                    new SqlServerDataProvider("Default", SqlServerVersion.v2017, SqlServerProvider.SystemDataSqlClient));

            DataConnection.DefaultConfiguration = "Default";
            services.AddSolrNet<PlataformaTransparencia.Modelos.SolrResponse>(Configuration.GetValue<string>("ConnectionSearchEngine"));

            services.AddTransient(typeof(Negocios.Home.IConsolidadosNacionalesBLL), typeof(Negocios.Home.ConsolidadosNacionalesBLL));
            services.AddTransient(typeof(Negocios.Interfaces.IPlanNacionalBLL), typeof(Negocios.PlanNacional.PlanNacionalBLL));
            services.AddTransient(typeof(Negocios.Entidad.IEntidadBLL), typeof(Negocios.Entidad.EntidadBLL));
            services.AddTransient(typeof(Negocios.Interfaces.IPresupuestoBLL), typeof(Negocios.Presupuesto.PresupuestoBLL));
            services.AddTransient(typeof(Negocios.Interfaces.IGestorTitulos), typeof(Negocios.Comunes.GestorTitulos));
            services.AddTransient(typeof(Negocios.Interfaces.IConsultasComunes), typeof(Negocios.RepositorioConsultas.ConsultasComunes));
            services.AddTransient(typeof(Negocios.Interfaces.IBusquedasProyectosBLL), typeof(Negocios.Proyectos.BusquedasProyectosBLL));
            services.AddTransient(typeof(Negocios.Location.ILocationBLL), typeof(Negocios.Location.LocationBLL));
            services.AddTransient(typeof(Negocios.Interfaces.IGeneradorDatosProximidad), typeof(Negocios.Proyectos.GeneradorDatosProximidad));

            //AND Para participacion
            services.AddHttpContextAccessor();
            services.AddDistributedMemoryCache();
            services.AddSession();


    ***REMOVED***

        public void Configure(IApplicationBuilder app, IHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
        ***REMOVED***

            var supportedCultures = new[]
            {
             new CultureInfo("en-US"),
        ***REMOVED***;

            app.UseRequestLocalization(new RequestLocalizationOptions
            {
               DefaultRequestCulture = new RequestCulture("en-US"),
               // Formatting numbers, dates, etc.
               SupportedCultures = supportedCultures,
               // UI strings that we have localized.
               SupportedUICultures = supportedCultures
         ***REMOVED***);


            app.UseStaticFiles();
            app.UseSession();

            app.UseOrchardCore();
    ***REMOVED***
***REMOVED***
***REMOVED***
