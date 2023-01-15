export const getPercentPaddingByVariableId = (variavel) => {
    const group_O_B = [1, 4, 5];
    const group_N_B = [3, 11, 12]
    const group_M_B = [181, 182]
    const group_J_B = [191]
    const group_E_B = [192]

    if(group_O_B.includes(variavel)) {
        return 14 - 1;
    }

    if(group_N_B.includes(variavel)) {
      return 13 - 1
    }

    if(group_M_B.includes(variavel)) {
        return 12 - 1
    }

    if(group_J_B.includes(variavel)) {
        return 9 - 1
    }

    if(group_E_B.includes(variavel)) {
        return 4 - 1
    }

    return 14 - 1
}