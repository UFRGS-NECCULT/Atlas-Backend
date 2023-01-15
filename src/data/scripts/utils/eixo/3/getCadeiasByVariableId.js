export const getCadeiasByVariableId = (variavel) => {

    if(variavel === 181 || variavel === 182) {
      return [2,3,4, 5, 6, 8,9, 11, 0]
    }

    if(variavel === 191) {
      return [2,3,5, 8,11, 0]
    }

    if(variavel === 192 || variavel === 15 || variavel === 16) {
      return [0]
    }
  
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0]
}