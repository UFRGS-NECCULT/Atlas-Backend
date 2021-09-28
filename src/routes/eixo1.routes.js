import { Router } from "express";
import Eixo1Controller from '../controllers/Eixo1Controller.js';
import { asyncHandler } from '../utils.js';

export const router = Router();

const controller = new Eixo1Controller();

/**
 * @swagger
 * paths:
 *  /api/eixo/1/bars?var={var}&uf={uf}&cad={cad}&deg={deg}:
 *    get:
 *      summary: Obter dados para visualização de série histórica
 *      tags: [Eixo 1]
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
 *  /api/eixo/1/map?var={var}&ano={ano}&cad={cad}&deg={deg}&atc={atc}:
 *    get:
 *      summary: Obter dados para visualização de mapa do brasil
 *      tags: [Eixo 1]
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
 *          name: atc
 *          description: Identificador da atuação
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
 *                        example: 88773
 *                      percentual:
 *                        type: decimal
 *                        description: Valor percentual
 *                        example: 1
 *                      taxa:
 *                        type: decimal
 *                        description: Taxa de variação
 *                        example: 0
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
 *                        example: none
 *  
 */
router.get('/map', asyncHandler(controller.getterMapa));
/**
 * @swagger
 * paths:
 *  /api/eixo/1/lines?var={var}&uf={uf}&cad={cad}&deg={deg}:
 *    get:
 *      summary: Obter dados para visualização de linhas
 *      tags: [Eixo 1]
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
 *      description: Obter dados para visualização de linhas no Eixo 1
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
router.get('/lines', asyncHandler(controller.getterLinhas));
/**
 * @swagger
 * paths:
 *  /api/eixo/1/treemap?var={var}&uf={uf}&deg={deg}&atc={atc}&ano={ano}:
 *    get:
 *      summary: Obter dados para visualização de treemap de setores culturais
 *      tags: [Eixo 1]
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
 *          name: atc
 *          description: Identificador da atuação
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
 *                        example: 17219
 *                      percentual:
 *                        type: decimal
 *                        description: Valor percentual
 *                        example: 0
 *                      taxa:
 *                        type: decimal
 *                        description: Taxa de variação
 *                        example: 0.16017972427393998
 *                      ano:
 *                        type: string
 *                        description: Ano selecionado
 *                        example: Todos
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
router.get('/treemap', asyncHandler(controller.getTreemapCad));
/**
 * @swagger
 * paths:
 *  /api/eixo/1/treemap-uf?var={var}&cad={cad}&deg={deg}&atc={atc}&ano={ano}:
 *    get:
 *      summary: Obter dados para visualização de treemap de estados
 *      tags: [Eixo 1]
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
 *          name: atc
 *          description: Identificador da atuação
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
 *                        example: 812
 *                      percentual:
 *                        type: decimal
 *                        description: Valor percentual
 *                        example: 0
 *                      taxa:
 *                        type: decimal
 *                        description: Taxa de variação
 *                        example: 0.007553628904723809
 *                      ano:
 *                        type: string
 *                        description: Ano selecionado
 *                        example: Todos
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
 *                        example: percent
 *  
 */
router.get('/treemap-uf', asyncHandler(controller.getTreemapUF));

/**
 * @swagger
 * paths:
 *  /api/eixo/1/donut?var={var}&uf={uf}&ano={ano}&deg={deg}:
 *    get:
 *      summary: Obter dados para visualização de donut
 *      tags: [Eixo 1]
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
 *  /api/eixo/1/config?var={var}:
 *    get:
 *      summary: Obter dados da variável
 *      tags: [Eixo 1]
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
 *  /api/eixo/1/info?var={var}&uf={uf}&ano={ano}&deg={deg}&cad={cad}:
 *    get:
 *      summary: Obter dados destaques
 *      tags: [Eixo 1]
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
 *      description: Obter dados da variável
 *      responses: 
 *        200:
 *          description: Lista de valores dos anos disponíveis para os parâmetros selecionados.
 */
router.get('/info', asyncHandler(controller.getInfo));
/**
 * @swagger
 * paths:
 *  /api/eixo/1/visualization?var={var}&box={box}:
 *    get:
 *      summary: Obter visualização referente à caixa selecionada
 *      tags: [Eixo 1]
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