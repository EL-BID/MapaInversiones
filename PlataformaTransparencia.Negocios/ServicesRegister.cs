using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.DependencyInjection;
using PlataformaTransparencia.Infrastructura;

namespace PlataformaTransparencia.Negocios
{
    public class ServicesRegister
    {
        private readonly IServiceCollection _services;
        public ServicesRegister(IServiceCollection services)
        {
            _services = services;
    ***REMOVED***

        public void RegisterDBContext()
        {
            _services.AddTransient(typeof(LinqToDB.IDataContext),typeof(Infrastructura.DataModels.TransparenciaDB));
    ***REMOVED***
***REMOVED***
***REMOVED***
