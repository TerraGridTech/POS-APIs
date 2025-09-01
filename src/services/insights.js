require('dotenv').config(); 

process.env.APPLICATIONINSIGHTS_NO_STATSBEAT = 'true';

// Desativa a coleta de metadados da VM para evitar o erro 169.254.169.254
const appInsights = require('applicationinsights');

appInsights.setup(process.env.INSTRUMENTATION_KEY)
  .setAutoCollectConsole(true)
  .setAutoCollectExceptions(true)
  .setSendLiveMetrics(false)
  .start();

// Exporta o cliente de telemetria
const telemetryClient = appInsights.defaultClient;

module.exports = telemetryClient;
