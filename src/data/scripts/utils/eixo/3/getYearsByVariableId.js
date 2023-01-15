export const getYearsByVariableId = (variavel) => {
  const group_2007_2017 = [1, 3, 7, 11, 12, 13, 14, 15, 16]; // 2007 ATÉ 2017
  const group_2007_2016 = [4, 5, 6, 9]; // 2007 ATÉ 2016
  const group_2007_2015 = [8]; // 2007 ATÉ 2015
  const group_2014_2017 = [181, 182, 191, 192]; // 2014 ATÉ 2017
  
    if (group_2007_2017.includes(variavel))
      return ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"]
  
    if (group_2007_2016.includes(variavel))
      return ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016"]

    if (group_2007_2015.includes(variavel))
      return ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]

    if (group_2014_2017.includes(variavel))
      return ["2014", "2015", "2016", "2017"]

    return [];
}