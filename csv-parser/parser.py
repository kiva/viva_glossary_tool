import csv
import json
import re

def getPathInput():
    try:
        path = input('path to csv file: ').strip()
        csvFile = open(path, 'r')
        return csvFile
    except OSError as e:
        return None

f = None
while f is None:
    f = getPathInput()

reader = csv.reader(f)
first = True

variousCountries = [
    'other',
    'etc',
    'various',
    'many',
]

allCountries = []
with open('countries.txt') as countryFile:
    allCountries = countryFile.read().splitlines()

glossary = {}
for row in reader:

    if len(row) == 0:
        continue
    if first:
        first = False
        continue

    # replace multiple spaces with only one for easier parsing
    for i in range(len(row)):
        row[i] = ' '.join(row[i].split())

    # parse and trim title to remove multiple words    
    title = row[1].lower()
    match = re.search(r'( [^ a-zA-Z0-9\-]| or|/)', title)
    if match:
        title = title[:match.start(0)]


    text = row[2]
    url = row[4]

    meaningStart = text.index('Meaning: ') + len('Meaning: ')
    meaningEnd = text.index(' Country: ')
    countryStart = meaningEnd + len(' Country: ')
    countryEnd = text.index(' Field Partner:')

    meaning = text[meaningStart:meaningEnd]
    countries = text[countryStart: countryEnd]

    # parse all countries or put in unspecified category
    countryList = []
    if any(c in countries for c in variousCountries):
        countryList.append('')
    else:
        for c in allCountries:
            if c in countries:
                countryList.append(c)
        if len(countryList) == 0:
            countryList.append('')

    for c in countryList: 
        if c not in glossary:
            glossary[c] = {}
        
        glossary[c][title] = {'meaning': meaning, 'url': url}

f.close()

result = json.dumps(glossary, indent=4, sort_keys=True)

outFileName = input('Name of output file: ')

with open(outFileName, 'w') as outFile:
    outFile.write(result)

print('done!')
