const barsTitle = "Série Histórica {{ uf if uf }} {{ 'no setor ' + cad if cad }}";
const treemapSccTitle = "Treemap - Setores Culturais e Criativos {{ uf if uf }}";

export default
  [
    {
      variable: 1,
      boxes: [
        {
          box: 1,
          data: {
            charts: [
              {
                id: "map",
                label: "Mapa",
                title: "Mapa do Brasil",
              },
              {
                id: "treemap_uf",
                label: "Treemap",
                title: "Treemap UFs",
              }
            ]
          }
        },
        {
          box: 2,
          data: {
            charts: [
              {
                id: "bars",
                label: "Barras",
                title: barsTitle,
              }
            ]
          }
        },
        {
          box: 3,
          data: {
            charts: [
              {
                id: "treemap_scc",
                label: "Treemap",
                title: treemapSccTitle,
              }
            ]
          }
        }
      ]
    },
    {
      variable: 2,
      boxes: [
        {
          box: 1,
          data: {
            charts: [
              {
                id: "map",
                label: "Mapa",
                title: "Mapa do Brasil",
              }
            ]
          }
        },
        {
          box: 2,
          data: {
            charts: [
              {
                id: "bars",
                label: "Barras",
                title: barsTitle,
              }
            ]
          }
        },
        {
          box: 3,
          data: {
            charts: [
              {
                id: "treemap_scc",
                label: "Treemap",
                title: treemapSccTitle,
              }
            ]
          }
        }
      ]
    },
    {
      variable: 4,
      boxes: [
        {
          box: 1,
          data: {
            charts: [
              {
                id: "map",
                label: "Mapa",
                title: "Mapa do Brasil",
              }
            ]
          }
        },
        {
          box: 2,
          data: {
            charts: [
              {
                id: "bars",
                label: "Barras",
                title: barsTitle,
              }
            ]
          }
        },
        {
          box: 3,
          data: {
            charts: [
              {
                id: "lines",
                label: "Linhas",
                title: "Gráfico de Linhas",
              }
            ]
          }
        }
      ]
    },
    {
      variable: 5,
      boxes: [
        {
          box: 1,
          data: {
            charts: [
              {
                id: "map",
                label: "Mapa",
                title: "Mapa do Brasil",
              }
            ]
          }
        },
        {
          box: 2,
          data: {
            charts: [
              {
                id: "bars",
                label: "Barras",
                title: barsTitle,
              }
            ]
          }
        },
        {
          box: 3,
          data: {
            charts: [
              {
                id: "lines",
                label: "Linhas",
                title: "Gráfico de Linhas",
              }
            ]
          }
        }
      ]
    },
    {
      variable: 6,
      boxes: [
        {
          box: 1,
          data: {
            charts: [
              {
                id: "map",
                label: "Mapa",
                title: "Mapa do Brasil",
              }
            ]
          }
        },
        {
          box: 2,
          data: {
            charts: [
              {
                id: "bars",
                label: "Barras",
                title: barsTitle,
              }
            ]
          }
        },
        {
          box: 3,
          data: {
            charts: [
              {
                id: "bars",
                label: "Barras",
                title: "Série Por Setor",
                constants: {
                  concentracao: '1'
                },
              }
            ]
          }
        }
      ]
    },
    {
      variable: 7,
      boxes: [
        {
          box: 1,
          data: {
            charts: [
              {
                id: "map",
                label: "Mapa",
                title: "Mapa do Brasil",
              }
            ]
          }
        },
        {
          box: 2,
          data: {
            charts: [
              {
                id: "bars",
                label: "Barras",
                title: barsTitle,
              }
            ]
          }
        },
        {
          box: 3,
          data: {
            charts: [
              {
                id: "treemap_scc",
                label: "Treemap",
                title: treemapSccTitle,
              }
            ]
          }
        }
      ]
    },
    {
      variable: 9,
      boxes: [
        {
          box: 1,
          data: {
            charts: [
              {
                id: "map",
                label: "Mapa",
                title: "Mapa do Brasil",
              }
            ]
          }
        },
        {
          box: 2,
          data: {
            charts: [
              {
                id: "bars",
                label: "Barras",
                title: barsTitle,
              }
            ]
          }
        },
        {
          box: 3,
          data: {
            charts: [
              {
                id: "lines",
                label: "Linhas",
                title: "Gráfico de Linhas",
              }
            ]
          }
        }
      ]
    },
    {
      variable: 11,
      boxes: [
        {
          box: 1,
          data: {
            charts: [
              {
                id: "map",
                label: "Mapa",
                title: "Mapa do Brasil",
              }
            ]
          }
        },
        {
          box: 2,
          data: {
            charts: [
              {
                id: "bars",
                label: "Barras",
                title: barsTitle,
              }
            ]
          }
        },
        {
          box: 3,
          data: {
            charts: [
              {
                id: "lines",
                label: "Linhas",
                title: "Gráfico de Linhas",
              }
            ]
          }
        }
      ]
    },
    {
      variable: 12,
      boxes: [
        {
          box: 1,
          data: {
            charts: [
              {
                id: "bars",
                label: "Barras",
                title: "Série Histórica Por UF",
                constants: {
                  concentracao: 0
                }
              }
            ]
          }
        },
        {
          box: 2,
          data: {
            charts: [
              {
                id: "bars",
                label: "Barras",
                title: "Série Histórica Por Setor",
                constants: {
                  concentracao: 1
                }
              }
            ]
          }
        },
        {
          box: 3,
          data: {
            charts: [
              {
                id: "lines",
                label: "Linhas",
                title: "Gráfico de Linhas",
              }
            ]
          }
        }
      ]
    },
    {
      variable: 13,
      boxes: [
        {
          box: 1,
          data: {
            charts: [
              {
                id: "bars",
                label: "Barras",
                title: "Série Histórica Por UF",
                constants: {
                  concentracao: 0
                }
              }
            ]
          }
        },
        {
          box: 2,
          data: {
            charts: [
              {
                id: "bars",
                label: "Barras",
                title: "Série Histórica Por Setor",
                constants: {
                  concentracao: 1
                }
              }
            ]
          }
        },
        {
          box: 3,
          data: {
            charts: [
              {
                id: "lines",
                label: "Linhas",
                title: "Gráfico de Linhas",
              }
            ]
          }
        }
      ]
    },
    {
      variable: 14,
      boxes: [
        {
          box: 1,
          data: {
            charts: [
              {
                id: "bars",
                label: "Barras",
                title: "Série Histórica Por UF",
                constants: {
                  concentracao: 0
                }
              }
            ]
          }
        },
        {
          box: 2,
          data: {
            charts: [
              {
                id: "bars",
                label: "Barras",
                title: "Série Histórica Por Setor",
                constants: {
                  concentracao: 1
                }
              }
            ]
          }
        },
        {
          box: 3,
          data: {
            charts: [
              {
                id: "lines",
                label: "Linhas",
                title: "Gráfico de Linhas",
              }
            ]
          }
        }
      ]
    },
    {
      variable: 15,
      boxes: [
        {
          box: 1,
          data: {
            charts: [
              {
                id: "bars",
                label: "Barras",
                title: barsTitle,
                constants: {
                  cad: 0
                }
              }
            ]
          }
        },
        {
          box: 2,
          data: {
            charts: [
              {
                id: "bars",
                label: "Barras",
                title: barsTitle,
                constants: {
                  cad: 1
                }
              }
            ]
          }
        },
        {
          box: 3,
          data: {
            charts: [
              {
                id: "lines",
                label: "Linhas",
                title: "Gráfico de Linhas",
              }
            ]
          }
        }
      ]
    }
  ]