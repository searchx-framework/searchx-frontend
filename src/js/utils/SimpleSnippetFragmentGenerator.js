'use strict';

/*
 *  Simple snippet fragment generator
 *  Loosely based on the code available at https://github.com/dargaCode/ApartmentDescriptionHighlights/blob/master/snippet/snippet.js
 *  
 *  Author: David Maxwell
 *  Date: 2020-04-21
 *  
 *  Basic logic:
 *      1) Take the document narrative provided, split it into a series of "phrases", essentially sentences.
 *      2) Take the user's query, split it into tokens (split at a ' ').
 *      3) Filter the phrases to a set that contain a mention of at least one term from the user's query (doesn't matter what one).
 *      4) For each phrase that mentioned a term (from (3)), generate a string that spans TERM_COUNT_SxS in each direction from the term in the original phrase.
 *         For example, consider '-10 -9 -8 -7 -6 -5 -4 -3 -2 -1 <strong>TERM</strong> 1 2 3 4 5 6 7 8 9 10', where each number represents a term x steps away.
 *         Change TERM_COUNT_SxS from 10 to another value as desired.
 *      5) Merge the first NUMBER_OF_FRAGMENTS strings from (4) together, return that string.
 * 
 *  Simple, not brilliant, no ranking involved. Hopefully it is sufficient for our needs.
 */

const TERM_COUNT_SxS = 10; // How many terms do we want to appear either side of the query term in each fragment?
const NUMBER_OF_FRAGMENTS = 4; // How many text fragments do we want to produce overall?
// What characters end a fragment of text? Typically a sentence (. ! ?), but can be broken by semicolons, too.
const ENDING_CHARACTERS = [
    '.',
    '!',
    '?',
    ';',
  ];

