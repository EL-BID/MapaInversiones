using Microsoft.AspNetCore.Mvc;
using PlataformaTransparencia.Modelos.OrganismoFinanciador;
using PlataformaTransparencia.Negocios.Interfaces;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  public class FinancialOrganizationController : Controller
  {
    private IFinanciadorBLL _financiadorBLL;
    public FinancialOrganizationController(IFinanciadorBLL financiadorBLL)
    {
      _financiadorBLL = financiadorBLL;
***REMOVED***
    public IActionResult Index()
    {
      ModelDataOrganismoFinanciador data = new()
      {
        Anios = _financiadorBLL.ObtenerAniosVistaPresupuesto()
  ***REMOVED***;
      return View(data);
***REMOVED***

    public IActionResult FinancialOrganizationDetail(int id, int anio)
    {
      ModelDetalleFinanciador data = new()
      {
        Anios= _financiadorBLL.ObtenerAniosVistaPresupuestoPorCodigoFinanciador(id),
        AnioSelected=anio,
        Nombre= _financiadorBLL.ObtenerNombreOrganismoPorCodigoFinanciador(id),
        Codigo=id
  ***REMOVED***;
      return View(data);
***REMOVED***
  ***REMOVED***
***REMOVED***
