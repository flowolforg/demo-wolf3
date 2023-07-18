export default function combinationOfKeywords(words) {
//function createWordCombinations(words) {
  const result = [];

  // Eine Hilfsfunktion, um rekursiv alle Kombinationen zu erzeugen
  function combine(currentWords, remainingWords) {
    if (currentWords.length > 0) {
      const queryAND = currentWords;
      const queryNOT = words.filter((word) => !currentWords.includes(word));
      result.push({ queryAND, queryNOT });
    }

    for (let i = 0; i < remainingWords.length; i++) {
      const newRemainingWords = remainingWords.slice(i + 1);
      combine([...currentWords, remainingWords[i]], newRemainingWords);
    }
  }

  combine([], words);

  // Sortiert die Kombinationen, beginnend mit den längsten Wortkombinationen
  result.sort((a, b) => b.queryAND.length - a.queryAND.length);

  return result;

}
