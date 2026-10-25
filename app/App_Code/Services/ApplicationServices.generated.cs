using FreeTrial.Handlers;
using FreeTrial.Data;
using FreeTrial.Web;
using System.Web.Configuration;

namespace FreeTrial.Services
{
    public class AppFrameworkConfig
    {

        public virtual void Initialize()
        {
            ApplicationServices.FrameworkAppName = "DrawingGen";
            ApplicationServices.Version = "8.9.47.0";
            ApplicationServices.HostVersion = "1.2.5.0";
            var releaseMode = true;
            AquariumExtenderBase.EnableMinifiedScript = releaseMode;
            AquariumExtenderBase.EnableCombinedScript = releaseMode;
            ApplicationServices.EnableMinifiedCss = releaseMode;
            ApplicationServices.EnableCombinedCss = releaseMode;
            CultureManager.SupportedCultures = new string[] {
                    "en-IN,en-US"};
            ApplicationServicesBase.AuthorizationIsSupported = false;
            BlobFactoryConfig.Initialize();
        }
    }
}
