
export const formatDate = (currentDate: Date):Date=>{
  if(currentDate===undefined) {
    return undefined;
  }
  let newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  return newDate;
}

export const getStringDate = (currentDate: Date):string=>{
  if(currentDate===undefined) {
    return undefined;
  }
  let stringDate = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
  return stringDate;
}

export const calculateMinMaxDate = (minAge?: number, maxAge?: number): { minDate?: Date, maxDate?: Date }  => {
  if(minAge<0 || maxAge<0){
    return {}
  }
  const today = new Date();

  let minDate: Date | undefined;
  let maxDate: Date | undefined;

  if (minAge !== undefined) {
    minDate = new Date(today);
    minDate.setFullYear(minDate.getFullYear() - minAge);
    minDate = formatDate(minDate);
  }

  if (maxAge !== undefined) {
    maxDate = new Date(today);
    maxDate.setFullYear(maxDate.getFullYear() - maxAge);
    maxDate = formatDate(maxDate);
  }
  return {minDate, maxDate}
}
