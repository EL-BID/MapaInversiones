using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;


namespace PlataformaTransparencia.Negocios.Comunes
{
 
    public interface ICdnService
    {
        string Url(IUrlHelper url, string path);
    }

    public class CdnService : ICdnService
    {
        private readonly string _baseUrl;

        public CdnService(IConfiguration configuration)
        {
            _baseUrl = (configuration["CDN:BaseUrl"] ?? string.Empty).TrimEnd('/');
        }

        public string Url(IUrlHelper urlHelper, string path)
        {
            // "~" -> "/inversionesmap/css/styles.css"
            var localPath = urlHelper.Content(path);

            if (string.IsNullOrEmpty(_baseUrl))
            {
                // Dev / QA: usa wwwroot
                return localPath;
            }

            // Prod: usa CDN / Blob
            return $"{_baseUrl}{localPath}";
        }
    }
}
