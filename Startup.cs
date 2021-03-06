﻿using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WebMail.Server;
using WebMail.Server.Extensions;
using Swashbuckle.AspNetCore.Swagger;
using System.Threading.Tasks;
using System.Net;
using WebMail.Server.SignalR;
using Microsoft.Extensions.Hosting;

namespace WebMail
{
    public class Startup
    {
        // Order or run
        //1) Constructor
        //2) Configure services
        //3) Configure

        private IWebHostEnvironment _hostingEnv;
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            _hostingEnv = env;

            Helpers.SetupSerilog();

            // var builder = new ConfigurationBuilder()
            //                .SetBasePath(env.ContentRootPath)
            //                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            //                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
            //                .AddEnvironmentVariables();
            // if (env.IsDevelopment())
            // {
            //     // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
            //     builder.AddUserSecrets<Startup>();
            // }

            // Configuration = builder.Build();
        }

        public static IConfiguration Configuration { get; set; }
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            if (_hostingEnv.IsDevelopment())
            {
                services.AddSslCertificate(_hostingEnv);
            }
            services.AddOptions();

            services.AddResponseCompression(options =>
            {
                options.MimeTypes = Helpers.DefaultMimeTypes;
            });

            services.AddCustomDbContext();

            services.AddCustomIdentity();

            services.AddCustomOpenIddict();

            services.AddMemoryCache();

            services.RegisterCustomServices();

            services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");

            services.AddSignalR();
            
            services.AddCustomizedMvc();

            // Node services are to execute any arbitrary nodejs code from .net
            services.AddNodeServices();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "WebMail", Version = "v1" });
            });
        }
        public void Configure(IApplicationBuilder app)
        {
            app.AddDevMiddlewares();

            if (_hostingEnv.IsProduction())
            {
                app.UseResponseCompression();
            }

            app.SetupMigrations();

            app.UseXsrf();

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                // http://stackoverflow.com/questions/25982095/using-googleoauth2authenticationoptions-got-a-redirect-uri-mismatch-error
                endpoints.MapControllerRoute(
                    name: "signin-google",
                    //template: "signin-google", 
                    pattern: "{controller=Account}/{action=ExternalLoginCallback}");

                endpoints.MapControllerRoute(
                    name: "spa-fallback",
                    pattern: "{controller=Home}/{action=Index}");

                endpoints.MapHub<Chat>("/chathub");
            });
        }
    }
}