// List of stopwords, used for removing stopwords from fragment selection.
// Source of stopwords list is here: https://gist.github.com/maxwelld90/6bafbf2570877c4d1de0
const STOPWORDS = [
    'a',
    'about',
    'above',
    'across',
    'after',
    'again',
    'against',
    'all',
    'almost',
    'alone',
    'along',
    'already',
    'also',
    'although',
    'always',
    'among',
    'an',
    'and',
    'another',
    'any',
    'anybody',
    'anyone',
    'anything',
    'anywhere',
    'are',
    'area',
    'areas',
    'around',
    'as',
    'ask',
    'asked',
    'asking',
    'asks',
    'at',
    'away',
    'b',
    'back',
    'backed',
    'backing',
    'backs',
    'be',
    'because',
    'become',
    'becomes',
    'became',
    'been',
    'before',
    'began',
    'behind',
    'being',
    'beings',
    'best',
    'better',
    'between',
    'big',
    'both',
    'but',
    'by',
    'c',
    'came',
    'can',
    'cannot',
    'case',
    'cases',
    'certain',
    'certainly',
    'clear',
    'clearly',
    'come',
    'could',
    'd',
    'did',
    'differ',
    'different',
    'differently',
    'do',
    'does',
    'done',
    'down',
    'downed',
    'downing',
    'downs',
    'during',
    'e',
    'each',
    'early',
    'either',
    'end',
    'ended',
    'ending',
    'ends',
    'enough',
    'even',
    'evenly',
    'ever',
    'every',
    'everybody',
    'everyone',
    'everything',
    'everywhere',
    'f',
    'face',
    'faces',
    'fact',
    'facts',
    'far',
    'felt',
    'few',
    'find',
    'finds',
    'first',
    'for',
    'four',
    'from',
    'full',
    'fully',
    'further',
    'furthered',
    'furthering',
    'furthers',
    'g',
    'gave',
    'general',
    'generally',
    'get',
    'gets',
    'give',
    'given',
    'gives',
    'go',
    'going',
    'good',
    'goods',
    'got',
    'great',
    'greater',
    'greatest',
    'group',
    'grouped',
    'grouping',
    'groups',
    'h',
    'had',
    'has',
    'have',
    'having',
    'he',
    'her',
    'herself',
    'here',
    'high',
    'higher',
    'highest',
    'him',
    'himself',
    'his',
    'how',
    'however',
    'i',
    'if',
    'important',
    'in',
    'interest',
    'interested',
    'interesting',
    'interests',
    'into',
    'is',
    'it',
    'its',
    'itself',
    'j',
    'just',
    'k',
    'keep',
    'keeps',
    'kind',
    'knew',
    'know',
    'known',
    'knows',
    'l',
    'large',
    'largely',
    'last',
    'later',
    'latest',
    'least',
    'less',
    'let',
    'lets',
    'like',
    'likely',
    'long',
    'longer',
    'longest',
    'm',
    'made',
    'make',
    'making',
    'man',
    'many',
    'may',
    'me',
    'member',
    'members',
    'men',
    'might',
    'more',
    'most',
    'mostly',
    'mr',
    'mrs',
    'much',
    'must',
    'my',
    'myself',
    'n',
    'necessary',
    'need',
    'needed',
    'needing',
    'needs',
    'never',
    'new',
    'newer',
    'newest',
    'next',
    'no',
    'non',
    'not',
    'nobody',
    'noone',
    'nothing',
    'now',
    'nowhere',
    'number',
    'numbers',
    'o',
    'of',
    'off',
    'often',
    'old',
    'older',
    'oldest',
    'on',
    'once',
    'one',
    'only',
    'open',
    'opened',
    'opening',
    'opens',
    'or',
    'order',
    'ordered',
    'ordering',
    'orders',
    'other',
    'others',
    'our',
    'out',
    'over',
    'p',
    'part',
    'parted',
    'parting',
    'parts',
    'per',
    'perhaps',
    'place',
    'places',
    'point',
    'pointed',
    'pointing',
    'points',
    'possible',
    'present',
    'presented',
    'presenting',
    'presents',
    'problem',
    'problems',
    'put',
    'puts',
    'q',
    'quite',
    'r',
    'rather',
    'really',
    'right',
    'room',
    'rooms',
    's',
    'said',
    'same',
    'saw',
    'say',
    'says',
    'second',
    'seconds',
    'see',
    'sees',
    'seem',
    'seemed',
    'seeming',
    'seems',
    'several',
    'shall',
    'she',
    'should',
    'show',
    'showed',
    'showing',
    'shows',
    'side',
    'sides',
    'since',
    'small',
    'smaller',
    'smallest',
    'so',
    'some',
    'somebody',
    'someone',
    'something',
    'somewhere',
    'state',
    'states',
    'still',
    'such',
    'sure',
    't',
    'take',
    'taken',
    'than',
    'that',
    'the',
    'their',
    'them',
    'then',
    'there',
    'therefore',
    'these',
    'they',
    'thing',
    'things',
    'think',
    'thinks',
    'this',
    'those',
    'though',
    'thought',
    'thoughts',
    'three',
    'through',
    'thus',
    'to',
    'today',
    'together',
    'too',
    'took',
    'toward',
    'turn',
    'turned',
    'turning',
    'turns',
    'two',
    'u',
    'under',
    'until',
    'up',
    'upon',
    'us',
    'use',
    'uses',
    'used',
    'v',
    'very',
    'w',
    'want',
    'wanted',
    'wanting',
    'wants',
    'was',
    'way',
    'ways',
    'we',
    'well',
    'wells',
    'went',
    'were',
    'what',
    'when',
    'where',
    'whether',
    'which',
    'while',
    'who',
    'whole',
    'whose',
    'why',
    'will',
    'with',
    'within',
    'without',
    'work',
    'worked',
    'working',
    'works',
    'would',
    'y',
    'year',
    'years',
    'yet',
    'you',
    'young',
    'younger',
    'youngest',
    'your',
    'yours'
];

/**
  * @desc Given a document narrative and a user's query, returns snippet fragment text. Query-biased summaries.
  * @param string $docText - the document narrative to extract candidate fragments from
  * @param string $queryTerms - the user's query
  * @return string - the complete snippet text for the document
*/
export function generateSnippetText(docText, queryTerms) {
    const phrases = splitDocumentIntoPhrases(docText);
    const searchTerms = splitQuery(queryTerms);
    
    const phraseMatches = phrases.filter(function(phrase) {
        return doesPhraseMatch(searchTerms, phrase);
    });

    const matchWindows = createFragmentWindows(searchTerms, phraseMatches);
    return matchWindows.slice(0, NUMBER_OF_FRAGMENTS).join(' ');
}

/**
  * @desc Given a searcher's query terms (as an array) and candidate phrases (fragments), returns a series of fragments that contain a query term (which is wrapped in HTML <strong> tags), plus ellipses at the start/end of the phrase.
  * @param array[string] $searchTerms - The user's query terms, as an array of strings
  * @param array[string] $phraseMatches - An array of phrases (fragments) that contain at least one term from the user's query
  * @return array[string] - An array of strings, representing complete fragments for selection/inclusion
*/
function createFragmentWindows(searchTerms, phraseMatches) {
    const windows = [];

    for (let matchedPhrase of phraseMatches) {
        for (let searchTerm of searchTerms) {
            let indexPosition = matchedPhrase.indexOf(searchTerm);

            if (indexPosition == -1) {
                continue;
            }

            let phraseTerms = matchedPhrase.split(' ');
            let termPosition = 0;

            for (let phraseTerm of phraseTerms) {
                if (phraseTerm.includes(searchTerm)) {
                    break;
                }

                termPosition++;
            }

            phraseTerms[termPosition] = '<strong>' + phraseTerms[termPosition] + '</strong>';

            if (termPosition < TERM_COUNT_SxS) {
                windows.push(phraseTerms.slice(0, termPosition+TERM_COUNT_SxS).join(' ') + '...');
            }
            else {
                windows.push('...' + phraseTerms.slice(termPosition-TERM_COUNT_SxS, termPosition+TERM_COUNT_SxS).join(' ') + '...');
            }
        }
    }

    return windows;
}

