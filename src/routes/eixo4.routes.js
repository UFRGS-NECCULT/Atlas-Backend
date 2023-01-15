import { Router } from "express";
import Eixo4Controller from '../controllers/Eixo4Controller.js';
import { asyncHandler } from '../utils.js';

const router = Router();

const controller = new Eixo4Controller();

/**
 * @swagger
 * paths:
 *  /api/eixo/4/bars?var={var}&uf={uf}&cad={cad}&prc={prc}&cns={cns}&tpo={tpo}:
 *    get:
 *      summary: Obter dados para visualização de série histórica
 *      tags: [Eixo 4]
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *          name: var
 *          description: Identificador da variável
 *        - in: path
 *          name: uf
 *          description: Identificador da UF
 *        - in: path
 *          name: cad
 *          description: Identificador do setor cultural
 *        - in: path
 *          name: prc
 *          description: Identificador do parceiro
 *        - in: path
 *          name: cns
 *          description: Identificador do Consumo/Bens
 *        - in: path
 *          name: tpo
 *          description: Identificador do tipo
 *      description: Obter dados para visualização de série histórica no Eixo 4
 *      responses: 
 *        200:
 *          description: Lista de valores dos anos disponíveis para os parâmetros selecionados.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                    type: object
 *                    properties:
 *                      valor:
 *                        type: decimal
 *                        description: Valor absoluto
 *                        example: 988151222.7008196
 *                      percentual:
 *                        type: decimal
 *                        description: Valor percentual
 *                        example: 1
 *                      taxa:
 *                        type: decimal
 *                        description: Taxa de variação
 *                        example: 0
 *                      variavel_id:
 *                        type: integer
 *                        description: Identificador da variável
 *                        example: 1
 *                      ano:
 *                        type: integer
 *                        description: Ano do respectivo valor
 *                        example: 2007
 *                      uf:
 *                        type: string
 *                        description: UF selecionada
 *                        example: Todos
 *                      uf_id:
 *                        type: integer
 *                        description: Identificador da UF selecionada
 *                        example: 0
 *                      cadeia:
 *                        type: string
 *                        description: Setor cultural selecionado
 *                        example: Todos
 *                      cadeia_id:
 *                        type: integer
 *                        description: Identificador do setor cultural selecionado
 *                        example: 0
 *                      parceiro:
 *                        type: string
 *                        description: Parceiro selecionado
 *                        example: Todos
 *                      parceiro_id:
 *                        type: integer
 *                        description: Identificador do parceiro selecionado
 *                        example: 0
 *                      consumo:
 *                        type: string
 *                        description: Consumo/Bens selecionado
 *                        example: Todos
 *                      consumo_id:
 *                        type: integer
 *                        description: Identificador do consumo/bens selecionado
 *                        example: 0
 *                      tipo:
 *                        type: string
 *                        description: Tipo selecionado
 *                        example: Exportação
 *                      tipo_id:
 *                        type: integer
 *                        description: Identificador do tipo selecionado
 *                        example: 1
 *                      cor:
 *                        type: string
 *                        description: Cor do setor cultural selecionado
 *                        example: "#071342"
 *                      cor_inferior:
 *                        type: string
 *                        description: Cor inferior do gradiente ao setor cultural selecionado
 *                        example: "#D9D5DE"
 *                      cor_superior:
 *                        type: string
 *                        description: Cor superior do gradiente ao setor cultural selecionado
 *                        example: "#685D78"
 *                      cor_eixo:
 *                        type: string
 *                        description: Cor do eixo selecionado
 *                        example: "#efc851"
 *                      formato:
 *                        type: string
 *                        description: Formato dos dados amostrados
 *                        example: none
 *  
 */
