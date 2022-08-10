int  "-"?([0-9]|[1-9][0-9]+)
frac  "."[0-9]+

%%
\s+                     /* skip whitespace */

{int}{frac}?\b          return 'NUMBER'
\"(?:'\\'[\\"bfnrt/]|'\\u'[a-fA-F0-9]{4}|[^\\\0-\x09\x0a-\x1f"])*\" return 'STRING'

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