import { Router } from "express";
import Eixo2Controller from '../controllers/Eixo2Controller.js';
import { asyncHandler } from '../utils.js';

const router = Router();

const controller = new Eixo2Controller();

/**
 * @swagger
 * paths:
 *  /api/eixo/2/bars?var={var}&uf={uf}&cad={cad}&deg={deg}:
 *    get:
 *      summary: Obter dados para visualização de série histórica
 *      tags: [Eixo 2]
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
 *          name: deg
 *          description: Identificador da subdesagregação
 *      description: Obter dados para visualização de série histórica no Eixo 1
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
 *                        example: 88773
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
 *                      atuacao:
 *                        type: string
 *                        description: Atuação selecionada
 *                        example: Todos
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
 *                      sdg_id:
 *                        type: integer
 *                        description: Identificador da desagregação
 *                        example: 0
 *                      sdg_nome:
 *                        type: string
 *                        description: Nome da desagregação
 *                        example: 0
 *                      sdg_cor:
 *                        type: string
 *                        description: Cor da desagregação
 *                        example: null
 *                      sdg_sub_id:
 *                        type: integer
 *                        description: Identificador da subdesagregação
 *                        example: 0
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
 *  /api/eixo/2/map?var={var}&ano={ano}&cad={cad}&deg={deg}&ocp={ocp}:
 *    get:
 *      summary: Obter dados para visualização de mapa do brasil
 *      tags: [Eixo 2]
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
 *          name: ocp
 *          description: Identificador da ocupação
 *      description: Obter dados para visualização de mapa do brasil no Eixo 1
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
 *                        example: 3972
 *                      percentual:
 *                        type: decimal
 *                        description: Valor percentual
 *                        example: 0.005447296854364352
 *                      taxa:
 *                        type: decimal
 *                        description: Taxa de variação
 *                        example: -0.029325513196480912
 *                      uf:
 *                        type: string
 *                        description: UF selecionada
 *                        example: Todos
 *                      uf_id:
 *                        type: integer
 *                        description: Identificador da UF selecionada
 *                        example: 0
 *                      ocp:
 *                        type: string
 *                        description: Nome da ocupação selecionada
 *                        example: Todos
 *                      ocp_id:
 *                        type: integer
 *                        description: Identificador da oUF selecionada
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
 *                        example: none
 *  
 */
router.get('/map', asyncHandler(controller.getMap));
/**
 * @swagger
 * paths:
 *  /api/eixo/2/lines?var={var}&uf={uf}&cad={cad}&deg={deg}&ocp={ocp}:
 *    get:
 *      summary: Obter dados para visualização de linhas
 *      tags: [Eixo 2]
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
 *          name: deg
 *          description: Identificador da subdesagregação
 *        - in: path
 *          name: ocp
 *          description: Identificador da ocupação
 *      description: Obter dados para visualização de linhas no Eixo 2
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
 *                        example: 589315
 *                      percentual:
 *                        type: decimal
 *                        description: Valor percentual
 *                        example: 1
 *                      taxa:
 *                        type: decimal
 *                        description: Taxa de variação
 *                        example: 0
 *                      ano:
 *                        type: string
 *                        description: Ano selecionado
 *                        example: Todos
 *                      grupo:
 *                        type: string
 *                        description: Nome da agregação
 *                        example: Todos
 *                      grupo_id:
 *                        type: integer
 *                        description: Identificador da agregação
 *                        example: 0
 *                      cor:
 *                        type: string
 *                        description: Cor do setor cultural selecionado
 *                        example: "#071342"
 *                      formato:
 *                        type: string
 *                        description: Formato dos dados amostrados
 *                        example: percent
 *  
 */
router.get('/lines', asyncHandler(controller.getLines));
/**
 * @swagger
 * paths:
 *  /api/eixo/2/treemap?var={var}&uf={uf}&deg={deg}&ocp={ocp}&ano={ano}:
 *    get:
 *      summary: Obter dados para visualização de treemap de setores culturais
 *      tags: [Eixo 2]
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
 *          name: ocp
 *          description: Identificador da ocupação
 *        - in: path
 *          name: deg
 *          description: Identificador da subdesagregação
 *        - in: path
 *          name: ano
 *          description: Identificador do ano
 *      description: Obter dados para visualização de treemap de setores culturais
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
 *                        example: 72344
 *                      percentual:
 *                        type: decimal
 *                        description: Valor percentual
 *                        example: 0.0992143110856331
 *                      taxa:
 *                        type: decimal
 *                        description: Taxa de variação
 *                        example: -0.033570674753196084
 *                      ano:
 *                        type: integer
 *                        description: Ano selecionado
 *                        example: 2015
 *                      grupo_nome:
 *                        type: string
 *                        description: Nome da agregação
 *                        example: Todos
 *                      grupo_id:
 *                        type: integer
 *                        description: Identificador da agregação
 *                        example: 0
 *                      item_nome:
 *                        type: string
 *                        description: Nome da agregação
 *                        example: Todos
 *                      item_id:
 *                        type: integer
 *                        description: Identificador da agregação
 *                        example: 0
 *                      cor:
 *                        type: string
 *                        description: Cor do setor cultural selecionado
 *                        example: "#071342"
 *                      formato:
 *                        type: string
 *                        description: Formato dos dados amostrados
 *                        example: percent
 *  
 */
