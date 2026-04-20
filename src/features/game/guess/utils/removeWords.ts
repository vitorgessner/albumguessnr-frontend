export const STOPWORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'it', 'its', 'as', 'be', 'was',
    'are', 'were', 'been', 'not', 'no', 'so', 'if', 'do', 'did',

    'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'e', 'ou', 'mas',
    'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
    'ao', 'aos', 'por', 'para', 'com', 'se', 'que', 'me', 'te', 'lhe',

    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o',
    'pero', 'en', 'de', 'del', 'al', 'por', 'para', 'con', 'si', 'que',
    'me', 'te', 'le', 'se', 'es', 'son', 'fue', 'era',
]);


export const WORD_REPLACEMENTS: [RegExp, string][] = [
    [/\bone\b/gi, '1'],
    [/\bum\b|\buma\b|\buno\b|\buna\b/gi, '1'],
    [/\btwo\b/gi, '2'],
    [/\bdois\b|\bduas\b|\bdos\b/gi, '2'],
    [/\bthree\b/gi, '3'],
    [/\btrês\b|\btres\b/gi, '3'],
    [/\bfour\b/gi, '4'],
    [/\bquatro\b/gi, '4'],
    [/\bfive\b/gi, '5'],
    [/\bcinco\b/gi, '5'],
    [/\bsix\b/gi, '6'],
    [/\bseis\b/gi, '6'],
    [/\bseven\b/gi, '7'],
    [/\bsiete\b|\bsete\b/gi, '7'],
    [/\beight\b/gi, '8'],
    [/\bocho\b|\boito\b/gi, '8'],
    [/\bnine\b/gi, '9'],
    [/\bnueve\b|\bnove\b/gi, '9'],
    [/\bten\b/gi, '10'],
    [/\bdiez\b|\bdez\b/gi, '10'],
    [/\bzero\b|\bcero\b|\bzero\b/gi, '0'],
    [/&/g, 'and'],
    [/\band\b/gi, 'and'],
    [/\be\b/gi, 'and'],
    [/\by\b/gi, 'and'],
]