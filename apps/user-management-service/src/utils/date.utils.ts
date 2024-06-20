const calculateMinMaxDate = (minAge?: number, maxAge?: number): { minDate?: Date, maxDate?: Date }  => {
    const today = new Date();

      let minDate: Date | undefined;
      let maxDate: Date | undefined;

      if (minAge !== undefined) {
        minDate = new Date(today);
        minDate.setFullYear(minDate.getFullYear() - minAge);
      }

      if (maxAge !== undefined) {
        maxDate = new Date(today);
        maxDate.setFullYear(maxDate.getFullYear() - maxAge);
      }
      return {minDate, maxDate}
}

export default calculateMinMaxDate;