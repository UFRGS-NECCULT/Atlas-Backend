const { getBars, getMaxValueSetor, getTotalBrasil, getTotalSumPrt, getAnoDefault, getterMapa, getterRegion } = require('./routes/eixo1');

/**
 * Registers the API routes to the application
 * @param {import('express').Application} app The express instance
 */
function registerRoutes(app) {
    app.get('/eixo/1/bars', getBars);
    app.get('/eixo/1/max-setor', getMaxValueSetor);
    app.get('/eixo/1/max-brasil', getTotalBrasil);
    app.get('/eixo/1/uf', getTotalSumPrt);
    app.get('/eixo/1/year', getAnoDefault);
    app.get('/eixo/1/map', getterMapa);
    app.get('/eixo/1/regions', getterRegion);
}

module.exports = {
    registerRoutes,
};