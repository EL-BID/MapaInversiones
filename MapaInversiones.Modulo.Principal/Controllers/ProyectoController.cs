using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.Project;
//using iTextSharp.text;
//using iTextSharp.text.pdf;
//using iTextSharp.tool.xml;
//using iTextSharp.tool.xml.parser;
//using iTextSharp.tool.xml.pipeline.html;
//using iTextSharp.tool.xml.pipeline.css;
//using iTextSharp.tool.xml.pipeline.end;
using System.Drawing;
using System.Drawing.Drawing2D;
//using Document = iTextSharp.text.Document;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Http;
using PlataformaTransparencia.Negocios.Proyectos;
using PdfSharpCore.Pdf;
using PdfSharpCore.Drawing;
using Bet.Extensions.Wkhtmltopdf;
using Microsoft.Extensions.Configuration;
using PlataformaTransparencia.Negocios.Interfaces;
using PlataformaTransparencia.Modelos.Reportes;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  public class ProyectoController : Controller
  {
    private readonly ILogger<ProyectoController> _logger;
    private readonly TransparenciaDB _connection;
    private readonly IHostingEnvironment _hostingEnvironment;
    private readonly IHttpContextAccessor _context;
    private readonly IPdfGenerator _pdfGenerator;
    private readonly IConfiguration _configuration;
    private readonly IConsultasComunes _consultasComunes;


    public ProyectoController(IConsultasComunes consultasComunes, IConfiguration configuration, IPdfGenerator pdfGenerator, ILogger<ProyectoController> logger, TransparenciaDB connection, IHostingEnvironment hostingEnvironment, IHttpContextAccessor context)
    {
      _logger = logger;
      _connection = connection;
      _hostingEnvironment = hostingEnvironment;
      _context = context;
      _pdfGenerator = pdfGenerator;
      _configuration = configuration;
      _consultasComunes = consultasComunes;
***REMOVED***

    //public object GestorTitulos { get; private set; ***REMOVED***

    public IActionResult PerfilProyecto(int Id)
    {
             string id_usuario_aux;
         string nom_usuario_aux;
        id_usuario_aux = HttpContext.Session.GetString("IdUsuario");
            nom_usuario_aux = HttpContext.Session.GetString("NomUsuario");
            ProjectProfileContract proyectoContract = new ProjectProfileContract(Id, _connection, id_usuario_aux, nom_usuario_aux);
      proyectoContract.Fill();
      return View(proyectoContract.ModelProjectProfile);
***REMOVED***

    [HttpPost]
    //[ValidateInput(false)]
    public async Task<FileResult> GeneratePDF_ARC(string id_obj_pdf, int cant_cont, int annio = 0)
    {
      MemoryStream stream = new MemoryStream();
      //MemoryStream stream = new MemoryStream();
      //PdfDocument document = new PdfDocument();
      //PdfPage page = document.AddPage();
      //XGraphics gfx = XGraphics.FromPdfPage(page);
      //XFont font = new XFont("Arial", 20);
      //gfx.DrawString("Agregando texto en el centro de la página", font, XBrushes.Black, new XRect(0, 0, page.Width, page.Height), XStringFormats.Center);
      //gfx.DrawString("Agregando texto al final de la página", font, XBrushes.Blue, new XRect(0, 0, page.Width, page.Height), XStringFormats.BottomLeft);
      //document.Save(stream, false);
      //document.Close();
      if (!string.IsNullOrEmpty(id_obj_pdf))
      {
        var id = Convert.ToInt32(id_obj_pdf);
        BusquedasProyectosBLL nombreBll = new BusquedasProyectosBLL(_configuration, _connection, _consultasComunes);
        ProyectoPdf detalleProyecto = await nombreBll.ObtenerDataProyectoPdfAsync(id);
        //    detalleProyecto.CantidadContratos = cant_cont;
        //    detalleProyecto.AnnioContratos = annio;
        //    //List<ModeloAvanceFinancieroPorComponenteProducto> avanceFisicoInversion = new List<ModeloAvanceFinancieroPorComponenteProducto>();
        //    //detalleProyecto.avanceFisicoInversion = await nombreBll.ObtenerAvanceFisicoPorComponenteProductoFaseProyecto(Id, "Inversión");

        string html = GeneraHtmlString(detalleProyecto);
        byte[] byteArray = await _pdfGenerator.GetAsync(html, System.Threading.CancellationToken.None);
        stream = new MemoryStream(byteArray);
        
        //    var output = new MemoryStream();

        //    var input = new MemoryStream(Encoding.UTF8.GetBytes(outHtml));

        //    var document = new Document();
        //    var writer = PdfWriter.GetInstance(document, output);
        //    writer.CloseStream = false;

        //    document.Open();

        //    var htmlContext = new iTextSharp.tool.xml.pipeline.html.HtmlPipelineContext(null);
        //    htmlContext.SetTagFactory(iTextSharp.tool.xml.html.Tags.GetHtmlTagProcessorFactory());
        //    string contentRootPath = _hostingEnvironment.ContentRootPath;

        //    iTextSharp.tool.xml.pipeline.css.ICSSResolver cssResolver = XMLWorkerHelper.GetInstance().GetDefaultCssResolver(false);
        //    //?????cssResolver.AddCssFile(contentRootPath + "/vendor/bootstrap/css/bootstrap.min.css", true);
        //    //cssResolver.AddCssFile(contentRootPath + "/content/css/projects.css", true);
        //    //???????cssResolver.AddCssFile(contentRootPath + "/css/MTTheme.css", true);
        //    cssResolver.AddCss(".mainTit_t1 { font-size: 25px;line-height: 40px;font-weight:500 ***REMOVED***", true);
        //    cssResolver.AddCss(".mainTit_t2 { font-size: 24px;line-height: 40px;***REMOVED***", true);
        //    cssResolver.AddCss(".sub_t1_red {color: #5AB642;font-weight: 600  ***REMOVED***", true);
        //    cssResolver.AddCss(".sub_t2_red { color: #5AB642;font-weight: 600; ***REMOVED***", true);
        //    cssResolver.AddCss(".details {margin: auto 45px;  ***REMOVED***", true);
        //    cssResolver.AddCss(".section-projects h2 {text-align: center ***REMOVED***", true);
        //    cssResolver.AddCss("#section-projects h2 {font-size: 26px; ***REMOVED***", true);
        //    cssResolver.AddCss("h1 {font-size: 18px;text-transform: uppercase;***REMOVED***", true);
        //    cssResolver.AddCss("h2 {font-size: 20px; font-weight: 600;text-transform: uppercase;***REMOVED***", true);
        //    cssResolver.AddCss("h3 {font-size: 14px;text-transform: uppercase;***REMOVED***", true);
        //    cssResolver.AddCss(".optionList a { color: #ccc ***REMOVED***", true);
        //    cssResolver.AddCss("u { list-style: none; ***REMOVED***", true);
        //    cssResolver.AddCss("li { list-style: none; ***REMOVED***", true);
        //    cssResolver.AddCss(".details span { text-align: center;font-weight:200; ***REMOVED***", true);
        //    cssResolver.AddCss(".details span .h2 { font-size: 14px;***REMOVED***", true);
        //    cssResolver.AddCss(".izq { text-align:left; width: 50%;border:0; border-bottom-color:#CCD2D4;border-bottom-style: dashed; border-bottom-width: 1px; padding-bottom: 5px; padding-top: 5px;***REMOVED***", true);
        //    cssResolver.AddCss(".der { text-align:right; width: 50%; border:0; border-bottom-color:#CCD2D4;border-bottom-style: dashed; border-bottom-width: 1px;padding-top: 3px;***REMOVED***", true);
        //    cssResolver.AddCss(".whiteBg { background-color: rgba(255,255,255,0.95);color: #000 ; ***REMOVED***", true);
        //    cssResolver.AddCss(".separador { padding-bottom: 10px;  ***REMOVED***", true);
        //    cssResolver.AddCss(".separador_20 { padding-bottom: 30px;  ***REMOVED***", true);
        //    cssResolver.AddCss(".separador_5 { padding-bottom: 5px;  ***REMOVED***", true);
        //    cssResolver.AddCss(".separador_10 { padding-bottom: 10px;  ***REMOVED***", true);
        //    cssResolver.AddCss("p span { font-size:10px;  ***REMOVED***", true);
        //    cssResolver.AddCss(".h2 {font-size: 18px; font-weight: 600;text-transform: uppercase;***REMOVED***", true);
        //    cssResolver.AddCss(".tabla {  text-align:center;font-size:10px; ***REMOVED***", true);
        //    cssResolver.AddCss(".labelCategory { bottom: 0;left: 0;  width: 100%; height: 30px; top: 82%; color: #000; font-weight: 400;background-color: rgba(255,255,255,.7);font-weight: bold;", true);
        //    //cssResolver.AddCss(" {   ***REMOVED***", true);

        //    IPipeline pipeline = new iTextSharp.tool.xml.pipeline.css.CssResolverPipeline(cssResolver, new iTextSharp.tool.xml.pipeline.html.HtmlPipeline(htmlContext, new PdfWriterPipeline(document, writer)));

        //    var worker = new XMLWorker(pipeline, true);

        //    var p = new XMLParser(worker);
        //    p.Parse(input);

        //    document.Close();
        //    output.Position = 0;

        //    Random rnd = new Random();
        //    int cont = rnd.Next(1000, 1000001);
        //    return File(output.ToArray(), "application/pdf", "FichaProyecto_" + id_obj_pdf + "_" + cont.ToString() + ".pdf");

        //***REMOVED***
        //else {

        //    return null;

  ***REMOVED***
      return File(stream.ToArray(), "application/pdf", "FichaProyecto_" + id_obj_pdf + "_" + cant_cont.ToString() + ".pdf"); ;

***REMOVED***

    private string GeneraHtmlString(ProyectoPdf info)
    {
      string outTxt = "";
      //int idProyecto = info.ProjectId;
      string logo = "<div style='width:150px;padding;color:#0D382E;font-weight:600;'>MapaInversiones Honduras</div> <div class='separador'><img src='http://investmentmap.eastus.cloudapp.azure.com:8082/img/logoMIV.svg' width='50' height='50'></div>";
      string titulo_sector = "SECTOR "+ info.Resumen.Sector.ToString().ToUpper();
      string encabezado = "<div id='infoEncabezado' style='padding:10px;'>" +
                  "<div class='row'>" +
                   "<div class='col-md-12'>" +
                    "<h2 class='mainTit_t1 text-center'>" + info.Resumen.Nombre +
                    "</h2>" +
                    "<div class='separador_5'></div>" +
                    "<h3 class='sub_t1_red text-center'>" + titulo_sector + "</h3>" +
                    "<div class='sub_t2_red text-center'>";
      //if (info.EntesBeneficiados.Count < 4)
      //{
      //  var count = 0;
      //  var cant_items = info.EntesBeneficiados.Count;
      //  foreach (var item in info.EntesBeneficiados)
      //  {
      //    if (count < cant_items - 1)
      //    {
      //      encabezado += "<span>" + item.Nombre + ",</span>";
      //***REMOVED***
      //    else
      //    {
      //      encabezado += "<span>" + item.Nombre + "</span>";
      //***REMOVED***
      //    count++;
      //  ***REMOVED***
      //***REMOVED***
      //else
      //{
      //  var count = 0;
      //  foreach (var item in info.EntesBeneficiados)
      //  {
      //    if (count <= 2)
      //    {
      //      encabezado += "<span>" + item.Nombre + ",</span>";
      //***REMOVED***
      //    count++;
      //  ***REMOVED***
      //  encabezado += "<span> y otros " + (count - 3) + "</span>";
      //***REMOVED***
      encabezado += "</div>" +
      "</div></div><div class='separador_10'></div>" +
          "<div style='width:60%;'>" +
                      "<table class='tabla text-center'>" +
                                  "<tr>" +
                                   "<td style='padding:5px;'>" +
                                  "<span class='h2'>" + info.Resumen.Duracion + " </span>" +
                                  "<br/>" +
                                  "<span>Duración estimada del proyecto</span>" +
                                  "</td> " +
                                  "<td style='padding:5px;'>" +
                                  "<span class='h2'>L$ " + string.Format("{0:n0***REMOVED***", info.Resumen.CostoEstimado)+ " </span>" +
                                  "<br/>" +
                                  "<span>Costo estimado del proyecto</span>" +
                                  "</td>" +
                                  "<td style='padding:5px;'>" +
                                  "<span class='h2'>" + $"{info.Resumen.MonedaCostoProyecto***REMOVED*** " + string.Format("{0:n0***REMOVED***", info.Resumen.CostoOtraMoneda) + "</span>" +
                                  "<br/>" +
                                 "<span>Costo en otra moneda</span>" +
                                  "</td>" +
                                   "<td style='padding:5px;'>" +
                                  "<span class='h2'>" + $"{info.Resumen.MonedaCostoProyecto***REMOVED*** {info.Resumen.TasaCambio.ToString().Replace(',', '.')***REMOVED***" + "</span>" +
                                  "<br/>" +
                                  "<span>Tasa de cambio</span>" +
                              "</td>" +
                      "</tr>" +
              "</table>" +
          "</div>" +
      "</div><div class='separador_5'></div>";

      string objetivo = "<div class='separador_10'></div>" +
           "<div id='divObjectivoGeneral'>" +
           "<h2 class='text-center'>OBJETIVO GENERAL</h2>" +
           "<p>" + info.Resumen.Objetivo + "</p>" +
           "</div><div class='separador_5'></div>";

      string info_general = "";
      info_general += "<div id='divInfoPdf' style='text-center;width:100%'>" +
                     "<h2 class='text-center'>" + "INFORMACIÓN GENERAL DEL PROYECTO" + "</h2>" +
                        "<table style='width:100%;'>" +
                            "<tr style='width:100%;display:flex; border-bottom:1px solid #CCD2D4; overflow:hidden; padding:5px 0px'>" +
                                "<td style='text-align:left; width: 50%;border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px; padding-bottom: 5px; padding-top: 5px;'><span class=''>Institución Ejecutora Principal</span></td>" +
                                "<td style='text-align:right; width: 50%; border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px;padding-top: 3px;'><span class=''>" + info.InformacionGeneral.InstitucionEjecutoraPrincipal + "</span></td>" +
                            "</tr>" +
                            "<tr style='display:flex; border-bottom:1px solid #CCD2D4; overflow:hidden; padding:5px 0px'>" +
                                "<td style='text-align:left; width: 50%;border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px; padding-bottom: 5px; padding-top: 5px;'><span class=''>Etapa</span></td>" +
                                "<td style='text-align:right; width: 50%; border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px;padding-top: 3px;'><span class=''>" + info.InformacionGeneral.Etapa + "</span></td>" +
                            "</tr>" +
                            "<tr class='listDetail'>" +
                                "<td style='text-align:left; width: 50%;border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px; padding-bottom: 5px; padding-top: 5px;'><span class=''>Fase</span></td>" +
                                "<td style='text-align:right; width: 50%; border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px;padding-top: 3px;'><span class=''>" + info.InformacionGeneral.Fase + "</span></td>" +
                            "</tr>" +
                            "<tr class='listDetail'>" +
                                "<td style='text-align:left; width: 50%;border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px; padding-bottom: 5px; padding-top: 5px;'><span class=''>Estado</span></td>" +
                                "<td style='text-align:right; width: 50%; border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px;padding-top: 3px;'><span class=''>" + info.InformacionGeneral.Estado + "</span></td>" +
                            "</tr>" +
                            "<tr class='listDetail'>" +
                                "<td style='text-align:left; width: 50%;border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px; padding-bottom: 5px; padding-top: 5px;'><span class=''>Fecha de Inicio</span></td>" +
                                "<td style='text-align:right; width: 50%; border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px;padding-top: 3px;'><span class=''>" + info.InformacionGeneral.AnioInicio + "</span></td>" +
                            "</tr>" +
                            "<tr class='listDetail'>" +
                                "<td style='text-align:left; width: 50%;border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px; padding-bottom: 5px; padding-top: 5px;'><span>Fecha de Finalización</span></td>" +
                                "<td style='text-align:right; width: 50%; border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px;padding-top: 3px;'><span class=''>" + info.InformacionGeneral.AnioFinalizacion + "</span></td>" +
                            "</tr>" +
                            "<tr class='listDetail'>" + 
                                "<td style='text-align:left; width: 50%;border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px; padding-bottom: 5px; padding-top: 5px;'><span>Código BIP</span></td>" +
                                "<td style='text-align:right; width: 50%; border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px;padding-top: 3px;'><span class=''>" + info.InformacionGeneral.CodigoBIP + "</span></td>" +
                            "</tr>" +
                             "<tr class='listDetail'>" + 
                                "<td style='text-align:left; width: 50%;border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px; padding-bottom: 5px; padding-top: 5px;'><span>Hombres Beneficiarios</span></td>" +
                                "<td style='text-align:right; width: 50%; border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px;padding-top: 3px;'><span class=''>" + info.InformacionGeneral.TotalBeneficiariosHombres + "</span></td>" +
                            "</tr>" +
                            "<tr class='listDetail'>"+
                                "<td style='text-align:left; width: 50%;border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px; padding-bottom: 5px; padding-top: 5px;'><span>Mujeres Beneficiarios</span></td>" +
                                "<td style='text-align:right; width: 50%; border:0; border-bottom-color:#CCD2D4;border-bottom-style: solid; border-bottom-width: 1px;padding-top: 3px;'><span class=''>" + info.InformacionGeneral.TotalBeneficiariosMujeres + "</span></td>" +
                            "</tr>" +
                        "</table><div class='separador'>&nbsp;</div>" +
                        "<p> El ejecutor primario en este proyecto es " + info.InformacionGeneral.InstitucionEjecutoraPrincipal;
      info_general += " Está clasificado como proyecto de " + info.InformacionGeneral.Etapa + ".";
      info_general += "</p>" +
      "<p>El trabajo se inició en " + info.InformacionGeneral.FechaInicio + " y se proyecta que esté terminado en " + info.InformacionGeneral.FechaFinalizacion + ".";
      info_general += "</p>" + "</div>";

      string avance_financiero = info.InformacionFinanciera.AvanceFinanciero.ToString().Replace(',', '.');
      string num_financiero = $"{info.InformacionFinanciera.AvanceFinanciero.ToString().Replace(',', '.')***REMOVED*** %";
      string celda_aux_2 = "<td style='padding-bottom:5px;padding-right:5px;padding-top:5px;padding-left:5px;color:#ffffff;'>&nbsp;</td>";
      if (info.InformacionFinanciera.AvanceFinanciero <= 0)
      {
        num_financiero = "";
        avance_financiero = "0";
  ***REMOVED***
      else
      {
        if (info.InformacionFinanciera.AvanceFinanciero > 100)
        {
          avance_financiero = "100";
          celda_aux_2 = "";
    ***REMOVED***
  ***REMOVED***
      string grafica_avance_financiero = "<div class='separador_20'></div><div style='background-color:#fff;text-align:center;'><h2 class='text-center'>AVANCE FINANCIERO</h2></div>" +
  "<div id='prueba_info' style='background-color:#FFFFFF;'>" +
      "<table style='width:700px;height:30px;border:1px solid #e25126;'>" +
          "<tr>" +
              "<td style='padding-bottom:5px;padding-right:5px;padding-top:5px;padding-left:0px;'>" +
                  "<table style='width:700px;height:30px;'>" +
                      "<tr>";
      if (info.InformacionFinanciera.AvanceFinanciero >= 5)
      {
        grafica_avance_financiero += "<td style='background-color:#e25126;color:#c5d7d5;width:" + avance_financiero + "%;padding-bottom:10px;padding-right:0px;padding-top:10px;padding-left:0px;text-align:center;font-size:16px;'>" + num_financiero + "</td>";
        if (info.InformacionFinanciera.AvanceFinanciero < 100)
        {
          grafica_avance_financiero += celda_aux_2;
    ***REMOVED***
  ***REMOVED***
      else
      {
        grafica_avance_financiero += "<td style='background-color:#e25126;color:#c5d7d5;width:" + avance_financiero + "%;padding-bottom:10px;padding-right:0px;padding-top:10px;padding-left:0px;text-align:center;font-size:16px;'>" + "</td><td style='color:#e25126;padding-bottom:10px;padding-right:0px;padding-top:10px;padding-left:0px;text-align:left;font-size:16px;'>" + num_financiero + "</td>";
  ***REMOVED***
      grafica_avance_financiero += "</tr>" +
"</table>" +
"</td>" +
"</tr>" +
"</table>" +
"<table style='width:800px;'>" +
"<tr>" +
"<td style='width:10%;text-align:right;color:#c5d7d5;font-size:8px;'>|</td>" +
"<td style='width:10%;text-align:right;color:#c5d7d5;font-size:8px;'>|</td>" +
"<td style='width:10%;text-align:right;color:#c5d7d5;font-size:8px;'>|</td>" +
"<td style='width:10%;text-align:right;color:#c5d7d5;font-size:8px;'>|</td>" +
"<td style='width:10%;text-align:right;color:#c5d7d5;font-size:8px;'>|</td>" +
"<td style='width:10%;text-align:right;color:#c5d7d5;font-size:8px;'>|</td>" +
"<td style='width:10%;text-align:right;color:#c5d7d5;font-size:8px;'>|</td>" +
"<td style='width:10%;text-align:right;color:#c5d7d5;font-size:8px;'>|</td>" +
"<td style='width:10%;text-align:right;color:#c5d7d5;font-size:8px;'>|</td>" +
"<td style='width:10%;text-align:right;color:#c5d7d5;font-size:8px;'>|</td>" +
"</tr>" +
"<tr>" +
"<td style='width:10%;text-align:right;border-right-color:#cccccc;color:#666;font-size:14px;'></td>" +
"<td style='width:10%;text-align:right;border-right-color:#cccccc;color:#666;font-size:14px;'>20%</td>" +
"<td style='width:10%;text-align:right;border-right-color:#cccccc;color:#666;font-size:14px;'></td>" +
"<td style='width:10%;text-align:right;border-right-color:#cccccc;color:#666;font-size:14px;'>40%</td>" +
"<td style='width:10%;text-align:right;border-right-color:#cccccc;color:#666;font-size:14px;'></td>" +
"<td style='width:10%;text-align:right;border-right-color:#cccccc;color:#666;font-size:14px;'>60%</td>" +
"<td style='width:10%;text-align:right;border-right-color:#cccccc;color:#666;font-size:14px;'></td>" +
"<td style='width:10%;text-align:right;border-right-color:#cccccc;color:#666;font-size:14px;'>80%</td>" +
"<td style='width:10%;text-align:right;border-right-color:#cccccc;color:#666;font-size:14px;'></td>" +
"<td style='width:10%;text-align:right;border-right-color:#cccccc;color:#666;font-size:14px;'>100%</td>" +
"</tr>" +
"</table></div>";

      //COMPONENTES Y ACTIVIDADES

      string actividadesPorComponentes = "";

      if (info.ComponentesYActividades !=null && info.ComponentesYActividades.Count > 0)
      {
        actividadesPorComponentes = "<div class='separador_20'></div><div style='background-color:#fff;text-align:center;'><h2 class='text-center'>ACTIVIDADES POR COMPONENTES</h2></div>";
        int i = 0;
        int j = 0;
        int k = 0;
        foreach (var item in info.ComponentesYActividades)
        {
          actividadesPorComponentes += "<div class='BoxComFases'>";
          if (k.ToString() != item.CodigoComponente)
          {
            actividadesPorComponentes += "<div class='list-item'>" +
            "<span class='badge'>" + item.CodigoComponente.ToString() + "</span>" +
            "<span>" + item.CodigoComponente + "</span>" +
            "</div>";
      ***REMOVED***
          foreach (var actividad in item.ActividadesComponente)
          {
            actividadesPorComponentes += "<div class='wraptable-fase'><div class='wraptable-product'>" +
               "<div class='wproduct'>" +
                  "<div class='tproduct'>Actividad <br/>" +
                  "<span class='small'>" + actividad + "</span></div>" +
                 "</div>" +
               "</div>" +
               "</div>" +
              "</div></div>";
              i++;
              //j = item.IdentificadorFase;
             // k = item.CodComponente;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      //CONTRATOS
      //ModelInformacionContratos contratosListData = new ModelInformacionContratos();
      //FiltroContratos filtro = new FiltroContratos();
      //filtro.Annio = info.AnnioContratos;
      //filtro.IdProyecto = info.ProjectId;
      //filtro.RegistrosPorPagina = info.CantidadContratos;
      //filtro.NumeroPagina = 1;



      //contratosListData = BusquedaContratosBLL.ObtenerInformacionContratosPorFiltros(filtro);
      //string strListContratos = "";
      //if (contratosListData != null && contratosListData.CantidadTotalRegistros > 0)
      //{
      //  strListContratos += "<div class='separador_20'></div>";
      //  strListContratos += "<div class='col-md-12 mb50'><h2>PROCESOS Y CONTRATOS</h2></div>";
      //  strListContratos += "<div class='scrollBox' id='srcContratos'>";

      //  foreach (var cont in contratosListData.listInformacion)
      //  {

      //    strListContratos += "  <div class='contractBox'>";
      //    strListContratos += "  <div class='contractNumber'>";
      //    strListContratos += "  <span class=''>Código proceso: </span> ";
      //    strListContratos += "  <span class='text-bold'>" + cont.CodigoProceso + " </span>";
      //    strListContratos += "  </div> ";
      //    strListContratos += "  <div class='wrap-head-process'>     ";
      //    strListContratos += "  <div class='cotractName'>         ";
      //    strListContratos += "  <div class='row'>             ";
      //    strListContratos += "  <div class='col-xs-12 col-md-12'>                 ";
      //    strListContratos += "  <span class='small'>PROCESO</span>";
      //    strListContratos += "  <div class='clearfix'></div>                 ";
      //    strListContratos += "  <span class='h4'>" + cont.DescripcionProceso + "</span>             ";
      //    strListContratos += "  </div>         ";
      //    strListContratos += "  </div>     ";
      //    strListContratos += "  </div>     ";
      //    strListContratos += "  <div class='cotractName'>         ";
      //    strListContratos += "  <div class='row'>             ";
      //    strListContratos += "  <div class='col-xs-8 col-md-8'>                 ";
      //    strListContratos += "  <span class='small'> UNIDAD DE COMPRA</span>";
      //    strListContratos += "  <div class='clearfix'></div>                 ";
      //    strListContratos += "  <span class='h4'>" + cont.UnidadCompra + "</span>             ";
      //    strListContratos += "  </div>         ";
      //    strListContratos += "  </div>     ";
      //    strListContratos += "  </div>     ";
      //    strListContratos += "  <div class='contractData'>         ";
      //    strListContratos += "  <table style = 'width:90%;'> ";
      //    strListContratos += "  <tr> ";
      //    strListContratos += "  <td>";
      //    strListContratos += "  <span class='txt_small'>Estado</span><br/><span class='amount_adj'>" + cont.EstadoProceso + "</span>";
      //    strListContratos += "  </td>             ";
      //    strListContratos += "  <td>";
      //    strListContratos += "  <span class='txt_small'>Monto Estimado</span><br/>";
      //    strListContratos += "  <span class='amount_adj'>RD$ " + String.Format("{0:n2***REMOVED***", cont.MontoEstimadoProceso) + "</span>";
      //    strListContratos += "  </td>             ";
      //    strListContratos += "  <td>";
      //    strListContratos += "  <span class='txt_small'>Moneda</span><br/>";
      //    strListContratos += "  <span class='amount_adj'>DOP</span> ";
      //    strListContratos += "  </td>         ";
      //    strListContratos += "  </tr> <tr> <td> &nbsp;</td><td>&nbsp; </td> <td>&nbsp; </td>  </tr> <tr>          ";
      //    strListContratos += "  <td>";
      //    strListContratos += "  <span class='txt_small'>Fecha de inicio </span><br/>&nbsp;<br/>";
      //    strListContratos += "  <span class='amount_adj'>" + cont.FechaInicioContrato.ToString().Substring(0, cont.FechaInicioContrato.ToString().IndexOf(" ")) + "</span>";
      //    strListContratos += "  </td>";
      //    strListContratos += "  <td>";
      //    strListContratos += "  <span class='txt_small'>Fecha de Finalización</span><br/>&nbsp;<br/>";
      //    strListContratos += "  <span class='amount_adj'> " + cont.FechaFinContrato.ToString().Substring(0, cont.FechaFinContrato.ToString().IndexOf(" ")) + "</span>";
      //    strListContratos += "  </td>             ";
      //    strListContratos += "  <td>";
      //    strListContratos += "  <span class='txt_small'>Fecha estimada de<br/>adjudicación</span><br/>";
      //    strListContratos += "  <span class='amount_adj'>" + cont.FCH_ESTIMADA_ADJUDICACION.ToString().Substring(0, cont.FCH_ESTIMADA_ADJUDICACION.ToString().IndexOf(" ")) + "</span>";
      //    strListContratos += "  </td></tr></table>";
      //    strListContratos += "  </div> ";
      //    strListContratos += "  </div> ";
      //    strListContratos += "  </div> ";



      //  ***REMOVED***
      //  strListContratos += "</div>";
      //***REMOVED***

      //FOTOS OFICIALES PROYECTO
      //string str_fotos = "<div class='separador_20'></div><h2 class='text-center'>FOTOS OFICIALES</h2>";
      //List<Images> imagenes = BusquedasProyectosBLL.ObtenerImagenesParaProyecto(idProyecto);
      //if (imagenes.Count > 0)
      //{

      //  foreach (Images obj_img in imagenes)
      //  {
      //    string ruta = "";
      //    if (obj_img.large.IndexOf("http") > -1)
      //    {
      //      //externa
      //      ruta = obj_img.large;
      //***REMOVED***
      //    else
      //    {
      //      ruta = System.Web.Hosting.HostingEnvironment.MapPath("~/" + obj_img.large);
      //***REMOVED***
      //    //string img_url = "<img src=\"" + "http://mapaiapptestcr.eastus.cloudapp.azure.com/GaleriaEnteTerritorial/sanjose_central/143_SM.jpg" + "\"/>";
      //    if (!string.IsNullOrEmpty(ruta))
      //    {
      //      str_fotos += "<div class='enlace_img' style='max-width: 700px;'>" +
      // "<img src='" + ruta + "'/>" +
      // "<div class='labelCategory'>" +
      //     "<div class='col-md-11'>" +
      //         "<span style='color:#666;font-size:14px;font-weight:bold;'>" + obj_img.description + "</span>" +
      //         "<span style='color:#666;font-size:14px;font-weight:bold;'> - SUBIDO EL " + ((DateTime)obj_img.fechaFoto).ToString("MM-dd-yyyyy") + "</span>" +
      //     "</div>" +
      // "</div>" +
      // "</div>";
      //***REMOVED***



      //  ***REMOVED***
      //***REMOVED***
      //else
      //{

      //  str_fotos += "<div class='separador'></div><p>No existen imagenes aún para este proyecto</p>";
      //***REMOVED***



      outTxt += logo;
      outTxt += encabezado;
      outTxt += objetivo;
      outTxt += info_general;
      outTxt += grafica_avance_financiero;
      outTxt += actividadesPorComponentes;
      //outTxt += fuentes;
      //outTxt += strListContratos;
      //outTxt += str_fotos;
      return outTxt;


***REMOVED***


    //string avance_fisico = info.PorcentajeAvanceFinanciero.ToString().Replace(",", ".");
    //  string avance_financiero = info.PorcentajeAvanceFinanciero.ToString().Replace(",", ".");
    //  string num_fisico = info.PorcentajeAvanceFinanciero.ToString() + "%";
    //  string num_financiero = info.PorcentajeAvanceFinanciero.ToString() + "%";
    //  string celda_aux_2 = "<td style='padding-bottom:5px;padding-right:5px;padding-top:5px;padding-left:5px;color:#ffffff;'>&nbsp;</td>";


      //if (info.PorcentajeAvanceFinanciero <= 0)
      //{
      //  num_financiero = "";
      //  avance_financiero = "0";
      //***REMOVED***
      //else
      //{
      //  if (info.PorcentajeAvanceFinanciero > 100)
      //  {
      //    avance_financiero = "100";
      //    celda_aux_2 = "";

      //  ***REMOVED***

      //***REMOVED***

  ***REMOVED***
***REMOVED***
