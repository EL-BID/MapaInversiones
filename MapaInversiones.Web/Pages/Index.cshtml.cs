using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace PlataformaTransparencia.Web.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;

    public IndexModel(ILogger<IndexModel> logger)
    {
        _logger = logger;
***REMOVED***

    public IActionResult OnGet()
    {
        return Redirect("/Home");
***REMOVED***
***REMOVED***

