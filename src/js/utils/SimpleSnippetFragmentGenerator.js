/*
 *  Simple snippet fragment generator
 *  Loosely based on the code available at https://github.com/dargaCode/ApartmentDescriptionHighlights/blob/master/snippet/snippet.js
 *  
 *  Author: David Maxwell
 *  Date: 2020-04-24
 *  
 *  Basic logic:
 *      1) Take the document narrative provided, split it into a series of "phrases", essentially sentences.
 *      2) Take the user's query, split it into tokens (split at a ' ').
 *      3) Filter the phrases to a set that contain a mention of at least one term from the user's query (doesn't matter what one).
 *      4) For each of the phrases, apply highlighting (<strong>) to the terms that match terms from the user's query.
 *      5) Apply some selection criteria to the phrases (in this case, ensure they are < 300 characters in length).
 *      6) Return the top NUMBER_OF_FRAGMENTS, joined into a single string.
 * 
 *  Simple, not brilliant, no ranking involved. Hopefully it is sufficient for our needs.
 */

const NUMBER_OF_FRAGMENTS = 3; // How many text fragments do we want to produce overall?
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

    const highlightedWindows = applyQueryBiasedTermHighlighting(searchTerms, phraseMatches);
    const selectedWindows = selectWindows(highlightedWindows);

    // Simple return the top NUMBER_OF_FRAGMENTS as part of the string.
    return selectedWindows.slice(0, NUMBER_OF_FRAGMENTS).join(' ');
}

/**
  * @desc Selects a series of phrases to use as candidates for snippet fragments. This applies a very simple rule, checking to see if the phrase is of a certain length. If less than that length, the phrase is included. Here, you'd ideally want to do some ranking.
  * @param array[string] $highlightedWindows - The array from applyQueryBiasedTermHighlighting
  * @return array[string] - The array of final candidates.
*/
function selectWindows(highlightedWindows) {
    const includedWindows = [];

    for (let window of highlightedWindows) {
        if (window.length < 300) {
            let styledWindow = window.slice(0, window.length - 1);

            if (styledWindow[0] !== styledWindow[0].toUpperCase()) {
                styledWindow = ['...', styledWindow].join('');
            }

            includedWindows.push([styledWindow, '...'].join(''));
        }
    }

    return includedWindows;
}

