ident                   [a-zA-Z][a-zA-Z0-9]+ 
number                  [1-9][0-9]+

%{
  const $ = yy.parser.yy.state;
%}

%%
\s+                     /* skip whitespace */

"true"                  return 'TRUE'
"false"                 return 'FALSE'
"undefined"             return 'UNDEFINED'
"null"                  return 'NULL'

{ident}":"{ident}           $.acceptToken('DIRECTIVE', yytext); return 'DIRECTIVE'
{ident}                     $.acceptToken('IDENT', yytext); return 'IDENT'
"-"?{number}("."[0-9]+)?    $.acceptToken('NUMBER'); return 'NUMBER'

\"(?:'\\'[\\"bfnrt/]|'\\u'[a-fA-F0-9]{4}|[^\\\0-\x09\x0a-\x1f"])*\" yytext = yytext.substr(1, yyleng - 2); $.acceptToken('STRING', yytext); return 'STRING'
\'(?:'\\'[\\"bfnrt/]|'\\u'[a-fA-F0-9]{4}|[^\\\0-\x09\x0a-\x1f"])*\' yytext = yytext.substr(1, yyleng - 2); $.acceptToken('STRING', yytext); return 'STRING'


"</"                      $.acceptToken('</'); return '</'
"<"                       $.acceptToken('<'); return '<'
">"                       $.acceptToken('>'); return '>'
"/>"                      $.acceptToken('/>'); return '/>'
"{{"                      $.acceptToken('{{'); return '{{'
"}}"                      $.acceptToken('}}'); return '}}'
"="                       $.acceptToken('='); return '='
"\""                      $.acceptToken('QUOTE'); return 'DQUOTE'
"\'"                      $.acceptToken('QUOTE'); return 'SQUOTE'

<<EOF>>                 return 'EOF'
.                       return 'INVALID'

%%