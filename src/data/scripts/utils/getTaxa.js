export const getTaxa = (worksheet, taxa_cell_ref) => {
    try {
      const taxa_cell = worksheet[taxa_cell_ref];
      return taxa_cell && taxa_cell.w !== '#DIV/0!' ? taxa_cell.v : 0
    } catch (e) {
      return 0;
    }
  }