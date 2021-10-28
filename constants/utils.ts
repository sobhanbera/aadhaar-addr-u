/**
 * @param {Array} array an array of any type of variables
 * @returns a random and shuffled order of the same array
 */
export function shuffleArray(array: Array<any>): Array<any> {
    var currIndex = array.length,
        temp,
        random;
    // the current index and random index variable with one temporary variable
    while (0 !== currIndex) {
        random = Math.floor(Math.random() * currIndex);
        currIndex -= 1;
        temp = array[currIndex];
        array[currIndex] = array[random];
        array[random] = temp;
    }
    return array;
}

/**
 * capitalize all words of a string
 * @param string the sentence or the statement
 * @returns a string which contains capital letter after each spaces...
 */
export function capitalizeWords(string: string): string {
    /**
     * we are converting the whole string to lowercase because
     * the input string may be like this:
     * Input:- THIS IS A SENTENCE OR STRING
     * Output:- THIS IS A SENTENCE OR STRING
     * But We Want:- This Is A Sentence Or String
     * that's why
     *
     * this is one of the edge case....
     */
    return string
        .toLowerCase()
        .replace(/(?:^|\s)\S/g, function (character) {
            // upper case character after every space
            return character.toUpperCase();
        })
        .replace(/(?:\.)\S/g, function (character) {
            /**
             * uppercase character after every period
             * this will be helpful to show artist name
             * like - a.r. rahman will be A.r. Rahman without this function
             * and with this function it will be A.R. Rahman
             * which is the correct format of the artists to show in the UI
             */
            return character.toUpperCase();
        })
        .trim();
}