router.get('/treemap', asyncHandler(controller.getTreemapSCC));
/**
 * @swagger
 * paths:
 *  /api/eixo/2/treemap-uf?var={var}&cad={cad}&deg={deg}&ocp={ocp}&ano={ano}:
 *    get:
 *      summary: Obter dados para visualização de treemap de estados
 *      tags: [Eixo 2]
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *          name: var
 *          description: Identificador da variável
 *        - in: path
 *          name: cad
 *          description: Identificador do setor cultural
 *        - in: path
 *          name: ocp
 *          description: Identificador da ocupação
 *        - in: path
 *          name: deg
 *          description: Identificador da subdesagregação
 *        - in: path
 *          name: ano
 *          description: Identificador do ano
 *      description: Obter dados para visualização de treemap de estados
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
 *                        example: 3972
 *                      percentual:
 *                        type: decimal
 *                        description: Valor percentual
 *                        example: 0.005447296854364352
 *                      taxa:
 *                        type: decimal
 *                        description: Taxa de variação
 *                        example: -0.029325513196480912
 *                      ano:
 *                        type: integer
 *                        description: Ano selecionado
 *                        example: 2015
 *                      grupo_nome:
 *                        type: string
 *                        description: Nome da agregação
 *                        example: Norte
 *                      grupo_id:
 *                        type: integer
 *                        description: Identificador do agrupamento (região)
 *                        example: 1
 *                      item_nome:
 *                        type: string
 *                        description: Nome da agregação
 *                        example: Rondônia
 *                      item_id:
 *                        type: integer
 *                        description: Identificador da UF
 *                        example: 11
 *                      cor:
 *                        type: string
 *                        description: Cor do setor cultural selecionado
 *                        example: "#071342"
 *                      formato:
 *                        type: string
 *                        description: Formato dos dados amostrados
 *                        example: none
 *  
 */
router.get('/treemap-uf', asyncHandler(controller.getTreemapUF));
/**
 * @swagger
 * paths:
 *  /api/eixo/2/donut?var={var}&uf={uf}&ano={ano}&deg={deg}:
 *    get:
 *      summary: Obter dados para visualização de donut
 *      tags: [Eixo 2]
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
 *          name: deg
 *          description: Identificador da subdesagregação
 *      description: Obter dados para visualização de donut
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
 *                        example: 131
 *                      percentual:
 *                        type: decimal
 *                        description: Valor percentual
 *                        example: 0.001218627323299038
 *                      taxa:
 *                        type: decimal
 *                        description: Taxa de variação
 *                        example: 0
 *                      ano:
 *                        type: string
 *                        description: Ano selecionado
 *                        example: 2015
 *                      item_nome:
 *                        type: string
 *                        description: Nome da agregação
 *                        example: Arquitetura e Design
 *                      item_id:
 *                        type: integer
 *                        description: Identificador do setor cultural
 *                        example: 1
 *                      cor:
 *                        type: string
 *                        description: Cor do setor cultural selecionado
 *                        example: "#87A8CA"
 *                      formato:
 *                        type: string
 *                        description: Formato dos dados amostrados
 *                        example: none
 *  
 */
router.get('/donut', asyncHandler(controller.getterDonut));
/**
 * @swagger
 * paths:
 *  /api/eixo/2/config?var={var}:
 *    get:
 *      summary: Obter dados da variável
 *      tags: [Eixo 2]
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
 *  /api/eixo/2/info?var={var}&uf={uf}&ano={ano}&deg={deg}&cad={cad}&ocp={ocp}:
 *    get:
 *      summary: Obter dados destaques
 *      tags: [Eixo 2]
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
 *          name: deg
 *          description: Identificador da subdesagregação
 *        - in: path
 *          name: cad
 *          description: Identificador do setor cultural
 *        - in: path
 *          name: ocp
 *          description: Identificador da ocupação
 *      description: Obter dados da variável
 *      responses: 
 *        200:
 *          description: Lista de valores dos anos disponíveis para os parâmetros selecionados.
 */
router.get('/info', asyncHandler(controller.getInfo));
/**
 * @swagger
 * paths:
 *  /api/eixo/2/visualization?var={var}&box={box}:
 *    get:
 *      summary: Obter visualização referente à caixa selecionada
 *      tags: [Eixo 2]
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

router.get('/csv', asyncHandler(controller.getCsv));

export default router;