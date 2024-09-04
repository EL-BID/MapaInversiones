using Microsoft.Extensions.Configuration;
using PlataformaTransparencia.Negocios.BLL.Comunes;
using Quartz;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Negocios
{
    public class SolrJob : IJob
    {
        private readonly IConfiguration _config;

        public SolrJob(IConfiguration config)
        {
            _config = config;
        }
        public async Task Execute(IJobExecutionContext context)
        {
            try
            {
                var SolrURL = _config["ConnectionSearchEngine"];
                var topics = _config["Topics"].Split(';');
                int Sleeptime = int.Parse(_config["SolrUpdateRequestInterval"]) * 1000;

                using (HttpClient client = new HttpClient())
                {

                    var request = SolrURL + "/dataimport?command=full-import&commit=true";
                    string clean = "true";
                    int LoopNum = 1;
                    string tempstring = string.Empty;

                    foreach (var topic in topics)
                    {
                        if (LoopNum > 1) { clean = "false"; }
                        tempstring = "&clean=" + clean + "&entity=" + topic;

                        client.DefaultRequestHeaders.Accept.Add(
                            new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                        var response = await client.GetAsync(new Uri(request + tempstring));
                        //var content = response.Content.ReadAsStringAsync().Result;
                        System.Threading.Thread.Sleep(Sleeptime);
                        LoopNum += 1;
                    }

                } 



            }
            catch (Exception ex)
            {
                LogHelper.GenerateLog(ex);
            }
            return;
            //return Task.FromResult(true);

        }
    }
}
