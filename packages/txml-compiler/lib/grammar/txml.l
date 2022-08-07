ident                   [a-zA-Z][a-zA-Z0-9]+ 
number                  [1-9][0-9]+
%%
\s+                     /* skip whitespace */

"true"                  return 'TRUE'
"false"                 return 'FALSE'
"undefined"             return 'UNDEFINED'
"null"                  return 'NULL'

{ident}":"{ident}           return 'DIRECTIVE'
{ident}                     return 'IDENT'
"-"?{number}("."[0-9]+)?    return 'NUMBER'


"</"                    return '</'
"<"                     return '<'
">"                     return '>'
"/>"                    return '/>'
"{{"                    return '{{'
"}}"                    return '}}'
"="                     return '='
"\""                    return 'DQUOTE'
"\'"                    return 'SQUOTE'
<<EOF>>                 return 'EOF'
.                       return 'INVALID'

%%