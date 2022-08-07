int  "-"?([0-9]|[1-9][0-9]+)
frac  "."[0-9]+

%%
\s+                     /* skip whitespace */

{int}{frac}?\b          return 'NUMBER'
\"[a-zA-Z0-9]+\"        return 'STRING'

"{"                     return '{'
"}"                     return '}'
"["                     return '['
"]"                     return ']'
","                     return ','
":"                     return ':'
"true"                  return 'TRUE'
"false"                 return 'FALSE'
"null"                  return 'NULL'
<<EOF>>                 return 'EOF'
.                       return 'INVALID'

%%