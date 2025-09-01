// test-insights.js
const telemetryClient = require('../src/services/insights');

telemetryClient.trackException({ exception: new Error("Teste de erro no Application Insights") });

console.log("Exceção enviada.");