/**
  * @desc Using regular expressions, splits document text into phrases. Typically these are sentences. Returns an array of strings, with each string representing a phrase that can be used.
  * @param string $docText - String representation of the document narrative
  * @return array[string] - An array of sentences/phrases (one sentence/phrase per index position) from the document narrative
*/
function splitDocumentIntoPhrases(docText) {
    const endingCharacters = ENDING_CHARACTERS.join('');
    const phraseRegex = new RegExp(`.+?[${endingCharacters}]`,'g');
    const phrases = [];

    let matchInfo = [];

    while ((matchInfo = phraseRegex.exec(docText)) != null) {
        const match = matchInfo[0].trim();
        phrases.push(match);
    }

    return phrases;
}

/**
  * @desc Given a query string, returns an array of strings, with each object in the array representing a unique term in the query. We drop stopwords here.
  * @param string $queryTerms - The query string to consider
  * @return array[string] - The array representation of the user's query, sans stopwords. One term per object.
*/
function splitQuery(queryTerms) {
    const regex = new RegExp('([^\\w\\s]|_)', 'g');
    const cleanedText = queryTerms.replace(regex, '');
    const splitQuery = cleanedText.trim().toLowerCase().split(' ');
    
    /* Filter out stopwords, place them into stopwordsRemoved */
    const stopwordsRemoved = splitQuery.filter(function(term) {
        return isStopword(term);
    });

    return stopwordsRemoved;
}

/**
  * @desc Simple function that makes use of the STOPWORDS constant to determine if $term is a stopword or not (listed in STOPWORDS).
  * @param string $term - The term to consider
  * @return boolean - True iif the term appears in STOPWORDS; false otherwise
*/
function isStopword(term) {
    if (STOPWORDS.indexOf(term.toLowerCase()) == -1) {
        return true;
    }

    return false;
}

/**
  * @desc Given a phrase of text and a user's individual query terms, return true iif at least one of the query terms appears within the phrase. The first term that is matched, true is returned.
  * @param array[string] $searchTerms - Array of strings representing each query term
  * @param string $phrase - String representation of the candidate phrase
  * @return boolean - True iif the phrase contains a term in the query, false otherwise
*/
function doesPhraseMatch(searchTerms, phrase) {
    phrase = phrase.toLowerCase();

    for (let searchTerm of searchTerms) {
        const matchFound = phrase.includes(searchTerm);

        if (matchFound) {
            return true;
        }
    }
    
    return false;
}

/* Driver code */
if (require.main === module) {
    var docText = "The aetiology, origins, and diagnosis of severe acute respiratory syndrome Poon, LLM; Guan, Y; Nicholls, JM; Yuen, KY; Peiris, JSM The Lancet Infectious Diseases Summary Severe acute respiratory syndrome (SARS) is a new infectious disease that first emerged in Guangdong province, China, in November, 2002. A novel coronavirus was later identified in patients with SARS. The detection of the virus in these patients, its absence in healthy controls or other patients with atypical pneumonia, and the reproduction of a similar disease in a relevant animal model fulfilled Koch's postulates for implicating this coronavirus as the causal agent of SARS. The full genome sequence was determined within weeks of the virus's identification. The rapid progress in the aetiology, the development of laboratory diagnostic tests, and the defining of routes of viral transmission were facilitated through a unique WHO-coordinated virtual network of laboratories, which shared information on a real-time basis through daily teleconferences. Subsequent studies have indicated that the SARS coronavirus is of animal origin, that its precursor is still present in animal populations within the region, and that live-animal markets in southern China may have provided the animal-human interphase that allowed this precursor virus to adapt to human-human transmission. These findings underscore the potential for the re-emergence of SARS and the need for laboratory tests for early diagnosis. However, the low viral load in the respiratory tract makes early diagnosis of SARS a diagnostic challenge, although improvements in the sensitivity of molecular diagnostic methods continue to be made. Severe acute respiratory syndrome (SARS) is a new infectious disease that first emerged in Guangdong province, China, in November, 2002.";
    var queryTerms = 'aetiology virus origins was';

    generateSnippetText(docText, queryTerms);
}