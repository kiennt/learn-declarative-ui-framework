ident                   [a-zA-Z]([a-zA-Z0-9]+)?
number                  "-"?[1-9]([0-9]+)?("."[0-9]+)?
str_wo_dquote           ([^"\\]|\\.)*
str_wo_lt               ([^\<])*

%x string children expr

%{
  const $ = yy.parser.yy.state;
%}

%%

<*><<EOF>>                      return 'EOF'
<*>"{{"                         this.begin('expr'); $.acceptToken('{{'); return '{{'
<*>"}}"                         this.popState(); $.acceptToken('}}'); return '}}'

<string>"\""                    this.popState(); return 'DQUOTE';
<string>{str_wo_dquote}/\{\{    this.unput('{{'); return 'STRING';
<string>{str_wo_dquote}/\}\}    this.unput('}}'); return 'STRING';
<string>{str_wo_dquote}         return 'STRING';

<children>"</"                  this.begin("INITIAL"); $.acceptToken('</'); return '</';
<children>"<"                   this.begin("INITIAL"); $.acceptToken('<'); return '<';
<children>{str_wo_lt}/\{\{      this.unput('{{'); return 'STRING';
<children>{str_wo_lt}/\}\}      this.unput('}}'); return 'STRING';
<children>{str_wo_lt}           return 'STRING';

<*>\s+                      /* skip whitespace */
(\<\!--)(.+)/\-\-\>         /** skip comment */

<expr>"true"                return 'TRUE';
<expr>"false"               return 'FALSE';
<expr>"null"                return 'NULL';
<expr>"undefined"           return 'UNDEFINED';
<expr>{number}              return 'NUMBER';
<expr>{ident}               return 'IDENT';
<expr>"\""                  this.begin('string'); $.acceptToken('QUOTE'); return 'DQUOTE';
<expr>">="                  return '>=';
<expr>"<="                  return '<=';
<expr>">"                   return '>';
<expr>"<"                   return '<';
<expr>"==="                 return '===';
<expr>"=="                  return '==';
<expr>"!=="                 return '!==';
<expr>"!="                  return '!=';
<expr>"&&"                  return '&&';
<expr>"||"                  return '||';
<expr>"+"                   return '+';
<expr>"-"                   return '-';
<expr>"**"                  return '**';
<expr>"*"                   return '*';
<expr>"/"                   return '/';
<expr>"%"                   return '%';
<expr>"["                   return '[';
<expr>"]"                   return ']';
<expr>"("                   return '(';
<expr>")"                   return ')';
<expr>"{"                   return '{';
<expr>"}"                   return '}';
<expr>","                   return ',';
<expr>":"                   return ':';
<expr>"?"                   return '?';
<expr>"!"                   return '!';
<expr>"..."                 return '...';
<expr>"."                   return '.';

{ident}":"{ident}           $.acceptToken('DIRECTIVE', yytext); return 'DIRECTIVE'
{ident}                     $.acceptToken('IDENT', yytext); return 'IDENT'
"</"                        $.acceptToken('</'); return '</';
"<"                         $.acceptToken('<'); return '<';
">"                         this.begin('children'); $.acceptToken('>'); return '>'
"/>"                        this.begin('children'); $.acceptToken('/>'); return '/>'
"="                         $.acceptToken('='); return '='
"\""                        this.begin('string'); $.acceptToken('QUOTE'); return 'DQUOTE'; 

.                           return 'INVALID'

%%