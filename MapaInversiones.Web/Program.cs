using LinqToDB;
using LinqToDB.AspNet;
using LinqToDB.AspNet.Logging;
using LinqToDB.Configuration;
using LinqToDB.Data;
using LinqToDB.DataProvider.SqlServer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Localization;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Negocios;
using Quartz;
using Quartz.AspNetCore;
using SolrNet;
using System.Globalization;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//builder.Services.AddRazorPages();
builder.Services.AddOrchardCms();

var ConnectionString = builder.Configuration.GetConnectionString("Default").ToString();

builder.Services.AddLinqToDBContext<TransparenciaDB>((provider, options) => options
    .UseSqlServer(ConnectionString)
    .UseDefaultLogging(provider));

builder.Services.AddQuartz(q =>
{
    //q.UseMicrosoftDependencyInjectionScopedJobFactory();
    // Just use the name of your job that you created in the Jobs folder.
    var jobKey = new JobKey("SolrJob");
    q.AddJob<SolrJob>(opts => opts.WithIdentity(jobKey));

    q.AddTrigger(opts => opts
        .ForJob(jobKey)
        .WithIdentity("SolrJob-trigger")
        .WithCronSchedule(builder.Configuration.GetValue<string>("SolrCronExpression"))
    );
});

// ASP.NET Core hosting
builder.Services.AddQuartzServer(options =>
{
    options.WaitForJobsToComplete = true;
});



// Set connection configuration
DataConnection
    .AddConfiguration(
        "Default",
        ConnectionString,
       SqlServerTools.GetDataProvider(
            SqlServerVersion.v2017,
            SqlServerProvider.SystemDataSqlClient));

DataConnection.DefaultConfiguration = "Default";

builder.Services.AddSolrNet<PlataformaTransparencia.Modelos.SolrResponse>(builder.Configuration.GetValue<string>("ConnectionSearchEngine"));
builder.Services.AddTransient(typeof(PlataformaTransparencia.Negocios.Home.IHomeBLL), typeof(PlataformaTransparencia.Negocios.Home.HomeBLL));
builder.Services.AddTransient(typeof(PlataformaTransparencia.Negocios.Interfaces.IPlanNacionalBLL), typeof(PlataformaTransparencia.Negocios.PlanNacional.PlanNacionalBLL));
builder.Services.AddTransient(typeof(PlataformaTransparencia.Negocios.Entidad.IEntidadBLL), typeof(PlataformaTransparencia.Negocios.Entidad.EntidadBLL));
builder.Services.AddTransient(typeof(PlataformaTransparencia.Negocios.Interfaces.IPresupuestoBLL), typeof(PlataformaTransparencia.Negocios.Presupuesto.PresupuestoBLL));
builder.Services.AddTransient(typeof(PlataformaTransparencia.Negocios.Interfaces.IFinanciadorBLL), typeof(PlataformaTransparencia.Negocios.OrganismoFinanciador.FinanciadorBLL));
builder.Services.AddTransient(typeof(PlataformaTransparencia.Negocios.Interfaces.IGestorTitulos), typeof(PlataformaTransparencia.Negocios.Comunes.GestorTitulos));
builder.Services.AddTransient(typeof(PlataformaTransparencia.Negocios.Interfaces.IConsultasComunes), typeof(PlataformaTransparencia.Negocios.RepositorioConsultas.ConsultasComunes));
builder.Services.AddTransient(typeof(PlataformaTransparencia.Negocios.Interfaces.IBusquedasProyectosBLL), typeof(PlataformaTransparencia.Negocios.Proyectos.BusquedasProyectosBLL));
builder.Services.AddTransient(typeof(PlataformaTransparencia.Negocios.Location.ILocationBLL), typeof(PlataformaTransparencia.Negocios.Location.LocationBLL));
builder.Services.AddTransient(typeof(PlataformaTransparencia.Negocios.Interfaces.IGeneradorDatosProximidad), typeof(PlataformaTransparencia.Negocios.Proyectos.GeneradorDatosProximidad));
builder.Services.AddTransient(typeof(PlataformaTransparencia.Negocios.Interfaces.ISectorBLL), typeof(PlataformaTransparencia.Negocios.Sectores.SectorBLL));
builder.Services.AddTransient(typeof(PlataformaTransparencia.Negocios.Interfaces.IEmergenciaBLL), typeof(PlataformaTransparencia.Negocios.Emergencia.EmergenciaBLL));
builder.Services.AddTransient(typeof(PlataformaTransparencia.Negocios.Interfaces.IConsolidadosNacionalesBLL), typeof(PlataformaTransparencia.Negocios.Proyectos.ConsolidadosNacionalesBLL));
builder.Services.AddTransient(typeof(PlataformaTransparencia.Negocios.Comunes.IDatosAbiertosBLL), typeof(PlataformaTransparencia.Negocios.Comunes.DatosAbiertosBLL));
builder.Services.AddTransient(typeof(PlataformaTransparencia.Negocios.Interfaces.IPresupuestoEmergenciaBLL), typeof(PlataformaTransparencia.Negocios.Presupuesto.PresupuestoEmergenciaBLL));
builder.Services.AddSingleton(typeof(PlataformaTransparencia.Negocios.Comunes.ICdnService), typeof(PlataformaTransparencia.Negocios.Comunes.CdnService));

//AND Para participacion
builder.Services.AddHttpContextAccessor();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();
builder.Services.AddRouting();
builder.Services.AddHttpClient();
//builder.Services.AddControllersWithViews();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;
});

var app = builder.Build();

app.UseForwardedHeaders();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

var supportedCultures = new[]
{
 new CultureInfo("es-CO")
};
app.UseRequestLocalization(new RequestLocalizationOptions
{
    DefaultRequestCulture = new RequestCulture("es-CO"),
    // Formatting numbers, dates, etc.
    SupportedCultures = supportedCultures,
    // UI strings that we have localized.
    SupportedUICultures = supportedCultures
});


//app.UsePathBase("/testmapa");

app.UseStaticFiles();

app.UseRouting();

app.UseSession();

app.UseOrchardCore();

app.Run();

