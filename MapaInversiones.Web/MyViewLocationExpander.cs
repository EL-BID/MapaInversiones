using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Razor;

namespace PlataformaTransparencia.Web
{
    public class MyViewLocationExpander : IViewLocationExpander
    {
        public IEnumerable<string> ExpandViewLocations(ViewLocationExpanderContext context, IEnumerable<string> viewLocations)
        {
            if (context.ControllerName != null && context.AreaName.Equals("OrchardCore.Users")) {
                viewLocations = 
                  new[] { $"/Views/{context.AreaName}/{context.ControllerName}/{context.ViewName}{RazorViewEngine.ViewExtension}"
                      }.Concat(viewLocations); 
                return viewLocations;
            }

            return viewLocations;
        }

        public void PopulateValues(ViewLocationExpanderContext context)
        {
        }
    }
}
