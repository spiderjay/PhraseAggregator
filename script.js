function generate(){

    // get input values
    let charLimit = document.getElementById("chars").value;
    let phraseMax = document.getElementById("phrase").value;
    
    // build regex for unwanted words
    // NOTE: ideally input should be validated making sure there are no spaces
    //       and all words are separated with "|"
    let unwanted = document.getElementById("unwanted").value.replace(/\|/g, '\\b\|');
    let unwantedRegex = new RegExp("\\b(" + unwanted + ")", "g");
    
    // Get input
    let words = document.getElementById("input").value
                .toLowerCase()  // conver to lowercase
                .replace(/[.,\/#!$%\^&\*;:{}=\_`~()+]/g, ' ') // remove punctuation
                .replace(/\s+/g, ' '); // replace new lines, multiple spaces with single space

    // Separate out phrases (wrapped in double quotes) to new array
    let phrases = words.match(/".*?"/g); 

    words = words.replace(/".*?"/g, ' ') // remove phrases (anything in double quotes)
                 .replace(unwantedRegex, ' ') // next remove any connecting words (and,the,etc.)
                 .replace(/\s+/g, ' '); // and replace multiple spaces / new lines again 
        
    words = words.split(' '); // make into array

    // Strip out the double quotes from the array values
    if (phrases) {
        phrases = phrases.map(function(el){ return el.replace(/^"|"$/g, ""); });
        // Combine words and phrases arrays into single array (starting with phrases)
        words = phrases.concat(words);
    }
    
    words = words.filter( (word, index) => words.indexOf(word) === index); //Remove duplicate words
    //words = removeDuplicates(words); // supposedly faster / less performance intensive than using filter

    //words = words.filter( word => word.length <= charLimit);
    words = words.filter(function(el){ return el != '' }); // remove any empty elements

    let everyCombo = generateLists(words,charLimit);
    let possiblePhrases = everyCombo.filter( value => value.length <= charLimit);
    
    possiblePhrases.sort(function(a, b){
        return b.length - a.length;
    });


    let output = [];

    for(let phrases in possiblePhrases){
        possiblePhrases[phrases] = possiblePhrases[phrases].split(" ");
    }

    output[0] = (possiblePhrases[0]);

    possiblePhrases = possiblePhrases.splice(1, possiblePhrases.length + 1);

    while(!checkComplete(words, output, phraseMax)){
        let condensed = [];
        condensed = [].concat(...output);
        for(let i in possiblePhrases){
            if(possiblePhrases[i].filter(x => condensed.includes(x)).length == 0){
                output.push(possiblePhrases[i]);
                break;
            }
            else{
                possiblePhrases.slice(i, 1);
            }
        }

    }
    let outputText = "";
    output.forEach(n => {
        if(n){
            outputText += n.join(" ") + '\n';
        }
    });
    console.log(outputText);
    document.getElementById("output").value = outputText;
}

function generateLists(words,charLimit) {
    var result = [];
    var f = function(prefix, words) {
      var newWord;
      for (var i = 0; i < words.length; i++) {
        // append prefix if not empty
        newWord = prefix.length > 0 ? prefix+' '+words[i] : words[i];
        // only push to result array if charLimit not exceeded
        if (newWord.length <= charLimit) {
            result.push(newWord);
            f(newWord, words.slice(i + 1));
        }
      }
    }
    f('', words);
    return result;
}

function checkComplete(unique, outputArray, phraseMax){
    if(outputArray.length >= phraseMax){
        return true;
    }
    let count = 0;
    outputArray.forEach(n =>{
        if(n){
            count += n.length;
        }
    });
    return unique.length <= count;
}

function removeDuplicates(words){
    var seen = {};
    var out = [];
    var j = 0;
    for(var i = 0; i < words.length; i++) {
         var item = words[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}