router.get('/bars', asyncHandler(controller.getBars));
/**
 * @swagger
 * paths:
 *  /api/eixo/4/map?var={var}&ano={ano}&cad={cad}&prc={prc}&cns={cns}&tpo={tpo}:
 *    get:
 *      summary: Obter dados para visualização de mapa do brasil
 *      tags: [Eixo 4]
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *          name: var
 *          description: Identificador da variável
 *        - in: path
 *          name: ano
 *          description: Identificador do ano
 *        - in: path
 *          name: cad
 *          description: Identificador do setor cultural
 *        - in: path
 *          name: deg
 *          description: Identificador da subdesagregação
 *        - in: path
 *          name: prc
 *          description: Identificador do parceiro
 *        - in: path
 *          name: cns
 *          description: Identificador do consumo/bens
 *        - in: path
 *          name: tpo
 *          description: Identificador do tipo
 *      description: Obter dados para visualização de mapa do brasil no Eixo 4
 *      responses: 
 *        200:
 *          description: Lista de valores dos anos disponíveis para os parâmetros selecionados.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                    type: object
 *                    properties:
 *                      valor:
 *                        type: decimal
 *                        description: Valor absoluto
 *                        example: 68447.06890662618
 *                      percentual:
 *                        type: decimal
 *                        description: Valor percentual
 *                        example: 0.00004903456848707352
 *                      taxa:
 *                        type: decimal
 *                        description: Taxa de variação
 *                        example: -0.11358559889493702
 *                      ano:
 *                        type: integer
 *                        description: Ano selecionado
 *                        example: 2015
 *                      uf:
 *                        type: string
 *                        description: UF selecionada
 *                        example: Todos
 *                      uf_id:
 *                        type: integer
 *                        description: Identificador da UF selecionada
 *                        example: 0
 *                      cadeia:
 *                        type: string
 *                        description: Setor cultural selecionado
 *                        example: Todos
 *                      cadeia_id:
 *                        type: integer
 *                        description: Identificador do setor cultural selecionado
 *                        example: 0
 *                      cor:
 *                        type: string
 *                        description: Cor do setor cultural selecionado
 *                        example: "#071342"
 *                      cor_inferior:
 *                        type: string
 *                        description: Cor inferior do gradiente ao setor cultural selecionado
 *                        example: "#D9D5DE"
 *                      cor_superior:
 *                        type: string
 *                        description: Cor superior do gradiente ao setor cultural selecionado
 *                        example: "#685D78"
 *                      cor_eixo:
 *                        type: string
 *                        description: Cor do eixo selecionado
 *                        example: "#efc851"
 *                      formato:
 *                        type: string
 *                        description: Formato dos dados amostrados
 *                        example: real
 *  
 */
router.get('/map', asyncHandler(controller.getMap));
/**
 * @swagger
 * paths:
 *  /api/eixo/4/world?var={var}&ano={ano}&cad={cad}&prc={prc}&cns={cns}&tpo={tpo}:
 *    get:
 *      summary: Obter dados para visualização de mapa do mundo
 *      tags: [Eixo 4]
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *          name: var
 *          description: Identificador da variável
 *        - in: path
 *          name: ano
 *          description: Identificador do ano
 *        - in: path
 *          name: cad
 *          description: Identificador do setor cultural
 *        - in: path
 *          name: deg
 *          description: Identificador da subdesagregação
 *        - in: path
 *          name: prc
 *          description: Identificador do parceiro
 *        - in: path
 *          name: cns
 *          description: Identificador do consumo/bens
 *        - in: path
 *          name: tpo
 *          description: Identificador do tipo
 *      description: Obter dados para visualização de mapa do mundo no Eixo 4
 *      responses: 
 *        200:
 *          description: Lista de valores dos anos disponíveis para os parâmetros selecionados.
 */
router.get('/world', asyncHandler(controller.getWorld));
/**
 * @swagger
 * paths:
 *  /api/eixo/4/treemap?var={var}&uf={uf}&ano={ano}&prc={prc}&cns={cns}&tpo={tpo}:
 *    get:
 *      summary: Obter dados para visualização de treemap de setores culturais
 *      tags: [Eixo 4]
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *          name: var
 *          description: Identificador da variável
 *        - in: path
 *          name: uf
 *          description: Identificador da UF
 *        - in: path
 *          name: prc
 *          description: Identificador do parceiro
 *        - in: path
 *          name: cns
 *          description: Identificador do consumo/bens
 *        - in: path
 *          name: tpo
 *          description: Identificador do tipo
 *        - in: path
 *          name: ano
 *          description: Identificador do ano
 *      description: Obter dados para visualização de treemap de setores culturais
 *      responses: 
 *        200:
 *          description: Lista de valores dos anos disponíveis para os parâmetros selecionados.
 *  
 */
