ident                   [a-zA-Z]([a-zA-Z0-9]+)?
number                  "-"?[1-9]([0-9]+)?("."[0-9]+)?
str_wo_dquote           ([^"\\]|\\.)*
str_wo_lt               ([^\<])*

%x string children expr

%%

<*><<EOF>>                      return 'EOF'
<*>"{{"                         this.begin('expr'); return '{{'
<*>"}}"                         this.popState(); return '}}'

<string>"\""                    this.popState(); return 'DQUOTE';
<string>{str_wo_dquote}/\{\{    this.unput('{{'); return 'STRING';
<string>{str_wo_dquote}/\}\}    this.unput('}}'); return 'STRING';
<string>{str_wo_dquote}         return 'STRING';

<children>"</"                  this.begin("INITIAL"); return '</';
<children>"<"                   this.begin("INITIAL"); return '<';
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
<expr>"\""                  this.begin('string'); return 'DQUOTE';
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

{ident}":"{ident}           return 'DIRECTIVE'
{ident}                     return 'IDENT'
"</"                        return '</';
"<"                         return '<';
">"                         this.begin('children'); return '>'
"/>"                        this.begin('children'); return '/>'
"="                         return '='
"\""                        this.begin('string'); return 'DQUOTE'; 

.                           return 'INVALID'

%%