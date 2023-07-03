# Feature
* MCMI Raw Score to BR Score
* MACI Raw Score to BR Score

Schizoid
BRScore = rawScore 

BR Score

{0,12,24,36,48,60,64,68,72,74,75,77,79,81,83,85,89,96,103,106,108,110,112,115}


1-8B Adjustment

{0,37,38,39,41,42,43,44,46,47,48,49,51,52,53,54,56,57,58,59,61,124,127,129,132,134,137,139,142,144,147,149,152,154,157,159,162,164,167,169,172}
->
{20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20}

const adj = 
Week < 124 ? BRScore + adj : BRScore - adj


# Scales
Scale         Created          Tested           Published
EPQ             OK
EPQ-R           OK
JTCI            OK
MACI            OK
MCMI            OK
MMPI-RF         OK
MPQ             OK
TCI             OK
SCL-90R         OK
DSMD-A

DSMD-C
JEPQ
LEYTON


# SCL-90R 
Add 3 more Subscales

PST - total item jegulo te 0 response day ni mane non zero item
PSDI - Psdi holo total raw score ÷ pst
Gsi - Gsi holo total raw score ÷ 90 
