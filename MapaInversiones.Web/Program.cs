using LinqToDB.AspNet;
using LinqToDB.AspNet.Logging;
using LinqToDB.Configuration;
using LinqToDB.Data;
using LinqToDB.DataProvider.SqlServer;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Negocios;
using Quartz;
using Quartz.AspNetCore;
using SolrNet;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//builder.Services.AddRazorPages();
builder.Services.AddOrchardCms();

var ConnectionString = builder.Configuration.GetConnectionString("Default").ToString();

builder.Services.AddLinqToDbContext<TransparenciaDB>((provider, options) => options
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

//AND Para participacion
builder.Services.AddHttpContextAccessor();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();
builder.Services.AddRouting();
//builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();
app.UseSession();

app.UseOrchardCore();

app.Run();

