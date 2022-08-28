ident                   [a-zA-Z_$]([a-zA-Z0-9_$]+)?
tag                     [a-zA-Z_$]([a-zA-Z0-9_$\-]+)?
number                  ("-"?[1-9]([0-9]+)?("."[0-9]+)?|[0-9])
space                   [\s\r\n\t]+
str_wo_dquote           [^'"\{]+
str_wo_lt               ([^\{\<]|[^\{\<]+\{)+

%x open_tag close_tag string children expr

%{
  // console.log({ state: YY_START, text: `"${yytext}"` });
  const $this = this;
  function startStringWithQuote(quote) {
    $this.quoteStack = $this.quoteStack ? $this.quoteStack : []; 
    $this.quoteStack.push(quote); 
    $this.begin("string"); 
    return 'QUOTE'; 
  }

  function processQuote(quote) {
    if ($this.quoteStack[$this.quoteStack.length - 1] === quote) {
      if (yytext === quote) {
        $this.quoteStack.pop();
        $this.popState();
        return 'QUOTE';
      } else {
        if (yytext.charAt(yyleng - 2) === "\\") {
          $this.more();
        } else {
          $this.unput(quote);
          return 'STRING'; 
        }
      }  
    } else {
      $this.more();
    }
  }
%}

%%

<*><<EOF>>                      return 'EOF';
{space}                         /* skip whitespace */
(\<\!\-\-)(.+)/\-\-\>           /** skip comment */
"<"                             this.begin('open_tag'); return '<';
.                               return 'INVALID';

<open_tag>{space}               /* skip whitespace */
<open_tag>{ident}":"{tag}       return 'DIRECTIVE';
<open_tag>{tag}                 return 'IDENT';
<open_tag>{ident}               return 'IDENT';
<open_tag>"="                   return '=';
<open_tag>"\""                  return startStringWithQuote("\"");
<open_tag>"'"                   return startStringWithQuote("'");
<open_tag>">"                   this.popState(); this.begin('children'); return '>';
<open_tag>"/>"                  this.popState(); return '/>';

<string>"\""                    return processQuote("\"");
<string>"'"                     return processQuote("'");
<string>"{{"                    %{
  if (yytext === "{{")  {
    this.begin('expr');
    return '{{';
  } else {
    this.unput('{{');
    return 'STRING';
  }
%}
<string>"{"                    %{
  if (yytext.charAt(yyleng - 2) === "{") {
    this.unput("{{");
    return 'STRING';
  } else {
    this.more();
  }
%}
<string>{str_wo_dquote}         this.more();

<children>"{{"                  this.begin('expr'); return '{{';
<children>"</"                  this.popState(); this.begin("close_tag"); return '</';
<children>"<"                   this.begin("open_tag"); return '<';
<children>{str_wo_lt}/(\{\{)    return 'STRING';
<children>{str_wo_lt}/(\}\})    this.unput('}}'); return 'STRING';
<children>{str_wo_lt}           return 'STRING';

<expr>"}}"                      this.popState(); return '}}';
<expr>"true"                    return 'TRUE';
<expr>"false"                   return 'FALSE';
<expr>"null"                    return 'NULL';
<expr>"undefined"               return 'UNDEFINED';
<expr>{number}                  return 'NUMBER';
<expr>{ident}                   return 'IDENT';
<expr>"\""                      return startStringWithQuote("\"")
<expr>"'"                       return startStringWithQuote("'")
<expr>">="                      return '>=';
<expr>"<="                      return '<=';
<expr>">"                       return '>';
<expr>"<"                       return '<';
<expr>"==="                     return '===';
<expr>"=="                      return '==';
<expr>"!=="                     return '!==';
<expr>"!="                      return '!=';
<expr>"&&"                      return '&&';
<expr>"||"                      return '||';
<expr>"+"                       return '+';
<expr>"-"                       return '-';
<expr>"**"                      return '**';
<expr>"*"                       return '*';
<expr>"/"                       return '/';
<expr>"%"                       return '%';
<expr>"["                       return '[';
<expr>"]"                       return ']';
<expr>"("                       return '(';
<expr>")"                       return ')';
<expr>"{"                       return '{';
<expr>"}"                       return '}';
<expr>","                       return ',';
<expr>":"                       return ':';
<expr>"?"                       return '?';
<expr>"!"                       return '!';
<expr>"..."                     return '...';
<expr>"."                       return '.';
<expr>{space}                   /* skip whitespace */

<close_tag>{space}              /* skip whitespace */
<close_tag>{tag}                return 'IDENT';
<close_tag>{ident}              return 'IDENT';
<close_tag>">"                  this.popState(); return '>';

%%