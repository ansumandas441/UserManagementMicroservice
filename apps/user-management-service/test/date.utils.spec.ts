import { calculateMinMaxDate, formatDate } from "../src/utils/date.utils";

describe('calculateMinMaxDate', ()=>{
    let today = new Date();

    it('should return undefined for both minDate and maxDate missing', () => {
        let result = calculateMinMaxDate();
        expect(result.minDate).toBeUndefined();
        expect(result.maxDate).toBeUndefined();
    });

    it('should return only the minDate if only minAge is present', ()=>{
        let minAge = 10;
        let result = calculateMinMaxDate(minAge);

        let expectedMinDate = formatDate(new Date(today));
        expectedMinDate.setFullYear(expectedMinDate.getFullYear() - minAge);

        expect(result.minDate).toEqual(expectedMinDate);
        expect(result.maxDate).toBeUndefined();
    });

    it('should return only the maxDate if only maxAge is present', ()=>{
        let maxAge = 10;
        let result = calculateMinMaxDate(undefined, maxAge);

        let expectedMaxDate = formatDate(new Date(today));
        expectedMaxDate.setFullYear(expectedMaxDate.getFullYear() - maxAge);

        expect(result.minDate).toBeUndefined();
        expect(result.maxDate).toEqual(expectedMaxDate);
    });

    it('should return both maxDate and minDate if both maxAge and minAge are present', ()=>{
        let maxAge = 20;
        let minAge = 10;
        let result = calculateMinMaxDate(minAge, maxAge);

        let expectedMinDate = formatDate(new Date(today));
        let expectedMaxDate = formatDate(new Date(today));
        expectedMinDate.setFullYear(expectedMaxDate.getFullYear() - minAge);
        expectedMaxDate.setFullYear(expectedMaxDate.getFullYear() - maxAge);

        expect(result.minDate).toEqual(expectedMinDate);
        expect(result.maxDate).toEqual(expectedMaxDate);
    });

    it('should handle negative values', ()=>{
        let maxAge = -2;
        let minAge = 10;

        let result = calculateMinMaxDate(minAge, maxAge);
        expect(result.minDate).toBeUndefined();
        expect(result.maxDate).toBeUndefined();
    });

    it('should handle undefined values', ()=>{
        let result = calculateMinMaxDate(undefined, undefined);
        expect(result.minDate).toBeUndefined();
        expect(result.maxDate).toBeUndefined();
    });

});