router.get('/treemap', asyncHandler(controller.getTreemap));
/**
 * @swagger
 * paths:
 *  /api/eixo/4/treemap-uf?var={var}&ano={ano}&prc={prc}&cns={cns}&tpo={tpo}:
 *    get:
 *      summary: Obter dados para visualização de treemap de setores culturais
 *      tags: [Eixo 4]
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *          name: var
 *          description: Identificador da variável
 *        - in: path
 *          name: cad
 *          description: Identificador do setor
 *        - in: path
 *          name: prc
 *          description: Identificador do parceiro
 *        - in: path
 *          name: cns
 *          description: Identificador do consumo/bens
 *        - in: path
 *          name: tpo
 *          description: Identificador do tipo
 *        - in: path
 *          name: ano
 *          description: Identificador do ano
 *      description: Obter dados para visualização de treemap de setores culturais
 *      responses: 
 *        200:
 *          description: Lista de valores dos anos disponíveis para os parâmetros selecionados.
 *  
 */
router.get('/treemap-uf', asyncHandler(controller.getTreemapUF));

/**
 * @swagger
 * paths:
 *  /api/eixo/4/donut?var={var}&uf={uf}&ano={ano}&deg={deg}:
 *    get:
 *      summary: Obter dados para visualização de donut
 *      tags: [Eixo 4]
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *          name: var
 *          description: Identificador da variável
 *        - in: path
 *          name: uf
 *          description: Identificador da UF
 *        - in: path
 *          name: ano
 *          description: Identificador do ano
 *        - in: path
 *          name: cad
 *          description: Identificador do setor cultural
 *        - in: path
 *          name: prc
 *          description: Identificador do parceiro
 *        - in: path
 *          name: cns
 *          description: Identificador do consumo/bens
 *      description: Obter dados para visualização de donut
 *      responses: 
 *        200:
 *          description: Lista de valores dos anos disponíveis para os parâmetros selecionados.
 *  
 */
router.get('/donut', asyncHandler(controller.getDonut));
/**
 * @swagger
 * paths:
 *  /api/eixo/4/config?var={var}:
 *    get:
 *      summary: Obter dados da variável
 *      tags: [Eixo 4]
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *          name: var
 *          description: Identificador da variável
 *      description: Obter dados da variável
 *      responses: 
 *        200:
 *          description: Lista de valores dos anos disponíveis para os parâmetros selecionados.
 */
router.get('/config', asyncHandler(controller.getConfig));

/**
 * @swagger
 * paths:
 *  /api/eixo/4/info?var={var}&uf={uf}&ano={ano}&prc={prc}&cad={cad}&cns={cns}&tpo={tpo}:
 *    get:
 *      summary: Obter dados destaques
 *      tags: [Eixo 4]
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *          name: var
 *          description: Identificador da variável
 *        - in: path
 *          name: uf
 *          description: Identificador da UF
 *        - in: path
 *          name: ano
 *          description: Identificador do ano
 *        - in: path
 *          name: prc
 *          description: Identificador do parceiro
 *        - in: path
 *          name: cad
 *          description: Identificador do setor cultural
 *        - in: path
 *          name: cns
 *          description: Identificador do consumo/bens
 *        - in: path
 *          name: tpo
 *          description: Identificador do tipo
 *      description: Obter dados da variável
 *      responses: 
 *        200:
 *          description: Lista de valores dos anos disponíveis para os parâmetros selecionados.
 */
router.get('/info', asyncHandler(controller.getInfo));
/**
 * @swagger
 * paths:
 *  /api/eixo/4/visualization?var={var}&box={box}:
 *    get:
 *      summary: Obter visualização referente à caixa selecionada
 *      tags: [Eixo 4]
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *          name: var
 *          description: Identificador da variável
 *        - in: path
 *          name: box
 *          description: Identificador da caixa
 *      description: Obter visualização referente à caixa selecionada
 *      responses: 
 *        200:
 *          description: Lista de valores dos anos disponíveis para os parâmetros selecionados.
 */
router.get('/visualization', asyncHandler(controller.getVisualization));

export default router;