/**
  * @desc Given a user's query terms and document phrases, applies <strong> highlighting to the phrase (making it query-biased).
  * @param string $searchTerms - The array of the user's search terms
  * @param string $phraseMatches - The array of phrases to consider
  * @return array[string] - The array of updated phrases with term highlighting applied.
*/
function applyQueryBiasedTermHighlighting(searchTerms, phraseMatches) {
    const windows = [];

    for (let matchedPhrase of phraseMatches) {
        let updatedWindow = matchedPhrase;
        let matchedPhraseLower = matchedPhrase.toLowerCase();
        let positions = [];

        for (let searchTerm of searchTerms) {
            let indexPosition = matchedPhraseLower.indexOf(searchTerm);
            
            if (indexPosition !== -1) {
                let endPosition = indexPosition + searchTerm.length;
                positions.push({'start': indexPosition, 'end': endPosition});
            }
        }

        positions = positions.sort((a,b) => b.start-a.start);  // Sort by start position in descending order.

        for (let selection of positions) {
            updatedWindow = [updatedWindow.slice(0, selection['start']),
                            '<strong>',
                            updatedWindow.slice(selection['start'], selection['end']),
                            '</strong>',
                            updatedWindow.slice(selection['end'], updatedWindow.length)].join('');
            
            selection['end'] += 17;
            selection['start'] += 8;
        }

        windows.push(updatedWindow);
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

    docText = docText.replace(/\(|\)|\'|\"|\`\$/g, ''); //eslint-disable-line
    docText = docText.replace(/\:|\t|\/|\&|\,|\-|\+|\+|\<|\>|\%|\@|\\|\*/g, ' '); //eslint-disable-line

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
    const regex = new RegExp('([^\\w\\s-\_]|_)', 'g'); //eslint-disable-line
    let cleanedText = queryTerms.replace(regex, '');

    cleanedText = cleanedText.replace(/\(|\)|\'|\"|\`\$/g, ''); //eslint-disable-line
    cleanedText = cleanedText.replace(/\.|\:|\t|\/|\&|\,|\-|\?|\+|\+|\;|\<|\>|\%|\@|\\|\*/g, ' '); //eslint-disable-line

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
    if (STOPWORDS.indexOf(term.toLowerCase()) === -1) {
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
    //var docText = "Since December 2019, there has been a cluster of patients with pneumonia of previously unknown cause in Wuhan, China. Research by the Chinese Center for Disease Control and Prevention (China CDC) assessed the lower respiratory tracts of these patients and discovered a novel coronavirus, which has since been named the 2019 novel coronavirus (2019-nCoV) 1 . On February 11, 2020, the World Health Organization (WHO) officially named this novel coronavirus pneumonia as Coronavirus Disease 2019 (COVID- 19) , whereas the International Committee on Taxonomy of Viruses has named it as severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2). Huang and colleagues reported that the first 41 patients of COVID-19 exhibited fever, cough, myalgia, and/or fatigue as common symptoms, 29% of whom had acute respiratory distress syndrome (ARDS) and six of whom died (15%) 2 . The typical findings from chest computed tomographies (CTs) were bilateral ground-glass opacity and subsegmental areas of consolidation 2 . At earlier times during the COVID-19 outbreak, patients with COVID-19 were more likely to report exposure to food from the Huanan Seafood Wholesale Market. With the epidemic gradually growing, it is now clear that human-to-human transmission has been prevalent 3 Importantly, when assessing COVID-19, it is noteworthy that influenza viruses share common etiologies and occur in the same season. Recently, global influenza associated with respiratory mortality is occurring at a higher frequency than what has been previously reported 5 . From September 2019 through the present day, there have been more than 170,000 patients with influenza in the United States, more than half of whom have been infected with the influenza A (H1N1) virus. The percentage of deaths attributed to pneumonia induced by influenza is 6.8% 6 . During the H1N1 global epidemic in 2009, Jain et al. found that 5% of patients with H1N1 influenza were admitted to intensive care units (ICUs) and 7% died 7 . Another study from Canada showed that the overall mortality among critically ill H1N1 patients at 28 days was 14.3% 8 . The common symptoms of H1N1 infection include fever and productive cough, whereas gastrointestinal symptoms (e.g., nausea, vomiting, and diarrhea) are less common. Furthermore, ground-glass opacities are not commonly found in chest CTs from H1N1 patients 9 . Although these two respiroviruses have loomed as epidemics in different regions at present, such epidemics can easily propagate to further regions over time due to climate change and global travel by individuals. Because of their distinct treatments and prognoses, it is important for clinicians and epidemiologists to accurately identify these two respiroviral infections via their differential clinical manifestations. Therefore, the aim of this study was to compare the different clinical presentations between ARDS patients infected with COVID-19 versus H1N1 in order to provide some guidance for their differential diagnoses. This was a retrospective case-control study. All of the COVID-19 subjects were confirmed by laboratory tests and were hospitalized at Wuhan Pulmonary Hospital (Hubei Province of China) between December 24, 2019 and February 7, 2020. The H1N1 pneumonia cases were from a single-center prospective cohort study (Clincaltrials.gov, NCT 02738645) in regard to patients with H1N1-induced ARDS at Beijing Chao-Yang Hospital (China). All of the H1N1 cases were confirmed by laboratory tests and corresponding patients were Pulmonary Hospital (wufeilunli-2020-02) approved the collection of clinical data from the included patients with H1N1 or COVID-19 infections, respectively. For the H1N1 cohort, written informed consent was obtained from all of the patients or their legal guardians. For the COVID-19 cohort, informed consent from each patient was waived since we prospectively collected and analyzed all of the data from each patient according to the policy for public-health-outbreak investigation of emerging infectious diseases issued by the National Health Commission of the People's Republic of China. Demographic and clinical data of the patients were entered into an electronic case report form and included the following: demographic characteristics (age and sex), underlying diseases, comorbidities, clinical symptoms (fever, cough, sputum, dyspnea, chest pain, rash, nausea, vomiting, abdominal pain, diarrhea, and headache), signs (body temperature, heart rate, respiratory frequency, and blood pressure), laboratory tests (blood routine test, arterial blood gas analysis (ABG), and blood chemistry), and microbiological findings/images of the lung (chest CT). Antimicrobiological therapy, respiratory support, complications, and outcomes were also recorded. Diagnoses of patients infected with COVID-19 or H1N1 were based on clinical presentations, imaging characteristics, and the presence of either SARS-CoV-2 or H1N1 detected in samples from either the respiratory tract or blood. Data analysis was performed using SPSS 23.0 (IBM Corp., Armonk, NY) software. Categorical variables were summarized using frequencies and percentages, and continuous data are presented as the medians (interquartile ranges [IQRs]). The Mann-Whitney U test was used for continuous variables, and the χ2 test or Fisher's exact test was used for categorical variables. Variables with a p value < 0.05 in the univariate analysis were entered into multivariate logistic regression analysis to identify independent risk factors associated with COVID-19 or H1N1. All of the p values less than 0.05 were considered to be statistically significant. The median age of COVID-19 patients was 67 years old, which was significantly higher than that of H1N1 patients (52 years old, p<0.001). The proportion of males in COVID-19 patients was 61.5%, which was significantly lower than that of H1N1 patients (80.0%, p=0.011). In terms of underlying diseases, 31.5% of COVID-19 patients has a history of cardiovascular disease, whereas that of H1N1 patients was significantly lower, at 10.7% (p=0.002). There was no significant difference in the history of hypertension, diabetes, or chronic-airway diseases between the two groups. At the time of admission, septic shock occurred in 31.5% of patients with COVID-19, which was greater than that of H1N1 patients (13.3%, p<0.001). However, the median sequential organ failure assessment (SOFA) score and Acute Physiology and Chronic Health Evaluation II (APACHE II) score of COVID-19 patients were 2 and 11, respectively, which were lower than the scores of 5 (p<0.001) and 14 (p=0.019), respectively, for H1N1 patients. There was no significant difference in the duration of onset to ARDS, duration of onset to diagnose. (Table 1 ) Both of COVID-19 and H1N1 patients presented with fever, cough, and dyspnea, whereas hemoptysis was less common. Furthermore, 53.4% of COVID-19 patients had productive cough, which was significantly less than that of H1N1 patients (78.7%, p=0.002). The proportions of fatigue (63.0%), myalgia (37.0%), and gastrointestinal symptoms (34.2%) in patients with COVID-19 were higher than those of H1N1 patients (18.7%, p<0.001; 6.7%, p<0.001; and 14.7%, p=0.007; respectively) ( Table 2 ). The median partial pressure of oxygen (PaO 2 )/fractional inspired oxygen (FiO 2 ) was 198.2 mmHg, which was significantly higher than the 107.0 mmHg of H1N1 patients (p<0.001). Following biochemical testing, aspartate transaminase (AST), lactate dehydrogenase (LDH), and troponin I (TnI) levels in COVID-19 patients were all significantly lower than those in H1N1 patients (25.5 vs 70.0 U/L, 483 vs 767 U/L, and 0.03 vs 0.14 ng/ml, respectively; p<0.001 for each). Both COVID-19 and H1N1 patients exhibited impairments in cellular immune function. However, the median CD3 + lymphocyte concentration in COVID-19 patients was 193 cells/μl and the median CD4 + CD3 + lymphocyte concentration was 97 cells/μl, which were significantly lower than those in H1N1 patients (303 cells/ul, p=0.007; and 185 cells/ul, p<0.001; respectively) ( Table 3 ). In terms of imaging characteristics, ground-glass opacity in chest CTs was more common in COVID-19 patients (94.5%) than in H1N1 patients (45.3%, p<0.001). In contrast, consolidation was more common in H1N1 patients than in COVID-19 patients (p=0.042) ( Table 3 and Figure 1 ). All of the patients received antiviral therapies. Oseltamivir was administered in all of the H1N1 patients. However, COVID-19 patients had a variety of antiviral treatments, included 83.6% with lopinavir/ritonavir, 62.7% with interferon α2b, 46.6% with oseltamivir, 32.9% with ganciclovir, and 27.4% with traditional Chinese medicines. In addition to antiviral treatments, 79.5% of COVID-19 patients received glucocorticoids, which was significantly higher than the proportion of 49.3% in H1N1 patients (p<0.001). In contrast, there were no differences in the dosage or course of glucocorticoid treatments between the two groups. Immunoglobulin was administered in 58.9% of COVID-19 patients, which was higher than that administered to H1N1 patients (29.3%, p<0.001) ( Table 4 ). In terms of respiratory support, 67.1% of COVID-19 patients received conventional oxygen therapy (COT) as initial support, whereas 89.7% patients of H1N1 patients received mechanical ventilation (p<0.001). However, the failure rates of COT, high-flow nasal canula oxygen therapy (HFNC), and non-invasive mechanical ventilation (NIV) were higher than those in COVID-19 patients. During the entire process of treatment, the proportions of H1N1 patients who received HFNC, NIV, invasive mechanical ventilation (IMV), and extracorporeal membrane oxygenation (ECMO) were significantly higher than those of COVID-19 patients (p<0.05) ( Table 4 ). In terms of prognoses, 26 patients (17.6%) with COVID-19 were not discharged by the time that the present study was published. The in-hospital mortality of COVID-19 patients with ARDS patients was 28.8%, while that of H1N1 patients was 34.7% (p=0.483). And then SOFA socre was used to adjust the motality of these patients. SOFA-score adjusted mortality of H1N1 patients was significantly higher than that of COVID-19 patients with the rate ratio was 2.009 (95% CI [1.563, 2.583], p<0.001). There was no difference in the duration of hospitalization between COVID-19 patients (13 days) and H1N1 patients (16 days) ( Table 4 ). Variables with a p value<0.05 in the univariate analysis were entered into multivariate logistic regression analysis. Compared with parameters in COVID- 19 Figure 2 ). The outbreak of COVID-19 began in December 2019, which also corresponded with the flu season. In this study, we compare the clinical courses between COVID-19-induced and H1N1-induced ARDS patients. We found that compared with features in H1N1 patients, COVID-19 patients were more likely to exhibit non-productive cough with obvious constitutional symptoms, such as fatigue, gastrointestinal symptoms, and a prevalence in the elderly. Additionally, imaging results more commonly presented as ground-glass opacities in COVID-19 patients. However, although the conditions of H1N1 patients seemed to be more critical than those of COVID-19 patients, there was no difference in the prognoses between ARDS patients infected with COVID-19 versus H1N1. Huang et al. showed that 93% of the first 41 patients with COVID-19 received oseltamivir as an antiviral therapy 2 , which indicated that it was difficult to differentiate COVID-19 from influenza via only clinical manifestations prior to viral identification. Similar to H1N1, SARS-CoV-2 exhibits prevalent human-to-human transmission through close contact and its basic reproductive number is estimated to be 2.2 3 . However, the basic reproductive number estimated during the H1N1 outbreak in Mexico in 2009 ranged from 1.3-1.7 11 . Acute respiratory infection is always the initial manifestation of these two respiratory infectious diseases. Because of their different therapies, prognoses, and protective measures, it is important to differentiate these two diseases via early clinical presentations. Our present study revealed that COVID-19 manifested as non-productive cough with nonspecific systemic symptoms, which is consistent with previous studies. Wang et al. analyzed the clinical characteristics of 138 hospitalized COVID-19 patients and reported that fever, fatigue, and dry cough were the most common symptoms 12 , and that the mean incubation period was 5.2 days. However, in addition to fever and productive cough, rhinorrhea is more common in H1N1 patients, and the median incubation period of this virus is 2 days 9 . Therefore, we speculate from previous research and our present findings that COVID-19 infection may present as a slow onset with fewer productive coughs and more obvious systemic symptoms compared with the clinical presentations of H1N1 infection. In our study, we found that ground-glass opacity was more common in COVID-19 patients than in H1N1 patients, whereas consolidation was more frequent in H1N1 patients, which is consistent with previous studies. The radiological findings of 81 patients with COVID-19 pneumonia from Shi et al. showed that diffused bilateral ground-glass opacities were the most predominant pattern of abnormalities in chest CTs within 1-3 weeks after disease onset 13 . Additionally, studies on H1N1-associated pneumonia have shown that critical cases present as areas of consolidation on CTs, with or without ground-glass opacities 14, 15 . In addition to diffuse alveolar damage in pathological findings in lungs indicating ARDS, COVID-19 is accompanied by cellular fibromyxoid exudates 16 while H1N1 is accompanied by necrotizing bronchiolitis and extensive hemorrhage 17 . Therefore, these differential pathological changes may present as distinguishing imaging characteristics during clinical assessments. We also found that COVID-19 patients received a wider variety of treatments compared to those of H1N1 patients. In contrast to definitive treatment measures for H1N1 18 , there is no evidence to approve the effectiveness of any therapy for COVID-19. More than one hundred clinical studies have been carried out by Chinese researchers, and the interim research data may provide some help for the current urgent demand for COVID-19 drug treatments 19 . The application of glucocorticoids was common in both COVID-19 and H1N1 patients in our present study, but the proportion in COVID-19 patients was greater than that in H1N1 patients. However, there was no difference in the dosage or duration of glucocorticoids between these two groups. At present, the available observational data suggest that glucocorticoids for the treatment of respiratory infections increase mortality and secondary infection rates in influenza, impair clearance of SARS-CoV and MERS-CoV, and complicate corticosteroid therapies in survivors 20 . Therefore, indications for glucocorticoids should be carefully evaluated in such patients. Both COVID-19 and H1N1 infections may be accompanied by ARDS. Respiratory support in such cases should be in accordance with therapeutic strategies of ARDS 21 . In our study, we found that the severity of respiratory failure was not equal between COVID-19 and H1N1 patients. We found that PaO 2 /FiO 2 levels in COVID-19 patients were higher than those in H1N1 patients, such that respiratory support in COVID-19 patients was initially via non-invasive methods and ultimately yielded higher failure rates. The EOLIA trial 22 provided information about the posterior probability of a mortality benefit for patients with acute respiratory failure 23 , especially in terms of reporting the success of the application of ECMO in ARDS patients with influenza 24 . We speculate that ECMO may also have potential in treating COVID-19 patients. However, the rapid growth of cases and lack of medical resources and medical staff have limited standardized respiratory support in accordance with related guidelines. In the present study, the mortality of ARDS patients infected with COVID-19 was 28.8%. According to the median PaO 2 /FiO 2 of 198.5 mmHg in COVID-19 patients in the present study, the corresponding mortality rate was consistent with the ARDS definition 10 . Although H1N1 patients in this study exhibited significantly lower oxygenation than that of COVID-19 patients, there was no difference in the mortality rate between the two groups. From the adjusted mortality analysis, we found H1N1 patients had a significantly worse prognosis than COVID-19 patients. All of the included COVID-19 cases in the present study were at the early stage of this epidemic. The rapidly growing cases of unknown diseases, inadequate responses, insufficient medical staff, and lack of medical supplies have adversely affected the treatments and prognoses of COVID-19 cases. Therefore, as a novel respiratory infectious disease, the relatively higher mortality rate of COVID-19 cases is to be expected. From the experiences gained from treating early COVID-19 patients, subsequent cases may benefit from better and more standard therapies, including specific medical treatments and respiratory support. There were some limitations of our present study. First, this was a retrospective study that included data from two independent single-center cohorts, which may have resulted in unavoidable bias. Second, the conditions of H1N1 patients were more severe than those of the COVID-19 cohort, which may have led to statistical disequilibrium. Third, there were 35.6% of the COVID-19 patients still hospitalized at the time of manuscript submission that meaning the mortality rate presented in COVID-19 is likely an underestimate of the real overall hospital mortality rate. At last, the data from the H1N1 cohort originated from a three-year span, whereas the data from the COVID-19 cohort originated from only a one-month span, which may have also affected our present results. There were many differences between COVID-19 and H1N1-induced ARDS patients in clinical presentations. Compared with H1N1, patients with COVID-19 induced ARDS had lower severity of illness scores at presentation and lower SOFA-score adjusted mortality. Future studies investigating COVID-19 should focus on well-designed, prospective, case-controled trials with large sample sizes, which could provide more experience and evidence in regard to COVID-19 treatment measures. The aim of the study was to explore the different clinical presentations between COVID-19 and influenza A (H1N1) pneumonia in patients with ARDS. There were many differences between COVID-19 and H1N1-induced ARDS patients in clinical presentations and outcome. Compared with H1N1, patients with COVID-19 induced ARDS had lower severity of illness scores at presentation and lower SOFA-score adjusted mortality. ECMO, extracorporeal membrane oxygenation; PaO 2 , partial pressure of oxygen; PaCO 2 , partial pressure of carbon dioxide; FiO 2 , fractional inspired oxygen.";
    var docText = "This is a sample document containing informaton about the new respiratory virus, COVID-19. It contains information on the symptoms carriers typically exhibit, symptoms of which are of the disease that the virus causes."
    var queryTerms = 'covid-19 information';

    console.log(generateSnippetText(docText, queryTerms));
}